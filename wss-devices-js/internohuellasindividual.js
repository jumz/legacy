var deviceName = "SUPREMA_RSG10,CROSSMATCH_GUARDIAN,IB_WATSONMINI,EXTERNAL";
var impressionsToCapture = [
    FingerprintCaptureApi.Impression.PLAIN_LEFT_LITTLE_FINGER,
    FingerprintCaptureApi.Impression.PLAIN_LEFT_RING_FINGER,
    FingerprintCaptureApi.Impression.PLAIN_LEFT_MIDDLE_FINGER,
    FingerprintCaptureApi.Impression.PLAIN_LEFT_INDEX_FINGER,
    FingerprintCaptureApi.Impression.PLAIN_RIGHT_INDEX_FINGER,
    FingerprintCaptureApi.Impression.PLAIN_RIGHT_MIDDLE_FINGER,
    FingerprintCaptureApi.Impression.PLAIN_RIGHT_RING_FINGER,          
    FingerprintCaptureApi.Impression.PLAIN_RIGHT_LITTLE_FINGER,    
    FingerprintCaptureApi.Impression.PLAIN_LEFT_THUMB,    
    FingerprintCaptureApi.Impression.PLAIN_RIGHT_THUMB
];
var impressionsIndex = 0;
var qualityScores = new Map();
var collectedImages = new Map();
var imgElement = document.getElementById("previewImage");
var statusElement = document.getElementById("status");
var promptElement = document.getElementById("prompt");
var markMissingElement = document.getElementById("markMissing");
var resetElement = document.getElementById("reset");
var previewScoreElement = document.getElementById("previewScoreBar");
var missingFingers = [];
var captureComponent;
var setComponent;

// Escala NIST/NFIQ que regresa getNfiqScore: 1=mejor ... 5=peor. Pedido explícito del usuario,
// 2026-09-29: mostrarla como barra de progreso (1->100%, 2->80%, ... 5->20%) y NO aceptar nada
// peor a calidad 2 -- si un dedo sale en 3/4/5, se rechaza y se vuelve a pedir el MISMO dedo
// automáticamente.
var QUALITY_TO_PERCENT = { 1: 100, 2: 80, 3: 60, 4: 40, 5: 20 };
var QUALITY_TO_COLOR = { 1: "#2e7d32", 2: "#8bc34a", 3: "#ff9800", 4: "#f4511e", 5: "#c62828" };
var MAX_ACCEPTABLE_QUALITY = 2;

function setQualityBar(el, score) {
    if (!el) return;
    if (score === undefined || score === null || QUALITY_TO_PERCENT[score] === undefined) {
        el.style.width = "0%";
        el.style.backgroundColor = "#e0e0e0";
        return;
    }
    el.style.width = QUALITY_TO_PERCENT[score] + "%";
    el.style.backgroundColor = QUALITY_TO_COLOR[score];
}

function isQualityRejected(score) {
    return score !== undefined && score !== null && score > MAX_ACCEPTABLE_QUALITY;
}

// Palabra de calidad que acompaña a la barra de "Calidad de la lectura" -- pedido explícito
// del usuario, 2026-09-29: "hay que agregar la palabra... 1 = excelente, 2 = muy buena,
// 3 = buena, 4 = regular, 5 = mala/pobre". Solo se muestra junto a la barra de vista previa,
// no en las tarjetas de resultados.
var QUALITY_TO_WORD = { 1: "Excelente", 2: "Muy buena", 3: "Buena", 4: "Regular", 5: "Mala/pobre" };
var previewScoreWordElement = document.getElementById("previewScoreWord");

function setPreviewQuality(score) {
    setQualityBar(previewScoreElement, score);
    if (previewScoreWordElement) {
        previewScoreWordElement.textContent = (score !== undefined && score !== null && QUALITY_TO_WORD[score] !== undefined) ? QUALITY_TO_WORD[score] : "";
    }
}

// Avanza impressionsIndex saltando cualquier dedo ya marcado como "missing" (desmarcado por el
// operador, ver el click handler de ".huellas" más abajo). Antes, desmarcar una casilla solo
// hacía impressionsIndex++ una vez, sin importar CUÁL casilla era -- si se desmarcaban varias,
// la secuencia quedaba completamente desincronizada (confirmado 2026-09-15: al dejar solo 3
// casillas marcadas, la captura pidió los ÚLTIMOS 3 dedos del arreglo fijo, no los 3 realmente
// marcados, porque el contador simplemente había avanzado 7 veces). Este chequeo por VALOR
// (missingFingers, no una posición) arregla eso sin importar el orden en que se desmarquen.
function advanceToNextCapturable() {
    while (impressionsIndex < impressionsToCapture.length &&
           missingFingers.indexOf(impressionsToCapture[impressionsIndex]) !== -1) {
        impressionsIndex++;
    }
}

