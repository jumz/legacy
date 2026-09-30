




// Pedido explícito del usuario, 2026-09-30: quitar el modal de "Éxito" al guardar en esta
// página. mostrarExito/mostrarExitoHTML (definidas en el JS global compartido, cargado ANTES
// que este archivo -- ver footer.php) también hacen la redirección a `siguiente` cuando el
// operador da clic en "OK" -- para no romper esa navegación, se sobreescriben aquí para que
// redirijan de inmediato sin mostrar nada. Solo afecta a ESTA página (cada página carga su
// propio wiring script, que sobreescribe la función global solo para sí misma) -- las páginas
// de huellas, que usan el mismo mostrarExito, no se tocan.
function mostrarExito(mensaje, siguiente) {
    if (siguiente) window.location.href = siguiente;
}
function mostrarExitoHTML(html, siguiente) {
    if (siguiente) window.location.href = siguiente;
}

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



const cam = new TD100Client({
    wsUrl: "ws://localhost:20008/",
    liveImg: document.getElementById("photoImage"),
    //faceImg: document.getElementById("faceCapture"),
    autoFaceImg: document.getElementById("finalImage"),
    //irisRightImg: document.getElementById("irisRight"),
    //irisLeftImg: document.getElementById("irisLeft"),
    //sceneImg: document.getElementById("sceneImage"),
    statusLabel: document.getElementById("camStatus"),
    //historyContainer: document.getElementById("captureHistory")
    faceGuideOuterEl: document.getElementById("faceGuideOuter"),
    faceGuideInnerEl: document.getElementById("faceGuideInner"),
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
