<?php
/*
Menu Superior: Poblacion
Menu: Alta Rostro
Pertenece: Poblacion
Prioridad: 3
Nombre Archivo: internorostro.php
Permiso: Agregar
*/
require($_SERVER['DOCUMENT_ROOT'] . '/include/authenticate.php');
include(FOLDER_HTML . 'include/header.php');
?>
<style>
  /* Mismo problema que ya se corrigió en internoiris.php: img-fluid sin tamaño fijo muestra el
     <img> a su resolución NATIVA, que cambia entre la vista previa idle y AutoFace -- crecía o
     achicaba el recuadro con cada cambio de estado (reportado 2026-09-22). Se fija una caja
     constante con object-fit:contain para que el tamaño sea el mismo que al cargar la página.
  */
  #photoImage {
    width: 100%;
    max-width: 640px;
    height: 360px;
    object-fit: contain;
    background-color: #000;
  }
  /* Recuadro guía de rostro sobre la vista previa en vivo, replicando en el navegador el mismo
     recuadro que ya se manda a la LCD física de la TD200 (SetLCDFaceGuideBounds) -- pedido
     explícito del usuario, 2026-09-22/23. #photoImageWrap envuelve exactamente la caja visible
     de #photoImage (por eso el margen que antes tenía el <img> se movió aquí) para que los
     recuadros, posicionados en porcentaje y centrados, coincidan con el encuadre real. El ancho
     alto exactos los fija JS (iCam.js, _applyFaceGuideBox) según CAM_FACE_INNER_*/OUTER_* de
     config.env -- aquí solo se define la apariencia común de ambos recuadros.
  */
  #photoImageWrap {
    position: relative;
    display: inline-block;
  }
  .face-guide-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 2px solid;
    box-sizing: border-box;
    pointer-events: none;
    display: none;
  }
  #faceGuideOuter { border-color: #ffffff; }
  #faceGuideInner { border-color: #28a745; }
</style>
<input type="hidden" id="aware_desactivado" />
<input type="hidden" id="primera_vez" />
<input type="hidden" id="id_interno" value="<?php echo $_POST['id']; ?>" />
<input type="hidden" id="siguiente_paso" value="<?php echo $siguiente; ?>?id=<?php echo $_POST['id']; ?>" />
<input type="hidden" id="foto_tomada" value="no" />
<main id="main-container">
  <div class="content-holder">
    <h1>Captura de Rostro</h1>
    
    <section id="interno_huellas-container"><!-- Capturar Huella -->
      <div id="contenedor_captura_huellas" class="inms-card">
      	<div class="row align-items-center">
		    <div class="col-sm-6">
		        <h3 class="title-divider">
		            <i class="fa fa-expand"></i> Captura
		        </h3>
		    </div>
		
		    <div class="col-sm-6 text-end">
		        <span class="me-2 align-middle">
		            <strong>Cámara:</strong>
		
		            <span id="camStatus"
		                  class="badge bg-secondary badge-status align-middle">
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
            <div id="photoImageWrap" class="m-2">
              <img id="photoImage" src="" class="img-fluid rounded border border-1 border-secondary">
              <div id="faceGuideOuter" class="face-guide-box"></div>
              <div id="faceGuideInner" class="face-guide-box"></div>
            </div>
          </div>
          
          
        </div>
        <div class="row mt-5">
			
          <div class="col-sm-12 text-center">
            <button id="startAutoCapture" class="btn btn-primary">Iniciar Captura Automática</button>
            <button id="btnAutoFaceOff" class="btn btn-secondary">Detener Captura Automática</button>
            
            
            <button id="manualCapture" style="display:none;">Manual Capture</button>
            <button id="stopAutoCapture" style="display:none;" class="btn btn-warning">Detener Auto Captura</button>
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