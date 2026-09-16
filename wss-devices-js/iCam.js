/**
 * iCam.js — reemplazo de la clase TD100Client original de idms_legacy. Mismo constructor
 * (mismo `config`: wsUrl, liveImg, faceImg, autoFaceImg, irisRightImg, irisLeftImg, sceneImg,
 * statusLabel, historyContainer) y los mismos métodos públicos (connectWS/disconnectWS/
 * manualReconnect, connectCamera/disconnectCamera, toggleSleep/sleep/wakeup, setLed,
 * captureFace, autoFace, captureIris, captureScene, addHistory) — así que el HTML/PHP que ya
 * instancia `new TD100Client(config)` y llama estos métodos no necesita ningún cambio.
 *
 * Toda la infraestructura de conexión (auto-reconexión con backoff, watchdog de "live"
 * congelado, badges de estado Bootstrap, temporizadores de captura pendiente) se conserva TAL
 * CUAL del archivo original -- no es parte de ningún protocolo, es la UI de la página. Lo único
 * que cambia es CÓMO se habla con el dispositivo: en vez del protocolo propio anterior
 * (`{command:"captureFace"}`, mensajes de texto plano "CameraConnected", etc.), ahora se habla
 * el protocolo real de BiometricBridge.App (WSS-DEVICES) -- el mismo puente que ya usa
 * idms-shadcn. Ver el README de WSS-DEVICES, sección "Protocolo WebSocket".
 *
 * Vista previa continua (decisión confirmada con el usuario -- replica el comportamiento del
 * original): en cuanto la cámara confirma "Connected" se abre una sesión de vista previa
 * (`camera.preview.start`) en el modo `config.previewMode` (default "face") y se deja abierta
 * mientras la página esté conectada -- `liveImg` se actualiza en vivo todo el tiempo, no solo
 * durante una captura. captureFace()/autoFace() reutilizan esa misma sesión (mismo modo) sin
 * abrir una nueva; al terminar una captura (éxito, error o cancelación) se retoma la vista
 * previa en vez de cerrarla. Esto mantiene el candado de cámara tomado todo el tiempo que la
 * página esté abierta -- aceptable porque solo una estación usa la cámara a la vez.
 *
 * EXCEPCIÓN -- iris NO usa vista previa continua (confirmado en hardware, 2026-09-11): el modo
 * "Enroll" de iris auto-captura por sí solo apenas queda armado (el `StartCapture` que abre la
 * vista previa YA arma la detección automática de ambos ojos, sin necesidad de `PressButton()`).
 * Dejarlo abierto de fondo hace que el hardware capture "fantasma" en cuanto detecta los ojos,
 * sin que el software lo haya pedido -- el resultado se descarta en silencio (no hay captura
 * pendiente registrada) y el hardware queda en mal estado para el siguiente intento manual
 * (`IrisImageCaptureFail`). Por eso, cuando `config.previewMode === "iris"`, la vista previa
 * solo se abre justo antes de una captura real (`captureIris`) y se cierra siempre al terminar
 * -- igual que el comportamiento original antes de esta vista previa continua.
 *
 * setLed/sleep/wakeup/toggleSleep/captureScene: sin equivalente en WSS-DEVICES hoy (decisión ya
 * tomada, ver plan) -- quedan como no-op seguro (no truenan, actualizan el status a un mensaje
 * claro de "no disponible" en vez de fingir que funcionaron).
 *
 * autoFace(enable): el original delegaba la detección "¿el rostro ya es válido para capturar?"
 * al firmware de la cámara (ICAO), que mandaba mensajes `autoFace` con status
 * running/capturing/invalid_full/success. WSS-DEVICES no tiene ese modo -- en vez de dejarlo como
 * no-op (lo que rompería esta pantalla, que solo tiene botones de captura automática, sin botón
 * manual), se SIMULA en el navegador: se abre una vista previa continua y, con un canvas oculto,
 * se compara cada frame contra el anterior (downscale a 48x36 + diferencia media de luminancia).
 * Cuando la imagen se mantiene "quieta" varios frames seguidos (persona posicionada, sin
 * movimiento) se dispara una captura real (`camera.capture`). No hay validación real de
 * "¿es un rostro válido, encuadrado, ICAO?" -- eso requeriría procesamiento de imagen que el
 * puente no ofrece hoy; cualquier captura que el hardware devuelva sin error se toma como éxito.
 * Umbral y frames requeridos (`_autoFaceStableThreshold`/`_autoFaceRequiredStableFrames`) son
 * valores de partida sin calibrar contra hardware real -- ajustar si captura demasiado rápido
 * (con la persona aún moviéndose) o nunca dispara (persona quieta pero no detectada como tal).
 */
class TD100Client {

