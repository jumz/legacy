<?php
//error_reporting(E_ALL);
ini_set("display_errors", "1");
ini_set('memory_limit', '-1');
ini_set('max_execution_time', 0);
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

function enrolarIris($izquierdo, $derecho, $id_interno)
{
    $r = new xajaxResponse();
    $filtros = array(
        array(
            'parametros' => $id_interno
        )
    );
    $respuesta = api_rpp("getInterno", $filtros, 0, 0, "");
    $iris_izquierdo = '';
    $iris_derecho = '';
    if (!empty($respuesta->registro)) {
        $interno = (array)$respuesta->registro;
        $iris_izquierdo = $interno['iris_izquierdo'];
        $iris_derecho = $interno['iris_derecho'];
    }
    $url = AWARE_IRIS . "add/internos_iris/";
    $base64izquierdo = base64_encode_image(BASE_INCLUDE . 'html/iris/' . $iris_izquierdo, 'jpg');
    $base64derecho = base64_encode_image(BASE_INCLUDE . 'html/iris/' . $iris_derecho, 'jpg');
    $arreglo = array(
        "encounter" => array(
            "INFRARED_LEFT" => $base64izquierdo,
            "INFRARED_RIGHT" => $base64derecho,
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
            "huella_iris" => 'si'
        );
        $respuesta = post_api_rpp("putIrisHuella", $atributos);
        $r->call("mostrarExito", "La informaci贸n se agreg贸 con 茅xito", "internos.php");
    }
    return $r;
}

