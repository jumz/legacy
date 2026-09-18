

// El <img> del placeholder se renderiza con $path_app + la ruta relativa (ver internoiris.php:
// "<?php echo $path_app; ?>js/Common/IrisComponent/images/empty_image_white.png"), es decir con
// el dominio completo delante (https://<host>/js/...) -- comparar contra el literal
// "/js/Common/IrisComponent/images/empty_image_white.png" (sin dominio) nunca daba match, así
// que esta detección de "ojo sin capturar" estaba muerta desde siempre: para el modo de un solo
// ojo, el <img> del ojo NO capturado se enviaba tal cual (la URL del placeholder, no una imagen)
// a guardarIris/guardarIrisContinuar, causando el error genérico del servidor. Mismo criterio ya
// aplicado del lado de PHP en internoiris.inc.php (strpos en vez de comparación exacta).
function irisEstaVacio(src)
{
    return !src || src.indexOf('empty_image_white.png') !== -1;
}

$('#btnGuardar').click(function()
{
    var id_interno = $('#id_interno').val();
    var iris_izquierdo = $('#iris_izquierdo_img').attr('src');
    var iris_derecho = $('#iris_derecho_img').attr('src');
    var imagenes = $('#resultados img');
    var arreglo = [];
    var arreglo_capturas = [];
    if (irisEstaVacio(iris_izquierdo) && irisEstaVacio(iris_derecho))
    {
        mostrarError("No se encontraron iris capturados");
        return false;
    }

    if($("#irisMode").val()=="both")
    {
        if (irisEstaVacio(iris_izquierdo) || irisEstaVacio(iris_derecho))
        {
            mostrarError("Falta una captura.");
            return false;
        }
    }
    else if($("#irisMode").val()=="right" && irisEstaVacio(iris_derecho))
    {
        mostrarError("No se encontró iris capturado");
        return false;
    }
    else if(irisEstaVacio(iris_izquierdo))
    {
        mostrarError("No se encontró iris capturado");
                return false;
    }


    mostrarEspera();
    xajax_guardarIris(id_interno, arreglo_capturas, iris_izquierdo, iris_derecho);
});

$('#btnGuardarContinuar').click(function()
{
    var id_interno = $('#id_interno').val();
    var iris_izquierdo = $('#iris_izquierdo_img').attr('src');
    var iris_derecho = $('#iris_derecho_img').attr('src');
    var imagenes = $('#resultados img');
    var arreglo = [];
    var siguiente_paso = $('#siguiente_paso').val();
    var arreglo_capturas = [];
    if (irisEstaVacio(iris_izquierdo) && irisEstaVacio(iris_derecho))
    {
        mostrarError("No se encontraron iris capturados");
        return false;
    }

    if($("#irisMode").val()=="both")
    {
        if (irisEstaVacio(iris_izquierdo) || irisEstaVacio(iris_derecho))
        {
            mostrarError("Falta una captura.");
            return false;
        }
    }
    else if($("#irisMode").val()=="right" && irisEstaVacio(iris_derecho))
    {
        mostrarError("No se encontró iris capturado");
        return false;
    }
    else if(irisEstaVacio(iris_izquierdo))
    {
        mostrarError("No se encontró iris capturado");
                return false;
    }


    mostrarEspera();
    xajax_guardarIrisContinuar(id_interno, arreglo_capturas, iris_izquierdo, iris_derecho, siguiente_paso);



});



const cam = new TD100Client({
    wsUrl: "ws://localhost:20008/",
    liveImg: document.getElementById("photoImage"),
    //faceImg: document.getElementById("finalImage"),
    //autoFaceImg: document.getElementById("finalImage"),
    irisRightImg: document.getElementById("iris_derecho_img"),
    irisLeftImg: document.getElementById("iris_izquierdo_img"),
    //sceneImg: document.getElementById("sceneImage"),
    statusLabel: document.getElementById("camStatus"),
    //historyContainer: document.getElementById("captureHistory")
});


// Asociar controles
//document.getElementById("btnCamConnect").onclick = () => cam.connectCamera();
//document.getElementById("btnCamDisconnect").onclick = () => cam.disconnectCamera();
//document.getElementById("btnSleepToggle").onclick = () => cam.toggleSleep();

//document.getElementById("manualCapture").onclick = () => cam.captureFace();
//document.getElementById("startAutoCapture").onclick = () => cam.autoFace(true);
//document.getElementById("btnAutoFaceOff").onclick = () => cam.autoFace(false);

document.getElementById("btnCaptureIris").onclick = () => cam.captureIris(document.getElementById("irisMode").value);
document.getElementById("btnReconnect").addEventListener("click", () => {
  cam.manualReconnect();
});
//document.getElementById("btnCaptureScene").onclick = () => cam.captureScene();