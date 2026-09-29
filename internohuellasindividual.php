<?php
/*
Menu Superior: Poblacion
Menu: Alta Huellas Individual
Pertenece: Poblacion
Prioridad: 3
Nombre Archivo: internohuellasindividual.php
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
        <h3 class="title-divider"><i class="fa fa-expand"></i> Captura Individual</h3>
        <div class="row">
          <div class="col-sm-8">

            <div style="width: 100%; height:480px;  border:1px solid lightgray;">
              <img id="previewImage" style="max-width:100%; max-height:100%">
            </div>

            <p>Estado: <span id="status"></span></p>
            <p>Capturando: <span id="prompt"></span></p>
            <p style="display: none;"><button id="markMissing">Mark Missing</button> When collecting slaps, marks index as missing. When collecting dual thumbs, marks left thumb as missing.</p>
            <p>Estado: <span id="autocaptureStatus"></span></p>
            <div class="quality-bar-wrap"><span class="quality-bar-label">Calidad de la lectura</span><div class="quality-bar-track"><div class="quality-bar-fill" id="previewScoreBar"></div></div><span class="quality-bar-word" id="previewScoreWord"></span></div>

            <button class="btn btn-info" id="reset">Reiniciar captura</button>
            <a class="btn btn-success" href="internohuellas.php?id=<?php echo $_GET['id']; ?>">Capturar 442</a>
          </div>
          <div class="col-sm-4">
            <?php foreach ($huellas_a_capturar as $huella) { ?>
              <div class="custom-checkbox">
                <input type="checkbox" class="substituted huellas omision <?php echo $huella['campo']; ?>" id="<?php echo $huella['campo']; ?>" checked="">
                <label for="<?php echo $huella['campo']; ?>"><?php echo $huella['nombre']; ?></label>
              </div>
            <?php } ?>

            <!-- Mismo diagrama ilustrativo que internohuellas.php, adaptado a dedo individual --
                 pedido explícito del usuario, 2026-09-25: "haz lo mismo para huellas individuales
                 y roladas". Aquí se resalta en verde UN solo círculo (el dedo específico
                 solicitado), igual que el LED físico individual que ya se enciende para esta
                 página (RS_SetFingerLED con la constante del dedo específico, no la de grupo).
                 Propio de esta página, no toca internohuellasindividual.js -- observa #prompt
                 con un MutationObserver, igual que internohuellas.php. La comparación es contra
                 el objeto FingerprintCaptureApi.Impression en tiempo de ejecución (no contra el
                 texto adivinado) porque ya se confirmó en internohuellas.php que las etiquetas
                 mostradas son español ("Índice derecho", etc, ver aw_fingerprint_capture.js:290-365),
                 no el nombre del enum. Rediseñado (2026-09-25, misma tarde) como dos manos
                 ilustradas de frente con un círculo superpuesto en la punta de cada dedo, en vez
                 de círculos sueltos con el nombre del dedo al lado -- mismo rediseño pedido por
                 el usuario para internohuellas.php. Sin confirmar todavía en hardware real. -->
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
                // Un dot por dedo, mapeado a la constante PLAIN_* correspondiente (no al texto
                // en español que se muestra -- ese se resuelve en tiempo de ejecución contra
                // FingerprintCaptureApi.Impression, ver comentario arriba del <svg>).
                var dots = {
                  dotLeftLittle: 'PLAIN_LEFT_LITTLE_FINGER',
                  dotLeftRing: 'PLAIN_LEFT_RING_FINGER',
                  dotLeftMiddle: 'PLAIN_LEFT_MIDDLE_FINGER',
                  dotLeftIndex: 'PLAIN_LEFT_INDEX_FINGER',
                  dotThumbLeft: 'PLAIN_LEFT_THUMB',
                  dotThumbRight: 'PLAIN_RIGHT_THUMB',
                  dotRightIndex: 'PLAIN_RIGHT_INDEX_FINGER',
                  dotRightMiddle: 'PLAIN_RIGHT_MIDDLE_FINGER',
                  dotRightRing: 'PLAIN_RIGHT_RING_FINGER',
                  dotRightLittle: 'PLAIN_RIGHT_LITTLE_FINGER'
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
             internohuellas.php, pedido explícito del usuario, 2026-09-29: "aplica esto mismo
             para la lectura individual". A diferencia de esa página (recaptura el GRUPO
             completo), aquí cada botón "Recapturar" pide UN SOLO dedo -- "en este caso solo
             debe solicitar el dedo al que se le esta indicando la recaptura". Se mantiene el
             id "resultados" y data-finger-code en cada <img> porque buildFixedPositionArrays()
             (internohuellasindividual.js) ya depende de ellos para el guardado -- solo cambia
             cómo se ve. internohuellasindividual.js ya NO crea <img> nuevos (ver appendImage):
             rellena el <img> que ya existe aquí, por código de dedo. -->
        <div id="resultados" class="resultados-grid">
          <div class="resultados-fila">
            <div class="huella-card" data-finger-code="10">
              <div class="huella-card-placeholder"></div>
              <img data-finger-code="10" style="display:none;">
              <div class="huella-card-label">10 Meñique<br>Mano Izquierda</div>
              <div class="huella-card-quality"><div class="huella-card-quality-track"><div class="huella-card-quality-fill" data-quality-fill></div></div><div class="huella-card-quality-word" data-quality-word></div></div>
              <button type="button" class="btn btn-sm btn-outline-secondary btn-recapturar" data-finger-code="10">Recapturar</button>
            </div>
            <div class="huella-card" data-finger-code="9">
              <div class="huella-card-placeholder"></div>
              <img data-finger-code="9" style="display:none;">
              <div class="huella-card-label">9 Anular<br>Mano Izquierda</div>
              <div class="huella-card-quality"><div class="huella-card-quality-track"><div class="huella-card-quality-fill" data-quality-fill></div></div><div class="huella-card-quality-word" data-quality-word></div></div>
              <button type="button" class="btn btn-sm btn-outline-secondary btn-recapturar" data-finger-code="9">Recapturar</button>
            </div>
            <div class="huella-card" data-finger-code="8">
              <div class="huella-card-placeholder"></div>
              <img data-finger-code="8" style="display:none;">
              <div class="huella-card-label">8 Medio<br>Mano Izquierda</div>
              <div class="huella-card-quality"><div class="huella-card-quality-track"><div class="huella-card-quality-fill" data-quality-fill></div></div><div class="huella-card-quality-word" data-quality-word></div></div>
              <button type="button" class="btn btn-sm btn-outline-secondary btn-recapturar" data-finger-code="8">Recapturar</button>
            </div>
            <div class="huella-card" data-finger-code="7">
              <div class="huella-card-placeholder"></div>
              <img data-finger-code="7" style="display:none;">
              <div class="huella-card-label">7 Índice<br>Mano Izquierda</div>
              <div class="huella-card-quality"><div class="huella-card-quality-track"><div class="huella-card-quality-fill" data-quality-fill></div></div><div class="huella-card-quality-word" data-quality-word></div></div>
              <button type="button" class="btn btn-sm btn-outline-secondary btn-recapturar" data-finger-code="7">Recapturar</button>
            </div>
          </div>
          <div class="resultados-fila">
            <div class="huella-card" data-finger-code="5">
              <div class="huella-card-placeholder"></div>
              <img data-finger-code="5" style="display:none;">
              <div class="huella-card-label">5 Meñique<br>Mano Derecha</div>
              <div class="huella-card-quality"><div class="huella-card-quality-track"><div class="huella-card-quality-fill" data-quality-fill></div></div><div class="huella-card-quality-word" data-quality-word></div></div>
              <button type="button" class="btn btn-sm btn-outline-secondary btn-recapturar" data-finger-code="5">Recapturar</button>
            </div>
            <div class="huella-card" data-finger-code="4">
              <div class="huella-card-placeholder"></div>
              <img data-finger-code="4" style="display:none;">
              <div class="huella-card-label">4 Anular<br>Mano Derecha</div>
              <div class="huella-card-quality"><div class="huella-card-quality-track"><div class="huella-card-quality-fill" data-quality-fill></div></div><div class="huella-card-quality-word" data-quality-word></div></div>
              <button type="button" class="btn btn-sm btn-outline-secondary btn-recapturar" data-finger-code="4">Recapturar</button>
            </div>
            <div class="huella-card" data-finger-code="3">
              <div class="huella-card-placeholder"></div>
              <img data-finger-code="3" style="display:none;">
              <div class="huella-card-label">3 Medio<br>Mano Derecha</div>
              <div class="huella-card-quality"><div class="huella-card-quality-track"><div class="huella-card-quality-fill" data-quality-fill></div></div><div class="huella-card-quality-word" data-quality-word></div></div>
              <button type="button" class="btn btn-sm btn-outline-secondary btn-recapturar" data-finger-code="3">Recapturar</button>
            </div>
            <div class="huella-card" data-finger-code="2">
              <div class="huella-card-placeholder"></div>
              <img data-finger-code="2" style="display:none;">
              <div class="huella-card-label">2 Índice<br>Mano Derecha</div>
              <div class="huella-card-quality"><div class="huella-card-quality-track"><div class="huella-card-quality-fill" data-quality-fill></div></div><div class="huella-card-quality-word" data-quality-word></div></div>
              <button type="button" class="btn btn-sm btn-outline-secondary btn-recapturar" data-finger-code="2">Recapturar</button>
            </div>
          </div>
          <div class="resultados-fila">
            <div class="huella-card" data-finger-code="6">
              <div class="huella-card-placeholder"></div>
              <img data-finger-code="6" style="display:none;">
              <div class="huella-card-label">6 Pulgar<br>Izquierdo</div>
              <div class="huella-card-quality"><div class="huella-card-quality-track"><div class="huella-card-quality-fill" data-quality-fill></div></div><div class="huella-card-quality-word" data-quality-word></div></div>
              <button type="button" class="btn btn-sm btn-outline-secondary btn-recapturar" data-finger-code="6">Recapturar</button>
            </div>
            <div class="huella-card" data-finger-code="1">
              <div class="huella-card-placeholder"></div>
              <img data-finger-code="1" style="display:none;">
              <div class="huella-card-label">1 Pulgar<br>Derecho</div>
              <div class="huella-card-quality"><div class="huella-card-quality-track"><div class="huella-card-quality-fill" data-quality-fill></div></div><div class="huella-card-quality-word" data-quality-word></div></div>
              <button type="button" class="btn btn-sm btn-outline-secondary btn-recapturar" data-finger-code="1">Recapturar</button>
            </div>
          </div>
        </div>
        <style>
          #resultados.resultados-grid { display: flex; flex-direction: column; gap: 14px; margin-top: 10px; }
          /* Cuadrícula de 4 columnas FIJAS para las 3 filas (4/4/2) -- pedido explícito del
             usuario, 2026-09-29: "mantente el tamaño de huellas de los pulgares del tamaño de
             los otros dedos". Con columnas fijas, cada tarjeta mide siempre 1/4 del ancho
             total sin importar cuántas tenga esa fila -- la fila de pulgares deja las últimas
             2 columnas vacías en vez de estirar sus 2 tarjetas. */
          #resultados .resultados-fila { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
          #resultados .huella-card { min-width: 0; text-align: center; font-size: 15px; }
          #resultados .huella-card img,
          #resultados .huella-card-placeholder { display: block; width: 100%; height: auto; aspect-ratio: 3 / 4; border-radius: 4px; }
          #resultados .huella-card img { object-fit: cover; border: 1px solid #ccc; }
          #resultados .huella-card-placeholder { background: #f0f0f0; border: 1px dashed #ccc; }
          #resultados .huella-card-label { margin-top: 4px; color: #555; line-height: 1.2; }
          #resultados .huella-card-quality { margin-top: 4px; }
          #resultados .huella-card-quality-track { width: 100%; height: 8px; background: #e0e0e0; border-radius: 4px; overflow: hidden; }
          #resultados .huella-card-quality-fill { height: 100%; width: 0%; background: #e0e0e0; transition: width 0.25s ease, background-color 0.25s ease; }
          #resultados .huella-card-quality-word { margin-top: 2px; font-size: 12px; color: #555; min-height: 1em; }
          .quality-bar-wrap { margin-top: 4px; display: flex; align-items: center; gap: 8px; }
          .quality-bar-label { font-size: 14px; color: #333; }
          .quality-bar-track { width: 160px; height: 14px; background: #e0e0e0; border-radius: 7px; overflow: hidden; }
          .quality-bar-fill { height: 100%; width: 0%; background: #e0e0e0; transition: width 0.25s ease, background-color 0.25s ease; }
          .quality-bar-word { font-size: 14px; font-weight: 600; color: #333; min-width: 90px; }
          #resultados .btn-recapturar { margin-top: 6px; font-size: 13px; padding: 4px 8px; width: 100%; }
        </style>
        <script>
          // Delega el clic de "Recapturar" a recapturarDedo(fingerCode), función global
          // definida en internohuellasindividual.js. addEventListener en JS plano, NO jQuery
          // -- bug real ya confirmado en internohuellas.php: en este punto de la página
          // jQuery todavía no está cargado ("$ is not defined"), así que un $(document).on(...)
          // aquí nunca se registraría.
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
  </div>




  </div>
</main>




<script src="<?php echo $path_app; ?>js/Common/lib/es6-promise/es6-promise.js"></script>
<script src="<?php echo $path_app; ?>js/Common/lib/biocomponents/aw_fingerprint_capture.js"></script>
<script src="<?php echo $path_app; ?>js/Common/lib/biocomponents/aw_fingerprint_set.js"></script>
<script src="<?php echo $path_app; ?>js/Common/lib/biocomponents/WebsocketTransport.js?v=wssdevices6"></script>
<script src="<?php echo $path_app; ?>js/Common/lib/biocomponents/ImpressionInfo.js"></script>
<script src="<?php echo $path_app; ?>js/Common/lib/binary-file-saver/BinaryFileSaver.js"></script>
<?php include(FOLDER_HTML . 'include/footer.php'); ?>