// Antes, si el WebSocket nunca lograba abrir (p.ej. BiometricBridge.App no está corriendo en
// esta computadora), no había onerror/onclose -- el estado se quedaba pegado para siempre en
// "Creando websocket..." sin ninguna pista de qué hacer. wsAbrioAlgunaVez distingue "nunca
// conectó" (mensaje: revisa el servicio) de "se cayó después de conectar" (mensaje: se perdió la
// conexión); wsFalloNotificado evita mostrar el aviso dos veces cuando onerror y onclose llegan
// juntos (lo normal para una conexión rechazada -- primero "error", luego "close").
var wsAbrioAlgunaVez = false;
var wsFalloNotificado = false;

function avisarWsNoConecto() {
    wsFalloNotificado = true;
    statusElement.innerText = "No se pudo conectar con BiometricBridge.";
    mostrarError("No se pudo conectar con BiometricBridge en esta computadora. Verifica que el servicio esté corriendo (busca su ícono junto al reloj, en la bandeja del sistema) y vuelve a cargar esta página.");
}

function connect() {
    mostrarEspera();
    statusElement.innerText = "Creando websocket...";
    wsAbrioAlgunaVez = false;
    wsFalloNotificado = false;
    // Puerto de WSS-DEVICES (config.env, CAM_PORT) -- el original apuntaba al puerto por
    // default del backend nativo de Aware (2080). Debe coincidir con el que ya usan
    // internorostro.js/internoiris.js (cámara y huella comparten el mismo puerto).
    websocket = new WebSocket("ws://localhost:20008");
    websocket.onerror = function (event) {
        avisarWsNoConecto();
    };
    websocket.onclose = function (event) {
        if (wsFalloNotificado) return; // onerror ya avisó -- no repetirlo
        if (!wsAbrioAlgunaVez) {
            avisarWsNoConecto(); // onclose llegó sin onerror -- caso raro, mismo aviso de todos modos
            return;
        }
        statusElement.innerText = "Se perdió la conexión con BiometricBridge.";
        mostrarError("Se perdió la conexión con BiometricBridge. Verifica que el servicio siga corriendo e intenta de nuevo.");
    };
    websocket.onopen = function (event) {
        wsAbrioAlgunaVez = true;
        var transport = createWebsocketTransport(websocket);
        statusElement.innerText = "Creando componente de captura...";
        createFingerprintCapture(transport, "FingerprintCapture").then(function (captureComponentValue) {
            captureComponent = captureComponentValue;
            statusElement.innerText = "Creando componente...";
            return createFingerprintSet(transport, "FingerprintSet")
        }).then(function (setComponentValue) {
            setComponent = setComponentValue;
            registerCallbacks();
            statusElement.innerText = "Cargando configuración...";
            return loadConfig();
        }).then(function () {
            statusElement.innerText = "Abriendo dispositivo...";
            return captureComponent.openDevice(deviceName);
        }).then(function () {
            statusElement.innerText = "Inicializando previsualización...";
            // Si el operador desmarcó casillas ANTES de que terminara de conectar (el caso más
            // común, ya que las casillas responden desde que carga la página), esos dedos ya
            // están en missingFingers -- hay que saltarlos antes del primer intento real.
            advanceToNextCapturable();
            startPreview();
        }).catch(function (error) {
            console.log(error);
        });
    };
}

// Handler for receiving the preview image
function onPreviewImage(base64Image) {
    imgElement.src = "data:image/jpg;base64," + base64Image;
    captureComponent.requestNextPreviewImage();
}

// Handler for receiving autocapture status
function onAutocaptureStatus(status) {

    // Finger out this message for now
    if (status === FingerprintCaptureApi.AutocaptureStatus.SOFTWAREAUTOCAPTURECONFIG_HANDEDNESS_NOT_RECOMMENDED) {
        return;
    }

    if (status === FingerprintCaptureApi.AutocaptureStatus.SOFTWAREAUTOCAPTURE_CAPTURE_INITIATED) {
        markMissingElement.disabled = true;
    }
    autocaptureStatus.innerText = FingerprintCaptureApi.AutocaptureStatus[status];
}

// Adds an image to the end of the document. `fingerCode` (FingerprintCaptureApi.Finger, ej.
// LEFT_LITTLE_FINGER) es opcional -- pedido explícito del usuario, 2026-09-25 ("aplica lo mismo
// para internohuellasindividual.php"), mismo fix que internohuellas.php: el backend
// (internohuellas.inc.php) espera SIEMPRE los 10 elementos de arreglo_capturas/arreglo en
// posición fija; con esta etiqueta se puede reconstruir esa lista fija sin depender del orden
// de llegada de las imágenes (ver btnGuardar/btnGuardarContinuar).
// Rellena la tarjeta YA EXISTENTE en la cuadrícula de #resultados (ver
// internohuellasindividual.php) en vez de crear un <img> nuevo y agregarlo al final -- mismo
// rediseño ya confirmado en hardware para internohuellas.php ("aplica esto mismo para la
// lectura individual y para huellas roladas"), pedido explícito del usuario, 2026-09-29.
function appendImage(imageData, fingerCode, score)
{
    if (fingerCode === undefined) return;
    var img = document.querySelector('#resultados img[data-finger-code="' + fingerCode + '"]');
    if (!img) return;
    img.src = "data:image/jpg;base64," + imageData;
    img.style.display = "";
    var placeholder = img.parentElement ? img.parentElement.querySelector('.huella-card-placeholder') : null;
    if (placeholder) placeholder.style.display = "none";
    var qualityFill = img.parentElement ? img.parentElement.querySelector('.huella-card-quality-fill') : null;
    setQualityBar(qualityFill, score);
}

