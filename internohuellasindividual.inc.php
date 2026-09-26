<?php

#----------------------------------------------------------------------------------------------------------------------#
#----------------------------------------------------Nivel de Acceso---------------------------------------------------#
#----------------------------------------------------------------------------------------------------------------------#

#----------------------------------------------------------------------------------------------------------------------#
#-------------------------------------------------------Includes-------------------------------------------------------#
#----------------------------------------------------------------------------------------------------------------------#





#----------------------------------------------------------------------------------------------------------------------#
#-------------------------------------------------------Funciones------------------------------------------------------#
#----------------------------------------------------------------------------------------------------------------------#
function base64_encode_image($filename = string, $filetype = string)
{
    if ($filename && is_file($filename) && filesize($filename) > 0) {
        $imgbinary = fread(fopen($filename, "r"), filesize($filename));
        return base64_encode($imgbinary);
    }
    return '';
}

function base64_to_jpeg($base64_string, $output_file)
{
	// open the output file for writing
	$ifp = fopen($output_file, 'wb');

	// split the string on commas
	// $data[ 0 ] == "data:image/png;base64"
	// $data[ 1 ] == <actual base64 string>
	$data = explode(',', $base64_string);

	// we could add validation here with ensuring count( $data ) > 1
	fwrite($ifp, base64_decode($data[1]));

	// clean up the file resource
	fclose($ifp);

	return $output_file;
}

function compararHuellas($pulgar_izquierdo, $pulgar_derecho, $id_interno)
{
	$r = new xajaxResponse();
	$filtros = array(
		array(
			'parametros' => $id_interno
		)
	);
	$respuesta = api_rpp("getInterno", $filtros, 0, 0, "");
	$pulgar_izquierdo = '';
	$pulgar_derecho = '';
	if (!empty($respuesta->registro)) {
		$interno = (array)$respuesta->registro;
		$pulgar_izquierdo = $interno['pulgar_mano_izquierda'];
		$pulgar_derecho = $interno['pulgar_mano_derecha'];
	}

	$url = AWARE_HUELLAS . "identify/internos_fp/";

	$base64izquierdo = base64_encode_image(BASE_INCLUDE . 'html/huellas/' . $pulgar_izquierdo, 'jpg');
	$base64derecho = base64_encode_image(BASE_INCLUDE . 'html/huellas/' . $pulgar_derecho, 'jpg');

	$arreglo = array(
		"probe" => array(
			"RIGHT_THUMB" => array(
				"image" => $base64derecho,
				"impression_type" => "PLAIN"
			),
			"LEFT_THUMB" => array(
				"image" => $base64izquierdo,
				"impression_type" => "PLAIN"
			)
		),
		"workflow" => array(
			"comparator" => array(
				"algorithm" => "D900",
				"fingerprint_types" => array(
					"LEFT_THUMB",
					"RIGHT_THUMB"
				)
			)
		),
		"candidate_list_size" => 1
	);

	$json = json_encode($arreglo);
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_HEADER, FALSE);
	curl_setopt($ch, CURLINFO_HEADER_OUT, FALSE);
	curl_setopt($ch, CURLOPT_VERBOSE, true);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_POST, true);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $json);
	$response = curl_exec($ch);
	curl_close($ch);
	$result = json_decode($response);
	if (isset($result->candidate_list[0]->id)) {
		$id_interno_encontrado = $result->candidate_list[0]->id;
		$porcentaje = $result->candidate_list[0]->score_percent;
		if ($id_interno_encontrado != '' && $porcentaje >= 90) {
			$interno_encontrado = array();
			$filtros = array(
				array(
					'parametros' => $id_interno_encontrado
				)
			);
			$respuesta = api_rpp("getInterno", $filtros, 0, 0, "");
			if (!empty($respuesta->registro)) {
				$interno_encontrado = (array)$respuesta->registro;
			}
			if ($interno_encontrado['frontal'] != '') {
				$frontal = '<img style="width:100%;" class="img-responsive" src="/rostros/' . $interno_encontrado['frontal'] . '" />';
			} else {
				$frontal = '';
			}
			$nombre = $interno_encontrado['apellido_paterno'] . " " . $interno_encontrado["apellido_materno"] . " " . $interno_encontrado['primer_nombre'];
			$r->call("mostrarAvisoHTML", $frontal . "Se ha encontrado un interno enrolado anteriormente: " . $nombre);
			return $r;
			return $r;
		} else {
			$r->ocultarMensaje();
			$r->call("enrolarHuellas", $id_interno);
			return $r;
		}
	} else {
		$r->ocultarMensaje();
		$r->call("enrolarHuellas", $id_interno);
		return $r;
	}
}

