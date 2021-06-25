let rowTable = "";
let tableClientes = ""
const divLoading = document.querySelector('#divLoading');
document.addEventListener('DOMContentLoaded', () => {
    if(document.querySelector('#tableClientes')){
        tableClientes = $('#tableClientes').DataTable({
            aProcessing: true,
            aServerSide: true,
            language: spanish_json,
            ajax: {
                url: ' ' + base_url + '/Clientes/getClientes',
                dataSrc: ''
            },
    
            columns: [{
                    data: 'idpersona'
                },
                {
                    data: 'identificacion'
                },
                {
                    data: 'nombres'
                },
                {
                    data: 'apellidos'
                },
                {
                    data: 'email_user'
                },
                {
                    data: 'telefono'
                },
                {
                    data: 'options'
                },
    
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
    
        tableClientes.on('draw', () => {
            fntViewCliente();
            fntEditCliente();
            fntDelCliente();
    
        })
    }

    if (document.querySelector('#formCliente')) {


        const formCliente = document.querySelector('#formCliente')

        formCliente.onsubmit = (e) => {
            e.preventDefault();
            const strIdentificacion = formCliente['txtIdentificacion'].value
            const strNombre = formCliente['txtNombre'].value
            const strApellido = formCliente['txtApellido'].value
            const strEmail = formCliente['txtEmail'].value
            const intTelefono = formCliente['txtTelefono'].value

            const strNit = formCliente['txtNit'].value
            const strNomFiscal = formCliente['txtNombreFiscal'].value
            const strDirFiscal = formCliente['txtDirFiscal'].value

            if (strIdentificacion == '' || strNombre == '' || strApellido == '' ||
                strEmail == '' || intTelefono == '' || strNit == '' 
                || strNomFiscal == '' || strDirFiscal == '' ) {
                swal('Atencion', 'Todos los campos son obligatorios.', 'error');
                return false;
            }

            const elementsValid = document.getElementsByClassName('valid');
            for (let i = 0; i < elementsValid.length; i++) {
                if (elementsValid[i].classList.contains('is-invalid')) {
                    swal('Atención!', 'Por favor verifique los campos en rojo', 'error');
                    return false;
                }
            }
            divLoading.style.display = 'flex';
            const request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            const ajaxUrl = base_url + '/Clientes/setCliente';
            const formData = new FormData(formCliente);
            request.open('POST', ajaxUrl, true);
            request.send(formData);
            request.onreadystatechange = () => {
                if (request.readyState == 4 && request.status == 200) {
                    const objData = JSON.parse(request.responseText);

                    if (objData.status) {
                        if(rowTable == ""){
                            tableClientes.ajax.reload();
                        }else{
                            rowTable.cells[1].textContent = strIdentificacion;
                            rowTable.cells[2].textContent = strNombre;
                            rowTable.cells[3].textContent = strApellido;
                            rowTable.cells[4].textContent = strEmail;
                            rowTable.cells[5].textContent = intTelefono;
                        }
                        $('#modalFormCliente').modal('hide');
                        formCliente.reset()
                        swal('Clientes', objData.msg, 'success');
                    } else {
                        swal('Error', objData.msg, 'error')
                    }
                    divLoading.style.display = 'none';
                    return false
                }
            }


        }
    }
}, false)

const fntViewCliente = () => {
    const btnViewCliente = document.querySelectorAll('.btnViewCliente');
    btnViewCliente.forEach(btnViewCliente => {
        btnViewCliente.addEventListener('click', (e) => {
            const idpersona = btnViewCliente.getAttribute('cl');
            const request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            const ajaxUrl = base_url + '/Clientes/getCliente/' + idpersona;
            request.open('GET', ajaxUrl, true);
            request.send();
            request.onreadystatechange = () => {
                if (request.readyState == 4 && request.status == 200) {
                    const objData = JSON.parse(request.responseText);

                    if (objData.status) {
                        const data = objData.data
                        document.querySelector('#celIdentificacion').innerHTML = data.identificacion;
                        document.querySelector('#celNombre').innerHTML = data.nombres;
                        document.querySelector('#celApellido').innerHTML = data.apellidos;
                        document.querySelector('#celTelefono').innerHTML = data.telefono;
                        document.querySelector('#celEmail').innerHTML = data.email_user;
                        document.querySelector('#celIde').innerHTML = data.nit;
                        document.querySelector('#celNomFiscal').innerHTML = data.nombrefiscal;
                        document.querySelector('#celDirFiscal').innerHTML = data.direccionfiscal;

                        document.querySelector('#celFechaRegistro').innerHTML = data.fechaRegistro;
                        $('#modalViewCliente').modal('show')
                    } else {
                        swal('Error', objData.msg, 'error');

                    }
                }
            }
        })
    })
}

const fntEditCliente = () => {
    const btnEditCliente = document.querySelectorAll('.btnEditCliente');
    btnEditCliente.forEach(btnEditCliente => {
        btnEditCliente.addEventListener('click', (e) => {
            rowTable = btnEditCliente.parentNode.parentNode.parentNode
            document.querySelector('#titleModal').innerHTML = "Actualizar Cliente";
            document.querySelector('.modal-header').classList.replace("headerRegister", "headerUpdate");
            document.querySelector('#btnActionForm').classList.replace("btn-primary", "btn-info");
            document.querySelector('#btnText').innerHTML = "Actualizar";
            const idpersona = btnEditCliente.getAttribute('cl');
            const request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            const ajaxUrl = base_url + '/Clientes/getCliente/' + idpersona;
            request.open('GET', ajaxUrl, true);
            request.send();
            request.onreadystatechange = () => {
                if (request.readyState == 4 && request.status == 200) {
                    const objData = JSON.parse(request.responseText);

                    if (objData.status) {
                        const formCliente = document.querySelector('#formCliente');
                        const data = objData.data
                        formCliente['idUsuario'].value = data.idpersona
                        formCliente['txtIdentificacion'].value = data.identificacion
                        formCliente['txtNombre'].value = data.nombres
                        formCliente['txtApellido'].value = data.apellidos
                        formCliente['txtEmail'].value = data.email_user
                        formCliente['txtTelefono'].value = data.telefono
                        formCliente['txtNit'].value = data.nit
                        formCliente['txtNombreFiscal'].value = data.nombrefiscal
                        formCliente['txtDirFiscal'].value = data.direccionfiscal
                        $('#modalFormCliente').modal('show')
                    } else {
                        swal('Error', objData, 'error')
                    }
                }
            }
        })
    })
}

const fntDelCliente = () => {
    const btnDelCliente = document.querySelectorAll('.btnDelCliente');
    btnDelCliente.forEach(btnDelCliente => {
        btnDelCliente.addEventListener('click', function(e) {
            const idcliente = this.getAttribute('cl');
            swal({
                title: 'Eliminar cliente',
                text: '¿Realmente quiere eliminar el cliente?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, eliminar',
                cancelButtonText: 'No, cancelar',
                closeOnConfirm: false,
                closeOnCancel: true
            }, (isConfirm) => {

                if (isConfirm) {
                    const request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
                    const ajaxDelUsuario = base_url + '/Clientes/delCliente/';
                    const strData = 'idCliente=' + idcliente;
                    request.open('POST', ajaxDelUsuario, true);
                    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                    request.send(strData);
                    request.onreadystatechange = () => {
                        if (request.readyState == 4 && request.status == 200) {
                            const objData = JSON.parse(request.responseText);
                            if (objData.status) {
                                swal('Eliminar!', objData.msg, 'success');
                                tableClientes.ajax.reload()
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
    rowTable = "";
    document.querySelector('#idUsuario').value = "";
    document.querySelector('.modal-header').classList.replace("headerUpdate", "headerRegister");
    document.querySelector('#btnActionForm').classList.replace("btn-info", "btn-primary");
    document.querySelector('#btnText').innerHTML = "Guardar";
    document.querySelector('#titleModal').innerHTML = "Nuevo Cliente";
    document.querySelector("#formCliente").reset();
    $('#modalFormCliente').modal('show');
}