function compararIris($izquierdo, $derecho, $id_interno)
{
    $r = new xajaxResponse();
    $filtros = array(
        array(
            'parametros' => $id_interno
        )
    );
    $respuesta = api_rpp("getInterno", $filtros, 0, 0, "");
    $iris_izquierdo = '';
    $iris_derecho = '';
    if (!empty($respuesta->registro)) {
        $interno = (array)$respuesta->registro;
        $iris_izquierdo = $interno['iris_izquierdo'];
        $iris_derecho = $interno['iris_derecho'];
    }
    $url = AWARE_IRIS . "identify/internos_iris/";
    $base64izquierdo = base64_encode_image(BASE_INCLUDE . 'html/iris/' . $iris_izquierdo, 'jpg');
    $base64derecho = base64_encode_image(BASE_INCLUDE . 'html/iris/' . $iris_derecho, 'jpg');
    $arreglo = array(
        "probe" => array(
            "INFRARED_LEFT" => $base64izquierdo,
            "INFRARED_RIGHT" => $base64derecho
        ),
        "workflow" => array(
            "comparator" => array(
                "algorithm" => "I500",
                "irisTypes" => array(
                    "INFRARED_LEFT",
                    "INFRARED_RIGHT"
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

    if (isset($result->candidateList[0]->id)) {
        $id_interno_encontrado = $result->candidateList[0]->id;
        $porcentaje = $result->candidateList[0]->scorePercent;
        if ($id_interno_encontrado != '' && $porcentaje >= 90) {
            $interno_encontrado = array();
            $filtros = array(
                array(
                    'parametros' => $id_interno_encontrado
                )
            );
            $respuesta = api_rpp("getInterno", $filtros, 0, 0, "");
            $rostro = '';
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
        }
    } else {
        $r->ocultarMensaje();
        $r->call("enrolarIris", $id_interno);
        return $r;
    }
}

#----------------------------------------------------------------------------------------------------------------------#
#-----------------------------------------------------Seccion AJAX-----------------------------------------------------#
#----------------------------------------------------------------------------------------------------------------------#

$xajax = new xajax();

function guardarIris($id_interno, $capturados, $iris_izquierdo, $iris_derecho)
{
    $r = new xajaxResponse();
    if (strpos($iris_izquierdo, 'empty_image_white.png') !== false) {
	$iris_izquierdo = '';
    }
    if (strpos($iris_derecho, 'empty_image_white.png') !== false) {
       $iris_derecho = '';
    }
    $iris_izquierdo_real = $iris_izquierdo;
    $iris_derecho_real = $iris_derecho;
    if ($iris_izquierdo != '' && $iris_derecho == '') {
        $iris_derecho = $iris_izquierdo;
    } else if ($iris_derecho != '' && $iris_izquierdo == '') {
        $iris_izquierdo = $iris_derecho;
    }
    $respuesta = compararIris($iris_izquierdo, $iris_derecho, $id_interno);
    $id_registro = 0;
    $huella_iris = 'no';
    $id_interno_iris = $id_interno;
    $filtros = array(
        array(
            'parametros' => $id_interno
        )
    );
    $respuesta_interno_rostro = api_rpp("getInternoRostro", $filtros, 0, 0, "");
    if (!empty($respuesta_interno_rostro->registro)) {
        $row = (array)$respuesta_interno_rostro->registro;
        $id_registro = $row['id_interno_rostro'];
        $huella_iris = 'si';
    }
    $iris_izquierdo = $iris_izquierdo_real;
    $iris_derecho = $iris_derecho_real;
    $iris_izquierdo_bd = '';
    $iris_derecho_bd = '';
    $izquierdo = '';
    $derecho = '';
    if ($iris_izquierdo != '') {
        $izquierdo = base64_to_jpeg($iris_izquierdo, '../../iris/' . $id_interno . '_iris_izquierdo.jpg');
        $iris_izquierdo_bd = $id_interno . '_iris_izquierdo.jpg';
    }
    if ($iris_derecho != '') {
        $derecho = base64_to_jpeg($iris_derecho, '../../iris/' . $id_interno . '_iris_derecho.jpg');
        $iris_derecho_bd = $id_interno . '_iris_derecho.jpg';
    }
    if ($id_registro > 0) {
        $atributos = array(
            "id_usuario_real" => $_SESSION['id_usuario'],
            "id_interno" => $id_interno,
            "id_interno_rostro" => $id_registro,
            "tipo_uno" => "iris_izquierdo",
            "nombre_uno" => $iris_izquierdo_bd,
            "tipo_dos" => "iris_derecho",
            "nombre_dos" => $iris_derecho_bd
        );
        $respuesta = post_api_rpp("putIris", $atributos);
    } else {
        $atributos = array(
            "id_usuario_real" => $_SESSION['id_usuario'],
            "id_interno" => $id_interno,
            "tipo_uno" => "iris_izquierdo",
            "nombre_uno" => $iris_izquierdo_bd,
            "tipo_dos" => "iris_derecho",
            "nombre_dos" => $iris_derecho_bd
        );
        $respuesta = post_api_rpp("postIris", $atributos);
    }
    if ($huella_iris == 'si' && $respuesta == '') {
        $url = AWARE_IRIS . "add/internos_iris/";

        $arreglo = array(
            "id" => $id_interno_iris
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
            "id_interno" => $id_interno_iris,
            "huella_rostro" => 'no'
        );
        $respuesta = post_api_rpp("putRostroHuella", $atributos);
    }
    if ($respuesta != '') {
        $r->call("mostrarExitoHTML", $respuesta, "internos.php");
        return $r;
    } else {
        if (verificar_licencia_enrolamiento() == 'si') {
            enrolarIris($iris_izquierdo, $iris_derecho, $id_interno_iris);
        }
        $r->call("mostrarExito", "La informaci贸n se registr贸 con 茅xito", "internos.php");
    }
    return $r;
}
$xajax->registerFunction("guardarIris");

function guardarIrisContinuar($id_interno, $capturados, $iris_izquierdo, $iris_derecho, $siguiente)
{
    $r = new xajaxResponse();
    // Despu閟
    if (strpos($iris_izquierdo, 'empty_image_white.png') !== false) {
        $iris_izquierdo = '';
    }
    if (strpos($iris_derecho, 'empty_image_white.png') !== false) {
        $iris_derecho = '';
    }
    $iris_izquierdo_real = $iris_izquierdo;
    $iris_derecho_real = $iris_derecho;
    if ($iris_izquierdo != '' && $iris_derecho == '') {
        $iris_derecho = $iris_izquierdo;
    } else if ($iris_derecho != '' && $iris_izquierdo == '') {
        $iris_izquierdo = $iris_derecho;
    }
    $respuesta = compararIris($iris_izquierdo, $iris_derecho, $id_interno);
    $id_registro = 0;
    $huella_iris = 'no';
    $id_interno_iris = $id_interno;
    $filtros = array(
        array(
            'parametros' => $id_interno
        )
    );
    $respuesta_interno_rostro = api_rpp("getInternoRostro", $filtros, 0, 0, "");
    if (!empty($respuesta_interno_rostro->registro)) {
        $row = (array)$respuesta_interno_rostro->registro;
        $id_registro = $row['id_interno_rostro'];
        $huella_iris = 'si';
    }
    $iris_izquierdo = $iris_izquierdo_real;
    $iris_derecho = $iris_derecho_real;
    $iris_izquierdo_bd = '';
    $iris_derecho_bd = '';
    $izquierdo = '';
    $derecho = '';
    if ($iris_izquierdo != '') {
        $izquierdo = base64_to_jpeg($iris_izquierdo, '../../iris/' . $id_interno . '_iris_izquierdo.jpg');
        $iris_izquierdo_bd = $id_interno . '_iris_izquierdo.jpg';
    }
    if ($iris_derecho != '') {
        $derecho = base64_to_jpeg($iris_derecho, '../../iris/' . $id_interno . '_iris_derecho.jpg');
        $iris_derecho_bd = $id_interno . '_iris_derecho.jpg';
    }
    if ($id_registro > 0) {
        $atributos = array(
            "id_usuario_real" => $_SESSION['id_usuario'],
            "id_interno" => $id_interno,
            "id_interno_rostro" => $id_registro,
            "tipo_uno" => "iris_izquierdo",
            "nombre_uno" => $iris_izquierdo_bd,
            "tipo_dos" => "iris_derecho",
            "nombre_dos" => $iris_derecho_bd
        );
        $respuesta = post_api_rpp("putIris", $atributos);        
    } else {
        $atributos = array(
            "id_usuario_real" => $_SESSION['id_usuario'],
            "id_interno" => $id_interno,
            "tipo_uno" => "iris_izquierdo",
            "nombre_uno" => $iris_izquierdo_bd,
            "tipo_dos" => "iris_derecho",
            "nombre_dos" => $iris_derecho_bd
        );
        $respuesta = post_api_rpp("postIris", $atributos);        
    }
    if ($huella_iris == 'si' && $respuesta == '') {
        $url = AWARE_IRIS . "add/internos_iris/";

        $arreglo = array(
            "id" => $id_interno_iris
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
            "id_interno" => $id_interno_iris,
            "huella_rostro" => 'no'
        );
        $respuesta = post_api_rpp("putRostroHuella", $atributos);
    }
    if ($respuesta != '') {
        $r->call("mostrarExitoHTML", $respuesta, $siguiente);
        return $r;
    } else {
        if (verificar_licencia_enrolamiento() == 'si') {
            enrolarIris($iris_izquierdo, $iris_derecho, $id_interno_iris);
        }
        $r->call("mostrarExito", "La informaci贸n se registr贸 con 茅xito", $siguiente);
    }
    return $r;
}
$xajax->registerFunction("guardarIrisContinuar");

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

if (!empty($respuesta->registro)) {
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
if (!empty($respuesta->registro)) {
    $row = (array)$respuesta->registro;
    $siguiente = $row['pagina'];
}

###################################################
###################################################

$iris_a_capturar = array();
$filtros = array(
    array(
        'parametros' => 'interno_iris'
    )
);
$respuesta = api_rpp("getConfiguracionCamposInternosMostrar", $filtros, 0, 0, "");
if (!empty($respuesta->registros)) {
    foreach ($respuesta->registros as $row_enrol) {
        $row = (array)$row_enrol;
        $iris_a_capturar[] = $row;
    }
}

#----------------------------------------------------------------------------------------------------------------------#
#-------------------------------------------------Salida de Javascript-------------------------------------------------#
#----------------------------------------------------------------------------------------------------------------------#
