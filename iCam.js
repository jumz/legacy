class TD100Client {

    constructor(config) {

        // ============================================================
        // CONFIGURACIÓN GENERAL
        // ============================================================

        this.wsUrl = config.wsUrl;

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
        
        // UI: si autoFace está "activo" (para que liveImageJpeg no pise el status)
        this.autoFaceUIActive = false;
        this.autoFaceLastStatus = null;

        // ============================================================
        // ESTADO INTERNO (ORIGINAL + EXTENDIDO)
        // ============================================================

        this.ws = null;
        this.wsState = "IDLE"; // IDLE | CONNECTING | CONNECTED | WAITING

        this.wsConnected = false;
        this.wsConnectedTs = 0;              // 🔧 NUEVO
        this.cameraConnected = false;

        this.isBusy = false;
        this.expectManualFace = false;
        this.manualFaceTimer = null;

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
        // AUTO WAKE FIX (CONDICIONAL)
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
        this.captureTimeoutMs = 2000;    // ajusta a gusto


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
        // WATCHDOG PRINCIPAL
        // ============================================================

        setInterval(() => {

            // WS no conectado
            if (!this.wsConnected) {
                this.resetLive();
                return;
            }

            const now = Date.now();

            // 🔧 Cámara no confirmada aún (pero WS sí)
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

            // ❌ Cámara conectada pero aún sin live
            if (this.lastLiveTs === 0) {

                if (
                    this.autoWakeEnabled &&
                    !this._autoWakeDone &&
                    !this._autoWakeInProgress &&
                    now - this.cameraConnectedTs > this.autoWakeDelayMs
                ) {
                    this.autoWakeCamera();
                }

                return;
            }

            // ⚠ Live se congeló
            if (now - this.lastLiveTs > this.liveTimeoutMs) {
                this.resetLive();
                this.setStatus("Live detenido", "warning");
            }

        }, 1000);
    }
    
    
    // ============================================================
    //
    // ============================================================
    
    startCapturePending(type, timeoutMs = this.captureTimeoutMs) 
    {
        this.capturePending = type;

        if (this.captureTimer) clearTimeout(this.captureTimer);

        this.captureTimer = setTimeout(() => {
            // Si sigue pendiente, falló
            if (this.capturePending === type) {
                this.capturePending = null;

                // Para face manual
                this.expectManualFace = false;
                if (this.manualFaceTimer) clearTimeout(this.manualFaceTimer);

                // Libera botón y avisa
                this.clearBusy();
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
            this.wsConnectedTs = Date.now();      // 🔧 NUEVO
            this.recoverAttempts = 0;
            this.clearCountdown();

            this.setStatus("WS conectado", "success");

            // 🔧 CLAVE: rearmar cámara tras reconexión de WS
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
    // 🛠 AUTO WAKE FIX
    // ============================================================

    autoWakeCamera() {

        if (!this.autoWakeEnabled) return;
        if (this._autoWakeDone) return;
        if (this._autoWakeInProgress) return;
        if (!this.wsConnected) return;

        this._autoWakeInProgress = true;

        console.log("[TD100] AutoWake: sleep → wake");

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

    // ============================================================
    // 🟩 MENSAJES ENTRANTES
    // ============================================================

    handleMessage(evt) {

        const raw = evt.data;
        if (typeof raw !== "string") return;

        const trimmed = raw.trim();

        // ==========================================================
        // 1) MENSAJES NO JSON (texto plano) -> procesar y salir
        // ==========================================================
        if (!trimmed.startsWith("{")) {

            if (trimmed.includes("CameraConnected")) {
                this.cameraConnected = true;
                this.cameraConnectedTs = Date.now();
                this.lastLiveTs = 0;
                this._autoWakeDone = false;
                this.setStatus("Cámara conectada", "success");
                return;
            }

            if (trimmed.includes("CameraDisconnected")) {
                this.cameraConnected = false;
                this.lastLiveTs = 0;
                this.resetLive();
                this.setStatus("Cámara desconectada", "warning");
                return;
            }

            if (trimmed.includes("needPhysicalButton")) {
                this.setStatus("Oprime el botón físico de la cámara para reactivarla.", "warning");
                return;
            }

            // ✅ ACKs opcionales para botones (si tu C# los manda como texto)
            if (trimmed.includes("FaceCaptureStarted")) 
            {
                this.setStatus("Captura iniciada...", "info");
                return;
            }

            if (trimmed.includes("scene_capture_started")) {
                this.setStatus("Captura de escena iniciada", "info");
                return;
            }

            console.log("[TD100] WS TEXT:", trimmed);
            return;
        }

        // ==========================================================
        // 2) MENSAJES JSON -> parsear
        // ==========================================================
        let msg;
        try { msg = JSON.parse(trimmed); }
        catch { return; }

        // ==========================================================
        // 3) TU SWITCH ACTUAL (igual)
        // ==========================================================
        switch (msg.type) {

            case "liveImageJpeg":
                this.lastLiveTs = Date.now();
                this.liveImg.src = "data:image/jpeg;base64," + msg.data;

                if (!this.autoFaceUIActive) {
                    if (this.cameraConnected) {
                        if (this.statusLabel && this.statusLabel.textContent === "Live detenido") {
                            this.setStatus("Cámara conectada", "success");
                        }
                    } else {
                        this.cameraConnected = true;
                        this.cameraConnectedTs = Date.now();
                        this.setStatus("Cámara conectada", "success");
                    }
                }
                break;

            case "autoFace":
                if (msg.data) {
                    this.autoFaceImg.src = "data:image/jpeg;base64," + msg.data;
                    this.addHistory("Auto rostro (ICAO)", msg.data);
                }

                if (msg.status) {
                    const attempt = (msg.attempt ?? 0);
                    const max = (msg.maxAttempts ?? 5);
                    const enabled = !!msg.enabled;

                    this.autoFaceLastStatus = msg.status;

                    switch (msg.status) {
                        case "running":
                            this.autoFaceUIActive = true;
                            this.setStatus(`AutoFace operando (${attempt}/${max})`, "info");
                            break;
                        case "capturing":
                            this.autoFaceUIActive = true;
                            this.setStatus(`AutoFace capturando (${attempt}/${max})`, "primary");
                            break;
                        case "invalid_full":
                            this.autoFaceUIActive = true;
                            this.setStatus(`AutoFace: rostro no válido (${attempt}/${max})`, "warning");
                            break;
                        case "success":
                            this.autoFaceUIActive = false;
                            this.setStatus(`AutoFace OK (${attempt}/${max})`, "success");
                            break;
                        case "cancelled":
                            this.autoFaceUIActive = false;
                            this.setStatus("AutoFace cancelado", "secondary");
                            break;
                        case "error":
                            this.autoFaceUIActive = false;
                            let err = msg.error || "unknown";
                            if (err === "max_attempts_reached") err = "límite de intentos alcanzado";
                            this.setStatus(`AutoFace error: ${err}`, "danger");
                            break;
                    }

                    if (!enabled && (msg.status === "success" || msg.status === "error" || msg.status === "cancelled")) {
                        this.autoFaceUIActive = false;
                    }
                }
                break;

                case "faceImage":
                case "face_full":
                    if (this.expectManualFace) {
                        this.faceImg.src = "data:image/jpeg;base64," + msg.data;
                        this.addHistory("Rostro manual", msg.data);
                        this.expectManualFace = false;
                        if (this.manualFaceTimer) clearTimeout(this.manualFaceTimer);
                    }
                    this.clearCapturePending();

                    this.finishCaptureStatus();   // ✅ AQUÍ
                    break;

                case "iris_right":
                    this.irisRightImg.src = "data:image/jpeg;base64," + msg.data;
                    this.addHistory("Iris derecho", msg.data);
                    this.clearCapturePending();

                    this.finishCaptureStatus();   // ✅ AQUÍ
                    break;

                case "iris_left":
                    this.irisLeftImg.src = "data:image/jpeg;base64," + msg.data;
                    this.addHistory("Iris izquierdo", msg.data);
                    this.clearCapturePending();

                    this.finishCaptureStatus();   // ✅ AQUÍ
                    break;

                case "sceneFull":
                    this.sceneImg.src = "data:image/jpeg;base64," + msg.data;
                    this.addHistory("Escena completa", msg.data);
                    this.clearCapturePending();

                    this.finishCaptureStatus();   // ✅ AQUÍ
                    break;


            case "sleep_state":
                const sleep = msg.isSleeping;
                this.setStatus(
                    sleep ? "Cámara en Sleep" : "Cámara activa",
                    sleep ? "warning" : "success"
                );
                break;
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
    // 🎥 OPERACIONES DE CÁMARA (ORIGINALES)
    // ============================================================

    connectCamera() {
        this.send("connectCamera");
        this.setStatus("Conectando cámara...", "warning");
    }

    disconnectCamera() {
        this.send("disconnectCamera");
        this.setStatus("Cámara desconectada", "secondary");
    }

    toggleSleep() {
        this.send({ command: "toggleSleep" });
    }
    
    sleep() {
        this.send({ command: "sleep" });
    }
    
    wakeup() {
            this.send({ command: "wakeup" });
        }

    setLed(mode) {
        this.send({
            command: "setLed",
            value: mode
        });
    }

    captureFace() {
        if (this.isBusy) return;

        this.expectManualFace = true;
        if (this.manualFaceTimer) clearTimeout(this.manualFaceTimer);

        // Si por lo que sea llega faceImage muy tarde, ya no lo tomes como “manual”
        this.manualFaceTimer = setTimeout(() => {
            this.expectManualFace = false;
        }, this.captureTimeoutMs + 500);

        this.markBusy(this.captureTimeoutMs + 1000);
        this.startCapturePending("face", this.captureTimeoutMs);

        this.setStatus("Captura iniciada...", "info");
        this.send({ command: "captureFace" });
    }


    autoFace(enable) {
        this.send({ command: enable ? "autoFaceOn" : "autoFaceOff" });

        if (enable) {
            this.autoFaceUIActive = true;
            this.setStatus("AutoFace iniciando...", "info");
        } else {
            this.autoFaceUIActive = false;
            this.setStatus("AutoFace desactivado", "secondary");
        }
    }


    captureIris(mode = "both") {
        if (this.isBusy) return;

        this.markBusy(this.captureTimeoutMs + 1500);
        this.startCapturePending("iris", this.captureTimeoutMs);

        this.setStatus("Captura iniciada...", "info");
        this.send({ command: "captureIris", mode });
    }


    captureScene() {
        if (this.isBusy) return;

        this.markBusy(this.captureTimeoutMs + 1500);
        this.startCapturePending("scene", this.captureTimeoutMs);

        this.setStatus("Captura iniciada...", "info");
        this.send({ command: "captureScene" });
    }

    
    manualReconnect() {
        // Cerrar WS actual si existe
        try { if (this.ws) this.ws.close(); } catch {}
        this.ws = null;

        // Reset de estado para permitir reintentos
        this.clearCountdown();
        this.clearWsTimeout();

        this.wsState = "IDLE";
        this.wsConnected = false;
        this.cameraConnected = false;
        this.lastLiveTs = 0;

        this.resetLive();        
        this.recoverAttempts = 0;

        this.setStatus("Reintentando conexión...", "warning");
        this.connectWS();
    }


    // ============================================================
    // 🖼 HISTORIAL
    // ============================================================

    addHistory(label, base64) {
        if (!this.historyContainer) return;

        const now = new Date().toLocaleTimeString();

        const div = document.createElement("div");
        div.className = "capture-item";
        div.innerHTML = `
            <div class="capture-item-title">${label}</div>
            <div class="capture-item-time">${now}</div>
            <img src="data:image/jpeg;base64,${base64}">
        `;

        this.historyContainer.prepend(div);
    }
}
