<?php
/*
Menu Superior: Poblacion
Menu: Interno Perfil
Pertenece: Poblacion
Prioridad: 1
Nombre Archivo: internosperfil.php
Permiso: Lectura
*/
require($_SERVER['DOCUMENT_ROOT'] . '/include/authenticate.php');
if (!isset($_POST['txtIDBiometrico'])) {
	$_POST['txtIDBiometrico'] = '';
}
include(FOLDER_HTML . 'include/header.php');
$_SESSION['tokenaudio'] = md5(uniqid(rand(), true));
?>

<main id="main-container">
	<div class="content-holder">

		<h1>Perfil Interno - <?php echo $interno['primer_nombre'] . ' ' . $interno['apellido_paterno']; ?></h1>
		<input type="hidden" id="id_interno" value="<?php echo $_GET['id']; ?>" />


		<section id="perfil-interno-container">
			<div class="perfil-interno-lateral inms-card">
				<?php if ($interno['frontal'] != '') : ?>
					<img src="<?php echo $path_app; ?>rostros/<?php echo $interno['frontal']; ?>" alt="User" title="User" class="" />
				<?php else : ?>
					<img src="<?php echo $path_app; ?>imgs/generic-user.jpg" alt="User" title="User" class="" />
				<?php endif; ?>

				<p><strong>IDINMS:</strong>&nbsp;<?php echo ($interno['bioid']); ?></p>
				<p><strong class="font-weight-bold fw-700">Estatus:</strong>&nbsp;<?php echo trim($interno['estatus']); ?></p>
				<p><strong class="font-weight-bold fw-700">Huella Voz:</strong>&nbsp;<?php echo getCalidadHuellaHTMLSTARS($interno['calidad_huella_voz'], stripos($interno["audio_enroll"], "THIRDLANE")); ?></p>

				<div>
					<strong class="font-weight-bold fw-700">Huella Voz Tipo <span class="d-inline-block mr-1 badge badge-success text-center p-1"> B</span>:</strong>
					<p class="font-italic">El origen del enrolamiento de la huella de voz se realiz&oacute; a trav&eacute;s de una lectura de texto.</p>
				</div>

				<div>
					<strong class="font-weight-bold fw-700">Huella Voz Tipo <span class="d-inline-block mr-1 badge badge-success text-center p-1"> A</span>:</strong>
					<p>El origen del enrolamiento de la huella de voz se realiz&oacute; a trav&eacute;s de una llamada telef&oacute;nica.</p>
				</div>

				<div>
					<span class="d-inline-block mr-1 badge badge-success text-center p-1"> <i class="fa fa-star"></i></span>
					<span class="d-inline-block mr-1 badge badge-success text-center p-1"> <i class="fa fa-star"></i></span>
					<span class="d-inline-block mr-1 badge badge-success text-center p-1"> <i class="fa fa-star"></i></span>
					<span class="d-inline-block mr-1 badge badge-success text-center p-1"> <i class="fa fa-star"></i></span>
					<p>Estos &iacute;conos representan el n&uacute;mero de retroalimentaciones de la huella de voz del sujeto.</p>
				</div>


			</div>


			<div class="perfil-interno-secciones">

				<section id="catalogos-nav">
					<div class="inms-subnav-horizontal">
						<a role="button" data-toggle="tab" data-bs-target="#tabDatos" data-id="tabDatos" class="menu_horizontal_activo cambiar_catalogo"><i class="fa fa-address-card"></i> Datos Generales</a>
						<?php if (!empty($informacion_interno_juridico) && !empty($informacion_interno_media_filiacion)) { ?>
							<a role="button" data-id="tabAdministrativos" class="cambiar_catalogo"><i class="fa fa-address-card"></i> Datos Administrativos</a>
						<?php } ?>
						<?php if ($informacion_orden_captura['internorostro.php'] == 'activo') { ?>
							<a role="button" data-id="tabRostro" class="cambiar_catalogo"><i class="fa fa-camera"></i> Rostro</a></a>
						<?php } ?>
						<?php if ($informacion_orden_captura['internohuellas.php'] == 'activo') { ?>
							<a role="button" data-id="tabHuellas" class="cambiar_catalogo"><i class="fa fa-hand"></i> Huellas</a>
						<?php } ?>
						<?php if ($informacion_orden_captura['internoiris.php'] == 'activo') { ?>
							<a role="button" data-id="tabIris" class="cambiar_catalogo"><i class="fa fa-eye"></i> Iris</a>
						<?php } ?>
						<?php if ($informacion_orden_captura['internoaudio.php'] == 'activo') { ?>
							<a role="button" data-id="tabVoz" class="cambiar_catalogo"><i class="fa fa-assistive-listening-systems"></i> Voz</a>
						<?php } ?>
						<?php if (!$ocultarFicha) { ?>
							<a class="" target="_blank" href="filiacion.php?id=<?php echo $_GET['id']; ?>"><i class="fa fa-portrait"></i> Ficha</a>
						<?php } ?>
					</div>
				</section>


				<!-- Contenido Tab 1-->
				<section id="tabDatos" class="contenedores-perfil">
					<?php
					foreach ($arreglo_informacion_interno_rpp as $key => $campo) {
						$arreglo_interno = $informacion_interno;
						if (array_key_exists($campo, $arreglo_interno)) {
							if ($campo == 'id_catalogo_general_sexo' || $campo == 'id_catalogo_general_nombre_del_centro') {
								$filtros = array(
									array(
										'parametros' => ($arreglo_interno[$campo] != '') ? $arreglo_interno[$campo] : '0'
									)
								);
								$respuesta = api_rpp("getCatalogo", $filtros, 0, 0, "");
								if (!empty($respuesta->registro)) {
									$row = (array)$respuesta->registro;
									$arreglo_interno[$campo] = $row['valor'];
								}
							}
							if ($campo == 'id_penal') {
								$filtros = array(
									array(
										'parametros' => ($arreglo_interno[$campo] != '') ? $arreglo_interno[$campo] : '0'
									)
								);
								$respuesta = api_rpp("getPenal", $filtros, 0, 0, "");
								if (!empty($respuesta->registro)) {
									$row = (array)$respuesta->registro;
									$arreglo_interno[$campo] = $row['nombre'];
								}
							}
					?>
							<p>
								<strong><i class="fa fa-user mr-2"></i> <?php echo $arreglo_informacion_interno_rpp_nombre[$key]; ?></strong>
								<span><?php echo $arreglo_interno[$campo]; ?></span>
							</p>
					<?php
						}
					}
					?>
					<?php if (!empty($informacion_interno_nacimiento)) { ?>

						<h2><i class="fa fa-globe mr-2"></i> Nacimiento</h2>

						<?php
						foreach ($arreglo_informacion_interno_rpp_nacimiento as $key => $campo) {
							$arreglo_interno = $informacion_interno_nacimiento;
							if (array_key_exists($campo, $arreglo_interno)) {
								if ($campo == 'cve_ent') {
									$filtros = array(
										array(
											'parametros' => ($arreglo_interno[$campo] != '') ? $arreglo_interno[$campo] : '0'
										)
									);
									$respuesta = api_rpp("getEntidad", $filtros, 0, 0, "");
									if (!empty($respuesta->registro)) {
										$row = (array)$respuesta->registro;
										$arreglo_interno[$campo] = $row['nom_ent'];
									}
								}
								if ($campo == 'cve_mun') {
									$filtros = array(
										array(
											'parametros' => ($arreglo_interno[$campo] != '') ? $arreglo_interno[$campo] : '0'
										)
									);
									$respuesta = api_rpp("getMunicipio", $filtros, 0, 0, "");
									if (!empty($respuesta->registro)) {
										$row = (array)$respuesta->registro;
										$arreglo_interno[$campo] = $row['nom_mun'];
									}
								}
								if ($campo == 'id_pais') {
									$filtros = array(
										array(
											'parametros' => ($arreglo_interno[$campo] != '') ? $arreglo_interno[$campo] : '0'
										)
									);
									$respuesta = api_rpp("getPais", $filtros, 0, 0, "");
									if (!empty($respuesta->registro)) {
										$row = (array)$respuesta->registro;
										$arreglo_interno[$campo] = $row['pais'];
									}
								}
								if ($campo == 'id_nacionalidad') {
									$filtros = array(
										array(
											'parametros' => ($arreglo_interno[$campo] != '') ? $arreglo_interno[$campo] : '0'
										)
									);
									$respuesta = api_rpp("getNacionalidad", $filtros, 0, 0, "");
									if (!empty($respuesta->registro)) {
										$row = (array)$respuesta->registro;
										$arreglo_interno[$campo] = $row['nacionalidad'];
									}
								}
						?>
								<p>
									<strong><i class="fa fa-globe"></i> <?php echo $arreglo_informacion_interno_rpp_nacimiento_nombre[$key]; ?></strong>
									<span><?php echo $arreglo_interno[$campo]; ?></span>
								</p>
					<?php
							}
						}
					}
					?>
					<?php if (!empty($informacion_interno_domicilio)) { ?>

						<h2><i class="fa fa-map-marker-alt"></i> Domicilio</h2>

						<?php
						foreach ($arreglo_informacion_interno_rpp_domicilio as $key => $campo) {
							$arreglo_interno = $informacion_interno_domicilio;
							if (array_key_exists($campo, $arreglo_interno)) {
								if ($campo == 'cve_ent') {
									$filtros = array(
										array(
											'parametros' => ($arreglo_interno[$campo] != '') ? $arreglo_interno[$campo] : '0'
										)
									);
									$respuesta = api_rpp("getEntidad", $filtros, 0, 0, "");
									if (!empty($respuesta->registro)) {
										$row = (array)$respuesta->registro;
										$arreglo_interno[$campo] = $row['nom_ent'];
									}
								}
								if ($campo == 'cve_mun') {
									$filtros = array(
										array(
											'parametros' => ($arreglo_interno[$campo] != '') ? $arreglo_interno[$campo] : '0'
										)
									);
									$respuesta = api_rpp("getMunicipio", $filtros, 0, 0, "");
									if (!empty($respuesta->registro)) {
										$row = (array)$respuesta->registro;
										$arreglo_interno[$campo] = $row['nom_mun'];
									}
								}
								if ($campo == 'id_pais') {
									$filtros = array(
										array(
											'parametros' => ($arreglo_interno[$campo] != '') ? $arreglo_interno[$campo] : '0'
										)
									);
									$respuesta = api_rpp("getPais", $filtros, 0, 0, "");
									if (!empty($respuesta->registro)) {
										$row = (array)$respuesta->registro;
										$arreglo_interno[$campo] = $row['pais'];
									}
								}
						?>
								<p>
									<strong><i class="fa fa-map-marker-alt mr-2"></i> <?php echo $arreglo_informacion_interno_rpp_domicilio_nombre[$key]; ?></strong>
									<span><?php echo $arreglo_interno[$campo]; ?></span>
								</p>
					<?php
							}
						}
					}
					?>
					<?php if (!empty($informacion_interno_complementarios)) { ?>

						<h2><i class="fa fa-street-view mr-2"></i> Complementarios</h2>

						<?php
						foreach ($arreglo_informacion_interno_rpp_complementarios as $key => $campo) {
							$arreglo_interno = $informacion_interno_complementarios;
							if (array_key_exists($campo, $arreglo_interno)) {
								if ($campo == 'id_catalogo_general_estado_civil' || $campo == 'id_catalogo_general_escolaridad' || $campo == 'id_catalogo_general_religion' || $campo == 'id_catalogo_general_etnia' || $campo == 'id_catalogo_general_habla_indigena') {
									$filtros = array(
										array(
											'parametros' => ($arreglo_interno[$campo] != '') ? $arreglo_interno[$campo] : '0'
										)
									);
									$respuesta = api_rpp("getCatalogo", $filtros, 0, 0, "");
									if (!empty($respuesta->registro)) {
										$row = (array)$respuesta->registro;
										$arreglo_interno[$campo] = $row['valor'];
									}
								}
						?>
								<p>
									<strong><i class="fa fa-street-view mr-2"></i> <?php echo $arreglo_informacion_interno_rpp_complementarios_nombre[$key]; ?></strong>
									<span><?php echo $arreglo_interno[$campo]; ?></span>
								</p>
					<?php
							}
						}
					}
					?>

					<div class="formas_actions">
						<a href="internos.php" class="btn btn-sm btn-primary"> <span class="fa fa-reply mr-1"></span> Regresar</a>
					</div>
				</section>
				<!-- /fin tab 1-->

				<!-- Contenido Tab Administrativos-->
				<?php if (!empty($informacion_interno_juridico) && !empty($informacion_interno_media_filiacion)) { ?>
					<section id="tabAdministrativos" style="display:none;" class="contenedores-perfil">
						<?php
						if (!empty($informacion_interno_juridico)) {
							foreach ($arreglo_informacion_interno_rpp_juridico as $key => $campo) {
								$arreglo_interno = $informacion_interno_juridico;
								if (array_key_exists($campo, $arreglo_interno)) {
									if ($campo == 'id_catalogo_general_ingresos_anteriores') {
										$filtros = array(
											array(
												'parametros' => ($arreglo_interno[$campo] != '') ? $arreglo_interno[$campo] : '0'
											)
										);
										$respuesta = api_rpp("getCatalogo", $filtros, 0, 0, "");
										if (!empty($respuesta->registro)) {
											$row = (array)$respuesta->registro;
											$arreglo_interno[$campo] = $row['valor'];
										}
									}
						?>
									<p>
										<strong><i class="fa fa-folder"></i> <?php echo $arreglo_informacion_interno_rpp_juridico_nombre[$key]; ?></strong>
										<span><?php echo $arreglo_interno[$campo]; ?></span>
									</p>
						<?php
								}
							}
						}
						?>

						<?php if (!empty($informacion_interno_media_filiacion)) { ?>
							<h2><i class="fa fa-user-circle mr-2"></i> Media Filiación</h2>

							<?php
							foreach ($arreglo_informacion_interno_rpp_media_filiacion as $key => $campo) {
								$arreglo_interno = $informacion_interno_media_filiacion;
								if (array_key_exists($campo, $arreglo_interno)) {
									if ($campo == 'estatura' || $campo == 'peso' || $campo == 'senas_particulares') {
									} else {

										$filtros = array(
											array(
												'parametros' => ($arreglo_interno[$campo] != '') ? $arreglo_interno[$campo] : '0'
											)
										);
										$respuesta = api_rpp("getCatalogo", $filtros, 0, 0, "");
										if (!empty($respuesta->registro)) {
											$row = (array)$respuesta->registro;
											$arreglo_interno[$campo] = $row['valor'];
										}
									}
							?>
									<p>
										<strong><i class="fa fa-user-circle"></i> <?php echo $arreglo_informacion_interno_rpp_media_filiacion_nombre[$key]; ?></strong>
										<span><?php echo $arreglo_interno[$campo]; ?></span>
									</p>
						<?php
								}
							}
						}
						?>


						<div class="formas_actions">
							<a href="internos.php" class="btn btn-sm btn-primary"> <span class="fa fa-reply mr-1"></span> Regresar</a>
						</div>
					</section>
				<?php } ?>
				<!-- /fin tab administrativos-->



				<!-- Contenido Tab Rostro-->
				<?php if ($informacion_orden_captura['internorostro.php'] == 'activo') { ?>
					<section id="tabRostro" style="display:none;" class="contenedores-perfil">

						<style>
						/* ── Upload / crop overlay ────────────────────────────── */
						.rostro-img-wrap {
							position: relative;
							display: block;
							border-radius: 5px;
							overflow: hidden;
						}
						.rostro-img-wrap img {
							display: block;
							width: 100%;
							height: auto;
							border-radius: 5px;
						}
						.rostro-img-overlay {
							position: absolute;
							bottom: 0; left: 0; right: 0;
							background: rgba(20, 40, 90, 0.58);
							display: flex;
							justify-content: space-around;
							padding: 5px 4px;
							opacity: 0;
							transition: opacity 0.18s ease;
						}
						.rostro-img-wrap:hover .rostro-img-overlay { opacity: 1; }
						.rostro-btn-upload,
						.rostro-btn-crop {
							background: transparent;
							border: none;
							color: #fff;
							font-size: 13px;
							cursor: pointer;
							padding: 3px 10px;
							border-radius: 3px;
							line-height: 1;
						}
						.rostro-btn-upload:hover,
						.rostro-btn-crop:hover { background: rgba(255,255,255,0.2); }
						.rostro-img-label {
							font-size: 11px;
							text-align: center;
							color: #8898aa;
							margin-top: 4px;
							font-weight: 500;
						}
						.rostro-img-placeholder {
							display: flex;
							align-items: center;
							justify-content: center;
							width: 100%;
							aspect-ratio: 3 / 4;
							background: #f0f3f8;
							border: 1px dashed #c5cfe0;
							border-radius: 5px;
							color: #aab4c4;
							font-size: 12px;
						}

						/* ── Layout: main + sidebar ───────────────────────────── */
						.rostro-layout {
							display: flex;
							gap: 16px;
							align-items: flex-start;
						}
						.rostro-main { flex: 1; min-width: 0; }
						.rostro-sidebar {
							width: 160px;
							flex-shrink: 0;
							position: sticky;
							top: 16px;
						}
						.rostro-sidebar-card {
							background: #fff;
							border: 1px solid #e2e8f0;
							border-radius: 10px;
							padding: 12px;
							box-shadow: 0 1px 4px rgba(0,0,0,0.06);
						}
						.rostro-sidebar-card .btn { width: 100%; margin-bottom: 4px; }

						/* ── Override legacy 4-column grid on #tabRostro ──────── */
						#tabRostro { display: block; }

						/* ── Group card ───────────────────────────────────────── */
						.rostro-group {
							background: #fff;
							border: 1px solid #e2e8f0;
							border-radius: 10px;
							margin-bottom: 16px;
							box-shadow: 0 1px 4px rgba(0,0,0,0.06);
						}
						.rostro-group-header {
							background: linear-gradient(135deg, #eef2fc 0%, #e4eaf8 100%);
							border-bottom: 1px solid #d8e0f0;
							padding: 9px 16px;
							font-size: 13px;
							font-weight: 700;
							text-transform: uppercase;
							letter-spacing: 0.07em;
							color: #3b4f7c;
							border-radius: 10px 10px 0 0;
						}
						.rostro-group-header .fa { color: #4f70c4; margin-right: 7px; }
						.rostro-subgroup { padding: 14px; }
						.rostro-container {
							display: grid;
							grid-template-columns: repeat(3, 1fr);
							gap: 12px;
							align-items: start;
						}
						.rostro-container > div {
							background: #f7f9fc;
							border: 1px solid #e2e8f0;
							border-radius: 8px;
							padding: 6px;
							transition: border-color 0.15s, box-shadow 0.15s;
						}
						.rostro-container > div:hover {
							border-color: #8aa3d6;
							box-shadow: 0 2px 8px rgba(60,90,180,0.10);
						}
						</style>

						<?php
						function rostroImgUpload($interno, $path_app, $campo, $tipo_bd, $crop_bd, $tipo, $fileInputId, $imgId) {
							$file = isset($interno[$campo]) ? $interno[$campo] : '';
							$src  = $file != ''
								? $path_app . 'rostros/' . $file . '?v=' . @filemtime(BASE_INCLUDE . 'html/rostros/' . $file)
								: $path_app . 'imgs/generic-user.jpg';
							$hasFoto = ($file != '');
							$idGET   = htmlspecialchars($_GET['id']);
							echo '<div class="rostro-img-wrap">';
							echo '  <img id="' . $imgId . '" src="' . $src . '" alt="' . $tipo . '" />';
							echo '  <input type="file" id="' . $fileInputId . '" class="rostroFileInput" style="display:none" accept="image/jpeg,image/jpg,image/png">';
							echo '  <div class="rostro-img-overlay">';
							echo '    <button type="button" class="rostro-btn-upload" onclick="document.getElementById(\'' . $fileInputId . '\').click()" title="Subir ' . $tipo . '"><i class="fa fa-upload"></i></button>';
							if ($hasFoto) {
								echo '    <form action="cropper.php" method="POST" style="margin:0">';
								echo '      <input type="hidden" name="id" value="' . $idGET . '">';
								echo '      <input type="hidden" name="tipo_bd" value="' . $tipo_bd . '">';
								echo '      <input type="hidden" name="crop_bd" value="' . $crop_bd . '">';
								echo '      <input type="hidden" name="tipo" value="' . htmlspecialchars($tipo) . '">';
								echo '      <button type="submit" class="rostro-btn-crop" title="Recortar ' . $tipo . '"><i class="fa fa-crop"></i></button>';
								echo '    </form>';
							}
							echo '  </div>';
							echo '</div>';
							echo '<div class="rostro-img-label">' . $tipo . '</div>';
						}
						?>

						<div class="rostro-layout">
						<div class="rostro-main">

						<!-- ══════════════ ORIGINALES ══════════════ -->
						<div class="rostro-group">
							<div class="rostro-group-header"><i class="fa fa-camera"></i> Originales</div>
							<div class="rostro-subgroup">
								<div class="rostro-container">
									<div><?php rostroImgUpload($interno, $path_app, 'frontal_manual',  'frontal_manual',  'frontal_crop',   'Frontal',         'fileSubirFrontal',   'imgFrontalManual');   ?></div>
									<div><?php rostroImgUpload($interno, $path_app, 'perfil_izquierdo','perfil_izquierdo','izquierdo_crop', 'Perfil Izquierdo','fileSubirPerfilIzq', 'imgPerfilIzquierdo'); ?></div>
									<div><?php rostroImgUpload($interno, $path_app, 'perfil_derecho',  'perfil_derecho',  'derecho_crop',   'Perfil Derecho',  'fileSubirPerfilDer', 'imgPerfilDerecho');   ?></div>
								</div>
							</div>
						</div>

						<!-- ══════════════ RECORTADAS ══════════════ -->
						<div class="rostro-group">
							<div class="rostro-group-header"><i class="fa fa-crop"></i> Recortadas</div>
							<div class="rostro-subgroup">
								<div class="rostro-container">
									<div>
										<?php if ($interno['frontal_crop'] != '') { ?>
											<div class="rostro-img-wrap"><img src="<?php echo $path_app; ?>rostros/<?php echo $interno['frontal_crop']; ?>?v=<?php echo @filemtime(BASE_INCLUDE . 'html/rostros/' . $interno['frontal_crop']); ?>" alt="Frontal" /></div>
										<?php } else { ?>
											<div class="rostro-img-placeholder">Sin recorte</div>
										<?php } ?>
										<div class="rostro-img-label">Frontal</div>
									</div>
									<div>
										<?php if ($interno['izquierdo_crop'] != '') { ?>
											<div class="rostro-img-wrap"><img src="<?php echo $path_app; ?>rostros/<?php echo $interno['izquierdo_crop']; ?>?v=<?php echo @filemtime(BASE_INCLUDE . 'html/rostros/' . $interno['izquierdo_crop']); ?>" alt="Perfil Izquierdo" /></div>
										<?php } else { ?>
											<div class="rostro-img-placeholder">Sin recorte</div>
										<?php } ?>
										<div class="rostro-img-label">Perfil Izquierdo</div>
									</div>
									<div>
										<?php if ($interno['derecho_crop'] != '') { ?>
											<div class="rostro-img-wrap"><img src="<?php echo $path_app; ?>rostros/<?php echo $interno['derecho_crop']; ?>?v=<?php echo @filemtime(BASE_INCLUDE . 'html/rostros/' . $interno['derecho_crop']); ?>" alt="Perfil Derecho" /></div>
										<?php } else { ?>
											<div class="rostro-img-placeholder">Sin recorte</div>
										<?php } ?>
										<div class="rostro-img-label">Perfil Derecho</div>
									</div>
								</div>
							</div>
						</div>

						</div><!-- /rostro-main -->

						<!-- ══════════════ SIDEBAR ══════════════ -->
						<div class="rostro-sidebar">
							<div class="rostro-sidebar-card">
								<div class="d-flex align-items-center mb-2">
									<hr class="flex-grow-1 my-0" /><small class="text-muted mx-2" style="white-space:nowrap">dispositivo</small><hr class="flex-grow-1 my-0" />
								</div>
								<form action="internorostro.php" class="enrolamiento" method="GET">
									<input type="hidden" name="id" value="<?php echo $_GET['id']; ?>" />
									<button type="submit" class="btn btn-sm btn-outline-success btn-block">
										<i class="fa fa-camera mr-1"></i> Capturar Rostro
									</button>
								</form>
								<button style="display:none;" type="button" id="btn_comparar_rostro" class="btn btn-sm btn-outline-success btn-block mt-1">
									<i class="fa fa-search mr-1"></i> Comparar Rostro
								</button>
								<?php if ($interno['huella_rostro'] == 'si') { ?>
									<button style="display:none;" type="button" id="btn_eliminar_rostro" class="btn btn-sm btn-outline-danger btn-block mt-1">
										<i class="fa fa-trash mr-1"></i> Eliminar Rostro
									</button>
								<?php } ?>
								<form action="internorostromanual.php" class="enrolamiento mt-1" method="GET">
									<input type="hidden" name="id" value="<?php echo $_GET['id']; ?>" />
									<button type="submit" class="btn btn-sm btn-outline-success btn-block">
										<i class="fa fa-user-circle mr-1"></i> Rostro Manual
									</button>
								</form>
								<form action="internoperfilizquierdo.php" class="enrolamiento mt-1" method="GET">
									<input type="hidden" name="id" value="<?php echo $_GET['id']; ?>" />
									<button type="submit" class="btn btn-sm btn-outline-success btn-block">
										<i class="fa fa-arrow-circle-left mr-1"></i> Perfil Izquierdo
									</button>
								</form>
								<form action="internoperfilderecho.php" class="enrolamiento mt-1" method="GET">
									<input type="hidden" name="id" value="<?php echo $_GET['id']; ?>" />
									<button type="submit" class="btn btn-sm btn-outline-success btn-block">
										<i class="fa fa-arrow-circle-right mr-1"></i> Perfil Derecho
									</button>
								</form>
								<hr class="mt-2 mb-2" />
								<a href="internos.php" class="btn btn-sm btn-outline-primary btn-block">
									<i class="fa fa-reply mr-1"></i> Regresar
								</a>
							</div>
						</div><!-- /rostro-sidebar -->

						</div><!-- /rostro-layout -->

					</section>
				<?php } ?>
				<!-- /fin tab Rostro-->


				<!-- contenido tab Huellas-->
				<?php if ($informacion_orden_captura['internohuellas.php'] == 'activo') { ?>
					<section id="tabHuellas" style="display:none;" class="contenedores-perfil">

						<style>
						/* ── Upload overlay ───────────────────────────────────── */
						.huella-img-wrap {
							position: relative;
							display: block;
							cursor: pointer;
							border-radius: 5px;
							overflow: hidden;
						}
						.huella-img-wrap img {
							display: block;
							width: 100%;
							height: auto;
							border-radius: 5px;
						}
						.huella-img-overlay {
							position: absolute;
							bottom: 0; left: 0; right: 0;
							background: rgba(20, 40, 90, 0.58);
							color: #fff;
							text-align: center;
							padding: 5px 0 4px;
							font-size: 12px;
							opacity: 0;
							transition: opacity 0.18s ease;
						}
						.huella-img-wrap:hover .huella-img-overlay { opacity: 1; }
						.huella-img-label {
							font-size: 10px;
							text-align: center;
							color: #8898aa;
							margin-top: 4px;
							font-weight: 500;
							line-height: 1.3;
						}

						/* ── Group card ───────────────────────────────────────── */
						.huellas-group {
							background: #fff;
							border: 1px solid #e2e8f0;
							border-radius: 10px;
							margin-bottom: 16px;
							box-shadow: 0 1px 4px rgba(0,0,0,0.06);
						}
						.huellas-group-header {
							background: linear-gradient(135deg, #eef2fc 0%, #e4eaf8 100%);
							border-bottom: 1px solid #d8e0f0;
							padding: 9px 16px;
							font-size: 13px;
							font-weight: 700;
							text-transform: uppercase;
							letter-spacing: 0.07em;
							color: #3b4f7c;
							border-radius: 10px 10px 0 0;
						}
						.huellas-group-header .fa { color: #4f70c4; margin-right: 7px; }
						.huellas-subgroup:last-child { border-radius: 0 0 10px 10px; }

						/* ── Sub-group ────────────────────────────────────────── */
						.huellas-subgroup {
							padding: 12px 14px 10px;
							border-bottom: 1px solid #f0f3f8;
						}
						.huellas-subgroup:last-child { border-bottom: none; }
						.huellas-subgroup-title {
							font-size: 11px;
							font-weight: 700;
							text-transform: uppercase;
							letter-spacing: 0.09em;
							color: #6b7fa8;
							margin-bottom: 10px;
						}

						/* ── Layout principal: huellas + sidebar ─────────────── */
						.huellas-layout {
							display: flex;
							gap: 16px;
							align-items: flex-start;
						}
						.huellas-main { flex: 1; min-width: 0; }
						.huellas-sidebar {
							width: 155px;
							flex-shrink: 0;
							position: sticky;
							top: 16px;
						}
						.huellas-sidebar-card {
							background: #fff;
							border: 1px solid #e2e8f0;
							border-radius: 10px;
							padding: 12px;
							box-shadow: 0 1px 4px rgba(0,0,0,0.06);
						}
						.huellas-sidebar-card .btn { width: 100%; margin-bottom: 4px; }

						/* ── Finger grid ──────────────────────────────────────── */
						#tabHuellas .tabHuellas_container {
							display: grid;
							grid-template-columns: repeat(4, 1fr);
							gap: 10px;
							align-items: start;
						}
						#tabHuellas .tabHuellas_container.huellas-pulgares {
							grid-template-columns: repeat(2, 1fr);
							max-width: calc(50% - 5px);
						}

						/* ── Individual finger cell ───────────────────────────── */
						#tabHuellas .tabHuellas_container > div {
							background: #f7f9fc;
							border: 1px solid #e2e8f0;
							border-radius: 8px;
							padding: 5px;
							transition: border-color 0.15s, box-shadow 0.15s;
						}
						#tabHuellas .tabHuellas_container > div:hover {
							border-color: #8aa3d6;
							box-shadow: 0 2px 8px rgba(60,90,180,0.10);
						}
						</style>

						<?php
						function huellaImgUpload($interno, $path_app, $campo, $label) {
							$file = isset($interno[$campo]) ? $interno[$campo] : '';
							$src  = $file != ''
								? $path_app . 'huellas/' . $file . '?v=' . @filemtime(BASE_INCLUDE . 'html/huellas/' . $file)
								: $path_app . 'imgs/system/nofinger.png';
							$imgId  = 'hImg_' . $campo;
							$fileId = 'hFile_' . $campo;
							echo '<div class="huella-img-wrap" onclick="document.getElementById(\'' . $fileId . '\').click()" title="Subir ' . $label . '">';
							echo '  <img id="' . $imgId . '" src="' . $src . '" alt="' . $label . '" />';
							echo '  <div class="huella-img-overlay"><i class="fa fa-upload"></i></div>';
							echo '  <input type="file" id="' . $fileId . '" class="huellaFileInput" data-campo="' . $campo . '" data-img="' . $imgId . '" accept="image/jpeg,image/jpg,image/png" style="display:none">';
							echo '</div>';
							echo '<div class="huella-img-label">' . $label . '</div>';
						}
						?>

						<div class="huellas-layout">
						<div class="huellas-main">

						<!-- ══════════════ HUELLAS PLANAS ══════════════ -->
						<div class="huellas-group">
							<div class="huellas-group-header">
								<i class="fa fa-hand"></i> Huellas Planas
							</div>

							<div class="huellas-subgroup">
								<div class="huellas-subgroup-title">Mano Derecha</div>
								<div class="tabHuellas_container">
									<div><?php huellaImgUpload($interno, $path_app, 'indice_mano_derecha', 'Índice'); ?></div>
									<div><?php huellaImgUpload($interno, $path_app, 'medio_mano_derecha', 'Medio'); ?></div>
									<div><?php huellaImgUpload($interno, $path_app, 'anular_mano_derecha', 'Anular'); ?></div>
									<div><?php huellaImgUpload($interno, $path_app, 'menique_mano_derecha', 'Meñique'); ?></div>
								</div>
							</div>

							<div class="huellas-subgroup">
								<div class="huellas-subgroup-title">Mano Izquierda</div>
								<div class="tabHuellas_container">
									<div><?php huellaImgUpload($interno, $path_app, 'menique_mano_izquierda', 'Meñique'); ?></div>
									<div><?php huellaImgUpload($interno, $path_app, 'anular_mano_izquierda', 'Anular'); ?></div>
									<div><?php huellaImgUpload($interno, $path_app, 'medio_mano_izquierda', 'Medio'); ?></div>
									<div><?php huellaImgUpload($interno, $path_app, 'indice_mano_izquierda', 'Índice'); ?></div>
								</div>
							</div>

							<div class="huellas-subgroup">
								<div class="huellas-subgroup-title">Pulgares</div>
								<div class="tabHuellas_container huellas-pulgares">
									<div><?php huellaImgUpload($interno, $path_app, 'pulgar_mano_izquierda', 'Pulgar MI'); ?></div>
									<div><?php huellaImgUpload($interno, $path_app, 'pulgar_mano_derecha', 'Pulgar MD'); ?></div>
								</div>
							</div>
						</div>

						<!-- ══════════════ HUELLAS ROLADAS ══════════════ -->
						<div class="huellas-group">
							<div class="huellas-group-header">
								<i class="fa fa-hand-o-right"></i> Huellas Roladas
							</div>

							<div class="huellas-subgroup">
								<div class="huellas-subgroup-title">Mano Derecha</div>
								<div class="tabHuellas_container">
									<div><?php huellaImgUpload($interno, $path_app, 'indice_mano_derecha_rolada', 'Índice'); ?></div>
									<div><?php huellaImgUpload($interno, $path_app, 'medio_mano_derecha_rolada', 'Medio'); ?></div>
									<div><?php huellaImgUpload($interno, $path_app, 'anular_mano_derecha_rolada', 'Anular'); ?></div>
									<div><?php huellaImgUpload($interno, $path_app, 'menique_mano_derecha_rolada', 'Meñique'); ?></div>
								</div>
							</div>

							<div class="huellas-subgroup">
								<div class="huellas-subgroup-title">Mano Izquierda</div>
								<div class="tabHuellas_container">
									<div><?php huellaImgUpload($interno, $path_app, 'menique_mano_izquierda_rolada', 'Meñique'); ?></div>
									<div><?php huellaImgUpload($interno, $path_app, 'anular_mano_izquierda_rolada', 'Anular'); ?></div>
									<div><?php huellaImgUpload($interno, $path_app, 'medio_mano_izquierda_rolada', 'Medio'); ?></div>
									<div><?php huellaImgUpload($interno, $path_app, 'indice_mano_izquierda_rolada', 'Índice'); ?></div>
								</div>
							</div>

							<div class="huellas-subgroup">
								<div class="huellas-subgroup-title">Pulgares Rolados</div>
								<div class="tabHuellas_container huellas-pulgares">
									<div><?php huellaImgUpload($interno, $path_app, 'pulgar_mano_izquierda_rolada', 'Pulgar MI'); ?></div>
									<div><?php huellaImgUpload($interno, $path_app, 'pulgar_mano_derecha_rolada', 'Pulgar MD'); ?></div>
								</div>
							</div>
						</div>

						</div><!-- /huellas-main -->

						<!-- ══════════════ SIDEBAR BOTONES ══════════════ -->
						<div class="huellas-sidebar">
							<div class="huellas-sidebar-card">
								<div class="d-flex align-items-center mb-2">
									<hr class="flex-grow-1 my-0" /><small class="text-muted mx-2" style="white-space:nowrap">dispositivo</small><hr class="flex-grow-1 my-0" />
								</div>
								<form action="internohuellas.php" class="enrolamiento" method="GET">
									<input type="hidden" name="id" value="<?php echo $_GET['id']; ?>" />
									<button type="submit" class="btn btn-sm btn-outline-success btn-block">
										<i class="fa fa-hand-o-up mr-1"></i> Capturar Huellas
									</button>
									<a href="internohuellasroladas.php?id=<?php echo $_GET['id']; ?>" class="btn btn-sm btn-outline-success btn-block mt-1">
										<i class="fa fa-hand-o-right mr-1"></i> Huellas Roladas
									</a>
									<a href="internohuellasindividual.php?id=<?php echo $_GET['id']; ?>" class="btn btn-sm btn-outline-success btn-block mt-1">
										<i class="fa fa-hand-pointer-o mr-1"></i> Huella Individual
									</a>
									<button type="button" style="display:none;" id="btn_comparar_huellas" class="btn btn-sm btn-outline-secondary btn-block mt-1">
										<i class="fa fa-search mr-1"></i> Comparar Huellas
									</button>
									<?php if ($interno['huella_huellas'] == 'si') { ?>
										<button style="display:none;" type="button" id="btn_eliminar_huellas" class="btn btn-sm btn-outline-danger btn-block mt-1">
											<i class="fa fa-trash mr-1"></i> Eliminar Huellas
										</button>
									<?php } ?>
								</form>
								<hr class="mt-2 mb-2" />
								<a href="internos.php" class="btn btn-sm btn-outline-primary btn-block">
									<i class="fa fa-reply mr-1"></i> Regresar
								</a>
							</div>
						</div><!-- /huellas-sidebar -->

						</div><!-- /huellas-layout -->

					</section>
				<?php } ?>
				<!-- /fin tab Huellas -->


				<!-- contenido tab Iris-->
				<?php if ($informacion_orden_captura['internoiris.php'] == 'activo') { ?>
					<section id="tabIris" style="display:none;" class="contenedores-perfil">

						<style>
						/* ── Iris: override legacy 3-col grid ──────────────────── */
						#tabIris { display: block; }

						/* ── Iris: layout main + sidebar ───────────────────────── */
						.iris-layout {
							display: flex;
							gap: 16px;
							align-items: flex-start;
						}
						.iris-main { flex: 1; min-width: 0; }
						.iris-sidebar {
							width: 160px;
							flex-shrink: 0;
							position: sticky;
							top: 16px;
						}
						.iris-sidebar-card {
							background: #fff;
							border: 1px solid #e2e8f0;
							border-radius: 10px;
							padding: 12px;
							box-shadow: 0 1px 4px rgba(0,0,0,0.06);
						}
						.iris-sidebar-card .btn { width: 100%; margin-bottom: 4px; }

						/* ── Iris: group card ───────────────────────────────────── */
						.iris-group {
							background: #fff;
							border: 1px solid #e2e8f0;
							border-radius: 10px;
							margin-bottom: 16px;
							box-shadow: 0 1px 4px rgba(0,0,0,0.06);
						}
						.iris-group-header {
							background: linear-gradient(135deg, #eef2fc 0%, #e4eaf8 100%);
							border-bottom: 1px solid #d8e0f0;
							padding: 9px 16px;
							font-size: 13px;
							font-weight: 700;
							text-transform: uppercase;
							letter-spacing: 0.07em;
							color: #3b4f7c;
							border-radius: 10px 10px 0 0;
						}
						.iris-group-header .fa { color: #4f70c4; margin-right: 7px; }
						.iris-subgroup { padding: 14px; }
						.iris-container {
							display: grid;
							grid-template-columns: repeat(2, 1fr);
							gap: 72px;
							align-items: start;
						}
						.iris-container > div {
							background: #f7f9fc;
							border: 1px solid #e2e8f0;
							border-radius: 8px;
							padding: 6px;
							transition: border-color 0.15s, box-shadow 0.15s;
							cursor: pointer;
						}
						.iris-container > div:hover {
							border-color: #8aa3d6;
							box-shadow: 0 2px 8px rgba(60,90,180,0.10);
						}

						/* ── Iris: image + upload overlay ───────────────────────── */
						.iris-img-wrap {
							position: relative;
							display: block;
							border-radius: 5px;
							overflow: hidden;
						}
						.iris-img-wrap img {
							display: block;
							width: 100%;
							height: auto;
							border-radius: 5px;
						}
						.iris-img-overlay {
							position: absolute;
							bottom: 0; left: 0; right: 0;
							background: rgba(20, 40, 90, 0.58);
							display: flex;
							justify-content: center;
							padding: 5px 4px;
							opacity: 0;
							transition: opacity 0.18s ease;
						}
						.iris-img-wrap:hover .iris-img-overlay { opacity: 1; }
						.iris-btn-upload {
							background: transparent;
							border: none;
							color: #fff;
							font-size: 13px;
							cursor: pointer;
							padding: 3px 10px;
							border-radius: 3px;
							line-height: 1;
						}
						.iris-btn-upload:hover { background: rgba(255,255,255,0.2); }
						.iris-img-label {
							font-size: 11px;
							text-align: center;
							color: #8898aa;
							margin-top: 4px;
							font-weight: 500;
						}
						.iris-img-placeholder {
							display: flex;
							align-items: center;
							justify-content: center;
							width: 100%;
							aspect-ratio: 1 / 1;
							background: #f0f3f8;
							border: 1px dashed #c5cfe0;
							border-radius: 5px;
							color: #aab4c4;
							font-size: 12px;
						}
						</style>

						<?php
						function irisImgUpload($interno, $path_app, $campo, $label) {
							$file   = isset($interno[$campo]) ? $interno[$campo] : '';
							$src    = $file != ''
								? $path_app . 'iris/' . $file . '?v=' . @filemtime(BASE_INCLUDE . 'html/iris/' . $file)
								: $path_app . 'imgs/system/noiris.png';
							$imgId  = 'irisImg_' . $campo;
							$fileId = 'irisFile_' . $campo;
							echo '<div class="iris-img-wrap" onclick="document.getElementById(\'' . $fileId . '\').click()" title="Subir ' . $label . '">';
							echo '  <img id="' . $imgId . '" src="' . $src . '" alt="' . $label . '" />';
							echo '  <div class="iris-img-overlay"><button type="button" class="iris-btn-upload"><i class="fa fa-upload"></i></button></div>';
							echo '  <input type="file" id="' . $fileId . '" class="irisFileInput" data-campo="' . $campo . '" data-img="' . $imgId . '" accept="image/jpeg,image/jpg,image/png" style="display:none">';
							echo '</div>';
							echo '<div class="iris-img-label">' . $label . '</div>';
						}
						?>

						<div class="iris-layout">
						<div class="iris-main">

						<div class="iris-group">
							<div class="iris-group-header"><i class="fa fa-eye"></i> Capturas de Iris</div>
							<div class="iris-subgroup">
								<div class="iris-container">
									<div><?php irisImgUpload($interno, $path_app, 'iris_derecho',   'Iris Derecho');   ?></div>
									<div><?php irisImgUpload($interno, $path_app, 'iris_izquierdo', 'Iris Izquierdo'); ?></div>
								</div>
							</div>
						</div>

						</div><!-- /iris-main -->

						<!-- ══════════════ SIDEBAR ══════════════ -->
						<div class="iris-sidebar">
							<div class="iris-sidebar-card">
								<div class="d-flex align-items-center mb-2">
									<hr class="flex-grow-1 my-0" /><small class="text-muted mx-2" style="white-space:nowrap">dispositivo</small><hr class="flex-grow-1 my-0" />
								</div>
								<form action="internoiris.php" class="enrolamiento" method="GET">
									<input type="hidden" name="id" value="<?php echo $_GET['id']; ?>" />
									<button type="submit" class="btn btn-sm btn-outline-success btn-block">
										<i class="fa fa-eye mr-1"></i> Capturar Iris
									</button>
								</form>
								<button style="display:none;" type="button" id="btn_comparar_iris" class="btn btn-sm btn-outline-success btn-block mt-1">
									<i class="fa fa-search mr-1"></i> Comparar Iris
								</button>
								<?php if ($interno['huella_iris'] == 'si') { ?>
									<button style="display:none;" type="button" id="btn_eliminar_iris" class="btn btn-sm btn-outline-danger btn-block mt-1">
										<i class="fa fa-trash mr-1"></i> Eliminar Iris
									</button>
								<?php } ?>
								<hr class="mt-2 mb-2" />
								<a href="internos.php" class="btn btn-sm btn-outline-primary btn-block">
									<i class="fa fa-reply mr-1"></i> Regresar
								</a>
							</div>
						</div><!-- /iris-sidebar -->

						</div><!-- /iris-layout -->

					</section>
				<?php } ?>
				<!-- /fin tab Iris -->

				<!-- contenido tab Voz-->
				<?php if ($informacion_orden_captura['internoaudio.php'] == 'activo') { ?>
					<section id="tabVoz" style="display:none;" class="contenedores-perfil">

						<div class="">
							<h5 class="font-weight-bold  text-muted">&nbsp; Audio Cargado</h5>

							<?php if (isset($audioOriginal) && $audioOriginal != "") : ?>
								<div class="">
									<?php // if (array_search('inmsid', array_column($_SESSION['rol_permisos'], 'menu')) !== false) { 
									?>
									<?php $_SESSION['archivo_audio'] = base64_encode($audioOriginal); ?>

									<audio id="audioEnrolado" src="<?php echo $path_app . $audioOriginal; ?>" controls <?php // echo (array_search('traerAudio', array_column($_SESSION['rol_permisos'], 'menu')) !== false) ? '' : 'controlsList="nodownload" oncontextmenu="return false;"';
																									?> style="width:100%;">
										<!--<source src="audio.php" type="audio/wav">-->
									</audio>
									<?php // } 
									?>
								</div>
								<?php // echo $descartarAudioOriginal; 
								?>
						</div>
						<?php if (array_search('traerAudio', array_column($_SESSION['rol_permisos'], 'menu')) !== false) { ?>
							<div>
								<a href="<?php echo $audioOriginal ?>" class="btn btn-success btn-lg btn-icon rounded-circle hover-effect-dot waves-effect waves-themed"><i class="fa fa-download"></i></a>
							</div>
						<?php } ?>
					<?php endif; ?>


					<?php if (!empty($audios_relacionados)) { ?>
						<div class="">
							<h3 class="title-divider mt-5">Audios relacionados</h3>
							<?php foreach ($audios_relacionados as $audio_relacionado) { ?>
								<div class="row">
									<div class="col-md-5">
										<?php if (array_search('inmsid', array_column($_SESSION['rol_permisos'], 'menu')) !== false) { ?>
											<?php $_SESSION['archivo_audio'] = base64_encode($audio_relacionado); ?>
											<audio controls <?php echo (array_search('traerAudio', array_column($_SESSION['rol_permisos'], 'menu')) !== false) ? '' : 'controlsList="nodownload" oncontextmenu="return false;"';  ?> style="width:100%;">
												<source src="audio.php?a=<?php echo base64_encode($audio_relacionado); ?>" type="audio/wav">
												Your browser does not support the audio tag.
											</audio>
										<?php } ?>
									</div>
									<?php // echo  $descartarAudioOriginal; 
									?>

								</div>
								<?php if (array_search('traerAudio', array_column($_SESSION['rol_permisos'], 'menu')) !== false) { ?>
									<div class="row">
										<div class="frame-wrap">
											<a href="<?php echo $audio_relacionado; ?>" class="btn btn-success btn-lg btn-icon rounded-circle hover-effect-dot waves-effect waves-themed"><i class="fa fa-download"></i></a>
										</div>
									</div>
								<?php } ?>
							<?php } ?>
						</div>
					<?php } ?>

					<div class="">
						<?php echo $enrolamientoMensaje; ?>
						<?php if ($enrolamientoMensajeTabla != '') { ?>
							<table class="inms-tabla table-hover table-striped">
								<thead>
									<tr>
										<td>Mensaje</td>
										<td>Origen</td>
										<td>Audio</td>
										<td>Opciones</td>
									</tr>
								</thead>
								<?php echo $enrolamientoMensajeTabla; ?>
							</table>
						<?php } ?>
					</div>

					<div class="">
						<form action="internoaudio.php" class="enrolamiento" method="GET">
							<input type="hidden" name="id" value="<?php echo $interno['idInterno']; ?>" />
							<button type="submit" class="btn btn-block btn-success"><i class="fa fa-microphone mr-1"></i> Capturar Audio</button>
						</form>

						<button type="button" id="btnSubirAudioWav" class="btn btn-block btn-outline-success mt-2">
							<i class="fa fa-upload mr-1"></i> Subir Audio WAV
						</button>
						<input type="file" id="fileSubirAudio" accept=".wav,audio/wav" style="display:none">

						<!-- Panel de revisión — aparece tras seleccionar archivo -->
						<div id="panelRevisionAudio" style="display:none; margin-top:12px; padding:10px; border:1px solid #c3dafe; border-radius:8px; background:#f0f4ff;">
							<p class="mb-1" style="font-size:12px; color:#3b4f7c; font-weight:600;"><i class="fa fa-headphones mr-1"></i> Revisar antes de aprobar:</p>
							<audio id="audioRevision" controls style="width:100%; margin-bottom:8px;"></audio>
							<button type="button" id="btnAprobarAudio" class="btn btn-sm btn-success btn-block mb-1">
								<i class="fa fa-check mr-1"></i> Aprobar
							</button>
							<button type="button" id="btnDescartarAudio" class="btn btn-sm btn-outline-danger btn-block">
								<i class="fa fa-times mr-1"></i> Descartar
							</button>
						</div>

						<a href="internos.php" class="btn btn-primary waves-effect waves-themed btn-block mt-2"> <span class="fa fa-reply mr-1"></span> Regresar</a>
					</div>

					</section>
				<?php } ?>
				<!-- /fin tab Voz -->



			</div>
		</section>


	</div>
</main>


<?php if (isset($_GET['ids'])) { ?>
	<script type="text/javascript" src="./js/jquery.jplayer.min.js"></script>
	<script type="text/javascript">
		$(document).ready(function() {
			$('#txtPorFecha').datepicker({
				dateFormat: 'yy-mm-dd',
				language: 'es'
			});
			$('#contenedor_grabacion #slcArchivo').select2();
			$("#jquery_jplayer_1").jPlayer({
				ready: function() {
					$(this).jPlayer("setMedia", {
						wav: "<?php echo $audioFile; ?>"
					});
				},
				swfPath: "js",
				supplied: "wav",
				wmode: "window"
			});

			$(".descartar-audio").click(function() {
				console.log(this)
			});
		});
	</script>
<?php } ?>

<?php
//$_SESSION['tokenaudio'] = ''; 
?>

<?php include(FOLDER_HTML . 'include/footer.php'); ?>