<?php headerAdmin($data); ?>

<main class="app-content">


      <div class="app-title">
        <div>
          <h1><i class="fas fa-tachometer-alt mr-2"></i><?= $data['page_title'] ?>

          </h1>

        </div>
        <ul class="app-breadcrumb breadcrumb">
          <li class="breadcrumb-item"><i class="fa fa-home fa-lg"></i></li>
          <li class="breadcrumb-item"><a href="<?= base_url() ?>/dashboard"><?= $data['page_title'] ?></a></li>
        </ul>
      </div>

    </main>

<?php footerAdmin($data); ?>