<?php

function base_url()
{
    return BASE_URL;
}
// Muestra la informacion formateada
function dep($data)
{
    $format = print_r('<pre>');
    $format = print_r($data);
    $format = print_r('</pre>');
    return $format;
}


function media()
{

    return BASE_URL.'/Assets';
}

// Funcion para requerir el HEADER
function headerAdmin($data= '')
{
    $view_header = "Views/Template/header_admin.php";
    include ($view_header);
}
// Funcion para requerir el footer
function footerAdmin($data= '')
{
    $view_footer = 'Views/Template/footer_admin.php';
    include ($view_footer);
}

// Funcion para requerir el HEADER TIENDA
function headerCotizacion($data="")
{
    $view_header = 'Views/Template/header_cotizacion.php';
    include ($view_header);
}
// Funcion para requerir el footer TIENDA
function footerCotizacion($data= '')
{
    $view_footer = 'Views/Template/footer_cotizacion.php';
    include ($view_footer);
}

function getModal(string $nameModal, $data){
    $view_modal = "Views/Template/modals/$nameModal.php";
    include $view_modal;
}
function getFile(string $url, $data){
    ob_start();
    require_once("Views/$url.php");
    $file = ob_get_clean();
    return $file;
}

//Envio de correos
function sendEmail($data,$template)
{
    $asunto = $data['asunto'];
    $emailDestino = $data['email'];
    $empresa = NOMBRE_EMPRESA;
    $remitente = EMAIL_REMITENTE;
    $emailCopia = !empty($data['emailCopia']) ? $data['emailCopia'] : '';
    //ENVIO DE CORREO
    $de = "MIME-Version: 1.0\r\n";
    $de .= "Content-type: text/html; charset=UTF-8\r\n";
    $de .= "From: {$empresa} <{$remitente}>\r\n";
    $de .= "Bcc: $emailCopia\r\n";
    ob_start();
    require_once('Views/Template/Email/'.$template.".php");
    $mensaje = ob_get_clean();
    $send = mail($emailDestino, $asunto, $mensaje, $de);
    return $send;
}

function getPermisos(int $idmodulo){
    require_once ('Models/PermisosModel.php');
    $objPermisos = new PermisosModel();
    $idrol = $_SESSION['userData']['idrol'];
    $arrPermisos = $objPermisos->permisosModulo($idrol);
    $permisos = '';
    $permisosMod = '';
    if(count($arrPermisos) > 0 ){
        $permisos = $arrPermisos;
        $permisosMod = isset($arrPermisos[$idmodulo]) ? $arrPermisos[$idmodulo] : '';
    }
    $_SESSION['permisos'] = $permisos;
    $_SESSION['permisosMod'] = $permisosMod;
}

function sessionUser(int $idpersona){
    include 'Models/LoginModel.php';
    $objLogin = new LoginModel();
    $request = $objLogin->sessionLogin($idpersona);
    return $request;
}

function uploadImage(array $data, string $name){
    $url_temp = $data['tmp_name'];
    $destino = 'Assets/images/uploads/'.$name;
    $move = move_uploaded_file($url_temp,$destino);
    return $move;
}

