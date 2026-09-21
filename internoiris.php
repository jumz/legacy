<?php
/*
Menu Superior: Poblacion
Menu: Alta Iris
Pertenece: Poblacion
Prioridad: 3
Nombre Archivo: internoiris.php
Permiso: Agregar
*/
require($_SERVER['DOCUMENT_ROOT'] . '/include/authenticate.php');
include(FOLDER_HTML . 'include/header.php');
?>
<style>
  h3.title-divider {
    color: #5CB2E4;
    border-bottom: 1px solid #a9cfe5;
    padding-bottom: 8px;
    margin-bottom: 20px;
  }
  /* El frame de la cámara no siempre llega con la misma resolución (vista previa normal vs.
     el modo de búsqueda de ojos durante una captura/reintento de iris) -- con img-fluid solo
     (max-width:100%, height:auto) el <img> se mostraba a su tamaño NATIVO cada vez, achicándose
     o agrandándose con cada cambio de estado y corriendo el selector "Ojo a capturar" de abajo,
     dificultando darle clic (reportado 2026-09-20). Se fija un tamaño de caja constante con
     object-fit:contain -- el frame que llegue se ajusta ADENTRO sin recortarse ni deformarse, y
     el resto de la página ya no se mueve.
  */
  #photoImage {
    width: 100%;
    max-width: 640px;
    height: 360px;
    object-fit: contain;
    background-color: #000;
  }
</style>
<input type="hidden" id="id_interno" value="<?php echo $_POST['id']; ?>" />
<input type="hidden" id="siguiente_paso" value="<?php echo $siguiente; ?>?id=<?php echo $_POST['id']; ?>" />


<main id="main-container">
    <div class="content-holder">
        <h1>Captura de Iris</h1>
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
		        
		          	<div class="col-sm-12 d-flex align-items-center justify-content-center gap-2">
					    <label for="irisMode" class="form-label form-label-sm mb-0">
					        Ojo a capturar:
					    </label>
					
					    <select id="irisMode" class="form-select form-select-sm w-auto">
					        <option value="both">Ambos ojos</option>
					        <option value="right">Solo derecho</option>
					        <option value="left">Solo izquierdo</option>
					    </select>
					
					    <button id="btnCaptureIris" class="btn btn-primary btn-sm">
					        Capturar
					    </button>
					</div>

		        </div>
		      </div>
            <div class="contenedor_captura_huellas-resultados inms-card">
		        <h3 class="title-divider"><i class="fa fa-image"></i> Resultados</h3>
		        <div id="resultados">
		          <table class="table table-responsive">
		            <tbody>
		              
		              <tr>
		                <td style="width:50%">
		                  <img id="iris_derecho_img" class="center-block img-fluid rounded m-2 border border-1 border-secondary" src="<?php echo $path_app; ?>js/Common/IrisComponent/images/empty_image_white.png" />
		                </td>
		                <td  style="width:50%">
		                <img id="iris_izquierdo_img" class="center-block img-fluid rounded m-2 border border-1 border-secondary" src="<?php echo $path_app; ?>js/Common/IrisComponent/images/empty_image_white.png" />
		                  
		                </td>
		              </tr>
		              <tr>
		              	<th class="text-center">Iris Derecho</td>
		                <th class="text-center">Iris Izquierdo</td>
		              </tr>
		            </tbody>
		          </table>
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