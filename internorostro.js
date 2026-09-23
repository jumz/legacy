




// #finalImage se renderiza sin atributo src (ver internorostro.php) hasta que una captura real
// lo llena -- $('#finalImage').attr('src') devuelve undefined en ese caso, no '', y
// undefined.length tronaba con "Cannot read properties of undefined" antes de siquiera mostrar
// el mensaje de "no hay foto capturada" (confirmado en consola, 2026-09-22: el clic en
// "Guardar"/"Guardar y Continuar" se caía en silencio sin avisar nada al operador).
$('#btnGuardar').click(function(){
    var id_interno = $('#id_interno').val();
    var imagen = $('#finalImage').attr('src');
    if(!imagen || imagen.length<2048)
    {
        mostrarError("No se encontró rosto capturado");
        return false;
    }
    mostrarEspera();
    xajax_guardarRostro(id_interno, imagen);
});

$('#btnGuardarContinuar').click(function(){
    var id_interno = $('#id_interno').val();
    var imagen = $('#finalImage').attr('src');
    var siguiente_paso = $('#siguiente_paso').val();
    if(!imagen || imagen.length<2048)
    {
        mostrarError("No se encontró rosto capturado");
        return false;
    }   
    mostrarEspera();
    xajax_guardarRostroContinuar(id_interno, imagen, siguiente_paso); 
});



// autoFaceImg apunta al mismo <img> que liveImg ("Captura") -- iCam.js nunca actualiza liveImg
// mientras autoFace está activo (manda los frames por autoFaceImg en su lugar), así que antes
// "Captura" se quedaba congelado durante toda la búsqueda mientras "Resultados" (finalImage)
// recibía el video en vivo Y la foto final mezclados en el mismo elemento (reportado
// 2026-09-22). Con este cambio + el de iCam.js (_handleAutoFaceCaptureResult también llena
// faceImg), "Captura" muestra el video en vivo de la búsqueda de principio a fin, y
// "Resultados" solo recibe la foto definitiva al terminar -- igual que ya hace la captura
// manual (ver internorostromanual.js).
const cam = new TD100Client({
    wsUrl: "ws://localhost:20008/",
    liveImg: document.getElementById("photoImage"),
    faceImg: document.getElementById("finalImage"),
    autoFaceImg: document.getElementById("photoImage"),
    //irisRightImg: document.getElementById("irisRight"),
    //irisLeftImg: document.getElementById("irisLeft"),
    //sceneImg: document.getElementById("sceneImage"),
    statusLabel: document.getElementById("camStatus"),
    //historyContainer: document.getElementById("captureHistory")
});

// ============================================================
// ASOCIAR CONTROLES
// ============================================================

// Auto-rostro
document.getElementById("startAutoCapture").onclick = () => {
    cam.autoFace(true);
};

document.getElementById("btnAutoFaceOff").onclick = () => {
    cam.autoFace(false);
};

document.getElementById("btnReconnect").addEventListener("click", () => {
  cam.manualReconnect();
});
