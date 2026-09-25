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
                 MutationObserver en vez de depender del wiring script. -->
            <!-- Rediseñado como 3 filas apiladas (en vez de 3 columnas comprimidas en el
                 ancho angosto de esta columna) -- pedido explícito del usuario, 2026-09-25:
                 la versión anterior en 3 columnas era demasiado pequeña para distinguirse. -->
            <svg id="huellasDiagrama" viewBox="0 0 320 310" style="width:100%; max-width:320px; margin-top:16px;">
              <g id="ledGroupLeft" class="led-group">
                <text x="10" y="24" font-size="18" fill="#666">Mano izquierda</text>
                <circle class="led-dot" cx="30" cy="65" r="20"></circle>
                <circle class="led-dot" cx="95" cy="65" r="20"></circle>
                <circle class="led-dot" cx="160" cy="65" r="20"></circle>
                <circle class="led-dot" cx="225" cy="65" r="20"></circle>
                <text x="30" y="98" text-anchor="middle" font-size="13" fill="#666">Meñique</text>
                <text x="95" y="98" text-anchor="middle" font-size="13" fill="#666">Anular</text>
                <text x="160" y="98" text-anchor="middle" font-size="13" fill="#666">Medio</text>
                <text x="225" y="98" text-anchor="middle" font-size="13" fill="#666">Índice</text>
              </g>
              <g id="ledGroupThumbs" class="led-group">
                <text x="10" y="128" font-size="18" fill="#666">Pulgares</text>
                <circle class="led-dot" cx="95" cy="165" r="20"></circle>
                <circle class="led-dot" cx="160" cy="165" r="20"></circle>
                <text x="127" y="198" text-anchor="middle" font-size="13" fill="#666">Izquierdo / Derecho</text>
              </g>
              <g id="ledGroupRight" class="led-group">
                <text x="10" y="228" font-size="18" fill="#666">Mano derecha</text>
                <circle class="led-dot" cx="30" cy="265" r="20"></circle>
                <circle class="led-dot" cx="95" cy="265" r="20"></circle>
                <circle class="led-dot" cx="160" cy="265" r="20"></circle>
                <circle class="led-dot" cx="225" cy="265" r="20"></circle>
                <text x="30" y="298" text-anchor="middle" font-size="13" fill="#666">Índice</text>
                <text x="95" y="298" text-anchor="middle" font-size="13" fill="#666">Medio</text>
                <text x="160" y="298" text-anchor="middle" font-size="13" fill="#666">Anular</text>
                <text x="225" y="298" text-anchor="middle" font-size="13" fill="#666">Meñique</text>
              </g>
            </svg>
            <style>
              #huellasDiagrama .led-dot { fill: #e0e0e0; stroke: #b0b0b0; stroke-width: 2; transition: fill 0.2s; }
              #huellasDiagrama .led-group.activo .led-dot { fill: #28a745; stroke: #1e7e34; }
              #huellasDiagrama .led-group.activo text { fill: #1e7e34; font-weight: bold; }
            </style>
            <script>
              // MutationObserver sobre #prompt en vez de tocar internohuellas.js -- ese
              // <span> ya lo llena el wiring existente
              // (promptElement.innerText = FingerprintCaptureApi.Impression[impression],
              // que produce literalmente "PLAIN_LEFT_FOUR_FINGERS"/"PLAIN_RIGHT_FOUR_FINGERS"/
              // "PLAIN_DUAL_THUMBS" -- el nombre del enum, confirmado leyendo
              // aw_fingerprint_capture.js). Sin confirmar todavía en hardware real.
              (function () {
                var promptEl = document.getElementById('prompt');
                var groups = {
                  left: document.getElementById('ledGroupLeft'),
                  thumbs: document.getElementById('ledGroupThumbs'),
                  right: document.getElementById('ledGroupRight')
                };
                function actualizarDiagrama() {
                  var texto = promptEl ? promptEl.textContent : '';
                  var activo = null;
                  if (texto.indexOf('LEFT_FOUR') !== -1) activo = 'left';
                  else if (texto.indexOf('RIGHT_FOUR') !== -1) activo = 'right';
                  else if (texto.indexOf('THUMBS') !== -1) activo = 'thumbs';
                  Object.keys(groups).forEach(function (key) {
                    if (!groups[key]) return;
                    groups[key].classList.toggle('activo', key === activo);
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