// Vacía (vuelve a mostrar el placeholder gris) la tarjeta de UN dedo -- a diferencia de
// internohuellas.php (que recaptura grupos de 4/2), aquí cada botón "Recapturar" pide un solo
// dedo, así que solo hay que limpiar esa tarjeta. Pedido explícito del usuario, 2026-09-29.
function clearFingerImage(fingerCode) {
    var img = document.querySelector('#resultados img[data-finger-code="' + fingerCode + '"]');
    if (!img) return;
    img.removeAttribute('src');
    img.style.display = "none";
    var placeholder = img.parentElement ? img.parentElement.querySelector('.huella-card-placeholder') : null;
    if (placeholder) placeholder.style.display = "";
    var qualityFill = img.parentElement ? img.parentElement.querySelector('.huella-card-quality-fill') : null;
    setQualityBar(qualityFill, undefined);
}

// FingerprintCaptureApi.Finger (código de la tarjeta, ver CHECKBOX_TO_FINGER más abajo) ->
// FingerprintCaptureApi.Impression (valor que usa impressionsToCapture) -- necesario para
// encontrar la POSICIÓN del dedo pedido y retroceder/avanzar la secuencia hasta ahí.
var FINGER_CODE_TO_IMPRESSION = {};
FINGER_CODE_TO_IMPRESSION[FingerprintCaptureApi.Finger.LEFT_LITTLE_FINGER] = FingerprintCaptureApi.Impression.PLAIN_LEFT_LITTLE_FINGER;
FINGER_CODE_TO_IMPRESSION[FingerprintCaptureApi.Finger.LEFT_RING_FINGER] = FingerprintCaptureApi.Impression.PLAIN_LEFT_RING_FINGER;
FINGER_CODE_TO_IMPRESSION[FingerprintCaptureApi.Finger.LEFT_MIDDLE_FINGER] = FingerprintCaptureApi.Impression.PLAIN_LEFT_MIDDLE_FINGER;
FINGER_CODE_TO_IMPRESSION[FingerprintCaptureApi.Finger.LEFT_INDEX_FINGER] = FingerprintCaptureApi.Impression.PLAIN_LEFT_INDEX_FINGER;
FINGER_CODE_TO_IMPRESSION[FingerprintCaptureApi.Finger.LEFT_THUMB] = FingerprintCaptureApi.Impression.PLAIN_LEFT_THUMB;
FINGER_CODE_TO_IMPRESSION[FingerprintCaptureApi.Finger.RIGHT_LITTLE_FINGER] = FingerprintCaptureApi.Impression.PLAIN_RIGHT_LITTLE_FINGER;
FINGER_CODE_TO_IMPRESSION[FingerprintCaptureApi.Finger.RIGHT_RING_FINGER] = FingerprintCaptureApi.Impression.PLAIN_RIGHT_RING_FINGER;
FINGER_CODE_TO_IMPRESSION[FingerprintCaptureApi.Finger.RIGHT_MIDDLE_FINGER] = FingerprintCaptureApi.Impression.PLAIN_RIGHT_MIDDLE_FINGER;
FINGER_CODE_TO_IMPRESSION[FingerprintCaptureApi.Finger.RIGHT_INDEX_FINGER] = FingerprintCaptureApi.Impression.PLAIN_RIGHT_INDEX_FINGER;
FINGER_CODE_TO_IMPRESSION[FingerprintCaptureApi.Finger.RIGHT_THUMB] = FingerprintCaptureApi.Impression.PLAIN_RIGHT_THUMB;

// Vuelve a pedir UN SOLO dedo -- pedido explícito del usuario, 2026-09-29: "en este caso solo
// debe solicitar el dedo al que se le esta indicando la recaptura" (a diferencia de
// internohuellas.php, que recaptura el grupo completo). Función global (este archivo no
// tiene wrapper de módulo) -- llamada desde internohuellasindividual.php.
var recaptureTargetIndex = null;
function recapturarDedo(fingerCode) {
    var impression = FINGER_CODE_TO_IMPRESSION[fingerCode];
    if (impression === undefined) return;
    var position = impressionsToCapture.indexOf(impression);
    if (position === -1) return;
    // No tiene sentido recapturar un dedo que el operador marcó como omitido.
    if (missingFingers.indexOf(impression) !== -1) return;
    clearFingerImage(fingerCode);
    recaptureTargetIndex = position;
    captureComponent.endAutoCapture().then(function () {
        impressionsIndex = position;
        startPreview();
    });
}

