<?php 
    const BASE_URL = 'http://localhost/cotizacion_chill';
    //Zona Horaria
    date_default_timezone_set('America/Caracas');

    // Datos de conexion a base de Datos

    const DB_HOST = 'localhost';
    const DB_NAME = 'cotizacion_chill';
    const DB_USER = 'root';
    const DB_PASSWORD = '';
    const DB_CHARSET = 'utf8';

    // Deliminadores decimal y millar Ej. 24,189.00

    const SPD = ',';
    const SPM = '.';

    //Simbolo de MONEDA
    const SMONEY = '$';
    const CURRENCY = 'USD';

    // Crear variables constantes
    //Datos envio de correo
    const NOMBRE_REMITENTE = 'ChillMarin';
    const EMAIL_REMITENTE = 'no-reply@empresa.com';
    const NOMBRE_EMPRESA = 'ChillMarin';
    const WEB_EMPRESA = BASE_URL;
    const DESCRIPCION_EMPRESA = '';
    const SHAREDHASH = '';
    //Datos Empresa
    const DIRECCION = '';
    const TELEMPRESA1 = '+58 414-00000';
    const TELEMPRESA2 = '+58 424-00000';
    
    const EMAIL_EMPRESA = '@gmail.com';
    const EMAIL_PEDIDOS = '@gmail.com';
    const EMAIL_SUSCRIPCION = '@gmail.com';
    
    // Datos para Encriptar / Desencriptar
    const KEY = 'darkmax1';
    const METHODENCRIPT = 'AES-128-ECB';

    // REDES SOCIALES 

    const FACEBOOK = 'https://www.facebook.com/Chillmarin-106833840661172/';
    const INSTAGRAM = 'https://www.instagram.com/chillmarin_/';
    const WHATSSAP = 'https://api.whatsapp.com/send?phone=584129964043';
    const TWITTER = 'https://twitter.com/ChillMarin_?s=09';