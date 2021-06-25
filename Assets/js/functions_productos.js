let tableProductos;
let rowTable = '';

$(document).on('focusin', function(e) {
    if ($(e.target).closest(".tox-dialog").length) {
        e.stopImmediatePropagation();
    }
});

tinymce.init({
	selector: '#txtDescripcion',
	width: "100%",
    height: 500,    
    statubar: true,
    plugins: [
        "advlist autolink link image lists charmap print preview hr anchor pagebreak",
        "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
        "save table contextmenu directionality emoticons template paste textcolor"
    ],
    toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media fullpage | forecolor backcolor emoticons",
});

window.addEventListener('load', () => {
    fntInputFile();
},false)

document.addEventListener('DOMContentLoaded',() => {
    tableProductos = $('#tableProductos').DataTable({
        aProcessing: true,
        aServerSide: true,
        language: spanish_json,
        ajax: {
            url: ' ' + base_url + '/Productos/getProductos',
            dataSrc: ''
        },

        columns: [{
                data: 'idproducto'
            },
            {
                data: 'codigo'
            },
            {
                data: 'nombre'
            },
            {
                data: 'stock'
            },
            {
                data: 'precio'
            },
            {
                data: 'status'
            },
            {
                data: 'options'
            }

        ],
        columnDefs: [
            {'className':'text-center', 'target': [3] },
            {'className':'text-center', 'target': [4] },
            {'className':'text-center', 'target': [5] },

        ],
        dom: 'lBfrtip',
        buttons: [{
                'extend': 'copyHtml5',
                'text': '<i class="far fa-copy"></i> Copiar',
                'titleAttr': 'Copiar',
                'className': 'btn btn-secondary',
                'exportOptions': {
                    "columns": [1,2,3,4]
                }
            },
            {
                'extend': 'excelHtml5',
                'text': '<i class="fas fa-file-excel"></i> Excel',
                'titleAttr': 'Exportar a Excel',
                'className': 'btn btn-success',
                'exportOptions': {
                    "columns": [1,2,3,4]
                }
            },
            {
                'extend': 'pdfHtml5',
                'text': '<i class="fas fa-file-pdf"></i> PDF',
                'titleAttr': 'Exportar a PDF',
                'className': 'btn btn-danger',
                'exportOptions': {
                    "columns": [1,2,3,4]
                }
            },
            {
                'extend': 'csvHtml5',
                'text': '<i class="fas fa-file-csv"></i> CSV',
                'titleAttr': 'Exportar a CSV',
                'className': 'btn btn-info',
                'exportOptions': {
                    "columns": [1,2,3,4]
                }
            }
        ],
        responsive: true,
        bDestroy: true,
        iDisplayLength: 10,
        order: [
            [0, 'asc']
        ],
    })

    if(document.querySelector('#formProductos')){
        const formProductos = document.querySelector('#formProductos');

        formProductos.onsubmit = (e) => {
            e.preventDefault();

            const strNombre = formProductos['txtNombre'].value
            const intCodigo = formProductos['txtCodigo'].value
            const strPrecio = formProductos['txtPrecio'].value
            const intStock = formProductos['txtStock'].value
            const intStatus = formProductos['listStatus'].value

            if(strNombre == '' || intCodigo == '' || strPrecio == '' || intStock == ''){
                swal('Atencion','Todos los campos son obligatorios','error')
                return false
            }

            if(intCodigo.length < 2){
                swal('Atencion','El codigo debe ser mayor que 2 digitos', 'error')
                return false;
            }

            divLoading.style.display = 'flex';
            tinyMCE.triggerSave();
            const ajaxUrl = base_url + '/Productos/setProducto';
            const request = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            const formData = new FormData(formProductos);
            request.open('POST',ajaxUrl,true)
            request.send(formData);
            request.onreadystatechange = () => {
                if(request.readyState == 4 && request.status == 200){
                    const {status,msg,idproducto} = JSON.parse(request.responseText);
                    if(status){
                        if(rowTable == ""){
                            tableProductos.ajax.reload();
                        }else{
                            const htmlStatus = intStatus == 1 ? '<span class="badge badge-success">Activo</span>' : '<span class="badge badge-danger">Inaactivo</span>'
                            rowTable.cells[1].textContent = intCodigo;
                            rowTable.cells[2].textContent = strNombre;
                            rowTable.cells[3].textContent = intStock;
                            rowTable.cells[4].textContent = strPrecio + ' ' + smoney;
                            rowTable.cells[5].innerHTML = htmlStatus;
                        }
                        swal('Éxito',msg,'success')
                        $('#modalFormProductos').modal('hide');

                    }else{
                        swal('Error',msg,'error')
                    }
                }
                divLoading.style.display = 'none';
                return false;
            }
        }
    }

    if(document.querySelector('.btnAddImage')){
        const btnAddImage = document.querySelector('.btnAddImage')
        btnAddImage.onclick = (e) => {
            const key = Date.now();
            const newElement = document.createElement('div')
            newElement.id = 'div'+key;
            newElement.innerHTML = `
            <div class="prevImage"></div>
            <input type="file" name="foto" id="img${key}" class="inputUploadfile">
            <label for="img${key}" class="btnUploadfile"><i class="fas fa-upload"></i></label>
            <button class="btnDeleteImage notBlock" type="button" onclick="fntDelItem('#div${key}')"><i class="fas fa-trash-alt"></i></button>
            `;
            document.querySelector('#containerImages').appendChild(newElement);
            document.querySelector('#div'+key +' .btnUploadfile').click()
            fntInputFile()
        }
    }

    if(document.querySelector('#txtCodigo')){
        const inputCodigo = document.querySelector('#txtCodigo');
        inputCodigo.onkeyup = () => {
            if(inputCodigo.value.length > 2){
                document.querySelector('#divBarCode').classList.remove('notBlock');
                fntBarcode(inputCodigo.value);
            }else{
                document.querySelector('#divBarCode').classList.add('notBlock')
            }
        }
    }


})

