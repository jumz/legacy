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
 * (o en `impression`, si se pasa explícito -- pedido explícito del usuario, 2026-09-25, para
 * poder consultar la impresión de CUALQUIER grupo, no solo la armada ahora mismo, y así saltar
 * grupos completamente omitidos antes de armarlos).
 * @returns {*}
 */
function getPositions(impression){
    if (impression === undefined) impression = impressionsToCapture[impressionsIndex];
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

// Un grupo (mano izquierda/derecha/pulgares) está completamente omitido cuando TODOS los
// dedos que le corresponden están en missingFingers (checkbox desmarcado) -- pedido explícito
// del usuario, 2026-09-25: "si se omite toda una lectura ... va a pasar directo a la mano
// derecha". Reutiliza getPositions(impression) y el mismo arreglo missingFingers que ya
// consume getSegments() (poblado ahora también desde el checkbox handler de abajo, no solo
// desde onMarkMissing).
function isImpressionFullyOmitted(impression) {
    var positions = getPositions(impression);
    if (positions.length === 0) return false;
    for (var i = 0; i < positions.length; i++) {
        if (missingFingers.indexOf(positions[i]) === -1) return false;
    }
    return true;
}

function startPreview() {
    qualityScores.clear();
    ocultarMensaje();
    previewScoreElement.innerText ="";
    // Salta cualquier grupo completamente omitido ANTES de armarlo -- ver
    // isImpressionFullyOmitted arriba.
    while (impressionsIndex < impressionsToCapture.length && isImpressionFullyOmitted(impressionsToCapture[impressionsIndex])) {
        impressionsIndex++;
    }
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

// Checkbox de cada dedo (ver internohuellas.php, ya no disabled) -> código
// FingerprintCaptureApi.Finger correspondiente -- pedido explícito del usuario, 2026-09-25
// ("me gustaría que también se pudieran omitir"). Mismos ids reales confirmados en el handler
// análogo de internohuellasindividual.js ($('.huellas').click).
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

$('.huellas').click(function () {
    var checkboxId = $(this).attr('id');
    var fingerCode = CHECKBOX_TO_FINGER[checkboxId];
    if (fingerCode === undefined) return;
    var isChecked = $(this).is(':checked');

    // Mismo arreglo que ya consume getSegments() (antes solo lo poblaba onMarkMissing) --
    // desmarcar agrega el código, marcar lo quita.
    if (isChecked) {
        var idx = missingFingers.indexOf(fingerCode);
        if (idx !== -1) missingFingers.splice(idx, 1);
    } else if (missingFingers.indexOf(fingerCode) === -1) {
        missingFingers.push(fingerCode);
    }

    // WebsocketTransport.js traduce esto a `omittedFingers` para el puente real (ver
    // aw_fingerprint_capture_set_finger_missing) -- antes eran no-ops puros. IMPORTANTE: el
    // reinicio de abajo (endAutoCapture/startPreview) va ENCADENADO dentro de este mismo
    // .then(), no disparado en paralelo -- el usuario reportó que, con la versión anterior (que
    // lo disparaba en paralelo), el LED físico no se actualizaba al desmarcar un dedo (aunque el
    // diagrama SVG sí, porque ese lee el DOM directo sin ningún async de por medio). Hipótesis
    // de causa (sin confirmar todavía en hardware que esto lo arregla): aw_fingerprint_capture_
    // start_auto_capture (disparado por startPreview) lee ctx.missingFingerCodes en el momento
    // en que se llama -- si eso pasaba ANTES de que la respuesta de este RPC (dos saltos:
    // setComponent, luego captureComponent, cada uno resuelto vía queueMicrotask) alcanzara a
    // actualizar ese estado, el puente armaba con el conjunto omitido VIEJO.
    setComponent.setFingerMissing(fingerCode, !isChecked).then(function () {
        return captureComponent.setFingerMissing(fingerCode, !isChecked);
    }).then(function () {
        // Si el dedo que se acaba de (des)marcar pertenece al grupo que se está armando/
        // capturando AHORA MISMO, hay que reiniciar esa captura -- pedido explícito del
        // usuario: "cada que se desmarca un dedo debe reiniciar la captura". No basta con
        // reiniciar solo cuando el grupo queda completamente omitido: la captura YA ARMADA
        // sigue usando el conteo mínimo y los LEDs que tenía al momento de armarse
        // (RS_SetMinimumFinger/RS_SetFingerLED ya se mandaron al puente) -- sin reiniciar, el
        // LED físico se queda desactualizado. Al volver a llamar startPreview(),
        // aw_fingerprint_capture_start_auto_capture (WebsocketTransport.js) recalcula
        // omittedFingers con el estado YA ACTUALIZADO (garantizado por el encadenado de
        // arriba) y arma de nuevo con el LED/mínimo correctos -- si el grupo quedó
        // completamente omitido, startPreview() ya lo salta solo (ver isImpressionFullyOmitted
        // arriba). Si el dedo pertenece a un grupo QUE TODAVÍA NO le toca su turno, no hace
        // falta reiniciar nada -- ya queda registrado en missingFingers y se aplica solo
        // cuando le toque.
        var currentPositions = getPositions(impressionsToCapture[impressionsIndex]);
        if (currentPositions.indexOf(fingerCode) !== -1) {
            return captureComponent.endAutoCapture().then(function () {
                startPreview();
            });
        }
    });
});

$('#btnGuardar').click(function(){
    var id_interno = $('#id_interno').val();
    var imagenes = $('#resultados img');
    // Antes bloqueaba si no había NINGUNA imagen, sin importar el motivo -- ahora, si el
    // operador omitió deliberadamente los 10 dedos (0 checkboxes marcados), debe poder
    // continuar de todas formas. Pedido explícito del usuario, 2026-09-25: "en el caso de que
    // se omitan todos los dedos debe poder dar siguiente hasta el siguiente paso".
    if($('#resultados img').length<=0 && $('#contenedor_captura_huellas input:checked').length>0){
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
    // Ver nota análoga en btnGuardar -- permite continuar si el operador omitió los 10 dedos.
    if($('#resultados img').length<=0 && $('#contenedor_captura_huellas input:checked').length>0){
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