    constructor(config) {

        // ============================================================
        // CONFIGURACIÓN GENERAL
        // ============================================================

        this.wsUrl = config.wsUrl;

        // Modo de la vista previa continua que se abre en cuanto la cámara conecta -- ver nota
        // de "Vista previa continua" al inicio del archivo. Si la página no dice explícitamente
        // config.previewMode, se infiere de qué imágenes configuró: sin faceImg pero con
        // irisRightImg/irisLeftImg -> es una página de iris (internoiris.php), no arrancar en
        // modo rostro para luego tener que cambiar a iris justo antes de la primera captura
        // (ese cambio de modo, encima del ya delicado apagado/reencendido de streaming del
        // hardware -- ver StopLiveSettleDelay en Td200CameraModule.cs -- puede producir
        // IrisImageCaptureFail).
        this.previewMode = config.previewMode ||
            (!config.faceImg && (config.irisRightImg || config.irisLeftImg) ? "iris" : "face");
        this.previewEye = config.previewEye || "both";

        // IMGs
        this.liveImg = config.liveImg;
        this.faceImg = config.faceImg;
        this.autoFaceImg = config.autoFaceImg;
        this.irisRightImg = config.irisRightImg;
        this.irisLeftImg = config.irisLeftImg;
        this.sceneImg = config.sceneImg;

        // Status
        this.statusLabel = config.statusLabel;
        this.historyContainer = config.historyContainer || null;

        // ============================================================
        // ESTADO INTERNO
        // ============================================================

        this.ws = null;
        this.wsState = "IDLE"; // IDLE | CONNECTING | CONNECTED | WAITING

        this.wsConnected = false;
        this.wsConnectedTs = 0;
        this.cameraConnected = false;

        this.isBusy = false;
        this.expectManualFace = false;
        this.manualFaceTimer = null;

        // Sesión de vista previa de cámara actualmente abierta contra WSS-DEVICES (ver nota de
        // "Vista previa continua" arriba) -- null cuando no hay ninguna.
        this._previewRequestId = null;
        this._previewMode = null; // "face" | "iris"
        this._previewEye = null;  // solo aplica a "iris": "both" | "right" | "left"
        this._previewPose = null; // solo aplica a "face": "frontal" | "profile"

        // ============================================================
        // AUTO CAPTURA DE IRIS (reintento automático mientras la cámara está conectada) --
        // sin confirmar todavía en hardware (2026-09-15). A diferencia de AutoFace (que hay que
        // simular por completo porque WSS-DEVICES no detecta rostro), el modo Enroll de iris SÍ
        // auto-detecta y auto-dispara por sí solo con solo estar armado (ver nota de "Vista
        // previa continua" al inicio del archivo) -- por eso aquí no hace falta ningún análisis
        // de frames, solo reintentar captureIris() en bucle hasta que el hardware entregue un
        // resultado real, dejando la vista previa visible entre intentos. _irisAutoCaptureGeneration
        // invalida reintentos viejos cuando se llama a captureIris() de nuevo (clic en "Capturar"
        // con el mismo o distinto ojo) -- mismo patrón que el reintento de dedo individual en
        // WebsocketTransport.js.
        this._irisAutoCaptureGeneration = 0;
        this._irisAutoCaptureMode = "both";
        this._irisAutoCaptureRetryDelayMs = 1500;

        // ============================================================
        // AUTO FACE (simulado en cliente -- ver nota al inicio del archivo)
        // ============================================================
        this.autoFaceUIActive = false;
        this._autoFaceCapturing = false;
        this._autoFaceAttempt = 0;
        this._autoFaceMaxAttempts = 15;
        this._autoFaceStableCount = 0;
        this._autoFacePrevFrame = null;
        this._autoFaceStableThreshold = 6;       // diferencia media de luminancia (0-255) por debajo de esto cuenta como "quieto"
        this._autoFaceRequiredStableFrames = 5;  // frames seguidos "quietos" antes de disparar la captura
        this._autoFaceSessionTimer = null;
        this._autoFaceSessionTimeoutMs = 60000;  // si nunca se estabiliza, se cancela con error
        this._autoFaceCanvas = document.createElement("canvas");
        this._autoFaceCanvas.width = 48;
        this._autoFaceCanvas.height = 36;

        // ============================================================
        // AUTO RECOVERY / CONEXIÓN
        // ============================================================

        this.autoRecover = true;
        this.recoverAttempts = 0;
        this.maxRecoverAttempts = 12;

        this.retryDelaySeconds = 4;
        this.wsConnectTimeoutMs = 5000;

        this.countdownTimer = null;
        this.countdownRemaining = 0;
        this.wsConnectTimer = null;

        // ============================================================
        // AUTO WAKE FIX -- sin equivalente en WSS-DEVICES (sleep/wakeup son no-op), se deja
        // deshabilitado por default para no disparar timers que nunca resolverán nada.
        // ============================================================

        this.autoWakeEnabled = false;
        this.autoWakeDelayMs = 2000;

        this._autoWakeDone = false;
        this._autoWakeInProgress = false;

        this.cameraConnectedTs = 0;

        // ===============================
        // CAPTURE TIMEOUT (manual)
        // ===============================
        this.capturePending = null;      // "face" | "iris" | "scene"
        this.captureTimer = null;
        // El puente puede tardar hasta ~2.5s solo en el margen de espera antes de disparar
        // (IrisStopLiveSettleDelay 2000ms + ArmSettleDelay 500ms en Td200CameraModule.cs, para
        // iris) más el tiempo real de captura -- con 2000ms aquí, el navegador se rendía antes
        // de que el servidor terminara de esperar (regresión confirmada 2026-09-14, mostraba
        // "No se recibió la imagen" en rostro/perfil aunque el servidor sí iba a responder).
        this.captureTimeoutMs = 6000;


        // ============================================================
        // LIVE WATCHDOG
        // ============================================================

        this.lastLiveTs = 0;
        this.liveTimeoutMs = 3000;

        this.blankImage =
            "data:image/svg+xml;base64," +
            btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480">
                    <rect width="100%" height="100%" fill="#e9ecef"/>
                  </svg>`);

        this.resetLive();

        // ============================================================
        // ARRANQUE → INTENTO INMEDIATO
        // ============================================================

        this.connectWS();

        if (this.autoRecover) {
            this.startAutoRecovery();
        }

        // ============================================================
        // PAUSA POR PESTAÑA OCULTA -- con vista previa continua, si el operador cambia a otra
        // pestaña o minimiza sin cerrar esta página, la cámara se quedaría tomada indefinidamente
        // sin que nadie la esté viendo.
        //
        // Deliberadamente NO se usa "blur"/"focus" de window (perder el foco hacia otra
        // ventana/app sin cambiar de pestaña ni minimizar): en la práctica eso dispara la pausa
        // con demasiada frecuencia -- incluso abrir DevTools para depurar cuenta como perder el
        // foco -- y cada pausa/reanudación es un ciclo completo de StartLive/StopLive/
        // StartCapture en el hardware. Confirmado en hardware (2026-09-11): ese ciclo repetido
        // en sucesión rápida produjo IrisImageCaptureFail. "visibilitychange" es un evento mucho
        // menos frecuente y más deliberado (cambiar de pestaña o minimizar de verdad), así que
        // se queda como única señal de "nadie está viendo esto".
        //
        // La pausa real se retrasa _windowInactiveDebounceMs (2.5s) por la misma razón -- si la
        // pestaña vuelve a ser visible antes de que venza el temporizador, se cancela y no se
        // llega a detener nada.
        // ============================================================

        this._windowInactiveTimer = null;
        this._windowInactiveDebounceMs = 2500;

        const evaluateWindowActive = () => {
            const inactive = document.hidden;

            if (inactive) {
                if (this._windowInactiveTimer) return; // ya hay una pausa programada
                this._windowInactiveTimer = setTimeout(() => {
                    this._windowInactiveTimer = null;
                    if (this.autoFaceUIActive) {
                        this._resetAutoFaceState();
                        this.setStatus("AutoFace pausado (ventana no activa)", "secondary");
                    }
                    this._stopPreview();
                }, this._windowInactiveDebounceMs);
            } else {
                if (this._windowInactiveTimer) {
                    clearTimeout(this._windowInactiveTimer);
                    this._windowInactiveTimer = null;
                }
                if (this.cameraConnected) this._resumeIdlePreview();
            }
        };
        document.addEventListener("visibilitychange", evaluateWindowActive);

        // ============================================================
        // WATCHDOG PRINCIPAL
        // ============================================================

        setInterval(() => {

            // WS no conectado
            if (!this.wsConnected) {
                this.resetLive();
                return;
            }

            const now = Date.now();

            // Cámara no confirmada aún (pero WS sí)
            if (!this.cameraConnected) {

                if (
                    this.autoWakeEnabled &&
                    !this._autoWakeDone &&
                    !this._autoWakeInProgress &&
                    now - this.wsConnectedTs > this.autoWakeDelayMs
                ) {
                    this.autoWakeCamera();
                }

                this.resetLive();
                return;
            }

            // Cámara conectada pero aún sin el primer frame de vista previa (normal justo
            // después de conectar, mientras se abre la sesión continua -- ver nota de "Vista
            // previa continua" arriba)
            if (this.lastLiveTs === 0) {
                return;
            }

            // Live se congeló mientras se esperaba (posible captura colgada)
            if (now - this.lastLiveTs > this.liveTimeoutMs && this.isBusy) {
                this.resetLive();
                this.setStatus("Live detenido", "warning");
            }

        }, 1000);
    }


    // ============================================================
    // TIMEOUT DE CAPTURA MANUAL
    // ============================================================

    startCapturePending(type, timeoutMs = this.captureTimeoutMs)
    {
        this.capturePending = type;

        if (this.captureTimer) clearTimeout(this.captureTimer);

        this.captureTimer = setTimeout(() => {
            // Si sigue pendiente, falló
            if (this.capturePending === type) {
                this.capturePending = null;

                // Auto-captura de iris (ver "AUTO CAPTURA DE IRIS"): si nunca llegó ni resultado
                // ni error (p.ej. hipo del WS), reintenta igual que ante un error explícito, en
                // vez de dejar el bucle detenido en silencio.
                if (type === "iris") {
                    const generation = this._irisAutoCaptureGeneration;
                    this.clearBusy();
                    this._stopPreview();
                    this.setStatus("Reintentando... (sin respuesta)", "warning");
                    setTimeout(
                        () => this._attemptIrisCapture(this._irisAutoCaptureMode, generation),
                        this._irisAutoCaptureRetryDelayMs
                    );
                    return;
                }

                // Para face manual
                this.expectManualFace = false;
                if (this.manualFaceTimer) clearTimeout(this.manualFaceTimer);

                // Libera botón y avisa
                this.clearBusy();
                this._resumeIdlePreview();
                if (!this.autoFaceUIActive) {
                    this.setStatus("No se recibió la imagen. Reintenta la captura.", "danger");
                }
            }
        }, timeoutMs);
    }

    clearCapturePending()
    {
        this.capturePending = null;
        if (this.captureTimer) {
            clearTimeout(this.captureTimer);
            this.captureTimer = null;
        }
    }

    // ============================================================
    // 📡 WEBSOCKET CONTROL
    // ============================================================

    connectWS() {

        if (this.wsState === "CONNECTING" || this.wsState === "CONNECTED") {
            return;
        }

        if (this.recoverAttempts >= this.maxRecoverAttempts) {
            this.setStatus("No se pudo conectar (límite alcanzado). Presiona Reconectar.", "danger");
            return;
        }

        this.recoverAttempts++;
        this.wsState = "CONNECTING";

        this.setStatus(
            `<i class="fa-solid fa-spinner fa-spin fa-sm me-1"></i>
             Conectando WS... (${this.recoverAttempts}/${this.maxRecoverAttempts})`,
            "warning",
            true
        );

        try {
            this.ws = new WebSocket(this.wsUrl);
        } catch {
            this.wsState = "WAITING";
            this.scheduleNextAttempt("Error creando WS");
            return;
        }

        this.wsConnectTimer = setTimeout(() => {
            if (this.wsState === "CONNECTING") {
                try { this.ws.close(); } catch {}
                this.ws = null;
                this.handleConnectionFailure("Timeout WS");
            }
        }, this.wsConnectTimeoutMs);

        this.ws.onopen = () => {
            this.clearWsTimeout();

            this.wsState = "CONNECTED";
            this.wsConnected = true;
            this.wsConnectedTs = Date.now();
            this.recoverAttempts = 0;
            this.clearCountdown();

            this.setStatus("WS conectado", "success");

            // Rearmar estado de cámara tras (re)conexión de WS
            this.cameraConnected = false;
            this.cameraConnectedTs = 0;
            this.lastLiveTs = 0;
            this._autoWakeDone = false;

            this.connectCamera();
        };

        this.ws.onclose = () => {
            this.clearWsTimeout();
            this.handleConnectionFailure("WS desconectado");
        };

        this.ws.onerror = () => {
            this.clearWsTimeout();
            this.handleConnectionFailure("WS error");
        };

        this.ws.onmessage = evt => this.handleMessage(evt);
    }

    disconnectWS() {
        if (!this.ws) return;
        try { this.ws.close(); } catch {}

        this.ws = null;
        this.wsState = "WAITING";
        this.wsConnected = false;
        this.cameraConnected = false;
        this.lastLiveTs = 0;
        this._previewRequestId = null;
        this._previewMode = null;
        this._resetAutoFaceState();

        this.resetLive();
        this.setStatus("WS desconectado", "secondary");
    }

    isWSReady() {
        return this.ws && this.ws.readyState === WebSocket.OPEN;
    }

    send(obj) {
        if (!this.isWSReady()) {
            this.setStatus("WS no está listo", "danger");
            return;
        }
        this.ws.send(typeof obj === "string" ? obj : JSON.stringify(obj));
    }

    clearWsTimeout() {
        if (this.wsConnectTimer) {
            clearTimeout(this.wsConnectTimer);
            this.wsConnectTimer = null;
        }
    }

    // ============================================================
    // 🔁 AUTO RECOVERY
    // ============================================================

    startAutoRecovery() {}

    handleConnectionFailure(reason) {

        this.wsState = "WAITING";
        this.wsConnected = false;
        this.cameraConnected = false;
        this.lastLiveTs = 0;
        this._previewRequestId = null;
        this._previewMode = null;
        this._resetAutoFaceState();

        this.resetLive();

        if (this.recoverAttempts >= this.maxRecoverAttempts) {
            this.setStatus("Error: no se pudo conectar", "danger");
            return;
        }

        this.scheduleNextAttempt(reason);
    }

    scheduleNextAttempt(reason) {

        this.clearCountdown();
        this.countdownRemaining = this.retryDelaySeconds;

        this.updateCountdownStatus(reason);

        this.countdownTimer = setInterval(() => {
            this.countdownRemaining--;

            if (this.countdownRemaining <= 0) {
                this.clearCountdown();
                this.connectWS();
            } else {
                this.updateCountdownStatus(reason);
            }
        }, 1000);
    }

    updateCountdownStatus(reason) {
        this.setStatus(
            `${reason} · Reintentando en ${this.countdownRemaining}s (${this.recoverAttempts}/${this.maxRecoverAttempts})`,
            "warning"
        );
    }

    clearCountdown() {
        if (this.countdownTimer) {
            clearInterval(this.countdownTimer);
            this.countdownTimer = null;
        }
    }

    // ============================================================
    // 🛠 AUTO WAKE FIX (sin equivalente real -- sleep()/wakeup() son no-op, ver más abajo;
    // autoWakeEnabled queda en false por default así que esto nunca se dispara solo)
    // ============================================================

    autoWakeCamera() {

        if (!this.autoWakeEnabled) return;
        if (this._autoWakeDone) return;
        if (this._autoWakeInProgress) return;
        if (!this.wsConnected) return;

        this._autoWakeInProgress = true;

        this.sleep();

        setTimeout(() => {
            this.wakeup();
            this._autoWakeDone = true;
            this._autoWakeInProgress = false;
        }, 1000);
    }

    // ============================================================
    // 🟧 STATUS Y BUSY
    // ============================================================

    setStatus(text, color = "secondary", isHtml = false) {
        if (!this.statusLabel) return;
        if (isHtml) this.statusLabel.innerHTML = text;
        else this.statusLabel.textContent = text;
        this.statusLabel.className = "badge bg-" + color;
    }

    markBusy(ms = 5000) {
        if (this.isBusy) return;

        this.isBusy = true;

        if (this._busyTimer) clearTimeout(this._busyTimer);

        this._busyTimer = setTimeout(() => {
            this.isBusy = false;
        }, ms);
    }

    clearBusy() {
        this.isBusy = false;
        if (this._busyTimer) clearTimeout(this._busyTimer);
    }

    resetLive() {
        if (this.liveImg) {
            this.liveImg.src = this.blankImage;
        }
    }

    finishCaptureStatus() {
        // Si AutoFace está controlando el status, no lo pises
        if (this.autoFaceUIActive) return;

        // Vuelve al estado sano
        if (this.cameraConnected) this.setStatus("Cámara conectada", "success");
        else if (this.wsConnected) this.setStatus("WS conectado", "success");
        else this.setStatus("Listo", "secondary");

        this.clearBusy();
    }

    // ============================================================
    // 🟩 MENSAJES ENTRANTES -- protocolo real de BiometricBridge.App (WSS-DEVICES)
    // ============================================================

    handleMessage(evt) {

        const raw = evt.data;
        if (typeof raw !== "string") return;

        let msg;
        try { msg = JSON.parse(raw.trim()); }
        catch (ex) { console.error("[iCam] Mensaje WS no es JSON válido:", ex, raw.slice(0, 200)); return; }

        switch (msg.type) {

            case "device.list": {
                const entry = (msg.devices || []).find(d => d.key === "camera");
                this._applyCameraStatus(entry ? entry.status : "Disconnected");
                break;
            }

            case "device.status":
                if (msg.device === "camera") this._applyCameraStatus(msg.status);
                break;

            case "camera.preview.frame":
                this.lastLiveTs = Date.now();

                if (this.autoFaceUIActive) {
                    this._autoFaceCheckFrame(msg.base64);
                    break;
                }

                if (this.liveImg) this.liveImg.src = "data:image/jpeg;base64," + msg.base64;

                if (this.cameraConnected &&
                    this.statusLabel && this.statusLabel.textContent === "Live detenido") {
                    this.setStatus("Cámara conectada", "success");
                }
                break;

            case "capture.result":
                console.log("[iCam][DIAG] capture.result recibido:", msg.requestId,
                    (msg.images || []).map(i => ({ label: i.label, format: i.format, base64Len: (i.base64 || "").length })));
                if (this.autoFaceUIActive || this._autoFaceCapturing) {
                    this._handleAutoFaceCaptureResult(msg);
                } else {
                    this._handleCaptureResult(msg);
                }
                break;

            case "error":
                console.log("[iCam][DIAG] error recibido:", msg.requestId, msg.code, msg.message);
                if (this.autoFaceUIActive || this._autoFaceCapturing) {
                    this._autoFaceRetryOrFail();
                    break;
                }
                // Captura automática de iris (ver "AUTO CAPTURA DE IRIS" en el constructor):
                // reintenta en vez de mostrar el error y detenerse -- el operador solo ve el
                // status "Reintentando...", no un diálogo de error, mientras siga sin capturar.
                if (this.capturePending === "iris") {
                    const generation = this._irisAutoCaptureGeneration;
                    this.clearCapturePending();
                    this.clearBusy();
                    this._stopPreview();
                    this.setStatus(`Reintentando... (${msg.message || "sin detectar"})`, "warning");
                    setTimeout(
                        () => this._attemptIrisCapture(this._irisAutoCaptureMode, generation),
                        this._irisAutoCaptureRetryDelayMs
                    );
                    break;
                }
                this.clearCapturePending();
                this.expectManualFace = false;
                this.clearBusy();
                this._resumeIdlePreview();
                this.setStatus(msg.message || "Error de captura", "danger");
                break;
        }
    }

    _applyCameraStatus(status) {

        // "Busy" es el estado normal mientras hay una vista previa/captura activa (el propio
        // SDK lo reporta así apenas se abre camera.preview.start) -- con vista previa continua
        // esto es el estado de todos los días, no una desconexión. Solo Disconnected/Connecting/
        // Error cuentan como "no conectada".
        if (status === "Busy") return;

        const connected = status === "Connected";
        if (connected && !this.cameraConnected) {
            this.cameraConnected = true;
            this.cameraConnectedTs = Date.now();
            this.lastLiveTs = 0;
            this._autoWakeDone = false;
            this.setStatus("Cámara conectada", "success");
            if (this.previewMode === "iris") {
                // Arranca (o reanuda tras una reconexión) la captura automática de iris -- ver
                // nota de "AUTO CAPTURA DE IRIS" arriba. _resumeIdlePreview() no aplica aquí (para
                // iris solo detiene la vista previa, no la reinicia).
                this.captureIris(this._irisAutoCaptureMode);
            } else {
                this._resumeIdlePreview();
            }
        } else if (!connected && this.cameraConnected) {
            this.cameraConnected = false;
            this.lastLiveTs = 0;
            this._irisAutoCaptureGeneration++; // invalida cualquier reintento de iris pendiente
            this._stopPreview();
            this.resetLive();
            if (this.autoFaceUIActive) {
                this._cancelAutoFace("Cámara desconectada", "warning");
            } else {
                this.setStatus("Cámara desconectada", "warning");
            }
        }
    }

    // "images" trae 1 (rostro) o hasta 2 (right_iris/left_iris) entradas -- mismo criterio que
    // biometric-capture.js: cada label se procesa de forma independiente, sin asumir que
    // siempre llegan ambas.
    _handleCaptureResult(msg) {
        const images = msg.images || [];
        // Resultado real de iris: invalida cualquier reintento automático que hubiera quedado
        // programado (ver "AUTO CAPTURA DE IRIS") -- ya no hace falta seguir buscando.
        if (images.some((img) => img.label === "right_iris" || img.label === "left_iris")) {
            this._irisAutoCaptureGeneration++;
        }
        // Cada imagen se procesa aislada: si una revienta (p.ej. porque la página no configuró
        // el <img> correspondiente), no debe impedir que el resto se muestre NI que se llegue al
        // clearCapturePending/_resumeIdlePreview de abajo -- sin este aislamiento, una excepción
        // aquí dejaba la vista previa congelada para siempre (solo se arreglaba refrescando).
        images.forEach((img) => {
            try {
                const dataUri = "data:" + this._mimeForFormat(img.format) + ";base64," + img.base64;
                switch (img.label) {
                    case "face":
                        if (this.expectManualFace) {
                            this.faceImg.src = dataUri;
                            this.addHistory("Rostro manual", img.base64, img.format);
                            this.expectManualFace = false;
                            if (this.manualFaceTimer) clearTimeout(this.manualFaceTimer);
                        }
                        break;
                    case "right_iris":
                        this.irisRightImg.src = dataUri;
                        this.addHistory("Iris derecho", img.base64, img.format);
                        break;
                    case "left_iris":
                        this.irisLeftImg.src = dataUri;
                        this.addHistory("Iris izquierdo", img.base64, img.format);
                        break;
                }
            } catch (ex) {
                console.error("[iCam] Error mostrando imagen de captura:", img.label, ex);
            }
        });

        this.clearCapturePending();
        this._resumeIdlePreview();
        this.finishCaptureStatus();
    }

    // ============================================================
    // 🎥 SESIÓN DE VISTA PREVIA (interno) -- ver nota de "Vista previa continua" al inicio
    // del archivo.
    // ============================================================

    _uuid() {
        if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    _startPreview(mode, eye, pose) {
        if (this._previewMode === mode &&
            (mode !== "iris" || this._previewEye === eye) &&
            (mode !== "face" || this._previewPose === (pose || "frontal"))) {
            return; // ya hay una sesión abierta en el modo/ojo/pose correcto -- reusarla
        }
        this._stopPreview();

        const requestId = this._uuid();
        this._previewRequestId = requestId;
        this._previewMode = mode;
        this._previewEye = eye || null;
        this._previewPose = mode === "face" ? (pose || "frontal") : null;

        const payload = { type: "camera.preview.start", requestId, capture: mode };
        if (mode === "iris" && eye) payload.eye = eye;
        if (mode === "face" && pose) payload.pose = pose;
        this.send(payload);
    }

    _stopPreview() {
        if (!this._previewRequestId) return;
        this.send({ type: "camera.preview.stop", requestId: this._previewRequestId });
        this._previewRequestId = null;
        this._previewMode = null;
        this._previewEye = null;
        this._previewPose = null;
    }

    // Vuelve al modo de vista previa "idle" configurado (config.previewMode) tras terminar una
    // captura (éxito, error o cancelación) -- en vez de dejar la vista en blanco, ver nota de
    // "Vista previa continua" al inicio del archivo.
    _resumeIdlePreview() {
        // El modo Enroll de iris auto-captura por sí solo con solo estar armado (StartLive ya
        // hace StartCapture) -- confirmado en hardware (2026-09-11): dejarlo abierto fuera de
        // una captura activa hace que el hardware capture "fantasma" en cuanto detecta ambos
        // ojos, sin que el software lo haya pedido (el puente no tiene una captura pendiente
        // registrada en ese momento y descarta el resultado en silencio), dejando el hardware en
        // mal estado para el siguiente intento manual (IrisImageCaptureFail). Por eso iris NUNCA
        // se deja como vista previa "de fondo" -- solo se abre justo antes de una captura real
        // (ver captureIris) y se cierra siempre aquí, sin excepción.
        if (this.previewMode === "iris") {
            this._stopPreview();
            return;
        }
        if (!this.cameraConnected) return;
        this._startPreview(this.previewMode);
    }

    // ============================================================
    // 🎥 OPERACIONES DE CÁMARA
    // ============================================================

    connectCamera() {
        // WSS-DEVICES conecta sus dispositivos al arrancar (no hay un comando de "conectar
        // cámara" por cliente) -- esto solo pregunta el estado actual.
        this.send({ type: "device.list" });
        this.setStatus("Conectando cámara...", "warning");
    }

    disconnectCamera() {
        // WSS-DEVICES no expone "desconectar solo la cámara" para un cliente -- el puente
        // administra el ciclo de vida del dispositivo por su cuenta. Esto solo refleja el
        // estado en la UI local.
        this._resetAutoFaceState();
        this._stopPreview();
        this.cameraConnected = false;
        this.resetLive();
        this.setStatus("Cámara desconectada", "secondary");
    }

    // Sin equivalente en WSS-DEVICES hoy -- no-op seguro (no truena, no finge éxito).
    toggleSleep() {
        this.setStatus("Sleep/Wakeup no disponible en este puente.", "warning");
    }

    sleep() {
        this.setStatus("Sleep no disponible en este puente.", "warning");
    }

    wakeup() {
        this.setStatus("Wakeup no disponible en este puente.", "warning");
    }

    setLed(mode) {
        // no-op intencional -- ver comentario del archivo.
    }

    // `pose` ("frontal", default, o "profile") -- ver la nota extensa en Td200CameraModule.
    // CaptureFaceAsync (puente C#): con "profile" el servidor apaga el recuadro guía frontal y
    // agrega un margen antes de disparar la captura, porque el mismo StartCapture+PressButton sin
    // pausa que funciona para rostro frontal se cuelga con la persona de perfil (confirmado en
    // hardware 2026-09-15: solo se completaba presionando el botón físico de la cámara).
    // Experimental, sin confirmar todavía si el margen alcanza.
    captureFace(pose = "frontal") {
        if (this.isBusy || this.autoFaceUIActive) return;

        this.expectManualFace = true;
        if (this.manualFaceTimer) clearTimeout(this.manualFaceTimer);

        this.manualFaceTimer = setTimeout(() => {
            this.expectManualFace = false;
        }, this.captureTimeoutMs + 500);

        this.markBusy(this.captureTimeoutMs + 1000);
        this.startCapturePending("face", this.captureTimeoutMs);

        this.setStatus("Captura iniciada...", "info");
        this._startPreview("face", null, pose);
        this.send({ type: "camera.capture", requestId: this._previewRequestId, capture: "face", pose });
    }

    // Simulado en el cliente -- ver nota al inicio del archivo. WSS-DEVICES no tiene detección
    // automática de rostro en el servidor, así que aquí se abre vista previa continua y se
    // detecta "quietud" frame a frame para disparar la captura real.
    autoFace(enable) {
        if (!enable) {
            if (this.autoFaceUIActive) this._cancelAutoFace("AutoFace cancelado", "secondary");
            return;
        }

        if (this.isBusy || this.autoFaceUIActive) return;

        this.autoFaceUIActive = true;
        this._autoFaceCapturing = false;
        this._autoFaceAttempt = 0;
        this._autoFaceStableCount = 0;
        this._autoFacePrevFrame = null;

        if (this._autoFaceSessionTimer) clearTimeout(this._autoFaceSessionTimer);
        this._autoFaceSessionTimer = setTimeout(() => {
            if (this.autoFaceUIActive) {
                this._cancelAutoFace("AutoFace: tiempo agotado, intenta de nuevo.", "warning");
            }
        }, this._autoFaceSessionTimeoutMs);

        this.setStatus(`AutoFace operando (0/${this._autoFaceMaxAttempts})`, "info");
        this._startPreview("face");
    }

    // Downscale a un canvas oculto (48x36) + diferencia media de luminancia contra el frame
    // anterior. Por debajo del umbral varios frames seguidos = "la persona está quieta" ->
    // dispara una captura real. Ver nota de calibración al inicio del archivo.
    _autoFaceCheckFrame(base64) {
        if (this.autoFaceImg) this.autoFaceImg.src = "data:image/jpeg;base64," + base64;
        if (this._autoFaceCapturing) return; // ya se disparó una captura, esperando resultado

        const img = new Image();
        img.onload = () => {
            if (!this.autoFaceUIActive || this._autoFaceCapturing) return; // canceló/disparó mientras decodificaba

            const ctx = this._autoFaceCanvas.getContext("2d");
            const w = this._autoFaceCanvas.width, h = this._autoFaceCanvas.height;
            ctx.drawImage(img, 0, 0, w, h);
            const frame = ctx.getImageData(0, 0, w, h).data;

            if (this._autoFacePrevFrame) {
                let diff = 0;
                for (let i = 0; i < frame.length; i += 4) {
                    diff += Math.abs(frame[i] - this._autoFacePrevFrame[i]);
                }
                const avgDiff = diff / (frame.length / 4);
                console.log("[iCam][DIAG] autoFace avgDiff:", avgDiff.toFixed(2), "stableCount:", this._autoFaceStableCount, "umbral:", this._autoFaceStableThreshold);

                if (avgDiff < this._autoFaceStableThreshold) {
                    this._autoFaceStableCount++;
                } else {
                    this._autoFaceStableCount = 0;
                }

                if (this._autoFaceStableCount >= this._autoFaceRequiredStableFrames) {
                    this._autoFaceTriggerCapture();
                }
            }

            this._autoFacePrevFrame = frame;
        };
        img.src = "data:image/jpeg;base64," + base64;
    }

    _autoFaceTriggerCapture() {
        if (!this._previewRequestId) return; // la sesión de preview ya no está activa

        this._autoFaceCapturing = true;
        this._autoFaceAttempt++;
        this.setStatus(`AutoFace capturando (${this._autoFaceAttempt}/${this._autoFaceMaxAttempts})`, "primary");
        this.send({ type: "camera.capture", requestId: this._previewRequestId, capture: "face" });
    }

    _handleAutoFaceCaptureResult(msg) {
        const faceImage = (msg.images || []).find(img => img.label === "face");
        if (!faceImage) {
            this._autoFaceRetryOrFail();
            return;
        }

        try {
            if (this.autoFaceImg) this.autoFaceImg.src = "data:" + this._mimeForFormat(faceImage.format) + ";base64," + faceImage.base64;
            this.addHistory("Auto rostro", faceImage.base64, faceImage.format);
        } catch (ex) {
            console.error("[iCam] Error mostrando imagen de AutoFace:", ex);
        }

        if (this._autoFaceSessionTimer) { clearTimeout(this._autoFaceSessionTimer); this._autoFaceSessionTimer = null; }
        this.autoFaceUIActive = false;
        this._autoFaceCapturing = false;
        this._resumeIdlePreview();
        this.setStatus(`AutoFace OK (${this._autoFaceAttempt}/${this._autoFaceMaxAttempts})`, "success");
    }

    // La captura disparada por estabilidad falló (p.ej. dispositivo ocupado/error de lectura) --
    // reintenta desde cero la detección de estabilidad sobre la misma sesión de preview, hasta
    // agotar los intentos.
    _autoFaceRetryOrFail() {
        if (!this.autoFaceUIActive) return; // ya se había cancelado

        this._autoFaceCapturing = false;
        this._autoFaceStableCount = 0;
        this._autoFacePrevFrame = null;

        if (this._autoFaceAttempt >= this._autoFaceMaxAttempts) {
            this._cancelAutoFace("AutoFace error: límite de intentos alcanzado", "danger");
            return;
        }

        this.setStatus(`AutoFace operando (${this._autoFaceAttempt}/${this._autoFaceMaxAttempts})`, "info");
    }

    _cancelAutoFace(statusText, color) {
        if (this._autoFaceSessionTimer) { clearTimeout(this._autoFaceSessionTimer); this._autoFaceSessionTimer = null; }
        this._resetAutoFaceState();
        if (this.cameraConnected) {
            this._resumeIdlePreview();
        } else {
            this._stopPreview();
        }
        this.setStatus(statusText, color);
    }

    _resetAutoFaceState() {
        if (this._autoFaceSessionTimer) { clearTimeout(this._autoFaceSessionTimer); this._autoFaceSessionTimer = null; }
        this.autoFaceUIActive = false;
        this._autoFaceCapturing = false;
        this._autoFaceStableCount = 0;
        this._autoFacePrevFrame = null;
    }

    // Punto de entrada público -- lo usa tanto el auto-arranque al conectar la cámara
    // (_applyCameraStatus) como el clic en "Capturar". SIEMPRE reinicia desde cero: cancela
    // cualquier intento/reintento en curso (ver "AUTO CAPTURA DE IRIS" en el constructor) en vez
    // de ignorarse si justo hay uno en vuelo -- así el clic en "Capturar" cumple su función de
    // "reiniciar el proceso" sin importar el estado exacto en que estaba.
    captureIris(mode = "both") {
        if (this.autoFaceUIActive) return;

        this._irisAutoCaptureGeneration++;
        const generation = this._irisAutoCaptureGeneration;
        this._irisAutoCaptureMode = mode;

        this.clearCapturePending();
        this.clearBusy();
        this._stopPreview();

        this._attemptIrisCapture(mode, generation);
    }

    // Un intento individual del bucle de auto-captura de iris. `generation` viene de
    // captureIris()/del reintento anterior -- si ya no coincide con
    // this._irisAutoCaptureGeneration, algo más nuevo lo superó (otro clic en "Capturar", una
    // desconexión, o un resultado real ya recibido) y este intento se descarta sin hacer nada.
    _attemptIrisCapture(mode, generation) {
        if (generation !== this._irisAutoCaptureGeneration) return;
        if (!this.cameraConnected) return;

        this.markBusy(this.captureTimeoutMs + 1500);
        this.startCapturePending("iris", this.captureTimeoutMs);

        this.setStatus("Buscando ojo(s)...", "info");
        this._startPreview("iris", mode);
        this.send({ type: "camera.capture", requestId: this._previewRequestId, capture: "iris", eye: mode });
    }

    // Sin equivalente en WSS-DEVICES (no existe un modo "escena") -- no-op seguro.
    captureScene() {
        this.setStatus("Captura de escena no disponible en este puente.", "warning");
    }

    manualReconnect() {
        try { if (this.ws) this.ws.close(); } catch {}
        this.ws = null;

        this.clearCountdown();
        this.clearWsTimeout();

        this.wsState = "IDLE";
        this.wsConnected = false;
        this.cameraConnected = false;
        this.lastLiveTs = 0;
        this._previewRequestId = null;
        this._previewMode = null;
        this._resetAutoFaceState();

        this.resetLive();
        this.recoverAttempts = 0;

        this.setStatus("Reintentando conexión...", "warning");
        this.connectWS();
    }

    // ============================================================
    // 🖼 HISTORIAL
    // ============================================================

    addHistory(label, base64, format) {
        if (!this.historyContainer) return;

        const now = new Date().toLocaleTimeString();

        const div = document.createElement("div");
        div.className = "capture-item";
        div.innerHTML = `
            <div class="capture-item-title">${label}</div>
            <div class="capture-item-time">${now}</div>
            <img src="data:${this._mimeForFormat(format)};base64,${base64}">
        `;

        this.historyContainer.prepend(div);
    }

    // El puente devuelve las capturas finales (rostro/iris) en el formato configurado en
    // config.env (CAM_FACE_FORMAT/CAM_IRIS_FORMAT, default "png") -- no siempre jpeg. Los frames
    // de vista previa sí son siempre jpeg (el propio servidor los codifica así), así que esto
    // solo aplica a imágenes de capture.result, no a camera.preview.frame.
    _mimeForFormat(format) {
        switch ((format || "png").toLowerCase()) {
            case "jpg":
            case "jpeg":
                return "image/jpeg";
            case "bmp":
                return "image/bmp";
            default:
                return "image/png";
        }
    }
}
