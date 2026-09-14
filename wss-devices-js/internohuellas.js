var deviceName = "SUPREMA_RSG10,CROSSMATCH_GUARDIAN,IB_WATSONMINI,EXTERNAL";
var impressionsToCapture = [
    FingerprintCaptureApi.Impression.PLAIN_LEFT_FOUR_FINGERS,
    FingerprintCaptureApi.Impression.PLAIN_RIGHT_FOUR_FINGERS,
    FingerprintCaptureApi.Impression.PLAIN_DUAL_THUMBS
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

function connect() {
    mostrarEspera();
    statusElement.innerText = "Creando websocket...";
    // Puerto de WSS-DEVICES (config.env, CAM_PORT) -- el original apuntaba al puerto por
    // default del backend nativo de Aware (2080). Ajusta si tu bridge usa otro puerto.
    websocket = new WebSocket("ws://localhost:23123");
    websocket.onopen = function (event) {
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

// Adds an image to the end of the document
function appendImage(imageData)
{
    document.body.appendChild(document.createElement("br"));
    var img = document.createElement("img");
    img.src = "data:image/jpg;base64," + imageData;
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

        if(impression === FingerprintCaptureApi.Impression.PLAIN_RIGHT_INDEX_FINGER)
        {
            setComponent.getSegmentedImage(FingerprintSetApi.Impression.PLAIN_RIGHT_INDEX_FINGER,
                FingerprintSetApi.ImageFormat.PNG).then( function(imageData){
                appendImage(imageData);
            });
        }
        if (impression === FingerprintCaptureApi.Impression.PLAIN_LEFT_FOUR_FINGERS)
        {
            getSegments();
        }
        else if (impression === FingerprintCaptureApi.Impression.PLAIN_RIGHT_FOUR_FINGERS)
        {
            getSegments();
        }
        else if (impression === FingerprintCaptureApi.Impression.PLAIN_DUAL_THUMBS)
        {
            getSegments();
        }

        impressionsIndex++;
        startPreview();
    });
}

function getSegments (){
    var positions = getPositions();
    for (i = 0; i < positions.length; i++) {
        var impression = positions[i];
        if (missingFingers.indexOf(impression) === -1)
        {
            // Translate single finger code to finger in slap code
            impression = ImpressionInfo.SingleFingerToFingerInSlap[impression];
            setComponent.getSegmentedImage(impression,
                FingerprintSetApi.ImageFormat.PNG).then( function(imageData){
                appendImage(imageData);
            });
        }
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
    if (impression === FingerprintCaptureApi.Impression.PLAIN_RIGHT_FOUR_FINGERS){
       return [
           FingerprintCaptureApi.Finger.RIGHT_INDEX_FINGER,
           FingerprintCaptureApi.Finger.RIGHT_MIDDLE_FINGER,
           FingerprintCaptureApi.Finger.RIGHT_RING_FINGER,
           FingerprintCaptureApi.Finger.RIGHT_LITTLE_FINGER
       ];
    }
    else if (impression === FingerprintCaptureApi.Impression.PLAIN_LEFT_FOUR_FINGERS){
        return [        
            FingerprintCaptureApi.Finger.LEFT_LITTLE_FINGER,
            FingerprintCaptureApi.Finger.LEFT_RING_FINGER,
            FingerprintCaptureApi.Finger.LEFT_MIDDLE_FINGER,
            FingerprintCaptureApi.Finger.LEFT_INDEX_FINGER
        ];
    }
    else if (impression === FingerprintCaptureApi.Impression.PLAIN_DUAL_THUMBS){
        return [
            FingerprintCaptureApi.Finger.LEFT_THUMB,
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
            statusElement.innerText = "Un error ha ocurrido: " + error_code;
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

$('#btnGuardar').click(function(){
    var id_interno = $('#id_interno').val();
    var imagenes = $('#resultados img');
    if($('#resultados img').length<=0){
        mostrarError("No se encontraron huellas capturadas");
        return false;
    }    
    var arreglo = [];
    $.each( imagenes, function( key, value ) {
      arreglo.push($(this).attr('src'));
    });
    var arreglo_capturas = [];
    $('#contenedor_captura_huellas input:checked').each(function() {
        arreglo_capturas.push($(this).attr('id'));
    });
    if(arreglo_capturas.length!=arreglo.length){
        mostrarError("Falta capturar huellas");
        return false;        
    }
    mostrarEspera();
    xajax_guardarHuellas(id_interno, arreglo_capturas, arreglo); 
});

$('#btnGuardarContinuar').click(function(){
    var id_interno = $('#id_interno').val();
    var imagenes = $('#resultados img');
    var siguiente_paso = $('#siguiente_paso').val();
    if($('#resultados img').length<=0){
        mostrarError("No se encontraron huellas capturadas");
        return false;
    }
    var arreglo = [];
    $.each( imagenes, function( key, value ) {
      arreglo.push($(this).attr('src'));
    });
    var arreglo_capturas = [];
    $('#contenedor_captura_huellas input:checked').each(function() {
        arreglo_capturas.push($(this).attr('id'));
    });
    if(arreglo_capturas.length!=arreglo.length){
        mostrarError("Falta capturar huellas");
        return false;        
    }        
    mostrarEspera();
    xajax_guardarHuellasContinuar(id_interno, arreglo_capturas, arreglo, siguiente_paso); 
});

    // Handshake original con "AdminAware" (servicio nativo que había que apagar/reencender
    // para liberar el lector antes de usar la versión web) -- eliminado para WSS-DEVICES: no
    // hay ninguna app nativa que administrar, el puente es el único dueño del dispositivo. El
    // connect() de DOMContentLoaded arriba es suficiente.