function deleteFile(string $name){
    unlink('Assets/images/uploads/'.$name);
}
// Eliminar exceso de espacio entre palabras para evitar inyecciones sql y ataques
function strClean($strCadena)
{
    $string = preg_replace(['/\s+/','/^\s|\s$/'], [' ',''], $strCadena);
    $string = trim($string); // Eliminar espacios en blanco al inicio y al final
    $string = stripslashes($string); // Elimina las \ invertidas
    $string = str_ireplace('<script>', '', $string);
    $string = str_ireplace('</script>', '', $string);
    $string = str_ireplace('<script src>', '', $string);
    $string = str_ireplace('<script type=>', '', $string);
    $string = str_ireplace('SELECT * FROM ', '', $string);
    $string = str_ireplace('DELETE FROM', '', $string);
    $string = str_ireplace('INSERT INTO', '', $string);
    $string = str_ireplace('SELECT COUNT(*) FROM', '', $string);
    $string = str_ireplace('DROP TABLE', '', $string);
    $string = str_ireplace("OR '1'='1'", '', $string);
    $string = str_ireplace('OR "1"="1" ', '', $string);
    $string = str_ireplace('OR ??1??=??1??', '', $string);
    $string = str_ireplace('is NULL; --', '', $string);
    $string = str_ireplace("is NULL; --", '', $string);
    $string = str_ireplace("LIKE '", '', $string);
    $string = str_ireplace('LIKE "', '', $string);
    $string = str_ireplace("LIKE ??", '', $string);
    $string = str_ireplace("OR 'a'='a'", "", $string);
    $string = str_ireplace('OR "a"="a"', "", $string);
    $string = str_ireplace("OR ??a??=??a", "", $string);
    $string = str_ireplace("OR ??a??=??a", "", $string);
    $string = str_ireplace("--", '', $string);
    $string = str_ireplace("^", '', $string);
    $string = str_ireplace("[", '', $string);
    $string = str_ireplace("]", '', $string);
    $string = str_ireplace('==', '', $string);

    return $string;
}

// Genera tu propia contrase??a
function passGenerator($length = 10)
{
    $pass = "";
    $longitudPass = $length;
    $cadena = 'ABDEFGHIJKLMNOPQRSTUVWXYZabcdefghitjklmnopeqrstuvxwyz1234567890';
    $longitudCandena = strlen($cadena);

    for ($i = 1; $i <= $longitudPass; $i++) {
        $pos = rand(0, $longitudCandena-1);
        $pass .= substr($cadena, $pos, 1);
    }

    return $pass;
}

// Genera un Token
function token()
{
    $r1 = bin2hex(random_bytes(10));
    $r2 = bin2hex(random_bytes(10));
    $r3 = bin2hex(random_bytes(10));
    $r4 = bin2hex(random_bytes(10));

    $token = $r1.'-'.$r2.'-'.$r3.'-'.$r4;

    return $token;
}

function clear_cadena(string $cadena){
    //Reemplazamos la A y a
    $cadena = str_replace(
    array('??', '??', '??', '??', '??', '??', '??', '??', '??'),
    array('A', 'A', 'A', 'A', 'a', 'a', 'a', 'a', 'a'),
    $cadena
    );

    //Reemplazamos la E y e
    $cadena = str_replace(
    array('??', '??', '??', '??', '??', '??', '??', '??'),
    array('E', 'E', 'E', 'E', 'e', 'e', 'e', 'e'),
    $cadena );

    //Reemplazamos la I y i
    $cadena = str_replace(
    array('??', '??', '??', '??', '??', '??', '??', '??'),
    array('I', 'I', 'I', 'I', 'i', 'i', 'i', 'i'),
    $cadena );

    //Reemplazamos la O y o
    $cadena = str_replace(
    array('??', '??', '??', '??', '??', '??', '??', '??'),
    array('O', 'O', 'O', 'O', 'o', 'o', 'o', 'o'),
    $cadena );

    //Reemplazamos la U y u
    $cadena = str_replace(
    array('??', '??', '??', '??', '??', '??', '??', '??'),
    array('U', 'U', 'U', 'U', 'u', 'u', 'u', 'u'),
    $cadena );

    //Reemplazamos la N, n, C y c
    $cadena = str_replace(
    array('??', '??', '??', '??',',','.',';',':'),
    array('N', 'n', 'C', 'c','','','',''),
    $cadena
    );
    return $cadena;
}
// Formato para valores monetarios