// Impression (FingerprintCaptureApi) -> {setImpression, fingerCode} -- reemplaza el if/else de
// 10 ramas que había antes. Necesario para poder ESPERAR (Promise.all implícito vía cadena) a
// que getNfiqScore() resuelva ANTES de decidir si se avanza al siguiente dedo o se rechaza y
// reintenta -- con el if/else anterior, el avance (impressionsIndex++/startPreview()) corría
// SIEMPRE de inmediato, sin esperar a que la imagen segmentada/score llegaran (no importaba
// porque antes no se necesitaba su resultado para decidir nada).
var IMPRESSION_TO_BRANCH = {};
[
    [FingerprintCaptureApi.Impression.PLAIN_LEFT_LITTLE_FINGER, FingerprintSetApi.Impression.PLAIN_LEFT_LITTLE_FINGER, FingerprintCaptureApi.Finger.LEFT_LITTLE_FINGER],
    [FingerprintCaptureApi.Impression.PLAIN_LEFT_RING_FINGER, FingerprintSetApi.Impression.PLAIN_LEFT_RING_FINGER, FingerprintCaptureApi.Finger.LEFT_RING_FINGER],
    [FingerprintCaptureApi.Impression.PLAIN_LEFT_MIDDLE_FINGER, FingerprintSetApi.Impression.PLAIN_LEFT_MIDDLE_FINGER, FingerprintCaptureApi.Finger.LEFT_MIDDLE_FINGER],
    [FingerprintCaptureApi.Impression.PLAIN_LEFT_INDEX_FINGER, FingerprintSetApi.Impression.PLAIN_LEFT_INDEX_FINGER, FingerprintCaptureApi.Finger.LEFT_INDEX_FINGER],
    [FingerprintCaptureApi.Impression.PLAIN_LEFT_THUMB, FingerprintSetApi.Impression.PLAIN_LEFT_THUMB, FingerprintCaptureApi.Finger.LEFT_THUMB],
    [FingerprintCaptureApi.Impression.PLAIN_RIGHT_LITTLE_FINGER, FingerprintSetApi.Impression.PLAIN_RIGHT_LITTLE_FINGER, FingerprintCaptureApi.Finger.RIGHT_LITTLE_FINGER],
    [FingerprintCaptureApi.Impression.PLAIN_RIGHT_RING_FINGER, FingerprintSetApi.Impression.PLAIN_RIGHT_RING_FINGER, FingerprintCaptureApi.Finger.RIGHT_RING_FINGER],
    [FingerprintCaptureApi.Impression.PLAIN_RIGHT_MIDDLE_FINGER, FingerprintSetApi.Impression.PLAIN_RIGHT_MIDDLE_FINGER, FingerprintCaptureApi.Finger.RIGHT_MIDDLE_FINGER],
    [FingerprintCaptureApi.Impression.PLAIN_RIGHT_INDEX_FINGER, FingerprintSetApi.Impression.PLAIN_RIGHT_INDEX_FINGER, FingerprintCaptureApi.Finger.RIGHT_INDEX_FINGER],
    [FingerprintCaptureApi.Impression.PLAIN_RIGHT_THUMB, FingerprintSetApi.Impression.PLAIN_RIGHT_THUMB, FingerprintCaptureApi.Finger.RIGHT_THUMB]
].forEach(function (entry) {
    IMPRESSION_TO_BRANCH[entry[0]] = { setImpression: entry[1], fingerCode: entry[2] };
});

// Handler for receiving the final captured image
function onCapturedImage(base64Image) {
    markMissingElement.disabled = true;
    statusElement.innerText = "Recibiendo imagen.";
    imgElement.src = "data:image/jpg;base64," + base64Image;
    var impression = impressionsToCapture[impressionsIndex];
    collectedImages[impression] = base64Image;
    setComponent.setFingerprintCaptureImage(impression, captureComponent).then(function () {
        var branch = IMPRESSION_TO_BRANCH[impression];
        if (!branch) return;
        setComponent.getSegmentedImage(branch.setImpression, FingerprintSetApi.ImageFormat.PNG).then(function (imageData) {
            setComponent.getNfiqScore(branch.setImpression).then(function (score) {
                finishCapturedFinger(imageData, branch.fingerCode, score);
            }).catch(function () {
                finishCapturedFinger(imageData, branch.fingerCode, undefined);
            });
        });
    });
}

