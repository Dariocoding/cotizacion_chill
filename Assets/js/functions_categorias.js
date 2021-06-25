let rowTable = "";
let tableCategorias;
const divLoading = document.querySelector('#divLoading');
document.addEventListener('DOMContentLoaded', () => {
    tableCategorias = $('#tableCategorias').DataTable({
        aProcessing: true,
        aServerSide: true,
        language: spanish_json,
        ajax: {
            url: ' ' + base_url + '/Categorias/getCategorias',
            dataSrc: ''
        },

        columns: [{
                data: 'idcategoria'
            },
            {
                data: 'nombre'
            },
            {
                data: 'descripcion'
            },
            {
                data: 'status'
            },
            {
                data: 'options'
            }

        ],
        dom: 'lBfrtip',
        buttons: [{
                'extend': 'copyHtml5',
                'text': '<i class="far fa-copy"></i> Copiar',
                'titleAttr': 'Copiar',
                'className': 'btn btn-secondary'
            },
            {
                'extend': 'excelHtml5',
                'text': '<i class="fas fa-file-excel"></i> Excel',
                'titleAttr': 'Exportar a Excel',
                'className': 'btn btn-success'
            },
            {
                'extend': 'pdfHtml5',
                'text': '<i class="fas fa-file-pdf"></i> PDF',
                'titleAttr': 'Exportar a PDF',
                'className': 'btn btn-danger'
            },
            {
                'extend': 'csvHtml5',
                'text': '<i class="fas fa-file-csv"></i> CSV',
                'titleAttr': 'Exportar a CSV',
                'className': 'btn btn-info'
            }
        ],
        responsive: true,
        bDestroy: true,
        iDisplayLength: 10,
        order: [
            [0, 'asc']
        ],
    })


    if (document.querySelector("#foto")) {
        var foto = document.querySelector("#foto");
        foto.onchange = function(e) {
            const uploadFoto = document.querySelector("#foto").value;
            const fileimg = document.querySelector("#foto").files;
            const nav = window.URL || window.webkitURL;
            const contactAlert = document.querySelector('#form_alert');
            if (uploadFoto != '') {
                const type = fileimg[0].type;
                const name = fileimg[0].name;
                if (type != 'image/jpeg' && type != 'image/jpg' && type != 'image/png') {
                    contactAlert.innerHTML = '<p class="errorArchivo">El archivo no es válido.</p>';
                    if (document.querySelector('#img')) {
                        document.querySelector('#img').remove();
                    }
                    document.querySelector('.delPhoto').classList.add("notBlock");
                    foto.value = "";
                    return false;
                } else {
                    contactAlert.innerHTML = '';
                    if (document.querySelector('#img')) {
                        document.querySelector('#img').remove();
                    }
                    document.querySelector('.delPhoto').classList.remove("notBlock");
                    const objeto_url = nav.createObjectURL(this.files[0]);
                    document.querySelector('.prevPhoto div').innerHTML = "<img id='img' src=" + objeto_url + ">";
                }
            } else {
                alert("No selecciono foto");
                if (document.querySelector('#img')) {
                    document.querySelector('#img').remove();
                }
            }
        }
    }

    if (document.querySelector(".delPhoto")) {
        const delPhoto = document.querySelector(".delPhoto");
        delPhoto.onclick = function(e) {
            document.querySelector('#foto_remove').value = 1;
            removePhoto();
        }
    }

    const formCategoria = document.querySelector('#formCategoria');
    formCategoria.onsubmit = (e) => {
        e.preventDefault();
        const strNombre = formCategoria['txtNombre'].value;
        const strDescripcion = formCategoria['txtDescripcion'].value;
        const intStatus = formCategoria['listStatus'].value;

        if (strNombre == '' || strDescripcion == '' || intStatus == '') {
            swal('Atencion', 'Todos los campos son obligatorios', 'error');
            return false
        }
        divLoading.style.display = 'flex';
        const request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP')
        const ajaxUrl = base_url + '/Categorias/setCategoria';
        const formData = new FormData(formCategoria);
        request.open('POST', ajaxUrl, true)
        request.send(formData)
        request.onreadystatechange = () => {
            if (request.readyState == 4 && request.status == 200) {
                const objData = JSON.parse(request.responseText);
                if (objData.status) {
                    if(rowTable == ""){
                        tableCategorias.ajax.reload()
                    }else{
                        const htmlStatus = intStatus == 1 ? 
                        '<span class="badge badge-success">Activo</span>' : 
                        '<span class="badge badge-danger">Inactivo</span>';
                        rowTable.cells[1].textContent = strNombre;
                        rowTable.cells[2].textContent = strDescripcion;
                        rowTable.cells[3].innerHTML = htmlStatus;
                        rowTable = '';

                    }
                    $('#modalFormCategorias').modal("hide");
                    formCategoria.reset();
                    swal('Categoria', objData.msg, 'success');
                    removePhoto()
                } else {
                    swal('Error', objData.msg, 'error');
                }
                divLoading.style.display = 'none';
                return false;
            }
        }

    }

    tableCategorias.on('draw', () => {
        fntViewCategoria();
        fntEditCategoria();
        fntDelCategoria();
    })

})

