<?php
/*
Menu Superior: Poblacion
Menu: Alta Perfil Izquierdo
Pertenece: Poblacion
Prioridad: 3
Nombre Archivo: internoperfilizquierdo.php
Permiso: Agregar
*/
require($_SERVER['DOCUMENT_ROOT'] . '/include/authenticate.php');
include(FOLDER_HTML . 'include/header.php');
?>
<input type="hidden" id="aware_desactivado" />
<input type="hidden" id="primera_vez" />
<input type="hidden" id="id_interno" value="<?php echo $_POST['id']; ?>" />
<input type="hidden" id="siguiente_paso" value="<?php echo $siguiente; ?>?id=<?php echo $_POST['id']; ?>" />
<input type="hidden" id="foto_tomada" value="no" />
<main id="main-container">
    <div class="content-holder">
        <h1>Captura de Perfil Izquierdo</h1>
        <section id="interno_huellas-container"><!-- Capturar Huella -->
            <div id="contenedor_captura_huellas" class="inms-card">
		        <div class="row">
			      	<div class="col-sm-6">
			      		<h3 class="title-divider"><i class="fa fa-expand"></i> Captura</h3>
			      	</div>
			      	<div class="col-sm-6 text-end">
			      	<span class="me-2">
						<strong>Cámara:</strong>
						<span id="camStatus" class="badge bg-secondary badge-status">
							desconocido
						</span>
					</span>
					<button id="btnReconnect" type="button"
					  class="btn btn-link p-0 m-0 text-decoration-none"
					  title="Reconectar" aria-label="Reconectar">
					  <i class="fa-solid fa-rotate-right small"></i>
					</button>
			      	</div>
		      	</div>
		        <div class="row">
		          
		          <div class="col-sm-12 text-center">
		            <img id="photoImage" src="" class="img-fluid rounded m-2 border border-1 border-secondary">
		          </div>
		          
		          
		        </div>
		        <div class="row mt-5">
		        
		          <div class="col-sm-12 text-center">
		            <button id="manualCapture" class="btn btn-primary">Capturar</button>
		          </div>
		        </div>
		      </div>
            <div class="contenedor_captura_huellas-resultados inms-card">
                <h3 class="title-divider"><i class="fa fa-image"></i> Resultados</h3>
                <div id="resultados" class="row">
		          <div class="col-sm-12">
		            <img id="finalImage" class="img-fluid rounded m-2 border border-1 border-secondary">
		          </div>
		        </div>
            </div>
        </section>
        <section>
            <div class="col-sm-2"></div>
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
<script src="<?php echo $path_app; ?>js/lib/iCam.js"></script>
<?php include(FOLDER_HTML . 'include/footer.php'); ?>