// Decide si el dedo recién capturado se acepta o se rechaza por calidad -- pedido explícito
// del usuario, 2026-09-29: "no permitamos nada menos calidad de 2". Si se rechaza (calidad
// 3/4/5), NO se agrega a resultados, se avisa y se vuelve a pedir el MISMO dedo automáticamente
// (mismo impressionsIndex). Si se acepta, sigue el flujo normal (avanzar/finalizar recaptura)
// que antes corría siempre de inmediato, sin esperar la calidad.
function finishCapturedFinger(imageData, fingerCode, score) {
    setPreviewQuality(score);
    if (isQualityRejected(score)) {
        statusElement.innerText = "Calidad insuficiente (" + score + ") -- reintentando...";
        setTimeout(startPreview, 2000);
        return;
    }
    appendImage(imageData, fingerCode, score);

    // Si esta captura fue una recaptura puntual de un solo dedo (botón "Recapturar" de
    // internohuellasindividual.php), NO hay que seguir la secuencia normal hacia el
    // SIGUIENTE dedo -- eso volvería a pedir dedos que ya estaban bien, solo porque se
    // recapturó otro. Pedido explícito del usuario, 2026-09-29.
    if (recaptureTargetIndex !== null) {
        recaptureTargetIndex = null;
        impressionsIndex = impressionsToCapture.length;
        promptElement.innerText = "";
        statusElement.innerText = "Captura finalizada.";
        return;
    }

    // Pequeña pausa antes de pedir el siguiente dedo -- pedido explícito del usuario,
    // 2026-09-29: "la calidad de la lectura cuando esta en el live no se alcanza, la barra
    // parece permanecer en 0". Bug real: sin esta pausa, startPreview() (que resetea la barra
    // a 0% antes de armar el siguiente dedo) corría en el MISMO ciclo síncrono en el que se
    // acababa de pintar la barra con el score real -- el navegador nunca llegaba a pintar ese
    // valor, solo el 0 final. Con la pausa, el score queda visible un momento antes de
    // reiniciar la barra.
    impressionsIndex++;
    advanceToNextCapturable();
    setTimeout(startPreview, 900);
}

function getSegments (){
    var positions = getPositions();
    for (i = 0; i < positions.length; i++) {
        var impression = positions[i];
        console.log(impression);
        //if (missingFingers.indexOf(impression) === -1)
        //{
            // Translate single finger code to finger in slap code
            impression = ImpressionInfo.SingleFingerToFingerInSlap[impression];
            setComponent.getSegmentedImage(impression,
                FingerprintSetApi.ImageFormat.PNG).then( function(imageData){
                appendImage(imageData);
                console.log(imageData);
            });
                console.log("Afuera");
        //}
    }
}

function onPreviewQualityScore (impressionString, afiqScore) {
    var impression = parseInt(impressionString, 10);
    qualityScores.set(impression, afiqScore);
    var positions = getPositions();
    var sortedScores = [];
    for (i = 0; i < positions.length; i++) {
        var score = qualityScores.get(positions[i]);
        if (score === undefined)
            score = 0;
        sortedScores.push(score);
    }
    previewScoreElement.innerText = sortedScores.join(" ");
}

/**
 * Returns the finger positions that contained in the current impression
 * @returns {*}
 */
function getPositions(){
    var impression = impressionsToCapture[impressionsIndex];
    if (impression === FingerprintCaptureApi.Impression.PLAIN_LEFT_LITTLE_FINGER){
        return [        
            FingerprintCaptureApi.Finger.LEFT_LITTLE_FINGER
        ];
    }
    else if (impression === FingerprintCaptureApi.Impression.PLAIN_LEFT_RING_FINGER){    
        return [        
            FingerprintCaptureApi.Finger.LEFT_RING_FINGER
        ];        
    }
    else if (impression === FingerprintCaptureApi.Impression.PLAIN_LEFT_MIDDLE_FINGER){    
        return [        
            FingerprintCaptureApi.Finger.LEFT_MIDDLE_FINGER
        ];        
    }
    else if (impression === FingerprintCaptureApi.Impression.PLAIN_LEFT_INDEX_FINGER){    
        return [        
            FingerprintCaptureApi.Finger.LEFT_INDEX_FINGER
        ];        
    }     
    else if (impression === FingerprintCaptureApi.Impression.PLAIN_LEFT_INDEX_FINGER){    
        return [        
            FingerprintCaptureApi.Finger.LEFT_INDEX_FINGER
        ];        
    }
    else if (impression === FingerprintCaptureApi.Impression.PLAIN_LEFT_THUMB){    
        return [        
            FingerprintCaptureApi.Finger.LEFT_THUMB
        ];        
    }
    else if (impression === FingerprintCaptureApi.Impression.PLAIN_RIGHT_LITTLE_FINGER){
        return [        
            FingerprintCaptureApi.Finger.RIGHT_LITTLE_FINGER
        ];
    }
    else if (impression === FingerprintCaptureApi.Impression.PLAIN_RIGHT_RING_FINGER){    
        return [        
            FingerprintCaptureApi.Finger.RIGHT_RING_FINGER
        ];        
    }
    else if (impression === FingerprintCaptureApi.Impression.PLAIN_RIGHT_MIDDLE_FINGER){    
        return [        
            FingerprintCaptureApi.Finger.RIGHT_MIDDLE_FINGER
        ];        
    }
    else if (impression === FingerprintCaptureApi.Impression.PLAIN_RIGHT_INDEX_FINGER){    
        return [        
            FingerprintCaptureApi.Finger.RIGHT_INDEX_FINGER
        ];        
    }     
    else if (impression === FingerprintCaptureApi.Impression.PLAIN_RIGHT_INDEX_FINGER){    
        return [        
            FingerprintCaptureApi.Finger.RIGHT_INDEX_FINGER
        ];        
    }
    else if (impression === FingerprintCaptureApi.Impression.PLAIN_RIGHT_THUMB){    
        return [        
            FingerprintCaptureApi.Finger.RIGHT_THUMB
        ];        
    } 
    else {
        return [impression];
    }
}