function enrolarHuellas($pulgar_izquierdo, $pulgar_derecho, $id_interno)
{
	$r = new xajaxResponse();
	$filtros = array(
		array(
			'parametros' => $id_interno
		)
	);
	$respuesta = api_rpp("getInterno", $filtros, 0, 0, "");
	$pulgar_izquierdo = '';
	$pulgar_derecho = '';
	if (!empty($respuesta->registro)) {
		$interno = (array)$respuesta->registro;
		$pulgar_izquierdo = $interno['pulgar_mano_izquierda'];
		$pulgar_derecho = $interno['pulgar_mano_derecha'];
	}
	$url = AWARE_HUELLAS . "add/internos_fp/";
	$base64izquierdo = base64_encode_image(BASE_INCLUDE . 'html/huellas/' . $pulgar_izquierdo, 'jpg');
	$base64derecho = base64_encode_image(BASE_INCLUDE . 'html/huellas/' . $pulgar_derecho, 'jpg');
	$arreglo = array(
		"encounter" => array(
			"LEFT_THUMB" => array(
				"image" => $base64izquierdo,
				"impression_type" => "PLAIN"
			),
			"RIGHT_THUMB" => array(
				"image" => $base64derecho,
				"impression_type" => "PLAIN"
			),
			"id" => $id_interno
		)
	);
	$json = json_encode($arreglo);
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_HEADER, FALSE);
	curl_setopt($ch, CURLINFO_HEADER_OUT, FALSE);
	curl_setopt($ch, CURLOPT_VERBOSE, true);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_POST, true);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $json);
	$response = curl_exec($ch);
	curl_close($ch);
	$result = json_decode($response);
	if ($result->id == $id_interno) {
		$atributos = array(
			"id_interno" => $id_interno,
			"huella_huellas" => 'si'
		);
		$respuesta = post_api_rpp("putHuellaHuellas", $atributos);
		$r->call("mostrarExito", "La información se agregó con éxito", "internos.php");
	}
	return $r;
}

#----------------------------------------------------------------------------------------------------------------------#
#-----------------------------------------------------Seccion AJAX-----------------------------------------------------#
#----------------------------------------------------------------------------------------------------------------------#

$xajax = new xajax();

