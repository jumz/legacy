var deviceName = "SUPREMA_RSG10,CROSSMATCH_GUARDIAN,IB_WATSONMINI,EXTERNAL";
var impressionsToCapture = [
    FingerprintCaptureApi.Impression.ROLLED_LEFT_LITTLE_FINGER,
    FingerprintCaptureApi.Impression.ROLLED_LEFT_RING_FINGER,
    FingerprintCaptureApi.Impression.ROLLED_LEFT_MIDDLE_FINGER,
    FingerprintCaptureApi.Impression.ROLLED_LEFT_INDEX_FINGER,
    FingerprintCaptureApi.Impression.ROLLED_RIGHT_INDEX_FINGER,
    FingerprintCaptureApi.Impression.ROLLED_RIGHT_MIDDLE_FINGER,
    FingerprintCaptureApi.Impression.ROLLED_RIGHT_RING_FINGER,          
    FingerprintCaptureApi.Impression.ROLLED_RIGHT_LITTLE_FINGER,    
    FingerprintCaptureApi.Impression.ROLLED_LEFT_THUMB,    
    FingerprintCaptureApi.Impression.ROLLED_RIGHT_THUMB
];
var impressionsIndex = 0;
var qualityScores = new Map();
var collectedImages = new Map();
var imgElement = document.getElementById("previewImage");
var statusElement = document.getElementById("status");
var promptElement = document.getElementById("prompt");
var markMissingElement = document.getElementById("markMissing");
var resetElement = document.getElementById("reset");
var previewScoreElement = document.getElementById("previewScore");
var missingFingers = [];
var captureComponent;
var setComponent;

// Avanza impressionsIndex saltando cualquier dedo ya marcado como "missing" (desmarcado por el
// operador, ver el click handler de ".huellas" más abajo). Antes, desmarcar una casilla solo
// hacía impressionsIndex++ una vez, sin importar CUÁL casilla era -- si se desmarcaban varias,
// la secuencia quedaba completamente desincronizada (mismo bug confirmado 2026-09-15 en
// internohuellasindividual.js: con solo 3 casillas marcadas, la captura pidió los ÚLTIMOS 3
// dedos del arreglo fijo, no los 3 realmente marcados). Este chequeo por VALOR (missingFingers,
// no una posición) arregla eso sin importar el orden en que se desmarquen.
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
            // Si el operador desmarcó casillas ANTES de que terminara de conectar, esos dedos ya
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
// para internohuellasroladas.php"), mismo fix que internohuellas.php: el backend
// (internohuellas.inc.php) espera SIEMPRE los 10 elementos de arreglo_capturas/arreglo en
// posición fija; con esta etiqueta se puede reconstruir esa lista fija sin depender del orden
// de llegada de las imágenes (ver btnGuardar/btnGuardarContinuar).
function appendImage(imageData, fingerCode)
{
    document.body.appendChild(document.createElement("br"));
    var img = document.createElement("img");
    img.src = "data:image/jpg;base64," + imageData;
    if (fingerCode !== undefined) img.dataset.fingerCode = fingerCode;
    document.getElementById('resultados').appendChild(img);
}

