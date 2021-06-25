<?php

    class Login extends Controllers{
        public function __construct(){
            session_start();
            if(isset($_SESSION['login'])){
                header('location: '.base_url().'/dashboard');
            }
            parent::__construct();
        }

        public function Login(){
            $data['page_tag'] = 'Login - '.NOMBRE_EMPRESA;
            $data['page_title'] = 'Login - '.NOMBRE_EMPRESA;
            $data['page_name'] = 'login';
            $data['page_functions_js'] = 'functions_login.js';
            $this->views->getView($this,'login',$data);
        }

        public function LoginUser()
        {
            if($_POST) {
                if(empty($_POST['txtEmail']) || empty($_POST['txtPassword'])){
                    $arrResponse = array('status' => false, 'msg' => 'Error de datos.');
                }else{
                    $strUsuario = strclean($_POST['txtEmail']);
                    $strPassword = hash("SHA256",$_POST['txtPassword']);
                    $requestUser = $this->model->loginUser($strUsuario,$strPassword);

                    if(empty($requestUser)){
                        $arrResponse = array('status' => false, 'msg' => 'EL usuario o la contraseña son incorrectos.');
                    }else{
                        $arrData = $requestUser;
                        if($arrData['status'] == 1){
                            $_SESSION['idUser'] = $arrData['idpersona'];
                            $_SESSION['login'] = true;
                            $this->model->sessionLogin($_SESSION['idUser']);
                            $arrResponse = array('status' => true, 'msg' => 'ok');
                        }else{
                            $arrResponse = array('status' => false, 'msg' => 'Usuario inactivo.');
                        }
                    }


                }
                echo json_encode($arrResponse,JSON_UNESCAPED_UNICODE);
            }

            die();
        }
        public function resetPass()
        {
            if($_POST){
                error_reporting(0);
                if(empty($_POST['txtEmailReset'])){
                    $arrResponse = array('status' => false, 'msg' => 'Error de datos.');
                }else{
                    $token = token();
                    $strEmail = strClean($_POST['txtEmailReset']);
                    $arrData = $this->model->getUserEmail($strEmail);
                    if(empty($arrData)){
                        $arrResponse = array('status' => false, 'msg' => 'Usuario no existente');
                    }else{
                        $idpersona = $arrData['idpersona'];
                        $nombreUsuario = $arrData['nombres']. ' '. $arrData['apellidos'];
                        $url_recovery = base_url().'/login/confirmUser/'.$strEmail.'/'.$token;
                        $updateToken = $this->model->setTokenUser($idpersona,$token);
                        $dataUsuario = array('nombreUsuario' => $nombreUsuario,
                                            'email' => $strEmail,
                                            'asunto' => 'Recuperar Cuenta - '.NOMBRE_REMITENTE,
                                            'url_recovery' => $url_recovery);

                        if($updateToken){
                            $sendEmail = sendEmail($dataUsuario,'email_cambioPassword');

                            if($sendEmail){
                                $arrResponse = array('status' => true, 'msg' => 'Se han enviado un email a tu cuenta de correo, para cambiar contraseña.');
                            }else{
                                $arrResponse = array('status' => false, 'msg' => 'No es posible realizar el proceso, intente mas tarde.');
                            }
                        }else{
                            $arrResponse = array('status' => false, 'msg' => 'No se pudo realizar el proceso, intente más tarde.');

                        }
                    }
                }
                echo json_encode($arrResponse,JSON_UNESCAPED_UNICODE);
            }


            die();
        }

        public function confirmUser(string $params)
        {
            if(empty($params)){
                header('location: '.base_url());
            }else{
                $arrParams = explode(',',$params);
                $strEmail = strClean($arrParams[0]);
                $strToken = strClean($arrParams[1]);
                $arrResponse = $this->model->getUsuario($strEmail,$strToken);
                if(empty($arrResponse)){
                    header('Location: '.base_url());
                }else{
                    $data['page_tag'] = 'Cambiar contraseña';
                    $data['page_title'] = 'Cambiar contraseña';
                    $data['page_name'] = 'Cambiar_contraseña';
                    $data['page_functions_js'] = 'functions_login.js';
                    $data['email'] = $strEmail;
                    $data['token'] = $strToken;

                    $data['idpersona'] = $arrResponse['idpersona'];
                    $this->views->getView($this,'cambiar_password',$data);
                }
            }
            die();

       
        }

        public function setPassword()
        {
            if($_POST){
                if(empty($_POST['idUsuario']) || empty($_POST['txtPassword']) || empty($_POST['txtPasswordConfirm']) || empty($_POST['txtEmail']) || empty($_POST['txtToken']) ){
                    $arrResponse = array('status' => false, 'msg' => 'Error de datos');
                }else{
                    $intIdPersona = intval($_POST['idUsuario']);
                    $strPassword = $_POST['txtPassword'];
                    $strPasswordConfirm = $_POST['txtPasswordConfirm'];
                    $strEmail = strClean($_POST['txtEmail']);
                    $strToken = strClean($_POST['txtToken']);
                    
                    if($strPassword != $strPasswordConfirm){
                        $arrResponse = array('status' => false, 'msg' => 'Las contraseñas no son iguales.');
                    }else{
                        $arrResponseUser = $this->model->getUsuario($strEmail,$strToken);
                        if(empty($arrResponseUser)){
                            $arrResponse = array('status' => false, 'msg' => 'Error de datos');
                        }else{
                            $strPassword = hash('SHA256',$strPassword);
                            $requestPass = $this->model->insertPassword($intIdPersona,$strPassword);
                            if($requestPass){
                                $arrResponse = array('status' => true, 'msg' => 'Contraseña actualizada con éxito.');
                            }else{
                                $arrResponse = array('status' => true, 'msg' => 'No es posible realizar el proceso, intente más tarde.');
                            }

                        }
                    }
                }
                echo json_encode($arrResponse,JSON_UNESCAPED_UNICODE);
            }
            die();
        }



    }