function registerCallbacks() {
    captureComponent.setPreviewImageUpdated(onPreviewImage);
    captureComponent.setPreviewQualityScoreUpdated(onPreviewQualityScore);
    captureComponent.setAutocaptureStatusUpdated(onAutocaptureStatus);
    captureComponent.setCapturedImageUpdated(onCapturedImage);
}

function startPreview() {
    qualityScores.clear();
    ocultarMensaje();
    setPreviewQuality(undefined);
    if (impressionsIndex < impressionsToCapture.length) {
        var impression = impressionsToCapture[impressionsIndex];
        promptElement.innerText = FingerprintCaptureApi.Impression[impression];
        captureComponent.startAutoCapture(impression, FingerprintCaptureApi.ImageFormat.JPG).then(function () {
            statusElement.innerText = "Previsualización de la imagen...";
            EnableMarkMissing(true);
        }).catch(function (error_code) {
            // Reintenta el MISMO dedo automáticamente en vez de detenerse -- antes, cualquier
            // fallo (sensor sucio, dedo mal puesto, etc.) dejaba la secuencia parada ahí, y la
            // única forma de continuar era "Reiniciar captura", que borra TODO el progreso y
            // recarga la página desde el primer dedo. Con 10 capturas independientes, cada una
            // con algo de probabilidad de fallar, esto hacía casi imposible terminar la
            // secuencia completa (confirmado 2026-09-15, mismo problema en
            // internohuellasroladas.js). No avanza impressionsIndex ni toca "Resultados".
            statusElement.innerText = "Un error ha ocurrido: " + error_code + " -- reintentando...";
            setTimeout(startPreview, 2000);
        });
    } else {
        promptElement.innerText = "";
        statusElement.innerText = "Captura finalizada.";
    }
}

function onMarkMissing() {
    EnableMarkMissing(false);
    var impression = impressionsToCapture[impressionsIndex];

    if (impression === FingerprintCaptureApi.Impression.PLAIN_LEFT_FOUR_FINGERS)
        impression = FingerprintCaptureApi.Finger.LEFT_INDEX_FINGER;
    else if (impression === FingerprintCaptureApi.Impression.PLAIN_RIGHT_FOUR_FINGERS)
        impression = FingerprintCaptureApi.Finger.RIGHT_INDEX_FINGER;
    else if (impression === FingerprintCaptureApi.Impression.PLAIN_DUAL_THUMBS)
        impression = FingerprintCaptureApi.Finger.LEFT_THUMB;

    missingFingers.push(impression);
    setComponent.setFingerMissing(impression, true).then(function () {
        return captureComponent.setFingerMissing(impression, true)
    }).then(function () {
        statusElement.innerText = "Marked as missing.";
    });
}


function EnableMarkMissing(enable) {
    markMissingElement.disabled = !enable;
}

function onReset() {
    statusElement.innerText = "Reiniciando...";
    EnableMarkMissing(false);
    captureComponent.endAutoCapture().then(function () {
        setComponent.reset().then(function () {
            return captureComponent.resetMissingFingers();
        }).then(function () {
            impressionsIndex = 0;
            startPreview();
        });
    });
    $('#resultados').html('');
    var huellas = $('.huellas');
    location.reload();    
}

function loadConfig() {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("load", function () {
            captureComponent.setAutoCaptureConfiguration(this.responseText)
                .then(function () {
                    resolve()
                });
        });
        xhr.open("GET", "autocapture_configuration.xml");
        xhr.send();
    });
}