// Handler for receiving the final captured image
function onCapturedImage(base64Image) {
    markMissingElement.disabled = true;
    statusElement.innerText = "Recibiendo imagen.";
    imgElement.src = "data:image/jpg;base64," + base64Image;    
    var impression = impressionsToCapture[impressionsIndex];
    collectedImages[impression] = base64Image;
    setComponent.setFingerprintCaptureImage(impression, captureComponent).then(function () {        
        if (impression === FingerprintCaptureApi.Impression.ROLLED_LEFT_LITTLE_FINGER)
        {
            setComponent.getSegmentedImage(FingerprintSetApi.Impression.ROLLED_LEFT_LITTLE_FINGER,
                FingerprintSetApi.ImageFormat.PNG).then( function(imageData){
                appendImage(imageData, FingerprintCaptureApi.Finger.LEFT_LITTLE_FINGER);
            });
        }else if(impression === FingerprintCaptureApi.Impression.ROLLED_LEFT_RING_FINGER)
        {
            setComponent.getSegmentedImage(FingerprintSetApi.Impression.ROLLED_LEFT_RING_FINGER,
                FingerprintSetApi.ImageFormat.PNG).then( function(imageData){
                appendImage(imageData, FingerprintCaptureApi.Finger.LEFT_RING_FINGER);
            });
        }else if(impression === FingerprintCaptureApi.Impression.ROLLED_LEFT_MIDDLE_FINGER)
        {
            setComponent.getSegmentedImage(FingerprintSetApi.Impression.ROLLED_LEFT_MIDDLE_FINGER,
                FingerprintSetApi.ImageFormat.PNG).then( function(imageData){
                appendImage(imageData, FingerprintCaptureApi.Finger.LEFT_MIDDLE_FINGER);
            });
        }else if(impression === FingerprintCaptureApi.Impression.ROLLED_LEFT_INDEX_FINGER)
        {
            setComponent.getSegmentedImage(FingerprintSetApi.Impression.ROLLED_LEFT_INDEX_FINGER,
                FingerprintSetApi.ImageFormat.PNG).then( function(imageData){
                appendImage(imageData, FingerprintCaptureApi.Finger.LEFT_INDEX_FINGER);
            });
        }else if(impression === FingerprintCaptureApi.Impression.ROLLED_LEFT_THUMB)
        {
            setComponent.getSegmentedImage(FingerprintSetApi.Impression.ROLLED_LEFT_THUMB,
                FingerprintSetApi.ImageFormat.PNG).then( function(imageData){
                appendImage(imageData, FingerprintCaptureApi.Finger.LEFT_THUMB);
            });
        }else if (impression === FingerprintCaptureApi.Impression.ROLLED_RIGHT_LITTLE_FINGER)
        {
            setComponent.getSegmentedImage(FingerprintSetApi.Impression.ROLLED_RIGHT_LITTLE_FINGER,
                FingerprintSetApi.ImageFormat.PNG).then( function(imageData){
                appendImage(imageData, FingerprintCaptureApi.Finger.RIGHT_LITTLE_FINGER);
            });
        }else if(impression === FingerprintCaptureApi.Impression.ROLLED_RIGHT_RING_FINGER)
        {
            setComponent.getSegmentedImage(FingerprintSetApi.Impression.ROLLED_RIGHT_RING_FINGER,
                FingerprintSetApi.ImageFormat.PNG).then( function(imageData){
                appendImage(imageData, FingerprintCaptureApi.Finger.RIGHT_RING_FINGER);
            });
        }else if(impression === FingerprintCaptureApi.Impression.ROLLED_RIGHT_MIDDLE_FINGER)
        {
            setComponent.getSegmentedImage(FingerprintSetApi.Impression.ROLLED_RIGHT_MIDDLE_FINGER,
                FingerprintSetApi.ImageFormat.PNG).then( function(imageData){
                appendImage(imageData, FingerprintCaptureApi.Finger.RIGHT_MIDDLE_FINGER);
            });
        }else if(impression === FingerprintCaptureApi.Impression.ROLLED_RIGHT_INDEX_FINGER)
        {
            setComponent.getSegmentedImage(FingerprintSetApi.Impression.ROLLED_RIGHT_INDEX_FINGER,
                FingerprintSetApi.ImageFormat.PNG).then( function(imageData){
                appendImage(imageData, FingerprintCaptureApi.Finger.RIGHT_INDEX_FINGER);
            });
        }else if(impression === FingerprintCaptureApi.Impression.ROLLED_RIGHT_THUMB)
        {
            setComponent.getSegmentedImage(FingerprintSetApi.Impression.ROLLED_RIGHT_THUMB,
                FingerprintSetApi.ImageFormat.PNG).then( function(imageData){
                appendImage(imageData, FingerprintCaptureApi.Finger.RIGHT_THUMB);
            });
        }


        impressionsIndex++;
        advanceToNextCapturable();
        startPreview();
    });
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
    if (impression === FingerprintCaptureApi.Impression.ROLLED_LEFT_LITTLE_FINGER){
        return [        
            FingerprintCaptureApi.Finger.LEFT_LITTLE_FINGER
        ];
    }
    else if (impression === FingerprintCaptureApi.Impression.ROLLED_LEFT_RING_FINGER){    
        return [        
            FingerprintCaptureApi.Finger.LEFT_RING_FINGER
        ];        
    }
    else if (impression === FingerprintCaptureApi.Impression.ROLLED_LEFT_MIDDLE_FINGER){    
        return [        
            FingerprintCaptureApi.Finger.LEFT_MIDDLE_FINGER
        ];        
    }
    else if (impression === FingerprintCaptureApi.Impression.ROLLED_LEFT_INDEX_FINGER){    
        return [        
            FingerprintCaptureApi.Finger.LEFT_INDEX_FINGER
        ];        
    }     
    else if (impression === FingerprintCaptureApi.Impression.ROLLED_LEFT_INDEX_FINGER){    
        return [        
            FingerprintCaptureApi.Finger.LEFT_INDEX_FINGER
        ];        
    }
    else if (impression === FingerprintCaptureApi.Impression.ROLLED_LEFT_THUMB){    
        return [        
            FingerprintCaptureApi.Finger.LEFT_THUMB
        ];        
    }
    else if (impression === FingerprintCaptureApi.Impression.ROLLED_RIGHT_LITTLE_FINGER){
        return [        
            FingerprintCaptureApi.Finger.RIGHT_LITTLE_FINGER
        ];
    }
    else if (impression === FingerprintCaptureApi.Impression.ROLLED_RIGHT_RING_FINGER){    
        return [        
            FingerprintCaptureApi.Finger.RIGHT_RING_FINGER
        ];        
    }
    else if (impression === FingerprintCaptureApi.Impression.ROLLED_RIGHT_MIDDLE_FINGER){    
        return [        
            FingerprintCaptureApi.Finger.RIGHT_MIDDLE_FINGER
        ];        
    }
    else if (impression === FingerprintCaptureApi.Impression.ROLLED_RIGHT_INDEX_FINGER){    
        return [        
            FingerprintCaptureApi.Finger.RIGHT_INDEX_FINGER
        ];        
    }     
    else if (impression === FingerprintCaptureApi.Impression.ROLLED_RIGHT_INDEX_FINGER){    
        return [        
            FingerprintCaptureApi.Finger.RIGHT_INDEX_FINGER
        ];        
    }
    else if (impression === FingerprintCaptureApi.Impression.ROLLED_RIGHT_THUMB){    
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
    previewScoreElement.innerText ="";
    if (impressionsIndex < impressionsToCapture.length) {
        var impression = impressionsToCapture[impressionsIndex];
        promptElement.innerText = FingerprintCaptureApi.Impression[impression];
        captureComponent.startAutoCapture(impression, FingerprintCaptureApi.ImageFormat.JPG).then(function () {
            statusElement.innerText = "Previsualización de la imagen...";
            EnableMarkMissing(true);
        }).catch(function (error_code) {
            // Reintenta el MISMO dedo automáticamente en vez de detenerse -- antes, cualquier
            // fallo (sensor sucio, rodado corto, etc.) dejaba la secuencia parada ahí, y la única
            // forma de continuar era "Reiniciar captura", que borra TODO el progreso y recarga la
            // página desde el primer dedo. Con 10 capturas independientes, cada una con algo de
            // probabilidad de fallar, esto hacía casi imposible terminar la secuencia completa
            // (confirmado 2026-09-15). No avanza impressionsIndex ni toca "Resultados" -- el
            // operador solo necesita ajustar (limpiar sensor, rodar mejor) antes del siguiente
            // intento automático.
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
    mostrarEspera();
    var actual = $(this).attr('id');
    if(actual=='menique_mano_izquierda'){
        var impression = FingerprintSetApi.Impression.ROLLED_LEFT_LITTLE_FINGER;
    }else if(actual=='anular_mano_izquierda'){
        var impression = FingerprintSetApi.Impression.ROLLED_LEFT_RING_FINGER;
    }else if(actual=='medio_mano_izquierda'){
        var impression = FingerprintSetApi.Impression.ROLLED_LEFT_MIDDLE_FINGER;
    }else if(actual=='indice_mano_izquierda'){
        var impression = FingerprintSetApi.Impression.ROLLED_LEFT_INDEX_FINGER;
    }else if(actual=='pulgar_mano_izquierda'){
        var impression = FingerprintSetApi.Impression.ROLLED_LEFT_THUMB;
    }else if(actual=='menique_mano_derecha'){
        var impression = FingerprintSetApi.Impression.ROLLED_RIGHT_LITTLE_FINGER;
    }else if(actual=='anular_mano_derecha'){
        var impression = FingerprintSetApi.Impression.ROLLED_RIGHT_RING_FINGER;
    }else if(actual=='medio_mano_derecha'){
        var impression = FingerprintSetApi.Impression.ROLLED_RIGHT_MIDDLE_FINGER;
    }else if(actual=='indice_mano_derecha'){
        var impression = FingerprintSetApi.Impression.ROLLED_RIGHT_INDEX_FINGER;
    }else if(actual=='pulgar_mano_derecha'){
        var impression = FingerprintSetApi.Impression.ROLLED_RIGHT_THUMB;
    }
    $(this).attr('disabled','true');
    if($(this).is(":checked")){
        return false;
        setComponent.setFingerMissing(impression, false).then(function(){
        return captureComponent.setFingerMissing(impression, false);
        }).then(function () {
            console.log("HABILITADO");
        });        
    }else{
        // Se registra por VALOR (missingFingers), no por posición -- ver advanceToNextCapturable()
        // al inicio del archivo (mismo fix aplicado en internohuellasindividual.js, 2026-09-16).
        if (missingFingers.indexOf(impression) === -1) missingFingers.push(impression);
        var isCurrentImpression = impressionsToCapture[impressionsIndex] === impression;
        setComponent.setFingerMissing(impression, true).then(function(){
        return captureComponent.setFingerMissing(impression, true);
        }).then(function () {
            console.log("DESHABILITADO");
            statusElement.innerText = "Marked as missing.";
            // Solo hay que abortar/reiniciar la captura en curso si el dedo desmarcado es justo
            // el que se está pidiendo ahora -- uno futuro ya quedó registrado arriba y se salta
            // solo cuando le toque su turno (advanceToNextCapturable), sin interrumpir nada.
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
// arreglo_capturas/arreglo en posición FIJA -- mismo bug y mismo fix ya confirmado en hardware
// real para internohuellas.php (ver ese archivo/README): con menos de 10 (dedos desmarcados) el
// backend truena con "Undefined offset", y una cadena vacía como placeholder también truena
// distinto (explode(',', '') sin coma que partir). Se recorren TODOS los checkboxes (marcados o
// no) en orden de DOM, con un data-URI JPEG 1x1 placeholder válido para los que no tienen
// imagen. Pedido explícito del usuario, 2026-09-25. Ids CON el sufijo "_rolada" -- ver el
// foreach de internohuellasroladas.php ($huella['campo'].'_rolada').
var CHECKBOX_TO_FINGER = {
    menique_mano_izquierda_rolada: FingerprintCaptureApi.Finger.LEFT_LITTLE_FINGER,
    anular_mano_izquierda_rolada: FingerprintCaptureApi.Finger.LEFT_RING_FINGER,
    medio_mano_izquierda_rolada: FingerprintCaptureApi.Finger.LEFT_MIDDLE_FINGER,
    indice_mano_izquierda_rolada: FingerprintCaptureApi.Finger.LEFT_INDEX_FINGER,
    pulgar_mano_izquierda_rolada: FingerprintCaptureApi.Finger.LEFT_THUMB,
    menique_mano_derecha_rolada: FingerprintCaptureApi.Finger.RIGHT_LITTLE_FINGER,
    anular_mano_derecha_rolada: FingerprintCaptureApi.Finger.RIGHT_RING_FINGER,
    medio_mano_derecha_rolada: FingerprintCaptureApi.Finger.RIGHT_MIDDLE_FINGER,
    indice_mano_derecha_rolada: FingerprintCaptureApi.Finger.RIGHT_INDEX_FINGER,
    pulgar_mano_derecha_rolada: FingerprintCaptureApi.Finger.RIGHT_THUMB
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
        if (isChecked && img.length === 0) faltaAlguna = true;
        arreglo.push(img.length ? img.attr('src') : PLACEHOLDER_JPEG_DATA_URI);
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
/*
    var webSocket2 = $.simpleWebSocket(
        { 
            url: 'ws://127.0.0.1:2012/', 
            onError: function(event) {  
                var id_interno = $('#id_interno').val();
                mostrarAvisoUrl("No se ha podido conectar al equipo, inicie el servicio AdminAware, después de iniciarlo: presione OK para reintentar","internorostro.php?id="+id_interno);                
            }
        });

    webSocket2.listen(function(message) {
        console.log('listen '+message.text);


       // $('#content').prepend(message.text+'\n');
    });

    webSocket2.send({ 'text': 'eliminar_aware' }).done(function() {
        console.log('message send 1');
        $('#aware_desactivado').val('si');

    }).fail(function(e) {
        // your error handling e. g.
        console.log(e);
    });    

    setInterval(function(){
        if($('#aware_desactivado').val()=='si'){ 
            webSocket2.send({ 'text': 'activar_aware' }).done(function() {
                console.log('message send 2');
                setTimeout(function(){ connect(); }, 5000);
                            
            }).fail(function(e) {
                // your error handling e. g.
                console.log(e);
            });
            //clearInterval();
            $('#aware_desactivado').val('no');
            if($('#primera_vez').val()=='no'){
                ocultarMensaje();
            }            
        }
    }, 1000);

    */