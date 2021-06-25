<?php 

$controller = ucwords($controller);
// Load // Con este codigo ya comunicamos con los controlladadores
$controllerfile = "Controllers/".$controller.".php";

//Buscamos el controlador
if(file_exists($controllerfile)){
    // Si existe, lo extraemos
    include $controllerfile;
    // Lo instanciamos
    $controller = new $controller();    
    if(method_exists($controller,$method)){
        
        $controller->$method($params);
    }else{
        require_once("Controllers/Error.php");
    }

}else{
    require_once("Controllers/Error.php");

}


?>