function guardarHuellas($id_interno, $capturados, $huellas)
{
	$r = new xajaxResponse();

	$clave_pulgar_izquierdo = array_search('pulgar_mano_izquierda', $capturados);
	$clave_pulgar_derecho = array_search('pulgar_mano_derecha', $capturados);
	$pulgar_izquierdo_real = '';
	$pulgar_derecho_real = '';
	if ($clave_pulgar_izquierdo != '') {
		$pulgar_izquierdo_real = $huellas[$clave_pulgar_izquierdo];
	}
	if ($clave_pulgar_derecho != '') {
		$pulgar_derecho_real = $huellas[$clave_pulgar_derecho];
	}
	if ($pulgar_izquierdo_real == '' && $pulgar_derecho_real != '') {
		$pulgar_izquierdo_real = $pulgar_derecho_real;
	} else if ($pulgar_izquierdo_real != '' && $pulgar_derecho_real == '') {
		$pulgar_derecho_real = $pulgar_izquierdo_real;
	}
	if ($pulgar_izquierdo_real != '' && $pulgar_derecho_real != '') {
		$respuesta = compararHuellas($pulgar_izquierdo_real, $pulgar_derecho_real, $id_interno);
	} else {
		$respuesta = '';
	}

	$arreglo_huellas_capturadas = array();
	foreach ($huellas as $key => $huella) {
		base64_to_jpeg($huella, '../../huellas/' . $id_interno . '_dedo_' . $key . '.jpg');
		$arreglo_huellas_capturadas[] = $id_interno . '_dedo_' . $key . '.jpg';
	}
	$id_registro = 0;
	$cadena_update = "";
	$huella_huellas = 'no';
	$id_interno_huellas = $id_interno;
	$filtros = array(
		array(
			'parametros' => $id_interno
		)
	);
	$respuestaInterno = api_rpp("getInterno", $filtros, 0, 0, "");
	if (!empty($respuestaInterno->registro)) {
		$interno = (array)$respuestaInterno->registro;
		$id_registro = $interno['id_interno_huella'];
		$huella_huellas = $interno['huella_huellas'];
	}
	if ($id_registro > 0) {
		$contador = 0;
		foreach ($capturados as $key => $capturado) {
			$arreglo[$capturado] = $arreglo_huellas_capturadas[$key];
			$contador++;
		}
		$arreglo['fecha_alta'] = date('Y-m-d H:i:s');
		$arreglo['estatus'] = 'activo';
		$atributos = array(
			"id_usuario_real" => $_SESSION['id_usuario'],
			"atributos" => $arreglo,
			"tabla" => 'interno_huellas',
			"id_registro" => $id_registro,
			"id_interno" => $id_interno
		);
		$id_interno = post_api_rpp("putHuellas", $atributos);
	} else {
		$arreglo = array();
		foreach ($capturados as $key => $capturado) {
			$arreglo[$capturado] = $arreglo_huellas_capturadas[$key];
		}
		$arreglo['fecha_alta'] = date('Y-m-d H:i:s');
		$arreglo['estatus'] = 'activo';
		$atributos = array(
			"id_usuario_real" => $_SESSION['id_usuario'],
			"atributos" => $arreglo,
			"tabla" => 'interno_huellas',
			"id_interno" => $id_interno
		);
		$id_interno = post_api_rpp("postHuellas", $atributos);
	}
	if ($huella_huellas == 'si' && $respuesta == '') {
		$url = AWARE_HUELLAS . "delete/internos_fp/";
		$arreglo = array(
			"id" => $id_interno
		);
		$json = json_encode($arreglo);
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_HEADER, FALSE);
		curl_setopt($ch, CURLINFO_HEADER_OUT, FALSE);
		curl_setopt($ch, CURLOPT_VERBOSE, true);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_POST, true);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $json);
		$response = curl_exec($ch);
		curl_close($ch);
		$result = json_decode($response);
		$atributos = array(
			"id_interno" => $id_interno,
			"huella_huellas" => 'no'
		);
		$respuesta = post_api_rpp("putHuellaHuellas", $atributos);
	}
	if ($respuesta != '') {
		$r->call("mostrarExitoHTML", $respuesta, "internos.php");
		return $r;
	} else {
		if (verificar_licencia_enrolamiento() == 'si') {
			//enrolarHuellas($huellas[8], $huellas[9], $id_interno);
			enrolarHuellas($pulgar_izquierdo_real, $pulgar_derecho_real, $id_interno);
		}
		$r->call("mostrarExito", "Las huellas se registraron con éxito", "internos.php");
	}
	return $r;
}
$xajax->registerFunction("guardarHuellas");