// Event listener to start the connection
document.addEventListener("DOMContentLoaded", function () {
    markMissingElement.onclick = onMarkMissing;
    EnableMarkMissing(false);
    resetElement.onclick = onReset;
    connect();
});
$('.huellas').click(function(){
    // Se quita mostrarEspera() aquí -- pedido explícito del usuario, 2026-09-25: (des)marcar
    // un dedo no debe mostrar el modal "Procesando..." (que además se quedaba pegado sin
    // cerrarse cuando el dedo (des)marcado no era el que se está pidiendo ahora mismo, ya que
    // ese camino nunca llama ocultarMensaje()). No afecta btnGuardar/btnGuardarContinuar/
    // connect(), que tienen sus propias llamadas a mostrarEspera() sin tocar.
    var actual = $(this).attr('id');
    if(actual=='menique_mano_izquierda'){
        var impression = FingerprintSetApi.Impression.PLAIN_LEFT_LITTLE_FINGER;
    }else if(actual=='anular_mano_izquierda'){
        var impression = FingerprintSetApi.Impression.PLAIN_LEFT_RING_FINGER;
    }else if(actual=='medio_mano_izquierda'){
        var impression = FingerprintSetApi.Impression.PLAIN_LEFT_MIDDLE_FINGER;
    }else if(actual=='indice_mano_izquierda'){
        var impression = FingerprintSetApi.Impression.PLAIN_LEFT_INDEX_FINGER;
    }else if(actual=='pulgar_mano_izquierda'){
        var impression = FingerprintSetApi.Impression.PLAIN_LEFT_THUMB;
    }else if(actual=='menique_mano_derecha'){
        var impression = FingerprintSetApi.Impression.PLAIN_RIGHT_LITTLE_FINGER;
    }else if(actual=='anular_mano_derecha'){
        var impression = FingerprintSetApi.Impression.PLAIN_RIGHT_RING_FINGER;
    }else if(actual=='medio_mano_derecha'){
        var impression = FingerprintSetApi.Impression.PLAIN_RIGHT_MIDDLE_FINGER;
    }else if(actual=='indice_mano_derecha'){
        var impression = FingerprintSetApi.Impression.PLAIN_RIGHT_INDEX_FINGER;
    }else if(actual=='pulgar_mano_derecha'){
        var impression = FingerprintSetApi.Impression.PLAIN_RIGHT_THUMB;
    }
    // Antes se deshabilitaba el checkbox aquí en CUALQUIER clic (marcar o desmarcar) --
    // pedido explícito del usuario, 2026-09-25: "no puedo volver a marcar un dedo como si
    // estuviera desactivado". Se quita para poder alternar libremente.
    if($(this).is(":checked")){
        // Antes había un "return false;" antes de esta llamada -- la dejaba como código
        // muerto, así que volver a marcar un dedo nunca se lo avisaba al backend/al puente.
        var idx = missingFingers.indexOf(impression);
        if (idx !== -1) missingFingers.splice(idx, 1);
        // Si el dedo que se vuelve a marcar está ANTES de la posición actual de la secuencia
        // (ya se saltó de largo por estar desmarcado), hay que retroceder y volver a pedirlo --
        // pedido explícito del usuario, 2026-09-25: al volver a marcar el meñique (ya saltado),
        // el LED/imagen se quedaban en el dedo que se estaba pidiendo (medio), no volvían al
        // meñique. Solo aplica si de verdad se saltó (posición < impressionsIndex) -- si es un
        // dedo que todavía no le toca su turno, no hace falta tocar nada.
        var impressionPosition = impressionsToCapture.indexOf(impression);
        var needsRewind = impressionPosition !== -1 && impressionPosition < impressionsIndex;
        setComponent.setFingerMissing(impression, false).then(function(){
        return captureComponent.setFingerMissing(impression, false);
        }).then(function () {
            console.log("HABILITADO");
            if (!needsRewind) return;
            captureComponent.endAutoCapture().then(function () {
                setComponent.reset().then(function () {
                    return captureComponent.resetMissingFingers();
                }).then(function () {
                    impressionsIndex = impressionPosition;
                    startPreview();
                    ocultarMensaje();
                });
            });
        });
    }else{
        // Se registra por VALOR (missingFingers), no por posición -- antes esto hacía
        // impressionsIndex++ a ciegas, así que desmarcar VARIAS casillas desincronizaba la
        // secuencia completa (confirmado 2026-09-15: con 3 casillas marcadas, la captura pidió
        // los últimos 3 dedos del arreglo fijo, no los 3 que realmente seguían marcados). Ver
        // advanceToNextCapturable() al inicio del archivo.
        if (missingFingers.indexOf(impression) === -1) missingFingers.push(impression);
        var isCurrentImpression = impressionsToCapture[impressionsIndex] === impression;
        setComponent.setFingerMissing(impression, true).then(function(){
        return captureComponent.setFingerMissing(impression, true);
        }).then(function () {
            console.log("DESHABILITADO");
            statusElement.innerText = "Marked as missing.";
            // Solo hay que abortar/reiniciar la captura en curso si el dedo que se acaba de
            // desmarcar es justo el que se está pidiendo AHORA MISMO. Si es un dedo que todavía
            // no le toca su turno, ya quedó registrado arriba -- advanceToNextCapturable() lo
            // va a saltar solo cuando la secuencia llegue a su posición, sin interrumpir nada.
            if (!isCurrentImpression) return;
            captureComponent.endAutoCapture().then(function () {
                setComponent.reset().then(function () {
                    return captureComponent.resetMissingFingers();
                }).then(function () {
                    advanceToNextCapturable();
                    startPreview();
                    ocultarMensaje();
                });
            });
        });
    }

});

