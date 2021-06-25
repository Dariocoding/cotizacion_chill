<?php
    class Dashboard extends Controllers{
        public function __construct(){
            session_start();
            if(empty($_SESSION['login'])){
                header('location: '.base_url().'/login');
            }
            parent::__construct();
        }


        public function dashboard(){
            $data['page_tag'] = 'Dashboard - '.NOMBRE_EMPRESA;
            $data['page_title'] = 'Dashboard - '.NOMBRE_EMPRESA;
            $data['page_name'] = 'dashboard';
            $data['page_functions_js'] = 'functions_dashboard.js';

            $this->views->getView($this,'dashboard',$data);


        }


    }