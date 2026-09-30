<?php
error_reporting(E_ALL);
ini_set("display_errors", "1");
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
    if ($filename) {
        $imgbinary = fread(fopen($filename, "r"), filesize($filename));
        return base64_encode($imgbinary);
    }
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

function enrolarRostro($rostro, $id_interno)
{
    $r = new xajaxResponse();
    $filtros = array(
        array(
            'parametros' => $id_interno
        )
    );
    $respuesta = api_rpp("getInterno", $filtros, 0, 0, "");
    $rostro = '';
    if (!empty($respuesta->registro)) {
        $interno = (array)$respuesta->registro;
        $rostro = $interno['frontal'];
    }
    $url = AWARE_ROSTRO . "add/internos_face/";
    $base64rostro = base64_encode_image(BASE_INCLUDE . 'html/rostros/' . $rostro, 'jpg');
    $arreglo = array(
        "encounter" => array(
            "VISIBLE_FRONTAL" => $base64rostro,
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
            "huella_rostro" => 'si'
        );
        $respuesta = post_api_rpp("putRostroHuella", $atributos);
        $r->call("mostrarExito", "La información se agregó con éxito", "internos.php");
    }
    return $r;
}

function compararRostro($rostro, $id_interno)
{
    $r = new xajaxResponse();
    $filtros = array(
        array(
            'parametros' => $id_interno
        )
    );
    $respuesta = api_rpp("getInterno", $filtros, 0, 0, "");
    $rostro = '';
    if (!empty($respuesta->registro)) {
        $interno = (array)$respuesta->registro;
        $rostro = $interno['frontal'];
    }
    $url = AWARE_ROSTRO . "identify/internos_face/";
    $base64rostro = base64_encode_image(BASE_INCLUDE . 'html/rostros/' . $rostro, 'jpg');
    $arreglo = array(
        "probe" => array(
            "VISIBLE_FRONTAL" => $base64rostro
        ),
        "workflow" => array(
            "comparator" => array(
                "algorithm" => "F500",
                "faceTypes" => array(
                    "VISIBLE_FRONTAL"
                )
            )
        ),
        "candidateListSize" => 1
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
    //print_r($result);
    if (isset($result->candidateList[0]->id)) {
        $id_interno_encontrado = $result->candidateList[0]->id;
        $porcentaje = $result->candidateList[0]->scorePercent;
        if ($id_interno_encontrado != '' && $porcentaje >= 90) {
            $filtros = array(
                array(
                    'parametros' => $id_interno_encontrado
                )
            );
            $respuesta = api_rpp("getInterno", $filtros, 0, 0, "");
            $nombre = '';
            $frontal = '';
            if (!empty($respuesta->registro)) {
                $row = (array)$respuesta->registro;
                if ($row['frontal'] != '') {
                    $frontal = '<img class="img-responsive" src="/rostros/' . $row['frontal'] . '" />';
                } else {
                    $frontal = '';
                }
                $nombre = $row['apellido_paterno'] . " " . $row["apellido_materno"] . " " . $row['primer_nombre'];
            }
            $atributos = array(
                "id_interno" => $id_interno,
                "id_interno_duplicado" => $id_interno_encontrado,
                "tipo_biometria" => 'rostro',
                "fecha" => date('Y-m-d H:i:s')
            );
            $respuesta = post_api_rpp("postInternoBiometricoDuplicado", $atributos);
            return $frontal . "<br>Se ha encontrado un interno enrolado anteriormente: " . $nombre;
        } else {
            return "";
        }
    } else {
        return "";
    }
}

#----------------------------------------------------------------------------------------------------------------------#
#-----------------------------------------------------Seccion AJAX-----------------------------------------------------#
#----------------------------------------------------------------------------------------------------------------------#

$xajax = new xajax();

function guardarRostro($id_interno, $imagen)
{
    $r = new xajaxResponse();
    $respuesta = compararRostro($imagen, $id_interno);
    $id_registro = 0;
    $huella_rostro = '';
    $id_interno_rostro = $id_interno;
    $filtros = array(
        array(
            'parametros' => $id_interno
        )
    );
    $respuesta_interno_rostro = api_rpp("getInternoRostro", $filtros, 0, 0, "");
    if (!empty($respuesta_interno_rostro->registro)) {
        $row = (array)$respuesta_interno_rostro->registro;
        $id_registro = $row['id_interno_rostro'];
        $huella_rostro = 'si';
    }
    $rostro = base64_to_jpeg($imagen, '../../rostros/' . $id_interno . '_rostro.jpg');
    if ($id_registro > 0) {
        $atributos = array(
            "id_usuario_real" => $_SESSION['id_usuario'],
            "id_interno" => $id_interno,
            "id_interno_rostro" => $id_registro,
            "tipo" => "frontal",
            "nombre" => $id_interno . '_rostro.jpg'
        );
        $respuesta = post_api_rpp("putRostro", $atributos);
    } else {
        $atributos = array(
            "id_usuario_real" => $_SESSION['id_usuario'],
            "id_interno" => $id_interno,
            "tipo" => "frontal",
            "nombre" => $id_interno . '_rostro.jpg'
        );
        $respuesta = post_api_rpp("postRostro", $atributos);
    }
    if ($huella_rostro == 'si' && $respuesta == '') {
        $url = AWARE_ROSTRO . "delete/internos_face/";

        $arreglo = array(
            "id" => $id_interno_rostro
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
            "huella_rostro" => 'no'
        );
        $respuesta = post_api_rpp("putRostroHuella", $atributos);
    }
    if ($respuesta != '') {
        $r->call("mostrarExitoHTML", $respuesta, "internos.php");
        return $r;
    } else {
        if (verificar_licencia_enrolamiento() == 'si') {
            enrolarRostro($imagen, $id_interno_rostro);
        }
        $r->call("mostrarExito", "La información se registró con éxito", "internos.php");
    }
    return $r;
}
$xajax->registerFunction("guardarRostro");

function guardarRostroContinuar($id_interno, $imagen, $siguiente)
{
    $r = new xajaxResponse();
    $respuesta = compararRostro($imagen, $id_interno);
    $id_registro = 0;
    $id_interno_rostro = $id_interno;
    $huella_rostro = '';
    $filtros = array(
        array(
            'parametros' => $id_interno
        )
    );
    $respuesta_interno_rostro = api_rpp("getInternoRostro", $filtros, 0, 0, "");
    if (!empty($respuesta_interno_rostro->registro)) {
        $row = (array)$respuesta_interno_rostro->registro;
        $id_registro = $row['id_interno_rostro'];
        $huella_rostro = 'si';
    }
    $rostro = base64_to_jpeg($imagen, '../../rostros/' . $id_interno . '_rostro.jpg');
    if ($id_registro > 0) {
        $atributos = array(
            "id_usuario_real" => $_SESSION['id_usuario'],
            "id_interno" => $id_interno,
            "id_interno_rostro" => $id_registro,
            "tipo" => "frontal",
            "nombre" => $id_interno . '_rostro.jpg'
        );
        $respuesta = post_api_rpp("putRostro", $atributos);
    } else {
        $atributos = array(
            "id_usuario_real" => $_SESSION['id_usuario'],
            "id_interno" => $id_interno,
            "tipo" => "frontal",
            "nombre" => $id_interno . '_rostro.jpg'
        );
        $respuesta = post_api_rpp("postRostro", $atributos);
    }
    if ($huella_rostro == 'si' && $respuesta == '') {
        $url = AWARE_ROSTRO . "delete/internos_face/";
        $arreglo = array(
            "id" => $id_interno_rostro
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
            "huella_rostro" => 'no'
        );
        $respuesta = post_api_rpp("putRostroHuella", $atributos);
    }
    if ($respuesta != '') {
        $r->call("mostrarExitoHTML", $respuesta, $siguiente);
        return $r;
    } else {
        if (verificar_licencia_enrolamiento() == 'si') {
            enrolarRostro($imagen, $id_interno_rostro);
        }
        $r->call("mostrarExito", "La información se registró con éxito", $siguiente);
    }
    return $r;
}
$xajax->registerFunction("guardarRostroContinuar");

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
###################################################
#Calculo de siguiente seccion
###################################################

$actual = 0;
$siguiente = '';

$filtros = array(
	array(
		'parametros' => basename($_SERVER["SCRIPT_FILENAME"])
	)
);
/*
$respuesta = api_rpp("getConfiguracionOrdenCapturaPagina", $filtros, 0, 0, "");

#print_r($respuesta );

if (!empty($respuesta->registro))
{
	$row = (array)$respuesta->registro;
	$actual = $row['paso'];
}

#var_dump($actual );

#die();


$filtros = array(
	array(
		'parametros' => $actual
	)
);
*/
$respuesta = api_rpp("getConfiguracionOrdenCapturaPagina", $filtros, 0, 0, "");
if (!empty($respuesta->registro))
{
	$row = (array)$respuesta->registro;
	$siguiente = $row['pagina'];
	
}
###################################################
###################################################


#----------------------------------------------------------------------------------------------------------------------#
#-------------------------------------------------Salida de Javascript-------------------------------------------------#
#----------------------------------------------------------------------------------------------------------------------#
