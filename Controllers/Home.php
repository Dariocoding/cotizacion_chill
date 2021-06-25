<?php

    class Home extends Controllers{
        public function __construct(){
            parent::__construct();
            session_start();
        }

        public function home(){
            $data['page_tag'] = NOMBRE_EMPRESA;
            $data['page_title'] = NOMBRE_EMPRESA;
            $data['page_name'] = NOMBRE_EMPRESA;
            $this->views->getView($this,'home',$data);
        }


    }