function formatMoney($cantidad)
{
    $cantidad = number_format($cantidad, 2, SPD, SPM);
    return $cantidad;
}
// TOKEN PAYPAL
function getTokenPayPal(){
    $payLogin = curl_init(URLPAYPAL.'/v1/oauth2/token');
    curl_setopt($payLogin,CURLOPT_SSL_VERIFYPEER,FALSE);
    curl_setopt($payLogin,CURLOPT_RETURNTRANSFER,TRUE);
    curl_setopt($payLogin,CURLOPT_USERPWD,IDCLIENTE.':'.SECRET);
    curl_setopt($payLogin,CURLOPT_POSTFIELDS,'grant_type=client_credentials');
    $result = curl_exec($payLogin);
    $err = curl_error($payLogin);
    curl_close($payLogin);
    if($err){
        $request = 'CURL Error #: '.$err;
    }else{
        $json = json_decode($result);
        $request = $json->access_token;
    }
    return $request;
    
}

function CurlConnectionGet(string $ruta, string $contentType = null, string $token = null){
    $contentType = $contentType != null ? $contentType : 'application/x-www-form-urlencoded';
    if($token != null){
        $arrHeader = array('Content-Type:'.$contentType,
        'Authorization: Bearer '.$token);
    }else{
        $arrHeader = array('Content-Type:'.$contentType);
    }

    $ch = curl_init();
    curl_setopt($ch,CURLOPT_URL,$ruta);
    curl_setopt($ch,CURLOPT_SSL_VERIFYPEER,FALSE);
    curl_setopt($ch,CURLOPT_RETURNTRANSFER,TRUE);
    curl_setopt($ch,CURLOPT_HTTPHEADER,$arrHeader);
    $result = curl_exec($ch);
    $err = curl_error($ch);
    curl_close($ch);
    if($err){
        $request = 'CURL Error #: '.$err;
    }else{
        $request = json_decode($result);
    }
    return $request;
}

function CurlConnectionPost(string $ruta, string $contentType = null, string $token = null){
    $contentType = $contentType != null ? $contentType : 'application/x-www-form-urlencoded';
    if($token != null){
        $arrHeader = array('Content-Type:'.$contentType,
        'Authorization: Bearer '.$token);
    }else{
        $arrHeader = array('Content-Type:'.$contentType);
    }

    $ch = curl_init();
    curl_setopt($ch,CURLOPT_URL,$ruta);
    curl_setopt($ch,CURLOPT_POST,TRUE);
    curl_setopt($ch,CURLOPT_SSL_VERIFYPEER,FALSE);
    curl_setopt($ch,CURLOPT_RETURNTRANSFER,TRUE);
    curl_setopt($ch,CURLOPT_HTTPHEADER,$arrHeader);
    $result = curl_exec($ch);
    $err = curl_error($ch);
    curl_close($ch);
    if($err){
        $request = 'CURL Error #: '.$err;
    }else{
        $request = json_decode($result);
    }
    return $request;
}



function Meses(){
    $meses = array
            ('Enero',
             'Febrero',
             'Marzo',
             'Abril',
             'Mayo',
             'Junio',
             'Julio',
             'Agosto',
             'Septiembre',
             'Octubre',
             'Noviembre',
             'Diciembre',);
    return $meses;
    ;
}

function tofloat($num) {
    $dotPos = strrpos($num, '.');
    $commaPos = strrpos($num, ',');
    $sep = (($dotPos > $commaPos) && $dotPos) ? $dotPos :
        ((($commaPos > $dotPos) && $commaPos) ? $commaPos : false);
  
    if (!$sep) {
        return floatval(preg_replace('/[^0-9]/', '', $num));
    }

    return floatval(
        preg_replace('/[^0-9]/', '', substr($num, 0, $sep)) . '.' .
        preg_replace('/[^0-9]/', '', substr($num, $sep+1, strlen($num)))
    );
}

function getCatFooter(){
    require_once('Models/CategoriasModel.php');
    $objCategoria = new CategoriasModel();
    $request = $objCategoria->getCategoriasFooter();
    return $request;
}