// El backend (internohuellas.inc.php, fuera de este repo) espera SIEMPRE los 10 elementos de
// arreglo_capturas/arreglo en posición FIJA (índice 0=meñique izq...9=pulgar der) -- mismo bug
// y mismo fix ya confirmado en hardware real para internohuellas.php (ver ese archivo/README):
// con menos de 10 (dedos desmarcados) el backend truena con "Undefined offset", y una cadena
// vacía como placeholder también truena distinto (explode(',', '') sin coma que partir). Se
// recorren TODOS los checkboxes (marcados o no) en orden de DOM, con un data-URI JPEG 1x1
// placeholder válido para los que no tienen imagen. Pedido explícito del usuario, 2026-09-25.
var CHECKBOX_TO_FINGER = {
    menique_mano_izquierda: FingerprintCaptureApi.Finger.LEFT_LITTLE_FINGER,
    anular_mano_izquierda: FingerprintCaptureApi.Finger.LEFT_RING_FINGER,
    medio_mano_izquierda: FingerprintCaptureApi.Finger.LEFT_MIDDLE_FINGER,
    indice_mano_izquierda: FingerprintCaptureApi.Finger.LEFT_INDEX_FINGER,
    pulgar_mano_izquierda: FingerprintCaptureApi.Finger.LEFT_THUMB,
    menique_mano_derecha: FingerprintCaptureApi.Finger.RIGHT_LITTLE_FINGER,
    anular_mano_derecha: FingerprintCaptureApi.Finger.RIGHT_RING_FINGER,
    medio_mano_derecha: FingerprintCaptureApi.Finger.RIGHT_MIDDLE_FINGER,
    indice_mano_derecha: FingerprintCaptureApi.Finger.RIGHT_INDEX_FINGER,
    pulgar_mano_derecha: FingerprintCaptureApi.Finger.RIGHT_THUMB
};

var PLACEHOLDER_JPEG_DATA_URI =
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAALCAABAAEBAREA/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/9oACAEBAAA/APf6/9k=";

function buildFixedPositionArrays() {
    var arreglo_capturas = [];
    var arreglo = [];
    var faltaAlguna = false;
    $('#contenedor_captura_huellas input.huellas').each(function () {
        var checkboxId = $(this).attr('id');
        var isChecked = $(this).is(':checked');
        arreglo_capturas.push(checkboxId);
        var fingerCode = CHECKBOX_TO_FINGER[checkboxId];
        var img = fingerCode !== undefined
            ? $('#resultados img[data-finger-code="' + fingerCode + '"]')
            : $();
        // El <img> de cada tarjeta ya existe SIEMPRE en el DOM desde que carga la página (ver
        // internohuellasindividual.php, cuadrícula de resultados, pedido del usuario
        // 2026-09-29) -- antes solo existía una vez capturado, así que "el elemento existe"
        // ya no sirve para saber si hay una imagen real. Se revisa que además tenga "src".
        var hasImage = img.length > 0 && !!img.attr('src');
        if (isChecked && !hasImage) faltaAlguna = true;
        arreglo.push(hasImage ? img.attr('src') : PLACEHOLDER_JPEG_DATA_URI);
    });
    return { arreglo_capturas: arreglo_capturas, arreglo: arreglo, faltaAlguna: faltaAlguna };
}

$('#btnGuardar').click(function(){
    var id_interno = $('#id_interno').val();
    var datos = buildFixedPositionArrays();
    if (datos.faltaAlguna) {
        mostrarError("Falta capturar huellas");
        return false;
    }
    mostrarEspera();
    xajax_guardarHuellas(id_interno, datos.arreglo_capturas, datos.arreglo);
});

$('#btnGuardarContinuar').click(function(){
    var id_interno = $('#id_interno').val();
    var siguiente_paso = $('#siguiente_paso').val();
    var datos = buildFixedPositionArrays();
    if (datos.faltaAlguna) {
        mostrarError("Falta capturar huellas");
        return false;
    }
    mostrarEspera();
    xajax_guardarHuellasContinuar(id_interno, datos.arreglo_capturas, datos.arreglo, siguiente_paso);
});

    // Handshake original con "AdminAware" (servicio nativo que había que apagar/reencender
    // para liberar el lector antes de usar la versión web) -- eliminado para WSS-DEVICES: no
    // hay ninguna app nativa que administrar, el puente es el único dueño del dispositivo. El
    // connect() de DOMContentLoaded arriba es suficiente.