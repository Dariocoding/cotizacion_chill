<?php 
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;


require __DIR__.'/../Libraries/PHPMailer-master/src/Exception.php';
require __DIR__.'/../Libraries/PHPMailer-master/src/PHPMailer.php';
require __DIR__.'/../Libraries/PHPMailer-master/src/SMTP.php';

class Mail{
    private $mailer;

    public function __construct(){
        $this->mailer = new PHPMailer(true);
    }

    public function configMail($data){
                    //Server settings
        $this->mailer->SMTPDebug = 0;
        $this->mailer->isSMTP();      
        $this->mailer->Host = MAIL_HOST;  
        $this->mailer->SMTPAuth = MAIL_SMTP_AUTH;        
        $this->mailer->Username = $data['fromMail'];        
        $this->mailer->Password = MAIL_PASSWORD;        
        $this->mailer->SMTPSecure = MAIL_SMTP_SECURITY;        
        $this->mailer->Port = MAIL_PORT;        
    }

    public function send($data){
        try {
            $this->configMail($data);
            //Recipients
            $this->mailer->setFrom($data['fromMail'], $data['fromName']);
            $this->mailer->addAddress($data['toMail'], $data['toName']);
            // Content
            $this->mailer->isHTML(true);
            $this->mailer->Subject = $data['subject'];
            $this->mailer->Body = $data['html'];
            $this->mailer->send();
        } catch (Exception $e) {
            return false;
        }
        return true;
    }
}