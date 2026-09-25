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
            <p style="display:none;">Preview Score: <span id="previewScore"></span></p>

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
  </div>




  </div>
</main>




<script src="<?php echo $path_app; ?>js/Common/lib/es6-promise/es6-promise.js"></script>
<script src="<?php echo $path_app; ?>js/Common/lib/biocomponents/aw_fingerprint_capture.js"></script>
<script src="<?php echo $path_app; ?>js/Common/lib/biocomponents/aw_fingerprint_set.js"></script>
<script src="<?php echo $path_app; ?>js/Common/lib/biocomponents/WebsocketTransport.js?v=wssdevices4"></script>
<script src="<?php echo $path_app; ?>js/Common/lib/biocomponents/ImpressionInfo.js"></script>
<script src="<?php echo $path_app; ?>js/Common/lib/binary-file-saver/BinaryFileSaver.js"></script>
<?php include(FOLDER_HTML . 'include/footer.php'); ?>