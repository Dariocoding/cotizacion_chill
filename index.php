<?php 

include ("Config/Config.php");
include ("Helpers/Helpers.php");

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');


// Si no enviamos un parametro desde la url, asignamos un controlador principal
$url = !empty($_GET['url']) ? $_GET['url'] : 'home/home' ;
// Convertimos la cadena de texto en un array
$arrUrl = explode('/',$url);

// Capturamos el controlador
$controller = $arrUrl[0];
// Capturamos el metodo
$method = $arrUrl[0];

$params = "";

if(!empty($arrUrl[1])) 
{
    if($arrUrl[1] != "")
    {
        $method = $arrUrl[1];
    }
}

// Verificamos si no esta vacio la posicion 2
// Si no está vacio le asignamos valor al parametro
if(!empty($arrUrl[2]))
{
    if($arrUrl[2] != "")
    {
        for ($i=2; $i < count($arrUrl) ; $i++) {
            $params .= $arrUrl[$i].','; 
            
        }
        // Eliminamos la ultima coma
        $params = trim($params, ',');
    }
}

require_once("Libraries/Core/Autoload.php");

require_once("Libraries/Core/Load.php");