function fntViewInfo(idProducto){
    const request = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTPP')
    const ajaxUrl = base_url + '/Productos/getProducto/' + idProducto
    request.open('GET',ajaxUrl,true)
    request.send();
    request.onreadystatechange = () => {
        if(request.readyState == 4 && request.status == 200){
            const objData = JSON.parse(request.responseText);
            if(objData.status){
                let htmlImage = '';
                const {codigo,nombre,precio,stock,categoria,descripcion,status,images} = objData.data
                const estadoProducto = status == 1 ? 
                '<span class="badge badge-success">Activo</span>' : 
                '<span class="badge badge-danger">Inactivo</span>'
                document.querySelector('#celCodigo').innerHTML = codigo;
                document.querySelector('#celNombre').innerHTML = nombre;
                document.querySelector('#celPrecio').innerHTML = precio;
                document.querySelector('#celStock').innerHTML = stock;
                document.querySelector('#celCategoria').innerHTML = categoria;
                document.querySelector('#celStatu').innerHTML = estadoProducto;
                document.querySelector('#celDescripcion').innerHTML = descripcion;

                if(images.length > 0){
                    for (let i = 0; i < images.length; i++) {
                        htmlImage += `<img src="${images[i].url_image}"></img>`
                    }
                }
                document.querySelector('#celFotos').innerHTML = htmlImage
                $('#modalViewProducto').modal('show')


            }else{
                swal('Error',objData.msg,'error')
            }
        }
    }
}

function fntEditInfo(element,idProducto) {
    rowTable = element.parentNode.parentNode.parentNode
    document.querySelector('.modal-header').classList.replace("headerRegister", "headerUpdate");
    document.querySelector('#btnActionForm').classList.replace("btn-primary", "btn-info");
    document.querySelector('#btnText').innerHTML = "Actualizar";
    document.querySelector('#titleModal').innerHTML = "Actualizar Producto";
    document.querySelector('#containerGallery').classList.remove('notBlock');
    const request = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTPP')
    const ajaxUrl = base_url + '/Productos/getProducto/' + idProducto
    request.open('GET',ajaxUrl,true)
    request.send();
    request.onreadystatechange = () => {
        if(request.readyState == 4 && request.status == 200){
            const objData = JSON.parse(request.responseText);
            if(objData.status){
                let htmlImage = ''
                const {idproducto,codigo,nombre,precio,stock,categoriaid,descripcion,status,images} = objData.data

                document.querySelector('#idProducto').value = idproducto
                document.querySelector('#txtNombre').value = nombre
                document.querySelector('#txtDescripcion').value = descripcion
                document.querySelector('#txtCodigo').value = codigo
                document.querySelector('#txtPrecio').value = precio
                document.querySelector('#txtStock').value = stock
                document.querySelector('#listCategoria').value = categoriaid
                document.querySelector('#listStatus').value = status

                tinymce.activeEditor.setContent(descripcion)
                $('#listCategoria').selectpicker('render')
                $('#listStatus').selectpicker('render')

                document.querySelector('#divBarCode').classList.remove('notBlock');
                fntBarcode(codigo)

                if(images.length > 0){
                    for (let i = 0; i < images.length; i++) {
                        let key = Date.now() + i
                        htmlImage += `
                            <div id="div${key}">
                                <div class="prevImage">
                                    <img src="${images[i].url_image}"></img>                
                                </div>
                                <button type="button" class="btnDeleteImage" onclick="fntDelItem('#div${key}')" imgname="${images[i].img}"><i class="fas fa-trash-alt"></i></button>
                            </div>
                        `
                    }
                }

                document.querySelector('#containerImages').innerHTML = htmlImage;


                $('#listCategoria').selectpicker('render');

                $('#modalFormProductos').modal('show');

            }else{
                swal('Error',objData.msg,'error')
            }
        }
    }

}