function guardarHuellasContinuar($id_interno, $capturados, $huellas, $siguiente)
{
	$r = new xajaxResponse();
	$clave_pulgar_izquierdo = array_search('pulgar_mano_izquierda', $capturados);
	$clave_pulgar_derecho = array_search('pulgar_mano_derecha', $capturados);
	$pulgar_izquierdo_real = '';
	$pulgar_derecho_real = '';
	if ($clave_pulgar_izquierdo != '') {
		$pulgar_izquierdo_real = $huellas[$clave_pulgar_izquierdo];
	}
	if ($clave_pulgar_derecho != '') {
		$pulgar_derecho_real = $huellas[$clave_pulgar_derecho];
	}
	if ($pulgar_izquierdo_real == '' && $pulgar_derecho_real != '') {
		$pulgar_izquierdo_real = $pulgar_derecho_real;
	} else if ($pulgar_izquierdo_real != '' && $pulgar_derecho_real == '') {
		$pulgar_derecho_real = $pulgar_izquierdo_real;
	}
	if ($pulgar_izquierdo_real != '' && $pulgar_derecho_real != '') {
		$respuesta = compararHuellas($pulgar_izquierdo_real, $pulgar_derecho_real, $id_interno);
	} else {
		$respuesta = '';
	}
	$arreglo_huellas_capturadas = array();
	foreach ($huellas as $key => $huella) {
		base64_to_jpeg($huella, '../../huellas/' . $id_interno . '_dedo_' . $key . '.jpg');
		$arreglo_huellas_capturadas[] = $id_interno . '_dedo_' . $key . '.jpg';
	}
	$id_registro = 0;
	$cadena_update = "";
	$huella_huellas = 'no';
	$id_interno_huellas = $id_interno;
	$filtros = array(
		array(
			'parametros' => $id_interno
		)
	);
	$respuestaInterno = api_rpp("getInterno", $filtros, 0, 0, "");
	if (!empty($respuestaInterno->registro)) {
		$interno = (array)$respuestaInterno->registro;
		$id_registro = $interno['id_interno_huella'];
		$huella_huellas = $interno['huella_huellas'];
	}
	if ($id_registro > 0) {
		$arreglo = array();
		$contador = 0;
		foreach ($capturados as $key => $capturado) {
			$arreglo[$capturado] = $arreglo_huellas_capturadas[$key];
			$contador++;
		}
		$arreglo['fecha_alta'] = date('Y-m-d H:i:s');
		$arreglo['estatus'] = 'activo';
		$atributos = array(
			"id_usuario_real" => $_SESSION['id_usuario'],
			"atributos" => $arreglo,
			"tabla" => 'interno_huellas',
			"id_registro" => $id_registro,
			"id_interno" => $id_interno
		);
		$id_interno = post_api_rpp("putHuellas", $atributos);
	} else {
		$arreglo = array();
		foreach ($capturados as $key => $capturado) {
			$arreglo[$capturado] = $arreglo_huellas_capturadas[$key];
		}
		$arreglo['fecha_alta'] = date('Y-m-d H:i:s');
		$arreglo['estatus'] = 'activo';
		$atributos = array(
			"id_usuario_real" => $_SESSION['id_usuario'],
			"atributos" => $arreglo,
			"tabla" => 'interno_huellas',
			"id_interno" => $id_interno
		);
		$id_interno = post_api_rpp("postHuellas", $atributos);
	}
	if ($huella_huellas == 'si' && $respuesta == '') {
		$url = AWARE_HUELLAS . "delete/internos_fp/";
		$arreglo = array(
			"id" => $id_interno
		);
		$json = json_encode($arreglo);
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_HEADER, FALSE);
		curl_setopt($ch, CURLINFO_HEADER_OUT, FALSE);
		curl_setopt($ch, CURLOPT_VERBOSE, true);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_POST, true);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $json);
		$response = curl_exec($ch);
		curl_close($ch);
		$result = json_decode($response);
		$atributos = array(
			"id_interno" => $id_interno,
			"huella_huellas" => 'no'
		);
		$respuesta = post_api_rpp("putHuellaHuellas", $atributos);
	}
	if ($respuesta != '') {
		$r->call("mostrarExitoHTML", $respuesta, $siguiente);
		return $r;
	} else {
		if (verificar_licencia_enrolamiento() == 'si') {
			//enrolarHuellas($huellas[8], $huellas[9], $id_interno);
			enrolarHuellas($pulgar_izquierdo_real, $pulgar_derecho_real, $id_interno);

		}
		$r->call("mostrarExito", "Las huellas se registraron con éxito", $siguiente);
	}
	return $r;
}
$xajax->registerFunction("guardarHuellasContinuar");

$xajax->processRequest();

#----------------------------------------------------------------------------------------------------------------------#
#---------------------------------------------Procesamiento de formulario----------------------------------------------#
#----------------------------------------------------------------------------------------------------------------------#


#----------------------------------------------------------------------------------------------------------------------#
#---------------------------------------------Inicializacion de variables----------------------------------------------#
#----------------------------------------------------------------------------------------------------------------------#

if (isset($_GET['id'])) {
	$_POST['id'] = $_GET['id'];
}
$actual = 0;
$siguiente = '';
$filtros = array(
	array(
		'parametros' => basename($_SERVER["SCRIPT_FILENAME"])
	)
);
$respuesta = api_rpp("getConfiguracionOrdenCapturaPagina", $filtros, 0, 0, "");
if (!empty($respuesta->registros)) {
	foreach ($respuesta->registros as $row_enrol) {
		$row = (array)$row_enrol;
		$actual = $row['paso'];
	}
}

$filtros = array(
	array(
		'parametros' => $actual
	)
);
$respuesta = api_rpp("getConfiguracionOrdenCapturaPagina", $filtros, 0, 0, "");
if (!empty($respuesta->registros)) {
	foreach ($respuesta->registros as $row_enrol) {
		$row = (array)$row_enrol;
		$siguiente = $row['pagina'];
	}
}

$huellas_a_capturar = array();
$iris_a_capturar = array();
$filtros = array(
	array(
		'parametros' => 'interno_huella,extra'
	)
);
$respuesta = api_rpp("getConfiguracionCamposInternosMostrar", $filtros, 0, 0, "");
if (!empty($respuesta->registros)) {
	foreach ($respuesta->registros as $row_enrol) {
		$row = (array)$row_enrol;
		$huellas_a_capturar[] = $row;
	}
}


#----------------------------------------------------------------------------------------------------------------------#
#-------------------------------------------------Salida de Javascript-------------------------------------------------#
#----------------------------------------------------------------------------------------------------------------------#
