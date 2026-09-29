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
            <div class="quality-bar-wrap"><span class="quality-bar-label">Calidad de la lectura</span><div class="quality-bar-track"><div class="quality-bar-fill" id="previewScoreBar"></div></div></div>

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
                 aw_fingerprint_capture.js:260-289). Rediseñado (2026-09-25, misma tarde) como dos
                 manos ilustradas de frente con un círculo superpuesto en la punta de cada dedo,
                 mismo rediseño pedido por el usuario para internohuellas.php. Sin confirmar
                 todavía en hardware real. -->
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
        <!-- Cuadrícula de 3 filas -- mismo rediseño ya confirmado en hardware para
             internohuellas.php/internohuellasindividual.php, pedido explícito del usuario,
             2026-09-29: "aplica esto mismo para... huellas roladas". Cada botón "Recapturar"
             pide UN SOLO dedo: "en este caso solo debe solicitar el dedo al que se le esta
             indicando la recaptura". Se mantiene el id "resultados" y data-finger-code en
             cada <img> porque buildFixedPositionArrays() (internohuellasroladas.js) ya
             depende de ellos para el guardado -- solo cambia cómo se ve.
             internohuellasroladas.js ya NO crea <img> nuevos (ver appendImage): rellena el
             <img> que ya existe aquí, por código de dedo. -->
        <div id="resultados" class="resultados-grid">
          <div class="resultados-fila">
            <div class="huella-card" data-finger-code="10">
              <div class="huella-card-placeholder"></div>
              <img data-finger-code="10" style="display:none;">
              <div class="huella-card-label">Meñique<br>Mano Izquierda</div>
              <div class="huella-card-quality"><div class="huella-card-quality-track"><div class="huella-card-quality-fill" data-quality-fill></div></div></div>
              <button type="button" class="btn btn-sm btn-outline-secondary btn-recapturar" data-finger-code="10">Recapturar</button>
            </div>
            <div class="huella-card" data-finger-code="9">
              <div class="huella-card-placeholder"></div>
              <img data-finger-code="9" style="display:none;">
              <div class="huella-card-label">Anular<br>Mano Izquierda</div>
              <div class="huella-card-quality"><div class="huella-card-quality-track"><div class="huella-card-quality-fill" data-quality-fill></div></div></div>
              <button type="button" class="btn btn-sm btn-outline-secondary btn-recapturar" data-finger-code="9">Recapturar</button>
            </div>
            <div class="huella-card" data-finger-code="8">
              <div class="huella-card-placeholder"></div>
              <img data-finger-code="8" style="display:none;">
              <div class="huella-card-label">Medio<br>Mano Izquierda</div>
              <div class="huella-card-quality"><div class="huella-card-quality-track"><div class="huella-card-quality-fill" data-quality-fill></div></div></div>
              <button type="button" class="btn btn-sm btn-outline-secondary btn-recapturar" data-finger-code="8">Recapturar</button>
            </div>
            <div class="huella-card" data-finger-code="7">
              <div class="huella-card-placeholder"></div>
              <img data-finger-code="7" style="display:none;">
              <div class="huella-card-label">Índice<br>Mano Izquierda</div>
              <div class="huella-card-quality"><div class="huella-card-quality-track"><div class="huella-card-quality-fill" data-quality-fill></div></div></div>
              <button type="button" class="btn btn-sm btn-outline-secondary btn-recapturar" data-finger-code="7">Recapturar</button>
            </div>
          </div>
          <div class="resultados-fila">
            <div class="huella-card" data-finger-code="5">
              <div class="huella-card-placeholder"></div>
              <img data-finger-code="5" style="display:none;">
              <div class="huella-card-label">Meñique<br>Mano Derecha</div>
              <div class="huella-card-quality"><div class="huella-card-quality-track"><div class="huella-card-quality-fill" data-quality-fill></div></div></div>
              <button type="button" class="btn btn-sm btn-outline-secondary btn-recapturar" data-finger-code="5">Recapturar</button>
            </div>
            <div class="huella-card" data-finger-code="4">
              <div class="huella-card-placeholder"></div>
              <img data-finger-code="4" style="display:none;">
              <div class="huella-card-label">Anular<br>Mano Derecha</div>
              <div class="huella-card-quality"><div class="huella-card-quality-track"><div class="huella-card-quality-fill" data-quality-fill></div></div></div>
              <button type="button" class="btn btn-sm btn-outline-secondary btn-recapturar" data-finger-code="4">Recapturar</button>
            </div>
            <div class="huella-card" data-finger-code="3">
              <div class="huella-card-placeholder"></div>
              <img data-finger-code="3" style="display:none;">
              <div class="huella-card-label">Medio<br>Mano Derecha</div>
              <div class="huella-card-quality"><div class="huella-card-quality-track"><div class="huella-card-quality-fill" data-quality-fill></div></div></div>
              <button type="button" class="btn btn-sm btn-outline-secondary btn-recapturar" data-finger-code="3">Recapturar</button>
            </div>
            <div class="huella-card" data-finger-code="2">
              <div class="huella-card-placeholder"></div>
              <img data-finger-code="2" style="display:none;">
              <div class="huella-card-label">Índice<br>Mano Derecha</div>
              <div class="huella-card-quality"><div class="huella-card-quality-track"><div class="huella-card-quality-fill" data-quality-fill></div></div></div>
              <button type="button" class="btn btn-sm btn-outline-secondary btn-recapturar" data-finger-code="2">Recapturar</button>
            </div>
          </div>
          <div class="resultados-fila">
            <div class="huella-card" data-finger-code="6">
              <div class="huella-card-placeholder"></div>
              <img data-finger-code="6" style="display:none;">
              <div class="huella-card-label">Pulgar<br>Izquierdo</div>
              <div class="huella-card-quality"><div class="huella-card-quality-track"><div class="huella-card-quality-fill" data-quality-fill></div></div></div>
              <button type="button" class="btn btn-sm btn-outline-secondary btn-recapturar" data-finger-code="6">Recapturar</button>
            </div>
            <div class="huella-card" data-finger-code="1">
              <div class="huella-card-placeholder"></div>
              <img data-finger-code="1" style="display:none;">
              <div class="huella-card-label">Pulgar<br>Derecho</div>
              <div class="huella-card-quality"><div class="huella-card-quality-track"><div class="huella-card-quality-fill" data-quality-fill></div></div></div>
              <button type="button" class="btn btn-sm btn-outline-secondary btn-recapturar" data-finger-code="1">Recapturar</button>
            </div>
          </div>
        </div>
        <style>
          #resultados.resultados-grid { display: flex; flex-direction: column; gap: 14px; margin-top: 10px; }
          #resultados .resultados-fila { display: flex; gap: 12px; }
          #resultados .huella-card { flex: 1 1 0; min-width: 0; text-align: center; font-size: 15px; }
          #resultados .huella-card img,
          #resultados .huella-card-placeholder { display: block; width: 100%; height: auto; aspect-ratio: 3 / 4; border-radius: 4px; }
          #resultados .huella-card img { object-fit: cover; border: 1px solid #ccc; }
          #resultados .huella-card-placeholder { background: #f0f0f0; border: 1px dashed #ccc; }
          #resultados .huella-card-label { margin-top: 4px; color: #555; line-height: 1.2; }
          #resultados .huella-card-quality { margin-top: 4px; }
          #resultados .huella-card-quality-track { width: 100%; height: 8px; background: #e0e0e0; border-radius: 4px; overflow: hidden; }
          #resultados .huella-card-quality-fill { height: 100%; width: 0%; background: #e0e0e0; transition: width 0.25s ease, background-color 0.25s ease; }
          .quality-bar-wrap { margin-top: 4px; display: flex; align-items: center; gap: 8px; }
          .quality-bar-label { font-size: 14px; color: #333; }
          .quality-bar-track { width: 160px; height: 14px; background: #e0e0e0; border-radius: 7px; overflow: hidden; }
          .quality-bar-fill { height: 100%; width: 0%; background: #e0e0e0; transition: width 0.25s ease, background-color 0.25s ease; }
          #resultados .btn-recapturar { margin-top: 6px; font-size: 13px; padding: 4px 8px; width: 100%; }
        </style>
        <script>
          // Delega el clic de "Recapturar" a recapturarDedo(fingerCode), función global
          // definida en internohuellasroladas.js. addEventListener en JS plano, NO jQuery --
          // bug real ya confirmado en internohuellas.php: en este punto de la página jQuery
          // todavía no está cargado ("$ is not defined").
          document.addEventListener('click', function (event) {
            var boton = event.target.closest('.btn-recapturar');
            if (!boton) return;
            var fingerCode = parseInt(boton.getAttribute('data-finger-code'), 10);
            if (typeof recapturarDedo === 'function') recapturarDedo(fingerCode);
          });
        </script>
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
<script src="<?php echo $path_app; ?>js/Common/lib/biocomponents/WebsocketTransport.js?v=wssdevices6"></script>
<script src="<?php echo $path_app; ?>js/Common/lib/biocomponents/ImpressionInfo.js"></script>
<script src="<?php echo $path_app; ?>js/Common/lib/binary-file-saver/BinaryFileSaver.js"></script>
<?php include(FOLDER_HTML . 'include/footer.php'); ?>