function fntInputFile() {
    let inputUploadfile = document.querySelectorAll('.inputUploadfile')
    inputUploadfile.forEach(inputUploadfile => {
        inputUploadfile.addEventListener('change', function (inputUploadfile) {
            let idProducto = document.querySelector('#idProducto').value
            let parentId = this.parentNode.getAttribute('id')
            let idFile = this.getAttribute('id')
            let uploadFoto = document.querySelector('#'+idFile).value;
            let fileimg = document.querySelector('#'+idFile).files;
            let prevImg = document.querySelector('#'+parentId+' .prevImage');
            let nav = window.URL || window.webkitURL

            if(uploadFoto != ''){
                let type = fileimg[0].type
                let name = fileimg[0].name
                if(type != 'image/jpeg' && type != 'image/jpg' && type != 'image/png'){
                    prevImg.innerHTML = 'Archivo no válido.'
                    uploadFoto.value = '';
                    return false
                }else{
                    let objeto_url = nav.createObjectURL(this.files[0])
                    prevImg.innerHTML = `<img class="loading" src="${base_url}/Assets/images/loading.svg">`
                    let request = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP')
                    let ajaxUrl = base_url + '/Productos/setImage';
                    let formData = new FormData()
                    formData.append('idproducto',idProducto);
                    formData.append('foto',this.files[0])
                    request.open('POST', ajaxUrl, true )
                    request.send(formData)
                    request.onreadystatechange = () => {
                        if(request.readyState != 4) return;
                        if(request.status == 200) {
                            const objData = JSON.parse(request.responseText);
                            
                            if(objData.status){
                                const {imgname,msg} = objData;
                                prevImg.innerHTML = `<img src="${objeto_url}">`
                                document.querySelector('#'+parentId+' .btnDeleteImage').setAttribute('imgname',imgname);
                                document.querySelector('#'+parentId+' .btnUploadfile').classList.add('notBlock');
                                document.querySelector('#'+parentId+' .btnDeleteImage').classList.remove('notBlock')
                                swal('Exito',msg,'success')
                            }else{
                                swal('Error',objData.msg,'error')
                            }
                        }
                    }
                }
            }

        })
    })
    
}

function fntDelItem(element){
    const nameImg = document.querySelector(element + ' .btnDeleteImage').getAttribute('imgname');
    const idProducto = document.querySelector('#idProducto').value
    const request = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP')
    const ajaxUrl = base_url + '/Productos/delFile'

    let formData = new FormData();
    formData.append('idproducto',idProducto);
    formData.append('file',nameImg);
    request.open('POST',ajaxUrl,true);
    request.send(formData)
    request.onreadystatechange = () => {
        if(request.readyState != 4) return
        if(request.status == 200){
            const objData = JSON.parse(request.responseText);
            if(objData.status){
                const itemRemove = document.querySelector(element)
                itemRemove.parentNode.removeChild(itemRemove);
            }else{
                swal('',objData.msg,'error');
            }
        }
    }


}

function fntDelInfo(idProducto){
    swal({
        title: 'Eliminar Producto',
        text: '¿Realmente quiere eliminar el Producto?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, eliminar',
        cancelButtonText: 'No, cancelar',
        closeOnConfirm: false,
        closeOnCancel: true
    }, (isConfirm) => {

        if (isConfirm) {
            const request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            const ajaxDelUsuario = base_url + '/Productos/delProducto';
            const strData = 'idproducto=' + idProducto;
            request.open('POST', ajaxDelUsuario, true);
            request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            request.send(strData);
            request.onreadystatechange = () => {
                if (request.readyState == 4 && request.status == 200) {
                    const objData = JSON.parse(request.responseText);
                    if (objData.status) {
                        swal('Eliminar!', objData.msg, 'success');
                        tableProductos.ajax.reload()
                    } else {
                        swal('Atencion!', objData.msg, 'error');
                    }
                }
            }
        }

    })
}

function fntBarcode (value)  {
    JsBarcode('#barcode',value);
}

function fntPrintBarcode (area)  {
    let elementArea = document.querySelector(area);
    let vprint = window.open(' ', 'popimpr', 'height=400,width=600')
    vprint.document.write(elementArea.innerHTML);
    vprint.document.close();
    vprint.print();
    vprint.close();

}

function openModal ()  {
    rowTable = "";
    document.querySelector('#divBarCode').classList.add('notBlock')
    document.querySelector('#containerGallery').classList.add('notBlock');
    document.querySelector('#containerImages').innerHTML = '';
    document.querySelector('#idProducto').value = "";
    document.querySelector('.modal-header').classList.replace("headerUpdate", "headerRegister");
    document.querySelector('#btnActionForm').classList.replace("btn-info", "btn-primary");
    document.querySelector('#btnText').innerHTML = "Guardar";
    document.querySelector('#titleModal').innerHTML = "Nuevo Producto";
    document.querySelector("#formProductos").reset();
    $('#listCategoria').selectpicker('render');

    $('#modalFormProductos').modal('show');
}