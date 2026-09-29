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
            <div class="quality-bar-wrap"><span class="quality-bar-label">Calidad de la lectura</span><div class="quality-bar-track"><div class="quality-bar-fill" id="previewScoreBar"></div></div><span class="quality-bar-word" id="previewScoreWord"></span></div>

            <button class="btn btn-info" id="reset">Reiniciar captura</button>
            <a class="btn btn-success" href="internohuellasindividual.php?id=<?php echo $_GET['id']; ?>">Capturar individualmente</a>
          </div>
          <div class="col-sm-4">
            <?php foreach ($huellas_a_capturar as $huella) { ?>
              <div class="custom-checkbox">
                <input type="checkbox" class="substituted huellas omision <?php echo $huella['campo']; ?>" id="<?php echo $huella['campo']; ?>" checked="">
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
              /* Declarado DESPUÉS de .activo a propósito: un dedo omitido debe verse rojo aunque
                 su grupo esté activo en ese momento (misma prioridad que se les da a los LEDs
                 físicos: rojo el que falta, verde los que siguen pidiéndose). */
              #huellasDiagrama .led-dot.omitido { fill: #dc3545; stroke: #a52834; }
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

              // Refleja en rojo, sobre el mismo diagrama, los checkboxes que el operador
              // desmarcó (dedo omitido) -- pedido explícito del usuario, 2026-09-25. Propio de
              // esta página, no toca internohuellas.js: los checkboxes ya no están
              // deshabilitados (ver el foreach de arriba), pero el envío real de qué dedos se
              // omiten al puente lo maneja WebsocketTransport.js (aw_fingerprint_capture_set_
              // finger_missing), no este script -- esto es solo el reflejo visual.
              (function () {
                var CHECKBOX_TO_DOT = {
                  menique_mano_izquierda: 'dotLeftLittle',
                  anular_mano_izquierda: 'dotLeftRing',
                  medio_mano_izquierda: 'dotLeftMiddle',
                  indice_mano_izquierda: 'dotLeftIndex',
                  pulgar_mano_izquierda: 'dotThumbLeft',
                  menique_mano_derecha: 'dotRightLittle',
                  anular_mano_derecha: 'dotRightRing',
                  medio_mano_derecha: 'dotRightMiddle',
                  indice_mano_derecha: 'dotRightIndex',
                  pulgar_mano_derecha: 'dotThumbRight'
                };
                function actualizarOmitido(checkboxId) {
                  var dotId = CHECKBOX_TO_DOT[checkboxId];
                  if (!dotId) return;
                  var dot = document.getElementById(dotId);
                  var checkbox = document.getElementById(checkboxId);
                  if (!dot || !checkbox) return;
                  dot.classList.toggle('omitido', !checkbox.checked);
                }
                Object.keys(CHECKBOX_TO_DOT).forEach(function (checkboxId) {
                  var checkbox = document.getElementById(checkboxId);
                  if (!checkbox) return;
                  actualizarOmitido(checkboxId);
                  checkbox.addEventListener('change', function () { actualizarOmitido(checkboxId); });
                });
              })();
            </script>
          </div>
        </div>
      </div>

      <div class="contenedor_captura_huellas-resultados inms-card">
        <h3 class="title-divider"><i class="fa fa-image"></i> Resultados</h3>
        <!-- Cuadrícula de 3 filas (izquierda/derecha/pulgares) en vez de una lista plana de
             imágenes -- pedido explícito del usuario, 2026-09-29. Se mantiene el id
             "resultados" y el atributo data-finger-code en cada <img> porque
             buildFixedPositionArrays() (internohuellas.js) ya depende de
             "#resultados img[data-finger-code=...]" para armar el guardado -- solo cambia
             cómo se ve, no cómo se guarda. internohuellas.js ya NO crea <img> nuevos (ver
             appendImage): ahora rellena el <img> que ya existe aquí, por código de dedo.
             El botón "Recapturar" de cualquier dedo vuelve a pedir el grupo COMPLETO al que
             pertenece (4 dedos en manos, 2 en pulgares) -- pedido explícito del usuario: "si
             doy clic en 'recapturar' del dedo medio de la mano derecha se tienen que
             recapturar los 4 dedos de la mano derecha". data-group coincide con la posición
             en impressionsToCapture (0=izquierda, 1=derecha, 2=pulgares). -->
        <div id="resultados" class="resultados-grid">
          <div class="resultados-fila" data-group="0">
            <div class="huella-card" data-finger-code="10">
              <div class="huella-card-placeholder"></div>
              <img data-finger-code="10" style="display:none;">
              <div class="huella-card-label">10 Meñique<br>Mano Izquierda</div>
              <div class="huella-card-quality"><div class="huella-card-quality-track"><div class="huella-card-quality-fill" data-quality-fill></div></div></div>
              <button type="button" class="btn btn-sm btn-outline-secondary btn-recapturar" data-group="0">Recapturar</button>
            </div>
            <div class="huella-card" data-finger-code="9">
              <div class="huella-card-placeholder"></div>
              <img data-finger-code="9" style="display:none;">
              <div class="huella-card-label">9 Anular<br>Mano Izquierda</div>
              <div class="huella-card-quality"><div class="huella-card-quality-track"><div class="huella-card-quality-fill" data-quality-fill></div></div></div>
              <button type="button" class="btn btn-sm btn-outline-secondary btn-recapturar" data-group="0">Recapturar</button>
            </div>
            <div class="huella-card" data-finger-code="8">
              <div class="huella-card-placeholder"></div>
              <img data-finger-code="8" style="display:none;">
              <div class="huella-card-label">8 Medio<br>Mano Izquierda</div>
              <div class="huella-card-quality"><div class="huella-card-quality-track"><div class="huella-card-quality-fill" data-quality-fill></div></div></div>
              <button type="button" class="btn btn-sm btn-outline-secondary btn-recapturar" data-group="0">Recapturar</button>
            </div>
            <div class="huella-card" data-finger-code="7">
              <div class="huella-card-placeholder"></div>
              <img data-finger-code="7" style="display:none;">
              <div class="huella-card-label">7 Índice<br>Mano Izquierda</div>
              <div class="huella-card-quality"><div class="huella-card-quality-track"><div class="huella-card-quality-fill" data-quality-fill></div></div></div>
              <button type="button" class="btn btn-sm btn-outline-secondary btn-recapturar" data-group="0">Recapturar</button>
            </div>
          </div>
          <div class="resultados-fila" data-group="1">
            <div class="huella-card" data-finger-code="5">
              <div class="huella-card-placeholder"></div>
              <img data-finger-code="5" style="display:none;">
              <div class="huella-card-label">5 Meñique<br>Mano Derecha</div>
              <div class="huella-card-quality"><div class="huella-card-quality-track"><div class="huella-card-quality-fill" data-quality-fill></div></div></div>
              <button type="button" class="btn btn-sm btn-outline-secondary btn-recapturar" data-group="1">Recapturar</button>
            </div>
            <div class="huella-card" data-finger-code="4">
              <div class="huella-card-placeholder"></div>
              <img data-finger-code="4" style="display:none;">
              <div class="huella-card-label">4 Anular<br>Mano Derecha</div>
              <div class="huella-card-quality"><div class="huella-card-quality-track"><div class="huella-card-quality-fill" data-quality-fill></div></div></div>
              <button type="button" class="btn btn-sm btn-outline-secondary btn-recapturar" data-group="1">Recapturar</button>
            </div>
            <div class="huella-card" data-finger-code="3">
              <div class="huella-card-placeholder"></div>
              <img data-finger-code="3" style="display:none;">
              <div class="huella-card-label">3 Medio<br>Mano Derecha</div>
              <div class="huella-card-quality"><div class="huella-card-quality-track"><div class="huella-card-quality-fill" data-quality-fill></div></div></div>
              <button type="button" class="btn btn-sm btn-outline-secondary btn-recapturar" data-group="1">Recapturar</button>
            </div>
            <div class="huella-card" data-finger-code="2">
              <div class="huella-card-placeholder"></div>
              <img data-finger-code="2" style="display:none;">
              <div class="huella-card-label">2 Índice<br>Mano Derecha</div>
              <div class="huella-card-quality"><div class="huella-card-quality-track"><div class="huella-card-quality-fill" data-quality-fill></div></div></div>
              <button type="button" class="btn btn-sm btn-outline-secondary btn-recapturar" data-group="1">Recapturar</button>
            </div>
          </div>
          <div class="resultados-fila" data-group="2">
            <div class="huella-card" data-finger-code="6">
              <div class="huella-card-placeholder"></div>
              <img data-finger-code="6" style="display:none;">
              <div class="huella-card-label">6 Pulgar<br>Izquierdo</div>
              <div class="huella-card-quality"><div class="huella-card-quality-track"><div class="huella-card-quality-fill" data-quality-fill></div></div></div>
              <button type="button" class="btn btn-sm btn-outline-secondary btn-recapturar" data-group="2">Recapturar</button>
            </div>
            <div class="huella-card" data-finger-code="1">
              <div class="huella-card-placeholder"></div>
              <img data-finger-code="1" style="display:none;">
              <div class="huella-card-label">1 Pulgar<br>Derecho</div>
              <div class="huella-card-quality"><div class="huella-card-quality-track"><div class="huella-card-quality-fill" data-quality-fill></div></div></div>
              <button type="button" class="btn btn-sm btn-outline-secondary btn-recapturar" data-group="2">Recapturar</button>
            </div>
          </div>
        </div>
        <style>
          /* Pedido explícito del usuario, 2026-09-29: las imágenes deben ocupar todo el
             ancho de su fila -- antes cada tarjeta tenía un ancho fijo (92px), dejando
             espacio vacío a la derecha en filas más anchas que el contenido. Ahora cada
             tarjeta crece a partes iguales (flex:1) hasta llenar la fila completa; el
             ancho de cada imagen depende de cuántas tarjetas tenga esa fila (4 en las
             manos, 2 en pulgares -- por eso los pulgares se ven más anchos, no es un bug). */
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
          .quality-bar-word { font-size: 14px; font-weight: 600; color: #333; min-width: 90px; }
          #resultados .btn-recapturar { margin-top: 6px; font-size: 13px; padding: 4px 8px; width: 100%; }
        </style>
        <script>
          // Delega el clic de "Recapturar" a recapturarGrupo(groupIndex), función global
          // definida en internohuellas.js (ese archivo no tiene wrapper de módulo, así que ya
          // expone sus variables/funciones como globales -- mismo patrón que el resto de esta
          // página usa para observar #prompt, solo que aquí SÍ hace falta invocar una función
          // real de la vista previa/captura, no solo leer el DOM). Pedido explícito del
          // usuario, 2026-09-29.
          //
          // Bug real confirmado (2026-09-29): se usó $(document).on(...) (jQuery) aquí, pero
          // en este punto de la página jQuery TODAVÍA no está cargado ("$ is not defined" --
          // confirmado en consola) -- se carga más abajo, junto con el resto de los <script>
          // de la página. Se reemplaza por addEventListener en JS plano, que no depende de
          // que jQuery ya esté disponible en este punto del documento.
          document.addEventListener('click', function (event) {
            var boton = event.target.closest('.btn-recapturar');
            if (!boton) return;
            var groupIndex = parseInt(boton.getAttribute('data-group'), 10);
            if (typeof recapturarGrupo === 'function') recapturarGrupo(groupIndex);
          });
        </script>
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
<script src="<?php echo $path_app; ?>js/Common/lib/biocomponents/WebsocketTransport.js?v=wssdevices6"></script>
<script src="<?php echo $path_app; ?>js/Common/lib/biocomponents/ImpressionInfo.js"></script>
<script src="<?php echo $path_app; ?>js/Common/lib/binary-file-saver/BinaryFileSaver.js"></script>
<?php include(FOLDER_HTML . 'include/footer.php'); ?>