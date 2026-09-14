

$('#btnGuardar').click(function()
{
    var id_interno = $('#id_interno').val();
    var iris_izquierdo = $('#iris_izquierdo_img').attr('src');
    var iris_derecho = $('#iris_derecho_img').attr('src');
    var imagenes = $('#resultados img');
    var arreglo = [];
    var arreglo_capturas = [];
    if (iris_izquierdo == '/js/Common/IrisComponent/images/empty_image_white.png' && iris_derecho == '/js/Common/IrisComponent/images/empty_image_white.png') 
    {
        mostrarError("No se encontraron iris capturados");
        return false;
    }
    
    if($("#irisMode").val()=="both")
    {
        if (iris_izquierdo == '/js/Common/IrisComponent/images/empty_image_white.png' || iris_derecho == '/js/Common/IrisComponent/images/empty_image_white.png') 
        {
            mostrarError("Falta una captura.");
            return false;
        }
    }
    else if($("#irisMode").val()=="right" && iris_derecho == '/js/Common/IrisComponent/images/empty_image_white.png')
    {
        mostrarError("No se encontró iris capturado");
        return false;
    }
    else if(iris_izquierdo == '/js/Common/IrisComponent/images/empty_image_white.png')
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
    if (iris_izquierdo == '/js/Common/IrisComponent/images/empty_image_white.png' && iris_derecho == '/js/Common/IrisComponent/images/empty_image_white.png') 
    {
        mostrarError("No se encontraron iris capturados");
        return false;
    }
    
    if($("#irisMode").val()=="both")
    {
        if (iris_izquierdo == '/js/Common/IrisComponent/images/empty_image_white.png' || iris_derecho == '/js/Common/IrisComponent/images/empty_image_white.png') 
        {
            mostrarError("Falta una captura.");
            return false;
        }
    }
    else if($("#irisMode").val()=="right" && iris_derecho == '/js/Common/IrisComponent/images/empty_image_white.png')
    {
        mostrarError("No se encontró iris capturado");
        return false;
    }
    else if(iris_izquierdo == '/js/Common/IrisComponent/images/empty_image_white.png')
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