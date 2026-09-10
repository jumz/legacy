/**
 * WebsocketTransport.js — reemplazo del transporte que idms_legacy usaba para hablar con el
 * servidor comercial de Aware Inc. ("Biocomponent Server API"). Implementa EXACTAMENTE la
 * interfaz que `aw_biocomponent_server.js`, `aw_fingerprint_capture.js` y `aw_fingerprint_set.js`
 * ya esperan de un `transportObject` (confirmado por lectura de esos 3 archivos, sin tocarlos):
 *
 *   transport.register(channel, onMessage)   // aw_biocomponent_server.js:51, capture.js:739, set.js:528
 *   transport.send(jsonNode)                 // cada función RPC de los 3 archivos
 *
 * jsonNode saliente: { message_id, channel, function, args }
 * onMessage entrante: { function, message_id, return_value, error: { code, message } }
 *   (aw_*.js resuelve su Promise leyendo result.return_value/result.error.code/result.error.message
 *   — confirmado en aw_biocomponent_server.js:31-45 y el mismo patrón en capture.js/set.js)
 *
 * Por debajo, en vez de hablar con el servidor real de Aware, este archivo habla el protocolo
 * WebSocket de BiometricBridge.App (WSS-DEVICES) — el mismo puente que ya usa idms-shadcn — así
 * que idms_legacy captura con el mismo hardware (RealScan G10) sin que aw_fingerprint_capture.js/
 * aw_fingerprint_set.js/aw_biocomponent_server.js necesiten ningún cambio.
 *
 * Uso (en vez de cargar el WebsocketTransport.js original de Aware):
 *   <script src=".../wss-devices-js/WebsocketTransport.js"></script>
 *   <script>
 *     var transport = new WebsocketTransport("ws://127.0.0.1:23123"); // opcional, mismo default que biometric-capture.js
 *     var fpCapture = createFingerprintCapture(transport, "fpCaptureChannel");
 *     var fpSet = createFingerprintSet(transport, "fpSetChannel");
 *   </script>
 *
 * Alcance: cubre los 3 flujos reales de idms_legacy (internohuellas.php = slap de 10 dedos,
 * internohuellasindividual.php = dedo individual plano, internohuellasroladas.php = dedo
 * individual rodado). Las funciones "propietarias" de Aware sin equivalente real en RealScan
 * (AFIQ score, imágenes de segmentación/calidad por separado, secuenciación mano-por-mano)
 * responden con un error explícito "no disponible" en vez de inventar un valor — ver
 * UNSUPPORTED_FUNCTIONS abajo. Todo lo demás que no captura ni consulta imágenes (calibración,
 * audio, resolución, versión...) responde éxito con un valor neutro, para que el código de Aware
 * no truene aunque esa función en particular no tenga efecto real aquí.
 */
