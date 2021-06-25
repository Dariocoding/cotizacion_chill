<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="author" content="Dario Flores">
    <meta name="theme-color" content="#009688">
    <meta name="shorcut-icon" href="">
    <link rel="shortcut icon" href="<?= media() ?>/template/img/favicon.ico" type="image/x-icon">
    <link rel="stylesheet" type="text/css" href="<?= media() ?>/css/main.css">
    <link rel="stylesheet" type="text/css" href="<?= media() ?>/css/style.css">
    <title><?= $data['page_tag'] ?></title>
  </head>
  <body>
    <section class="material-half-bg">
      <div class="cover"></div>
    </section>
    <section class="login-content">
      <div class="logo">
        <h1><?= $data['page_title'] ?></h1>
      </div>
      <div class="login-box flipped">
        <div id="divLoading">
          <img src="<?= media() ?>/images/loading.svg" alt="Loading">
        </div>
        <form id="formCambiarPass" name="formCambiarPass" class="forget-form" action="">
            <input type="hidden" id="idUsuario" name="idUsuario" value="<?= $data['idpersona'] ?>">
            <input type="hidden" id="txtEmail" name="txtEmail" value="<?= $data['email'] ?>">
            <input type="hidden" id="txtToken" name="txtToken" value="<?= $data['token'] ?>">

          <h3 class="login-head"><i class="fas fa-key"></i>Cambiar contraseña</h3>
          <div class="form-group">
            <input id="txtPassword" name="txtPassword" class="form-control" type="password" placeholder="Nueva Contraseña">
          </div>
          <div class="form-group">
            <input id="txtPasswordConfirm" name="txtPasswordConfirm" class="form-control" type="password" placeholder="Confirmar Nueva Contraseña">
          </div>
          <div class="form-group btn-container">
            <button class="btn btn-primary btn-block"><i class="fa fa-unlock fa-lg fa-fw"></i> CAMBIAR</button>
          </div>
        </form>
      </div>
    </section>
    <script>
        const base_url = "<?= base_url() ?>"
    </script>
    <script src="<?= media() ?>/js/jquery-3.3.1.min.js"></script>
    <script src="<?= media() ?>/js/popper.min.js"></script>
    <script src="<?= media() ?>/js/bootstrap.min.js"></script>
    <script src="<?= media() ?>/js/main.js"></script>
    <script src="<?= media() ?>/js/fontawesome.js"></script>
    <script src="<?= media() ?>/js/plugins/pace.min.js"></script>
    <script src="<?= media() ?>/js/plugins/pace.min.js"></script>
    <script src="<?= media() ?>/js/plugins/sweetalert.min.js"></script>
    <script src="<?= media() ?>/js/<?= $data['page_functions_js'] ?>"></script>
  </body>
</html>