const fntViewCategoria = () => {
    const btnViewCategoria = document.querySelectorAll('.btnViewCategoria');
    btnViewCategoria.forEach(btnViewCategoria => {
        btnViewCategoria.addEventListener('click', (e) => {
            const idcategoria = btnViewCategoria.getAttribute('ctg');
            const request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            const ajaxUrl = base_url + '/Categorias/getCategoria/' + idcategoria;
            request.open('GET', ajaxUrl, true);
            request.send();
            request.onreadystatechange = () => {
                if (request.readyState == 4 && request.status == 200) {
                    const objData = JSON.parse(request.responseText);

                    if (objData.status) {
                        const data = objData.data
                        const estadoCategoria = data.status == 1 ?
                            '<span class="badge badge-success">Activo</span>' :
                            '<span class="badge badge-danger">Inactivo</span>';
                        document.querySelector('#celId').innerHTML = data.idcategoria;
                        document.querySelector('#celNombre').innerHTML = data.nombre;
                        document.querySelector('#celDescripcion').innerHTML = data.descripcion;
                        document.querySelector('#celEstado').innerHTML = estadoCategoria;
                        document.querySelector('#imgCategoria').innerHTML = '<img src="' + data.url_portada + '"></img>';

                        $('#modalViewCategoria').modal('show')
                    } else {
                        swal('Error', objData.msg, 'error');

                    }
                }
            }
        })
    })
}

const removePhoto = () => {
    document.querySelector('#foto').value = "";
    document.querySelector('.delPhoto').classList.add("notBlock");
    if (document.querySelector('#img')) {
        document.querySelector('#img').remove();
    }
}

const fntEditCategoria = () => {
    const btnEditCategoria = document.querySelectorAll('.btnEditCategoria');
    btnEditCategoria.forEach(btnEditCategoria => {
        btnEditCategoria.addEventListener('click', (e) => {
            rowTable = btnEditCategoria.parentNode.parentNode.parentNode
            document.querySelector('#titleModal').innerHTML = "Actualizar Categoria";
            document.querySelector('.modal-header').classList.replace("headerRegister", "headerUpdate");
            document.querySelector('#btnActionForm').classList.replace("btn-primary", "btn-info");
            document.querySelector('#btnText').innerHTML = "Actualizar";
            const idCategoria = btnEditCategoria.getAttribute('ctg');
            const request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            const ajaxUrl = base_url + '/Categorias/getCategoria/' + idCategoria;
            request.open('GET', ajaxUrl, true);
            request.send();
            request.onreadystatechange = () => {
                if (request.readyState == 4 && request.status == 200) {
                    const objData = JSON.parse(request.responseText);

                    if (objData.status) {
                        const formCategoria = document.querySelector('#formCategoria');
                        const data = objData.data
                        formCategoria['idCategoria'].value = data.idcategoria
                        formCategoria['txtNombre'].value = data.nombre
                        formCategoria['txtDescripcion'].value = data.descripcion
                        formCategoria['foto_actual'].value = data.portada
                        document.querySelector('#foto_remove').value = 0;


                        if (data.status == 1) {
                            document.querySelector('#listStatus').value = 1;
                        } else {
                            document.querySelector('#listStatus').value = 2;
                        }

                        $('#listStatus').selectpicker('render')

                        if (document.querySelector('#img')) {
                            document.querySelector('#img').src = data.url_portada
                        } else {
                            document.querySelector('.prevPhoto div').innerHTML = '<img id="img" src="' + data.url_portada + '" >'
                        }

                        if (data.portada == 'portada_categoria.png') {
                            document.querySelector('.delPhoto').classList.add('notBlock');
                        } else {
                            document.querySelector('.delPhoto').classList.remove('notBlock');
                        }

                        $('#modalFormCategorias').modal('show')
                    } else {
                        swal('Error', objData, 'error')
                    }
                }
            }
        })
    })
}

const fntDelCategoria = () => {
    const btnDelCategoria = document.querySelectorAll('.btnDelCategoria');
    btnDelCategoria.forEach(btnDelCategoria => {
        btnDelCategoria.addEventListener('click', function(e) {
            const idcategoria = this.getAttribute('ctg');
            swal({
                title: 'Eliminar categoria',
                text: '¿Realmente quiere eliminar la categoria?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, eliminar',
                cancelButtonText: 'No, cancelar',
                closeOnConfirm: false,
                closeOnCancel: true
            }, (isConfirm) => {

                if (isConfirm) {
                    const request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
                    const ajaxDelUsuario = base_url + '/Categorias/delCategoria';
                    const strData = 'idcategoria=' + idcategoria;
                    request.open('POST', ajaxDelUsuario, true);
                    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                    request.send(strData);
                    request.onreadystatechange = () => {
                        if (request.readyState == 4 && request.status == 200) {
                            const objData = JSON.parse(request.responseText);
                            if (objData.status) {
                                swal('Eliminar!', objData.msg, 'success');
                                tableCategorias.ajax.reload()
                            } else {
                                swal('Atencion!', objData.msg, 'error');
                            }
                        }
                    }
                }

            })

        })
    })
}


const openModal = () => {
    removePhoto()
    rowTable = "";
    document.querySelector('#idCategoria').value = "";
    document.querySelector('.modal-header').classList.replace("headerUpdate", "headerRegister");
    document.querySelector('#btnActionForm').classList.replace("btn-info", "btn-primary");
    document.querySelector('#btnText').innerHTML = "Guardar";
    document.querySelector('#titleModal').innerHTML = "Nueva Categoria";
    document.querySelector("#formCategoria").reset();
    $('#modalFormCategorias').modal('show');
}