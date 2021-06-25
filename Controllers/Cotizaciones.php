<?php

    class Cotizaciones extends Controllers{
        public function __construct(){
            session_start();
            if(empty($_SESSION['login'])){
                header('location: '.base_url().'/login');
            }
            parent::__construct();
        }

        public function Cotizaciones(){
            $data['page_tag'] = 'cotizaciones - '.NOMBRE_EMPRESA;
            $data['page_title'] = 'cotizaciones - '.NOMBRE_EMPRESA;
            $data['page_name'] = 'cotizaciones';
            $data['page_functions_js'] = 'functions_cotizaciones.js';
            $this->views->getView($this,'cotizaciones',$data);
        }


    }