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


#----------------------------------------------------------------------------------------------------------------------#
#-----------------------------------------------------Seccion AJAX-----------------------------------------------------#
#----------------------------------------------------------------------------------------------------------------------#

$xajax = new xajax();

function guardarPerfil($id_interno, $imagen)
{
    $r = new xajaxResponse();
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
    $rostro = base64_to_jpeg($imagen, '../../rostros/' . $id_interno . '_perfil_izquierdo.jpg');
    if ($id_registro > 0) {
        $atributos = array(
            "id_usuario_real" => $_SESSION['id_usuario'],
            "id_interno" => $id_interno,
            "id_interno_rostro" => $id_registro,
            "tipo" => "perfil_izquierdo",
            "nombre" => $id_interno . '_perfil_izquierdo.jpg'
        );
        $respuesta = post_api_rpp("putRostro", $atributos);
    } else {
        $atributos = array(
            "id_usuario_real" => $_SESSION['id_usuario'],
            "id_interno" => $id_interno,
            "tipo" => "perfil_izquierdo",
            "nombre" => $id_interno . '_perfil_izquierdo.jpg'
        );
        $respuesta = post_api_rpp("postRostro", $atributos);
    }
    $r->call("mostrarExito", "La información se registró con éxito", "internos.php");
    return $r;
}
$xajax->registerFunction("guardarPerfil");

function guardarPerfilContinuar($id_interno, $imagen, $siguiente)
{
    $r = new xajaxResponse();
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
    $rostro = base64_to_jpeg($imagen, '../../rostros/' . $id_interno . '_perfil_izquierdo.jpg');
    if ($id_registro > 0) {
        $atributos = array(
            "id_usuario_real" => $_SESSION['id_usuario'],
            "id_interno" => $id_interno,
            "id_interno_rostro" => $id_registro,
            "tipo" => "perfil_izquierdo",
            "nombre" => $id_interno . '_perfil_izquierdo.jpg'
        );
        $respuesta = post_api_rpp("putRostro", $atributos);
    } else {
        $atributos = array(
            "id_usuario_real" => $_SESSION['id_usuario'],
            "id_interno" => $id_interno,
            "tipo" => "perfil_izquierdo",
            "nombre" => $id_interno . '_perfil_izquierdo.jpg'
        );
        $respuesta = post_api_rpp("postRostro", $atributos);
    }
    $r->call("mostrarExito", "La información se registró con éxito", $siguiente);
    return $r;
}
$xajax->registerFunction("guardarPerfilContinuar");

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