(function () {
  "use strict";

  const DEFAULT_WS_URL = "ws://127.0.0.1:23123";

  // ---- Mapeo de Impression (FingerprintCaptureApi.Impression, aw_fingerprint_capture.js:256-431)
  // a lo que BiometricBridge.App entiende. Valores confirmados leyendo ese enum completo, no
  // inferidos. "kind" distingue:
  //   - "slap": dispara una captura real de mano/pulgares (varias imágenes ya segmentadas)
  //   - "single_flat"/"single_rolled": dispara una captura real de un dedo (RS_CAPTURE_FLAT_
  //     SINGLE_FINGER / RS_CAPTURE_ROLL_FINGER en el puente) -- el dedo esperado es solo
  //     informativo (para el nombre en pantalla): el label real que vuelve lo decide el
  //     hardware al segmentar, igual que en el puente.
  //   - "finger_ref": NO dispara captura -- solo referencia un dedo que ya viene incluido en un
  //     slap ya capturado (ej. "el índice derecho dentro del slap de mano derecha"), para
  //     funciones que operan sobre un dedo puntual de un resultado ya obtenido.
  const IMPRESSION_INFO = {
    1: { kind: "single_rolled", finger: "right_thumb" },
    2: { kind: "single_rolled", finger: "right_index" },
    3: { kind: "single_rolled", finger: "right_middle" },
    4: { kind: "single_rolled", finger: "right_ring" },
    5: { kind: "single_rolled", finger: "right_little" },
    6: { kind: "single_rolled", finger: "left_thumb" },
    7: { kind: "single_rolled", finger: "left_index" },
    8: { kind: "single_rolled", finger: "left_middle" },
    9: { kind: "single_rolled", finger: "left_ring" },
    10: { kind: "single_rolled", finger: "left_little" },
    11: { kind: "single_flat", finger: "right_thumb" },
    12: { kind: "single_flat", finger: "left_thumb" },
    13: { kind: "slap", hand: "right" },
    14: { kind: "slap", hand: "left" },
    15: { kind: "finger_ref", finger: "right_index" },
    16: { kind: "finger_ref", finger: "right_middle" },
    17: { kind: "finger_ref", finger: "right_ring" },
    18: { kind: "finger_ref", finger: "right_little" },
    19: { kind: "finger_ref", finger: "left_index" },
    20: { kind: "finger_ref", finger: "left_middle" },
    21: { kind: "finger_ref", finger: "left_ring" },
    22: { kind: "finger_ref", finger: "left_little" },
    31: { kind: "slap", hand: "thumbs" },
    32: { kind: "finger_ref", finger: "right_thumb" },
    33: { kind: "finger_ref", finger: "left_thumb" },
    80: { kind: "single_flat", finger: "right_index" },
    81: { kind: "single_flat", finger: "right_middle" },
    82: { kind: "single_flat", finger: "right_ring" },
    83: { kind: "single_flat", finger: "right_little" },
    84: { kind: "single_flat", finger: "left_index" },
    85: { kind: "single_flat", finger: "left_middle" },
    86: { kind: "single_flat", finger: "left_ring" },
    87: { kind: "single_flat", finger: "left_little" },
    // El resto del enum (combinaciones de "two finger" 61-79/114-116) no lo usan
    // internohuellas/individual/roladas -- se reporta "unsupported" en vez de adivinar.
  };

  function describeImpression(impression) {
    return IMPRESSION_INFO[impression] || { kind: "unsupported" };
  }

  // Mismo sentinel que Aware ya usa para "no se pudo calcular" en getSegmentationQuality
  // (aw_fingerprint_set.js:1573-1605, códigos 254/255) -- se reutiliza para los scores/
  // funciones sin equivalente real, en vez de inventar un código nuevo.
  const SCORE_NOT_AVAILABLE = 255;

  // Funciones propietarias de Aware sin equivalente real en RealScan/RS_SDK -- responden error
  // explícito "no disponible" en vez de un valor inventado.
  const UNSUPPORTED_FUNCTIONS = new Set([
    "aw_fingerprint_set_get_afiq_score",
    "aw_fingerprint_set_get_segmentation_coordinates",
    "aw_fingerprint_set_failed_sequencing",
    "aw_fingerprint_set_get_sequencing_errors",
    "aw_fingerprint_set_get_minutia_count",
    "aw_fingerprint_set_get_compare_template",
    "aw_fingerprint_set_compare_templates",
  ]);

  function uuid() {
    if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  class WebsocketTransport {
    constructor(wsUrl) {
      this.wsUrl = wsUrl || DEFAULT_WS_URL;
      this._ws = null;
      this._connected = false;
      this._channels = new Map(); // channel -> onMessage
      // Imagenes ya capturadas, por canal de FingerprintCapture: Map(finger label -> {base64,format,nistQuality})
      this._captureCache = new Map();
      // Impresiones "presentes" reportadas por FingerprintSet.setFingerprintCaptureImage, por
      // canal de FingerprintSet: Map(impression number -> finger label)
      this._setImpressions = new Map();
      this._pendingByRequestId = new Map(); // requestId -> { channel, messageId, function }
      this._connect();
    }

    _connect() {
      try {
        this._ws = new WebSocket(this.wsUrl);
      } catch (err) {
        this._ws = null;
        return;
      }
      this._ws.onopen = () => {
        this._connected = true;
      };
      this._ws.onclose = () => {
        this._connected = false;
        this._ws = null;
      };
      this._ws.onerror = () => {
        /* onclose ya maneja el estado; sin más info util aquí */
      };
      this._ws.onmessage = (event) => this._handleBridgeMessage(event.data);
    }

    _send(message) {
      if (!this._connected || !this._ws) return false;
      this._ws.send(JSON.stringify(message));
      return true;
    }

    // ---- Interfaz que aw_biocomponent_server.js/aw_fingerprint_capture.js/aw_fingerprint_set.js
    // ya esperan de un transportObject -- ver comentario del archivo. ----

    register(channel, onMessage) {
      this._channels.set(channel, onMessage);
      if (!this._captureCache.has(channel)) this._captureCache.set(channel, new Map());
      if (!this._setImpressions.has(channel)) this._setImpressions.set(channel, new Map());
    }

    send(jsonNode) {
      const { message_id, channel, function: fn, args } = jsonNode;
      const reply = (returnValue, errorCode, errorMessage) => {
        const onMessage = this._channels.get(channel);
        if (!onMessage) return;
        // aw_*.js resuelve/rechaza su Promise de forma async (Promise nativa); despachar en un
        // microtask es suficiente y evita reentradas sincrónicas raras con quien llamó send().
        queueMicrotask(() => {
          onMessage({
            function: fn,
            message_id,
            return_value: returnValue,
            error: { code: errorCode || 0, message: errorMessage || "" },
          });
        });
      };
      this._dispatch(fn, args || [], channel, reply);
    }

    // ---- Despacho de funciones RPC de Aware -----------------------------------------------

    _dispatch(fn, args, channel, reply) {
      const handler = HANDLERS[fn];
      if (handler) {
        handler.call(this, args, channel, reply);
        return;
      }
      // Funciones no listadas explícitamente (calibración, audio, resolución, metadatos,
      // versión, etc.): no tienen efecto real en este puente, pero tampoco deben tronar el
      // código de Aware -- responden éxito con un valor neutro.
      reply(null, 0, "");
    }

    _pushEvent(channel, fn, args) {
      const onMessage = this._channels.get(channel);
      if (!onMessage) return;
      queueMicrotask(() => onMessage({ function: fn, message_id: null, return_value: null, args, error: { code: 0, message: "" } }));
    }

    // Envía fingerprint.capture al puente real y espera capture.result/error para ese requestId.
    _captureReal(hand) {
      return new Promise((resolve, reject) => {
        if (!this._connected) {
          reject(new Error("No hay conexión con BiometricBridge.App."));
          return;
        }
        const requestId = uuid();
        this._pendingByRequestId.set(requestId, { resolve, reject });
        this._send({ type: "fingerprint.capture", requestId, hand });
      });
    }

    _cancelReal(requestId) {
      this._send({ type: "capture.cancel", requestId });
    }

    _handleBridgeMessage(raw) {
      let msg;
      try {
        msg = JSON.parse(raw);
      } catch (err) {
        return;
      }

      if (msg.type === "capture.result" && msg.device === "fingerprint") {
        const pending = this._pendingByRequestId.get(msg.requestId);
        if (!pending) return;
        this._pendingByRequestId.delete(msg.requestId);
        pending.resolve(msg.images || []);
      } else if (msg.type === "error" && this._pendingByRequestId.has(msg.requestId)) {
        const pending = this._pendingByRequestId.get(msg.requestId);
        this._pendingByRequestId.delete(msg.requestId);
        pending.reject(new Error(msg.message || msg.code || "Error de captura"));
      }
      // "device.status"/"device.list" no tienen equivalente en el protocolo de Aware que estas
      // páginas consuman directamente -- si idms_legacy necesita mostrar estado de conexión,
      // debe hacerlo por su cuenta (igual que hoy, vía polling de aw_fingerprint_capture_*
      // funciones de estado, ya cubiertas por el fallback genérico de _dispatch).
    }
  }

  // ---- Handlers explícitos --------------------------------------------------------------
  // this === instancia de WebsocketTransport (llamados vía handler.call(this, ...)).

  const HANDLERS = {
    // -- FingerprintCapture: administración sin efecto real en el hardware --
    aw_fingerprint_capture_create(args, channel, reply) {
      reply(true, 0, "");
    },
    aw_fingerprint_capture_destroy(args, channel, reply) {
      this._captureCache.delete(channel);
      reply(null, 0, "");
    },
    aw_fingerprint_capture_open_device(args, channel, reply) {
      // args[0] es un CSV de escaneres deseados -- este puente ya sabe cuál usar (config.env),
      // no hace falta elegir aquí.
      reply(true, 0, "");
    },
    aw_fingerprint_capture_close(args, channel, reply) {
      reply(null, 0, "");
    },

    // -- Captura real --
    aw_fingerprint_capture_start_auto_capture(args, channel, reply) {
      const impression = args[0];
      const info = describeImpression(impression);
      if (info.kind === "unsupported" || info.kind === "finger_ref") {
        reply(null, -1, `Impression ${impression} no soportada por este adaptador (WSS-DEVICES).`);
        return;
      }
      const hand = info.kind === "slap" ? info.hand : info.kind === "single_rolled" ? "single_rolled" : "single";
      this._pushEvent(channel, "aw_fingerprint_capture_autocapture_status_updated", ["capturing"]);
      this._captureReal(hand)
        .then((images) => {
          const cache = this._captureCache.get(channel) || new Map();
          images.forEach((img) => cache.set(img.label, { base64: img.base64, format: img.format || "png", nistQuality: img.nistQuality }));
          this._captureCache.set(channel, cache);
          this._pushEvent(channel, "aw_fingerprint_capture_captured_image_updated", [impression]);
          this._pushEvent(channel, "aw_fingerprint_capture_autocapture_status_updated", ["completed"]);
          reply(null, 0, "");
        })
        .catch((err) => {
          this._pushEvent(channel, "aw_fingerprint_capture_autocapture_status_updated", ["failed"]);
          reply(null, -1, err && err.message ? err.message : "Error de captura");
        });
    },
    aw_fingerprint_capture_disable_auto_capture(args, channel, reply) {
      reply(null, 0, "");
    },
    aw_fingerprint_capture_end_auto_capture(args, channel, reply) {
      // No se guarda el requestId en vuelo por canal en esta version simple: si hace falta
      // cancelar activamente una captura larga, agregar ese seguimiento aqui. Por ahora, dejar
      // que expire por CAPTURE_TIMEOUT_MS en el puente es aceptable para este adaptador.
      reply(null, 0, "");
    },
    aw_fingerprint_capture_get_captured_image(args, channel, reply) {
      const cache = this._captureCache.get(channel);
      const entry = cache && cache.size > 0 ? Array.from(cache.values())[0] : null;
      reply(entry ? entry.base64 : null, entry ? 0 : -1, entry ? "" : "No hay imagen capturada.");
    },
    aw_fingerprint_capture_set_finger_missing(args, channel, reply) {
      reply(null, 0, "");
    },
    aw_fingerprint_capture_reset_missing_fingers(args, channel, reply) {
      reply(null, 0, "");
    },

    // -- FingerprintSet: administración --
    aw_fingerprint_set_create(args, channel, reply) {
      reply(true, 0, "");
    },
    aw_fingerprint_set_destroy(args, channel, reply) {
      this._setImpressions.delete(channel);
      reply(null, 0, "");
    },
    aw_fingerprint_set_reset(args, channel, reply) {
      this._setImpressions.set(channel, new Map());
      reply(null, 0, "");
    },
    aw_fingerprint_set_clear_all_impressions(args, channel, reply) {
      this._setImpressions.set(channel, new Map());
      reply(null, 0, "");
    },
    aw_fingerprint_set_clear_impression(args, channel, reply) {
      const map = this._setImpressions.get(channel);
      if (map) map.delete(args[0]);
      reply(null, 0, "");
    },
    aw_fingerprint_set_set_finger_missing(args, channel, reply) {
      reply(null, 0, "");
    },

    // Vincula una imagen ya capturada (de un canal de FingerprintCapture) a una impresión de
    // este FingerprintSet -- ver aw_fingerprint_set.js:1105-1138: el 2do argumento es el objeto
    // `fingerprintCapture` completo, del cual el propio Aware extrae `.channel`.
    aw_fingerprint_set_set_fingerprint_capture_image(args, channel, reply) {
      const impression = args[0];
      const fingerprintCapture = args[1];
      const sourceChannel = fingerprintCapture && fingerprintCapture.channel;
      const info = describeImpression(impression);
      const sourceCache = this._captureCache.get(sourceChannel);
      if (!sourceCache) {
        reply(null, -1, "Canal de captura de origen no encontrado.");
        return;
      }
      const finger = info.finger || (sourceCache.size === 1 ? Array.from(sourceCache.keys())[0] : null);
      if (!finger || !sourceCache.has(finger)) {
        reply(null, -1, "No hay una imagen capturada para esta impresión.");
        return;
      }
      const map = this._setImpressions.get(channel) || new Map();
      map.set(impression, finger);
      this._setImpressions.set(channel, map);
      // El FingerprintSet consulta las imagenes por su propio cache -- se copia por
      // conveniencia, ya indexado por canal de origen (los getters abajo lo resuelven).
      this._captureCache.set(channel, sourceCache);
      reply(null, 0, "");
    },

    aw_fingerprint_set_is_finger_present(args, channel, reply) {
      const info = describeImpression(args[0]);
      const map = this._setImpressions.get(channel);
      const present = Boolean(info.finger && map && map.has(args[0]));
      reply(present, 0, "");
    },
    aw_fingerprint_set_is_impression_analyzed(args, channel, reply) {
      const map = this._setImpressions.get(channel);
      reply(Boolean(map && map.has(args[0])), 0, "");
    },
    aw_fingerprint_set_enough_digits_captured(args, channel, reply) {
      const map = this._setImpressions.get(channel);
      reply(Boolean(map && map.size > 0), 0, "");
    },

    // Calidad NIST: RealScan la entrega por dedo en cada captura (nistQuality) -- es el
    // equivalente real más cercano a NFIQ que este puente tiene, así que se usa directo.
    aw_fingerprint_set_get_nfiq_score(args, channel, reply) {
      const finger = this._resolveSetFinger(channel, args[0]);
      const cache = this._captureCache.get(channel);
      const entry = finger && cache ? cache.get(finger) : null;
      if (!entry || entry.nistQuality == null) {
        reply(SCORE_NOT_AVAILABLE, 0, "");
        return;
      }
      reply(entry.nistQuality, 0, "");
    },
    aw_fingerprint_set_get_segmentation_quality(args, channel, reply) {
      // Mismo valor que NFIQ: RealScan no distingue "calidad de segmentación" de "calidad NIST"
      // como dos métricas separadas -- ver SCORE_NOT_AVAILABLE arriba para el sentinel.
      HANDLERS.aw_fingerprint_set_get_nfiq_score.call(this, args, channel, reply);
    },

    // Imágenes derivadas (input/segmentada/redimensionada/calidad): RealScan no las distingue
    // entre sí -- se devuelve la MISMA imagen ya capturada para las cuatro variantes, en vez de
    // fabricar una diferencia que no existe.
    aw_fingerprint_set_get_input_image(args, channel, reply) {
      this._replyWithCachedImage(channel, this._resolveSetFinger(channel, args[0]), reply);
    },
    aw_fingerprint_set_get_segmented_image(args, channel, reply) {
      this._replyWithCachedImage(channel, this._resolveSetFinger(channel, args[0]), reply);
    },
    aw_fingerprint_set_get_sized_image(args, channel, reply) {
      this._replyWithCachedImage(channel, this._resolveSetFinger(channel, args[0]), reply);
    },
    aw_fingerprint_set_get_quality_image(args, channel, reply) {
      this._replyWithCachedImage(channel, this._resolveSetFinger(channel, args[0]), reply);
    },
  };

  // Funciones propietarias sin equivalente real -- ver UNSUPPORTED_FUNCTIONS al inicio del
  // archivo. Se generan aquí para no repetir el mismo cuerpo a mano.
  UNSUPPORTED_FUNCTIONS.forEach((fn) => {
    HANDLERS[fn] = function (args, channel, reply) {
      reply(null, -1, `${fn} no esta disponible: sin equivalente real en RealScan/RS_SDK.`);
    };
  });

  // ---- Helpers de instancia (agregados al prototipo para poder usar `this` desde HANDLERS) --

  WebsocketTransport.prototype._resolveSetFinger = function (channel, impression) {
    const map = this._setImpressions.get(channel);
    if (map && map.has(impression)) return map.get(impression);
    const info = describeImpression(impression);
    return info.finger || null;
  };

  WebsocketTransport.prototype._replyWithCachedImage = function (channel, finger, reply) {
    const cache = this._captureCache.get(channel);
    const entry = finger && cache ? cache.get(finger) : null;
    if (!entry) {
      reply(null, -1, "No hay imagen disponible para este dedo.");
      return;
    }
    reply(entry.base64, 0, "");
  };

  window.WebsocketTransport = WebsocketTransport;
})();
