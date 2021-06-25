<?php 

// spl_autoload_register() allows you to register multiple functions
spl_autoload_register(function($class){
    if(file_exists("Libraries/".'Core/'.$class.".php")){
        require_once("Libraries/".'Core/'.$class.".php");
    }
});
?>