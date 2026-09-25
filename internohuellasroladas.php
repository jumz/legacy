<?php
/*
Menu Superior: Poblacion
Menu: Alta Huellas Roladas
Pertenece: Poblacion
Prioridad: 3
Nombre Archivo: internohuellasroladas.php
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


    <section id="interno_huellas-container">

      <div id="contenedor_captura_huellas" class="inms-card">
        <h3 class="title-divider"><i class="fa fa-expand"></i> Captura Roladas</h3>

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
          </div>
          <div class="col-sm-4">
            <?php foreach ($huellas_a_capturar as $huella) { ?>
              <div class="custom-checkbox">
                <input type="checkbox" class="substituted huellas omision <?php echo $huella['campo'].'_rolada'; ?>" id="<?php echo $huella['campo'].'_rolada'; ?>" checked="">
                <label for="<?php echo $huella['campo'].'_rolada'; ?>"><?php echo $huella['nombre']; ?></label>
              </div>
            <?php } ?>

            <!-- Mismo diagrama ilustrativo que internohuellas.php/internohuellasindividual.php,
                 adaptado a dedo rolado -- pedido explícito del usuario, 2026-09-25: "haz lo mismo
                 para huellas individuales y roladas". Resalta en verde UN solo círculo (el dedo
                 específico solicitado), igual que el LED físico individual ya encendido para esta
                 página. Propio de esta página, no toca internohuellasroladas.js -- observa
                 #prompt con un MutationObserver. Comparación contra el objeto
                 FingerprintCaptureApi.Impression en tiempo de ejecución (no contra texto
                 adivinado), igual que en las otras dos páginas -- las etiquetas mostradas para
                 los códigos ROLLED_* también son español ("Índice derecho rolado", etc, ver
                 aw_fingerprint_capture.js:260-289). Sin confirmar todavía en hardware real. -->
            <svg id="huellasDiagrama" viewBox="0 0 320 310" style="width:100%; max-width:320px; margin-top:16px;">
              <text x="10" y="24" font-size="18" fill="#666">Mano izquierda</text>
              <g class="finger-dot" id="dotLeftLittle">
                <circle class="led-dot" cx="30" cy="65" r="20"></circle>
                <text x="30" y="98" text-anchor="middle" font-size="13" fill="#666">Meñique</text>
              </g>
              <g class="finger-dot" id="dotLeftRing">
                <circle class="led-dot" cx="95" cy="65" r="20"></circle>
                <text x="95" y="98" text-anchor="middle" font-size="13" fill="#666">Anular</text>
              </g>
              <g class="finger-dot" id="dotLeftMiddle">
                <circle class="led-dot" cx="160" cy="65" r="20"></circle>
                <text x="160" y="98" text-anchor="middle" font-size="13" fill="#666">Medio</text>
              </g>
              <g class="finger-dot" id="dotLeftIndex">
                <circle class="led-dot" cx="225" cy="65" r="20"></circle>
                <text x="225" y="98" text-anchor="middle" font-size="13" fill="#666">Índice</text>
              </g>

              <text x="10" y="128" font-size="18" fill="#666">Pulgares</text>
              <g class="finger-dot" id="dotThumbLeft">
                <circle class="led-dot" cx="95" cy="165" r="20"></circle>
                <text x="95" y="198" text-anchor="middle" font-size="13" fill="#666">Izquierdo</text>
              </g>
              <g class="finger-dot" id="dotThumbRight">
                <circle class="led-dot" cx="160" cy="165" r="20"></circle>
                <text x="160" y="198" text-anchor="middle" font-size="13" fill="#666">Derecho</text>
              </g>

              <text x="10" y="228" font-size="18" fill="#666">Mano derecha</text>
              <g class="finger-dot" id="dotRightIndex">
                <circle class="led-dot" cx="30" cy="265" r="20"></circle>
                <text x="30" y="298" text-anchor="middle" font-size="13" fill="#666">Índice</text>
              </g>
              <g class="finger-dot" id="dotRightMiddle">
                <circle class="led-dot" cx="95" cy="265" r="20"></circle>
                <text x="95" y="298" text-anchor="middle" font-size="13" fill="#666">Medio</text>
              </g>
              <g class="finger-dot" id="dotRightRing">
                <circle class="led-dot" cx="160" cy="265" r="20"></circle>
                <text x="160" y="298" text-anchor="middle" font-size="13" fill="#666">Anular</text>
              </g>
              <g class="finger-dot" id="dotRightLittle">
                <circle class="led-dot" cx="225" cy="265" r="20"></circle>
                <text x="225" y="298" text-anchor="middle" font-size="13" fill="#666">Meñique</text>
              </g>
            </svg>
            <style>
              #huellasDiagrama .led-dot { fill: #e0e0e0; stroke: #b0b0b0; stroke-width: 2; transition: fill 0.2s; }
              #huellasDiagrama .finger-dot.activo .led-dot { fill: #28a745; stroke: #1e7e34; }
              #huellasDiagrama .finger-dot.activo text { fill: #1e7e34; font-weight: bold; }
            </style>
            <script>
              (function () {
                var promptEl = document.getElementById('prompt');
                // Un dot por dedo, mapeado a la constante ROLLED_* correspondiente (no al texto
                // en español que se muestra -- ese se resuelve en tiempo de ejecución contra
                // FingerprintCaptureApi.Impression, ver comentario arriba del <svg>).
                var dots = {
                  dotLeftLittle: 'ROLLED_LEFT_LITTLE_FINGER',
                  dotLeftRing: 'ROLLED_LEFT_RING_FINGER',
                  dotLeftMiddle: 'ROLLED_LEFT_MIDDLE_FINGER',
                  dotLeftIndex: 'ROLLED_LEFT_INDEX_FINGER',
                  dotThumbLeft: 'ROLLED_LEFT_THUMB',
                  dotThumbRight: 'ROLLED_RIGHT_THUMB',
                  dotRightIndex: 'ROLLED_RIGHT_INDEX_FINGER',
                  dotRightMiddle: 'ROLLED_RIGHT_MIDDLE_FINGER',
                  dotRightRing: 'ROLLED_RIGHT_RING_FINGER',
                  dotRightLittle: 'ROLLED_RIGHT_LITTLE_FINGER'
                };
                function actualizarDiagrama() {
                  var texto = promptEl ? promptEl.textContent : '';
                  var activoId = null;
                  if (typeof FingerprintCaptureApi !== 'undefined') {
                    var Impression = FingerprintCaptureApi.Impression;
                    Object.keys(dots).forEach(function (id) {
                      var code = Impression[dots[id]];
                      if (code !== undefined && texto === Impression[code]) activoId = id;
                    });
                  }
                  Object.keys(dots).forEach(function (id) {
                    var el = document.getElementById(id);
                    if (el) el.classList.toggle('activo', id === activoId);
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
    </section>


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