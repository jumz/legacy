<?php
/*
Menu Superior: Poblacion
Menu: Alta Huellas
Pertenece: Poblacion
Prioridad: 3
Nombre Archivo: internohuellas.php
Permiso: Agregar
*/
require($_SERVER['DOCUMENT_ROOT'] . '/include/authenticate.php');
include(FOLDER_HTML . 'include/header.php');
?>

<main id="main-container">
  <div class="content-holder">

    <input type="hidden" id="aware_desactivado" />
    <input type="hidden" id="primera_vez" />
    <input type="hidden" id="id_interno" value="<?php echo $_POST['id']; ?>" />
    <input type="hidden" id="siguiente_paso" value="<?php echo $siguiente; ?>?id=<?php echo $_POST['id']; ?>" />


    <section id="interno_huellas-container"><!-- Capturar Huella -->

      <div id="contenedor_captura_huellas" class="inms-card">
        <h3 class="title-divider"><i class="ni ni-blog-read"></i> Captura 442</h3>
        <div class="row">
          <div class="col-sm-8">
            <div style="width: 100%; height:480px;  border:1px solid lightgray;">
              <img id="previewImage" style="max-width:100%; max-height:100%">
            </div>

            <p>Estado: <span id="status"></span></p>
            <p>Capturando: <span id="prompt"></span></p>
            <p style="display: none;"><button id="markMissing">Mark Missing</button> When collecting slaps, marks index as missing. When collecting dual thumbs, marks left thumb as missing.</p>
            <p>Estado: <span id="autocaptureStatus"></span></p>
            <p style="display:none;">Preview Score: <span id="previewScore"></span></p>

            <button class="btn btn-info" id="reset">Reiniciar captura</button>
            <a class="btn btn-success" href="internohuellasindividual.php?id=<?php echo $_GET['id']; ?>">Capturar individualmente</a>
          </div>
          <div class="col-sm-4">
            <?php foreach ($huellas_a_capturar as $huella) { ?>
              <div class="custom-checkbox">
                <input type="checkbox" class="substituted huellas omision <?php echo $huella['campo']; ?>" id="<?php echo $huella['campo']; ?>" checked="" disabled="disabled">
                <label for="<?php echo $huella['campo']; ?>"><?php echo $huella['nombre']; ?></label>
              </div>
            <?php } ?>

            <!-- Diagrama ilustrativo de colocación de dedos -- pedido explícito del usuario
                 (2026-09-25): resalta en verde el grupo (mano izquierda/pulgares/mano derecha)
                 que se está pidiendo en cada momento, igual que los LEDs físicos del lector.
                 Propio de esta página, no toca internohuellas.js -- observa el texto de
                 "Capturando: ..." (id="prompt", que sí llena internohuellas.js) con un
                 MutationObserver en vez de depender del wiring script. La comparación es contra
                 el objeto FingerprintCaptureApi.Impression en tiempo de ejecución (no contra
                 texto adivinado) -- confirmado que las etiquetas mostradas son español ("Mano
                 izquierda", etc, ver aw_fingerprint_capture.js:291-335), no el nombre del enum.
                 Rediseñado (2026-09-25, misma tarde) como dos manos ilustradas de frente (forma
                 simplificada -- rectángulos redondeados, no una foto) con un círculo superpuesto
                 en la punta de cada dedo, en vez de círculos sueltos con el nombre del dedo al
                 lado -- pedido explícito del usuario para que se vea más parecido al diagrama de
                 referencia del fabricante ("RealScan-10, COLOCACIÓN DE LOS DIEZ DEDOS"). Sin
                 confirmar todavía en hardware real. -->
            <svg id="huellasDiagrama" viewBox="0 0 400 260" style="width:100%; max-width:400px; margin-top:16px;">
              <!-- Mano izquierda -->
              <rect class="hand-shape" x="45" y="215" width="60" height="35" rx="10"></rect>
              <rect class="hand-shape" x="15" y="135" width="130" height="85" rx="26"></rect>
              <rect class="hand-shape" x="140" y="160" width="45" height="24" rx="12"></rect>
              <rect class="hand-shape" x="17" y="75" width="26" height="65" rx="13"></rect>
              <rect class="hand-shape" x="52" y="45" width="26" height="95" rx="13"></rect>
              <rect class="hand-shape" x="87" y="30" width="26" height="110" rx="13"></rect>
              <rect class="hand-shape" x="122" y="50" width="26" height="90" rx="13"></rect>

              <!-- Mano derecha (misma forma, en espejo) -->
              <rect class="hand-shape" x="295" y="215" width="60" height="35" rx="10"></rect>
              <rect class="hand-shape" x="255" y="135" width="130" height="85" rx="26"></rect>
              <rect class="hand-shape" x="215" y="160" width="45" height="24" rx="12"></rect>
              <rect class="hand-shape" x="252" y="50" width="26" height="90" rx="13"></rect>
              <rect class="hand-shape" x="287" y="30" width="26" height="110" rx="13"></rect>
              <rect class="hand-shape" x="322" y="45" width="26" height="95" rx="13"></rect>
              <rect class="hand-shape" x="357" y="75" width="26" height="65" rx="13"></rect>

              <!-- Círculos superpuestos en la punta de cada dedo -->
              <circle class="led-dot" id="dotLeftLittle" cx="30" cy="88" r="14"></circle>
              <circle class="led-dot" id="dotLeftRing" cx="65" cy="58" r="14"></circle>
              <circle class="led-dot" id="dotLeftMiddle" cx="100" cy="43" r="14"></circle>
              <circle class="led-dot" id="dotLeftIndex" cx="135" cy="63" r="14"></circle>
              <circle class="led-dot" id="dotThumbLeft" cx="173" cy="172" r="14"></circle>
              <circle class="led-dot" id="dotThumbRight" cx="227" cy="172" r="14"></circle>
              <circle class="led-dot" id="dotRightIndex" cx="265" cy="63" r="14"></circle>
              <circle class="led-dot" id="dotRightMiddle" cx="300" cy="43" r="14"></circle>
              <circle class="led-dot" id="dotRightRing" cx="335" cy="58" r="14"></circle>
              <circle class="led-dot" id="dotRightLittle" cx="370" cy="88" r="14"></circle>
            </svg>
            <style>
              #huellasDiagrama .hand-shape { fill: #f6d3b8; stroke: #d3a077; stroke-width: 2; }
              #huellasDiagrama .led-dot { fill: rgba(255,255,255,0.45); stroke: #8a8a8a; stroke-width: 2; transition: fill 0.2s, stroke 0.2s; }
              #huellasDiagrama .led-dot.activo { fill: #28a745; stroke: #1e7e34; }
            </style>
            <script>
              // MutationObserver sobre #prompt en vez de tocar internohuellas.js -- ese
              // <span> ya lo llena el wiring existente
              // (promptElement.innerText = FingerprintCaptureApi.Impression[impression]).
              // OJO: para PLAIN_LEFT_FOUR_FINGERS/PLAIN_RIGHT_FOUR_FINGERS/PLAIN_DUAL_THUMBS
              // ese reverse-lookup NO da el nombre del enum -- da una etiqueta en español
              // ("Mano izquierda"/"Mano derecha"/"Ambos pulgares", ver
              // aw_fingerprint_capture.js:291-335). Por eso se compara contra el propio objeto
              // FingerprintCaptureApi.Impression en vez de contra texto adivinado -- así sigue
              // funcionando aunque cambien las etiquetas.
              (function () {
                var promptEl = document.getElementById('prompt');
                var groups = {
                  left: ['dotLeftLittle', 'dotLeftRing', 'dotLeftMiddle', 'dotLeftIndex'],
                  right: ['dotRightIndex', 'dotRightMiddle', 'dotRightRing', 'dotRightLittle'],
                  thumbs: ['dotThumbLeft', 'dotThumbRight']
                };
                var allDotIds = [].concat(groups.left, groups.right, groups.thumbs);
                function actualizarDiagrama() {
                  var texto = promptEl ? promptEl.textContent : '';
                  var activos = [];
                  if (typeof FingerprintCaptureApi !== 'undefined') {
                    var Impression = FingerprintCaptureApi.Impression;
                    if (texto === Impression[Impression.PLAIN_LEFT_FOUR_FINGERS]) activos = groups.left;
                    else if (texto === Impression[Impression.PLAIN_RIGHT_FOUR_FINGERS]) activos = groups.right;
                    else if (texto === Impression[Impression.PLAIN_DUAL_THUMBS]) activos = groups.thumbs;
                  }
                  allDotIds.forEach(function (id) {
                    var el = document.getElementById(id);
                    if (el) el.classList.toggle('activo', activos.indexOf(id) !== -1);
                  });
                }
                if (promptEl) {
                  new MutationObserver(actualizarDiagrama).observe(promptEl, { childList: true, characterData: true, subtree: true });
                }
                actualizarDiagrama();
              })();
            </script>
          </div>
        </div>
      </div>

      <div class="contenedor_captura_huellas-resultados inms-card">
        <h3 class="title-divider"><i class="fa fa-image"></i> Resultados</h3>
        <div id="resultados"></div>
      </div>

    </section><!-- /fn contenedor capturar huellas -->

    <section>
      <div class="contenedor_captura_huellas-botones inms-card">
        <a class="btn btn-danger" href="internos.php"><i class="fa fa-times"></i> Cancelar</a>
        <button type="button" class="btn btn-info" id="btnGuardar"><i class="fa fa-check"></i> Guardar y Regresar</a>
          <?php if ($siguiente != '') { ?>
            <button type="button" class="btn btn-primary ml-1" id="btnGuardarContinuar"><i class="fa fa-chevron-circle-right"></i> Guardar y Continuar</a>
            <?php } ?>
      </div>
    </section>

  </div>
</main>


<script src="<?php echo $path_app; ?>js/Common/lib/es6-promise/es6-promise.js"></script>
<script src="<?php echo $path_app; ?>js/Common/lib/biocomponents/aw_fingerprint_capture.js"></script>
<script src="<?php echo $path_app; ?>js/Common/lib/biocomponents/aw_fingerprint_set.js"></script>
<script src="<?php echo $path_app; ?>js/Common/lib/biocomponents/WebsocketTransport.js?v=wssdevices5"></script>
<script src="<?php echo $path_app; ?>js/Common/lib/biocomponents/ImpressionInfo.js"></script>
<script src="<?php echo $path_app; ?>js/Common/lib/binary-file-saver/BinaryFileSaver.js"></script>
<?php include(FOLDER_HTML . 'include/footer.php'); ?>