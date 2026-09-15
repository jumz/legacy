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
 * CONTRATO REAL (confirmado leyendo el WebsocketTransport.js original del fabricante,
 * 2026-09-14 — el archivo anterior de este adaptador lo adivinaba mal): no es una clase que crea
 * su propia conexión a partir de una URL. Es una función global `createWebsocketTransport`
 * que recibe un WebSocket YA CREADO Y CONECTADO desde afuera (lo crea el wiring de cada página,
 * ej. internohuellas.js: `websocket = new WebSocket(...); websocket.onopen = function() {
 * var transport = createWebsocketTransport(websocket); ... }`), y devuelve `{register, send}`.
 * Este adaptador respeta esa forma: no abre su propio WebSocket, usa el que le pasan (que el
 * wiring debe apuntar al puerto de WSS-DEVICES, no al del backend nativo de Aware).
 *
 * Por debajo, en vez de hablar con el servidor real de Aware, este archivo habla el protocolo
 * WebSocket de BiometricBridge.App (WSS-DEVICES) — el mismo puente que ya usa idms-shadcn — así
 * que idms_legacy captura con el mismo hardware (RealScan G10) sin que aw_fingerprint_capture.js/
 * aw_fingerprint_set.js/aw_biocomponent_server.js necesiten ningún cambio.
 *
 * Uso (en vez de cargar el WebsocketTransport.js original de Aware):
 *   <script src=".../wss-devices-js/WebsocketTransport.js"></script>
 *   <script>
 *     var ws = new WebSocket("ws://localhost:20008"); // puerto de WSS-DEVICES (config.env, CAM_PORT), no el 2080 original
 *     ws.onopen = function () {
 *       var transport = createWebsocketTransport(ws);
 *       var fpCapture = createFingerprintCapture(transport, "fpCaptureChannel");
 *       var fpSet = createFingerprintSet(transport, "fpSetChannel");
 *     };
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

  // ---- Parche defensivo de window.WebSocket -- confirmado en hardware/producción
  // (2026-09-14): el navegador (o algo intermedio -- no CDN, no nginx con proxy_cache, un solo
  // servidor por DNS -- nunca identificado con certeza) sirve copias VIEJAS de los wiring
  // scripts de cada página (internohuellas.js y hermanos) incluso con recarga forzada e
  // incógnita nueva, mientras que este mismo archivo (cargado con ?v=... para forzar
  // frescura) sí llega actualizado. Esas copias viejas traen hardcodeado el puerto del backend
  // nativo de Aware (2080, el transporte real) y un segundo socket a un servicio "AdminAware"
  // (2012, solo para apagar/reencender la app nativa antes de usar la versión web -- no aplica
  // con WSS-DEVICES) cuyo fallo muestra un diálogo de error confuso al usuario.
  //
  // Como este archivo SÍ llega fresco y se ejecuta ANTES que esos wiring scripts (script tag
  // síncrono, antes de DOMContentLoaded), parcha aquí el constructor global para que, sin
  // importar qué versión de esos scripts esté corriendo: (a) cualquier intento de conectar al
  // 2080 se redirija al puerto real de WSS-DEVICES, y (b) cualquier intento de conectar al 2012
  // se neutralice en silencio (un socket que nunca abre ni falla) en vez de mostrar el error.
  // Debe coincidir con CAM_PORT en el config.env del puente -- confirmado 2026-09-14 que en
  // esta instalación es 20008, NO el 23123 usado en otras (internorostro.js/internoiris.js ya
  // apuntan a 20008; cámara y huella comparten el mismo puerto, ver "Puerto único" en el README
  // de WSS-DEVICES). Ajustar aquí si tu instalación usa otro valor.
  const WSS_DEVICES_PORT = 20008;
  const NativeWebSocket = window.WebSocket;

  function createNoopSocket() {
    // No dispara open/close/message/error jamás -- el código viejo que espera una respuesta de
    // "AdminAware" simplemente se queda esperando para siempre, sin mostrar ningún diálogo.
    return { readyState: 0, send: function () {}, close: function () {}, onopen: null, onmessage: null, onerror: null, onclose: null };
  }

  function PatchedWebSocket(url, protocols) {
    if (/:2080\/?$/.test(url)) {
      const fixedUrl = url.replace(/:2080\/?$/, ":" + WSS_DEVICES_PORT);
      console.warn("[WebsocketTransport] Redirigiendo WebSocket de puerto 2080 (Aware) a " + WSS_DEVICES_PORT + " (WSS-DEVICES):", url, "->", fixedUrl);
      return protocols !== undefined ? new NativeWebSocket(fixedUrl, protocols) : new NativeWebSocket(fixedUrl);
    }
    if (/:2012\/?$/.test(url)) {
      console.warn("[WebsocketTransport] Ignorando conexión a AdminAware (puerto 2012) -- no aplica con WSS-DEVICES:", url);
      return createNoopSocket();
    }
    return protocols !== undefined ? new NativeWebSocket(url, protocols) : new NativeWebSocket(url);
  }
  PatchedWebSocket.prototype = NativeWebSocket.prototype;
  PatchedWebSocket.CONNECTING = NativeWebSocket.CONNECTING;
  PatchedWebSocket.OPEN = NativeWebSocket.OPEN;
  PatchedWebSocket.CLOSING = NativeWebSocket.CLOSING;
  PatchedWebSocket.CLOSED = NativeWebSocket.CLOSED;
  window.WebSocket = PatchedWebSocket;

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

  // AutocaptureStatus (FingerprintCaptureApi.AutocaptureStatus, aw_fingerprint_capture.js:57-182)
  // -- ES UN ENUM NUMÉRICO, no strings ("capturing"/"completed"/"failed" -- versión anterior de
  // este adaptador los inventó y producía "Estado: undefined" en pantalla, confirmado
  // 2026-09-14, porque internohuellas.js hace `AutocaptureStatus[status]`, una búsqueda inversa
  // numero->texto). Valores confirmados leyendo ese enum completo:
  const AUTOCAPTURE_STATUS_CAPTURING = 30102; // SOFTWAREAUTOCAPTURE_CAPTURE_INITIATED
  const AUTOCAPTURE_STATUS_COMPLETED = 20103; // CAPTURE_COMPLETED
  const AUTOCAPTURE_STATUS_ABORTED = 20102; // CAPTURE_ABORTED -- no hay un código más específico
  // de "por qué" falló (los que sí existen son sobre calidad/posición de dedo, que este puente
  // no distingue) -- usar el genérico en vez de fabricar una razón que no se puede confirmar.

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

  // ---- Fábrica del transporte -- firma y valor de retorno idénticos al original del
  // fabricante (register/send), recibiendo un WebSocket ya conectado en vez de crear el suyo. --

  function createWebsocketTransport(websocketHandle) {
    const channels = new Map(); // channel -> onMessage
    // Imagenes ya capturadas, por canal de FingerprintCapture: Map(finger label -> {base64,format,nistQuality})
    const captureCache = new Map();
    // Impresiones "presentes" reportadas por FingerprintSet.setFingerprintCaptureImage, por
    // canal de FingerprintSet: Map(impression number -> finger label)
    const setImpressions = new Map();
    const pendingByRequestId = new Map(); // requestId -> { resolve, reject }
    // Único requestId de captura en vuelo (a lo mucho una a la vez -- el puente ya lo garantiza
    // con su propio candado por dispositivo) -- permite que endAutoCapture() mande un
    // capture.cancel real en vez de ser un no-op. Ver nota en aw_fingerprint_capture_end_auto_capture.
    let currentCaptureRequestId = null;

    function sendToBridge(message) {
      websocketHandle.send(JSON.stringify(message));
    }

    function handleBridgeMessage(event) {
      let msg;
      try {
        msg = JSON.parse(event.data);
      } catch (err) {
        return;
      }

      if (msg.type === "capture.result" && msg.device === "fingerprint") {
        const pending = pendingByRequestId.get(msg.requestId);
        if (!pending) return;
        pendingByRequestId.delete(msg.requestId);
        if (currentCaptureRequestId === msg.requestId) currentCaptureRequestId = null;
        pending.resolve(msg.images || []);
      } else if (msg.type === "error" && pendingByRequestId.has(msg.requestId)) {
        const pending = pendingByRequestId.get(msg.requestId);
        pendingByRequestId.delete(msg.requestId);
        if (currentCaptureRequestId === msg.requestId) currentCaptureRequestId = null;
        pending.reject(new Error(msg.message || msg.code || "Error de captura"));
      }
      // "device.status"/"device.list" no tienen equivalente en el protocolo de Aware que estas
      // páginas consuman directamente -- si idms_legacy necesita mostrar estado de conexión,
      // debe hacerlo por su cuenta (igual que hoy, vía polling de aw_fingerprint_capture_*
      // funciones de estado, ya cubiertas por el fallback genérico de dispatch).
    }
    websocketHandle.onmessage = handleBridgeMessage;

    // Envía fingerprint.capture al puente real y espera capture.result/error para ese requestId.
    function captureReal(hand) {
      return new Promise((resolve, reject) => {
        const requestId = uuid();
        currentCaptureRequestId = requestId;
        pendingByRequestId.set(requestId, { resolve, reject });
        sendToBridge({ type: "fingerprint.capture", requestId, hand });
      });
    }

    // Cancela la captura en vuelo (si hay una) mandando capture.cancel al puente real -- esto
    // dispara el cancellationToken.Register de CaptureHandAsync en el C#, que ya llama
    // RS_AbortCapture correctamente. Usado por aw_fingerprint_capture_end_auto_capture (ver
    // abajo) -- antes era un no-op, y el botón "Reiniciar captura" de los wiring scripts nunca
    // limpiaba el estado real del dispositivo, dejando cascadas de "-212"/"-203" en el siguiente
    // intento (confirmado 2026-09-15).
    function cancelCurrentCapture() {
      if (!currentCaptureRequestId) return;
      sendToBridge({ type: "capture.cancel", requestId: currentCaptureRequestId });
      currentCaptureRequestId = null;
    }

    function pushEvent(channel, fn, args) {
      const onMessage = channels.get(channel);
      if (!onMessage) return;
      queueMicrotask(() => onMessage({ function: fn, message_id: null, return_value: null, args, error: { code: 0, message: "" } }));
    }

    function resolveSetFinger(channel, impression) {
      const map = setImpressions.get(channel);
      if (map && map.has(impression)) return map.get(impression);
      const info = describeImpression(impression);
      return info.finger || null;
    }

    function replyWithCachedImage(channel, finger, reply) {
      const cache = captureCache.get(channel);
      const entry = finger && cache ? cache.get(finger) : null;
      if (!entry) {
        reply(null, -1, "No hay imagen disponible para este dedo.");
        return;
      }
      reply(entry.base64, 0, "");
    }

    // Contexto que ven los HANDLERS -- reemplaza al `this` de la versión anterior (basada en
    // clase) ahora que la fábrica es una función simple, sin instancia que enlazar.
    const ctx = { channels, captureCache, setImpressions, captureReal, cancelCurrentCapture, pushEvent, resolveSetFinger, replyWithCachedImage };

    function dispatch(fn, args, channel, reply) {
      const handler = HANDLERS[fn];
      if (handler) {
        handler(ctx, args, channel, reply);
        return;
      }
      // Funciones no listadas explícitamente (calibración, audio, resolución, metadatos,
      // versión, etc.): no tienen efecto real en este puente, pero tampoco deben tronar el
      // código de Aware -- responden éxito con un valor neutro.
      reply(null, 0, "");
    }

    // ---- Interfaz que aw_biocomponent_server.js/aw_fingerprint_capture.js/aw_fingerprint_set.js
    // ya esperan de un transportObject -- ver comentario del archivo. ----

    function register(channel, onMessage) {
      channels.set(channel, onMessage);
      if (!captureCache.has(channel)) captureCache.set(channel, new Map());
      if (!setImpressions.has(channel)) setImpressions.set(channel, new Map());
    }

    function send(jsonNode) {
      const { message_id, channel, function: fn, args } = jsonNode;
      const reply = (returnValue, errorCode, errorMessage) => {
        const onMessage = channels.get(channel);
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
      dispatch(fn, args || [], channel, reply);
    }

    return { register, send };
  }

  // ---- Handlers explícitos --------------------------------------------------------------
  // Cada handler recibe (ctx, args, channel, reply) -- ctx es el contexto de la instancia de
  // transporte que lo invocó (ver createWebsocketTransport arriba).

  const HANDLERS = {
    // -- FingerprintCapture: administración sin efecto real en el hardware --
    aw_fingerprint_capture_create(ctx, args, channel, reply) {
      reply(true, 0, "");
    },
    aw_fingerprint_capture_destroy(ctx, args, channel, reply) {
      ctx.captureCache.delete(channel);
      reply(null, 0, "");
    },
    aw_fingerprint_capture_open_device(ctx, args, channel, reply) {
      // args[0] es un CSV de escaneres deseados -- este puente ya sabe cuál usar (config.env),
      // no hace falta elegir aquí.
      reply(true, 0, "");
    },
    aw_fingerprint_capture_close(ctx, args, channel, reply) {
      reply(null, 0, "");
    },

    // -- Captura real --
    aw_fingerprint_capture_start_auto_capture(ctx, args, channel, reply) {
      console.log("[WebsocketTransport][DIAG] start_auto_capture invocado -- impression=", args[0], new Error().stack);
      const impression = args[0];
      const info = describeImpression(impression);
      if (info.kind === "unsupported" || info.kind === "finger_ref") {
        reply(null, -1, `Impression ${impression} no soportada por este adaptador (WSS-DEVICES).`);
        return;
      }
      const hand = info.kind === "slap" ? info.hand : info.kind === "single_rolled" ? "single_rolled" : "single";
      ctx.pushEvent(channel, "aw_fingerprint_capture_autocapture_status_updated", [AUTOCAPTURE_STATUS_CAPTURING]);
      ctx
        .captureReal(hand)
        .then((images) => {
          const cache = ctx.captureCache.get(channel) || new Map();
          images.forEach((img) => cache.set(img.label, { base64: img.base64, format: img.format || "png", nistQuality: img.nistQuality }));
          ctx.captureCache.set(channel, cache);
          // capturedImageUpdated espera la imagen en base64 directamente, no un número de
          // impresión (confirmado en aw_fingerprint_capture.js:705-711: reenvía result.args tal
          // cual al callback del usuario, y el JSDoc de setCapturedImageUpdated dice "Callback
          // with the captured image", mismo formato que la vista previa). RealScan no entrega
          // una sola foto "cruda" del slap completo como una sola imagen -- ya viene segmentada
          // por dedo -- así que se usa la primera imagen capturada como representativa para esta
          // vista previa; el resultado real por dedo lo resuelve getSegments() en el wiring vía
          // getSegmentedImage(), que sí lee del cache completo.
          const preview = images.length > 0 ? images[0].base64 : null;
          ctx.pushEvent(channel, "aw_fingerprint_capture_captured_image_updated", [preview]);
          ctx.pushEvent(channel, "aw_fingerprint_capture_autocapture_status_updated", [AUTOCAPTURE_STATUS_COMPLETED]);
          reply(null, 0, "");
        })
        .catch((err) => {
          ctx.pushEvent(channel, "aw_fingerprint_capture_autocapture_status_updated", [AUTOCAPTURE_STATUS_ABORTED]);
          reply(null, -1, err && err.message ? err.message : "Error de captura");
        });
    },
    aw_fingerprint_capture_disable_auto_capture(ctx, args, channel, reply) {
      reply(null, 0, "");
    },
    aw_fingerprint_capture_end_auto_capture(ctx, args, channel, reply) {
      // Antes era un no-op: el botón "Reiniciar captura" de los wiring scripts (que llama a
      // esta función antes de reiniciar la secuencia) nunca cancelaba nada real en el puente,
      // dejando la captura vieja "viva" -- el siguiente intento chocaba con ella (-212 "ya hay
      // una captura en curso", o -203 si el choque pasaba en un punto distinto). Confirmado en
      // hardware 2026-09-15. Ahora manda capture.cancel de verdad si hay una captura en vuelo.
      ctx.cancelCurrentCapture();
      reply(null, 0, "");
    },
    aw_fingerprint_capture_get_captured_image(ctx, args, channel, reply) {
      const cache = ctx.captureCache.get(channel);
      const entry = cache && cache.size > 0 ? Array.from(cache.values())[0] : null;
      reply(entry ? entry.base64 : null, entry ? 0 : -1, entry ? "" : "No hay imagen capturada.");
    },
    aw_fingerprint_capture_set_finger_missing(ctx, args, channel, reply) {
      reply(null, 0, "");
    },
    aw_fingerprint_capture_reset_missing_fingers(ctx, args, channel, reply) {
      reply(null, 0, "");
    },

    // -- FingerprintSet: administración --
    aw_fingerprint_set_create(ctx, args, channel, reply) {
      reply(true, 0, "");
    },
    aw_fingerprint_set_destroy(ctx, args, channel, reply) {
      ctx.setImpressions.delete(channel);
      reply(null, 0, "");
    },
    aw_fingerprint_set_reset(ctx, args, channel, reply) {
      ctx.setImpressions.set(channel, new Map());
      reply(null, 0, "");
    },
    aw_fingerprint_set_clear_all_impressions(ctx, args, channel, reply) {
      ctx.setImpressions.set(channel, new Map());
      reply(null, 0, "");
    },
    aw_fingerprint_set_clear_impression(ctx, args, channel, reply) {
      const map = ctx.setImpressions.get(channel);
      if (map) map.delete(args[0]);
      reply(null, 0, "");
    },
    aw_fingerprint_set_set_finger_missing(ctx, args, channel, reply) {
      reply(null, 0, "");
    },

    // Vincula una imagen ya capturada (de un canal de FingerprintCapture) a una impresión de
    // este FingerprintSet -- ver aw_fingerprint_set.js:1105-1138: PESE a que el JSDoc dice
    // "@param {String} fingerprintCapture FingerprintCapture object", el código mismo hace
    // `fingerprintCapture = fingerprintCapture.channel;` ANTES de mandarlo por RPC (línea 1107)
    // -- o sea que args[1] YA es el string del canal, no un objeto. Leer `.channel` de ahí
    // (versión anterior de este adaptador) daba `undefined` siempre, y como el wiring no tiene
    // `.catch()` en la promesa de setFingerprintCaptureImage, el rechazo se perdía en silencio
    // y getSegments() nunca se ejecutaba (confirmado 2026-09-14: "Resultados" quedaba vacío).
    aw_fingerprint_set_set_fingerprint_capture_image(ctx, args, channel, reply) {
      const impression = args[0];
      const sourceChannel = args[1];
      const info = describeImpression(impression);
      const sourceCache = ctx.captureCache.get(sourceChannel);
      if (!sourceCache || sourceCache.size === 0) {
        reply(null, -1, "Canal de captura de origen no encontrado o sin imágenes.");
        return;
      }

      // "slap" (4 dedos o pulgares) no tiene UN dedo que asociar aquí -- son varios. El wiring
      // (getSegments() en internohuellas.js) consulta cada dedo por separado después, vía
      // ImpressionInfo.SingleFingerToFingerInSlap + get_segmented_image, que ya leen del cache
      // completo copiado abajo. Exigir un solo "finger" para un slap (versión anterior de este
      // adaptador) rechazaba SIEMPRE estas capturas -- confirmado 2026-09-14: el escáner
      // capturaba bien los 4 dedos (LED correcto) pero "Resultados" quedaba vacío porque esta
      // función rechazaba en silencio (el wiring no tiene .catch() en esta promesa).
      // Para dedo individual (single_flat/single_rolled), el hardware NO puede saber si es
      // izquierdo o derecho -- a diferencia de un slap, no hay contexto de mano completa para
      // inferirlo. Confirmado en hardware (2026-09-14): estas capturas quedan etiquetadas
      // "unknown" en vez del nombre que IMPRESSION_INFO adivina (ej. "left_little"). Por eso
      // aquí se prefiere SIEMPRE la única etiqueta real que trae el cache cuando hay una sola
      // (el caso normal de single_flat/single_rolled), y `info.finger` queda solo como último
      // recurso si por algún motivo el cache tuviera más de una entrada.
      const finger = (sourceCache.size === 1 ? Array.from(sourceCache.keys())[0] : null) || info.finger;
      if (info.kind !== "slap" && (!finger || !sourceCache.has(finger))) {
        reply(null, -1, "No hay una imagen capturada para esta impresión.");
        return;
      }

      const map = ctx.setImpressions.get(channel) || new Map();
      if (finger) map.set(impression, finger);
      ctx.setImpressions.set(channel, map);
      // El FingerprintSet consulta las imagenes por su propio cache -- se copia por
      // conveniencia, ya indexado por canal de origen (los getters abajo lo resuelven).
      ctx.captureCache.set(channel, sourceCache);
      reply(null, 0, "");
    },

    aw_fingerprint_set_is_finger_present(ctx, args, channel, reply) {
      const info = describeImpression(args[0]);
      const map = ctx.setImpressions.get(channel);
      const present = Boolean(info.finger && map && map.has(args[0]));
      reply(present, 0, "");
    },
    aw_fingerprint_set_is_impression_analyzed(ctx, args, channel, reply) {
      const map = ctx.setImpressions.get(channel);
      reply(Boolean(map && map.has(args[0])), 0, "");
    },
    aw_fingerprint_set_enough_digits_captured(ctx, args, channel, reply) {
      const map = ctx.setImpressions.get(channel);
      reply(Boolean(map && map.size > 0), 0, "");
    },

    // Calidad NIST: RealScan la entrega por dedo en cada captura (nistQuality) -- es el
    // equivalente real más cercano a NFIQ que este puente tiene, así que se usa directo.
    aw_fingerprint_set_get_nfiq_score(ctx, args, channel, reply) {
      const finger = ctx.resolveSetFinger(channel, args[0]);
      const cache = ctx.captureCache.get(channel);
      const entry = finger && cache ? cache.get(finger) : null;
      if (!entry || entry.nistQuality == null) {
        reply(SCORE_NOT_AVAILABLE, 0, "");
        return;
      }
      reply(entry.nistQuality, 0, "");
    },
    aw_fingerprint_set_get_segmentation_quality(ctx, args, channel, reply) {
      // Mismo valor que NFIQ: RealScan no distingue "calidad de segmentación" de "calidad NIST"
      // como dos métricas separadas -- ver SCORE_NOT_AVAILABLE arriba para el sentinel.
      HANDLERS.aw_fingerprint_set_get_nfiq_score(ctx, args, channel, reply);
    },

    // Imágenes derivadas (input/segmentada/redimensionada/calidad): RealScan no las distingue
    // entre sí -- se devuelve la MISMA imagen ya capturada para las cuatro variantes, en vez de
    // fabricar una diferencia que no existe.
    aw_fingerprint_set_get_input_image(ctx, args, channel, reply) {
      ctx.replyWithCachedImage(channel, ctx.resolveSetFinger(channel, args[0]), reply);
    },
    aw_fingerprint_set_get_segmented_image(ctx, args, channel, reply) {
      ctx.replyWithCachedImage(channel, ctx.resolveSetFinger(channel, args[0]), reply);
    },
    aw_fingerprint_set_get_sized_image(ctx, args, channel, reply) {
      ctx.replyWithCachedImage(channel, ctx.resolveSetFinger(channel, args[0]), reply);
    },
    aw_fingerprint_set_get_quality_image(ctx, args, channel, reply) {
      ctx.replyWithCachedImage(channel, ctx.resolveSetFinger(channel, args[0]), reply);
    },
  };

  // Funciones propietarias sin equivalente real -- ver UNSUPPORTED_FUNCTIONS al inicio del
  // archivo. Se generan aquí para no repetir el mismo cuerpo a mano.
  UNSUPPORTED_FUNCTIONS.forEach((fn) => {
    HANDLERS[fn] = function (ctx, args, channel, reply) {
      reply(null, -1, `${fn} no esta disponible: sin equivalente real en RealScan/RS_SDK.`);
    };
  });

  // Los wiring scripts (internohuellas.js y hermanos) no tienen .catch() en varias de sus
  // cadenas de promesas -- un rechazo (ej. de setFingerprintCaptureImage) se pierde en silencio,
  // sin ningún error visible, dejando la UI a medias sin explicación (confirmado 2026-09-14, dos
  // veces distintas). Este listener global lo saca a la luz para no tener que adivinar de nuevo.
  window.addEventListener("unhandledrejection", function (event) {
    console.error("[WebsocketTransport] Promesa rechazada sin capturar (revisa qué la generó):", event.reason);
  });

  window.createWebsocketTransport = createWebsocketTransport;
})();
