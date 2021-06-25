<script>
      const base_url = '<?= base_url() ?>';
      const smoney = '<?= SMONEY ?>';
    </script>
    <script src="<?= media() ?>/js/compress.js"></script>

    <?php if($data['page_name'] != 'perfil' AND $data['page_name'] != 'dashboard' ) { ?>
        <script src="<?= media() ?>/js/plugins/jquery.dataTables.min.js"></script>
        <script src="<?= media() ?>/js/plugins/dataTables.bootstrap.min.js"></script>
        <script type="text/javascript" language="javascript" src="https://cdn.datatables.net/buttons/1.5.2/js/dataTables.buttons.min.js"></script>
        <script type="text/javascript" language="javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js"></script>
        <script type="text/javascript" language="javascript" src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.36/pdfmake.min.js"></script>
        <script type="text/javascript" language="javascript" src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.36/vfs_fonts.js"></script>
        <script type="text/javascript" language="javascript" src="https://cdn.datatables.net/buttons/1.5.2/js/buttons.html5.min.js"></script>
        <script src="<?= media() ?>/js/plugins/bootstrap-select.min.js"></script>
    <?php } ?>

    
    <?php if(isset($data['page_functions_js'])){ ?>
      <script src="<?= media() ?>/js/<?= $data['page_functions_js'] ?>"></script>
    <?php } ?> 

  </body>
</html>