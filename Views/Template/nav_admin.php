<div class="app-sidebar__overlay" data-toggle="sidebar"></div>
    <aside class="app-sidebar">
      <div class="app-sidebar__user"><img class="app-sidebar__user-avatar" src="<?= media() ?>/images/avatar-user.png" alt="User Image">
        <div>
          <p class="app-sidebar__user-name"><?= $_SESSION['userData']['nombres'] . ' '. $_SESSION['userData']['apellidos'] ?></p>
          <p class="app-sidebar__user-designation">Usuario ChillMarin</p>
        </div>
      </div>
      <ul class="app-menu">
        <li><a class="app-menu__item" href="<?= base_url() ?>"><i class="app-menu__icon mr-2 fas fa-globe"></i><span class="app-menu__label">Ver sitio web</span></a></li>
        <li><a class="app-menu__item" href="<?= base_url() ?>/dashboard"><i class="app-menu__icon mr-2 fas fa-tachometer-alt"></i><span class="app-menu__label">Dashboard</span></a></li>
        <li><a class="app-menu__item" href="<?= base_url() ?>/cotizaciones"><i class="app-menu__icon mr-2 fas fa-hand-holding-usd"></i><span class="app-menu__label">Cotizaciones</span></a></li>
        <li><a class="app-menu__item" href="<?= base_url() ?>/logout"><i class="app-menu__icon mr-2 fas fa-sign-out-alt"></i><span class="app-menu__label">Salir</span></a></li>

      </ul>
    </aside>