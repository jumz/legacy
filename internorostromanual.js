$('#btnGuardar').click(function(){
    var id_interno = $('#id_interno').val();
    var imagen = $('#finalImage').attr('src');
    if(imagen.length<2048)
    {
        mostrarError("No se encontró rosto capturado");
        return false;
    }     
    mostrarEspera();
    xajax_guardarPerfil(id_interno, imagen); 
});

$('#btnGuardarContinuar').click(function(){
    var id_interno = $('#id_interno').val();
    var imagen = $('#finalImage').attr('src');
    var siguiente_paso = $('#siguiente_paso').val();
    if(imagen.length<2048)
    {
        mostrarError("No se encontró rosto capturado");
        return false;
    }   
    mostrarEspera();
    xajax_guardarPerfilContinuar(id_interno, imagen, siguiente_paso); 
});



const cam = new TD100Client({
    wsUrl: "ws://localhost:20008/",
    liveImg: document.getElementById("photoImage"),
    faceImg: document.getElementById("finalImage"),
    //autoFaceImg: document.getElementById("finalImage"),
    //irisRightImg: document.getElementById("irisRight"),
    //irisLeftImg: document.getElementById("irisLeft"),
    //sceneImg: document.getElementById("sceneImage"),
    statusLabel: document.getElementById("camStatus"),
    //historyContainer: document.getElementById("captureHistory")
});


// Asociar controles
//document.getElementById("btnCamConnect").onclick = () => cam.connectCamera();
//document.getElementById("btnCamDisconnect").onclick = () => cam.disconnectCamera();
//document.getElementById("btnSleepToggle").onclick = () => cam.toggleSleep();

document.getElementById("manualCapture").onclick = () => cam.captureFace();
document.getElementById("btnReconnect").addEventListener("click", () => {
  cam.manualReconnect();
});
//document.getElementById("startAutoCapture").onclick = () => cam.autoFace(true);
//document.getElementById("btnAutoFaceOff").onclick = () => cam.autoFace(false);

//document.getElementById("btnCaptureIris").onclick = () => cam.captureIris(document.getElementById("irisMode").value);
//document.getElementById("btnCaptureScene").onclick = () => cam.captureScene();