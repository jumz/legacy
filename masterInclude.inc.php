<?php

if (!defined("ORIGEN"))
	define("ORIGEN", $_SERVER['HTTP_HOST']);

date_default_timezone_set("America/Mexico_City");

require_once LIB_XAJAX;
require_once FOLDER_INCLUDE . 'model/clsBasicCommon.inc.php';

$f = explode("/", $_SERVER['PHP_SELF']);
$f = $f[count($f) - 1];

$__FILE_NAME__ = str_replace(array("/", ".php"), "", $f);


if (is_file(FOLDER_INCLUDE . "controler/" . $__FILE_NAME__ . ".inc.php")) {
	require_once(FOLDER_INCLUDE . "controler/" . $__FILE_NAME__ . ".inc.php");
}

if (!isset($_JAVASCRIPT_CSS)) {
	$_JAVASCRIPT_CSS = '';
}

$_JAVASCRIPT_CSS .= ' <script language="javascript" src="' . URL_JAVASCRIPT_LIB . 'common.js"></script>';
if (isset($xajax)) {
	$_JAVASCRIPT_CSS .= $xajax->getJavascript($path_app . "js/lib/");
}

if (is_file(FOLDER_JS . $__FILE_NAME__ . ".js")) {
	$_JAVASCRIPT_CSS .= '<script type="text/javascript" src="' . URL_JAVASCRIPT_SYSTEM . $__FILE_NAME__ . '.js"></script>';
}

if (isset($_JAVASCRIPT_OUT)) {
	$_JAVASCRIPT_CSS .= '<script type="text/javascript">' . $_JAVASCRIPT_OUT . '</script>';
}
