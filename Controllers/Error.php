<?php
    class Errors extends Controllers{
        public function __construct(){
            parent::__construct();

            if(!isset($_SESSION)){
                session_start();
            }

        }

        public function notFound(){
            $data['page_tag'] = 'Error - '.NOMBRE_EMPRESA;
            $data['page_title'] = 'Error - '.NOMBRE_EMPRESA;
            $data['page_name'] = 'error';
            $this->views->getView($this,'error',$data);
        }


    }
    $notFound = new Errors();
    $notFound->notFound();