let tableUsuarios;
let rowTable = ""
const divLoading = document.querySelector('#divLoading');
document.addEventListener('DOMContentLoaded', () => {

    if(document.querySelector('#tableUsuarios')){
        tableUsuarios = $('#tableUsuarios').DataTable({
            aProcessing: true,
            aServerSide: true,
            language: spanish_json,
            ajax: {
                url: ' ' + base_url + '/Usuarios/getUsuarios',
                dataSrc: ''
            },

            columns: [{
                    data: 'idpersona'
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
                    data: 'nombrerol'
                },
                {
                    data: 'status'
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
                    'className': 'btn btn-secondary',
                    'exportOptions': {
                        "columns": [0,1,2,3,4,5]
                    }
                },
                {
                    'extend': 'excelHtml5',
                    'text': '<i class="fas fa-file-excel"></i> Excel',
                    'titleAttr': 'Exportar a Excel',
                    'className': 'btn btn-success',
                    'exportOptions': {
                        "columns": [0,1,2,3,4,5]
                    }
                },
                {
                    'extend': 'pdfHtml5',
                    'text': '<i class="fas fa-file-pdf"></i> PDF',
                    'titleAttr': 'Exportar a PDF',
                    'className': 'btn btn-danger',
                    'exportOptions': {
                        "columns": [0,1,2,3,4,5]
                    }
                },
                {
                    'extend': 'csvHtml5',
                    'text': '<i class="fas fa-file-csv"></i> CSV',
                    'titleAttr': 'Exportar a CSV',
                    'className': 'btn btn-info',
                    'exportOptions': {
                        "columns": [0,1,2,3,4,5]
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
        tableUsuarios.on('draw', () => {
            fntViewUsuario();
            fntEditUsuario();
            fntDelUsuario();

        })
    }

    if (document.querySelector('#formUsuarios')) {
        const formUsuario = document.querySelector('#formUsuarios')
        formUsuario.onsubmit = (e) => {
            e.preventDefault();
            const strIdentificacion = formUsuario['txtIdentificacion'].value
            const strNombre = formUsuario['txtNombre'].value
            const strApellido = formUsuario['txtApellido'].value
            const strEmail = formUsuario['txtEmail'].value
            const intTelefono = formUsuario['txtTelefono'].value
            const intTipousuario = formUsuario['listRolid'].value
            const intStatus = document.querySelector('#listStatus').value;

            if (strIdentificacion == '' || strNombre == '' || strApellido == '' ||
                strEmail == '' || intTelefono == '' || intTipousuario == '') {
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
            const ajaxUrl = base_url + '/Usuarios/setUsuario';
            const formData = new FormData(formUsuario);
            request.open('POST', ajaxUrl, true);
            request.send(formData);
            request.onreadystatechange = () => {
                if (request.readyState == 4 && request.status == 200) {
                    const objData = JSON.parse(request.responseText);

                    if (objData.status) {
                        if(rowTable == ""){
                            tableUsuarios.ajax.reload();
                        }else{
                            const htmlStatus = intStatus == 1 ? 
                            '<span class="badge badge-success">Activo</span>' : 
                            '<span class="badge badge-danger">Inactivo</span>';
                            rowTable.cells[1].textContent = strNombre;
                            rowTable.cells[2].textContent = strApellido;
                            rowTable.cells[3].textContent = strEmail;
                            rowTable.cells[4].textContent = intTelefono;
                            rowTable.cells[5].textContent = document.querySelector("#listRolid").selectedOptions[0].text;
                            rowTable.cells[6].innerHTML = htmlStatus;
                        }
                        $('#modalFormUsuario').modal('hide');
                        formUsuario.reset()
                        swal('Usuarios', objData.msg, 'success');
                    } else {
                        swal('Error', objData.msg, 'error')
                    }
                    divLoading.style.display = 'none';
                    return false
                }
            }


        }
    }

    // Actualizar Perfil
    if (document.querySelector('#formPerfil')) {

        const formPerfil = document.querySelector('#formPerfil')

        formPerfil.onsubmit = (e) => {
            e.preventDefault();
            const strIdentificacion = formPerfil['txtIdentificacion'].value
            const strNombre = formPerfil['txtNombre'].value
            const strApellido = formPerfil['txtApellido'].value
            const intTelefono = formPerfil['txtTelefono'].value
            const strPassword = formPerfil['txtPassword'].value
            const strPasswordConfirm = formPerfil['txtPasswordConfirm'].value

            if (strIdentificacion == '' || strNombre == '' || strApellido == '' ||
                intTelefono == '') {
                swal('Atencion', 'Todos los campos son obligatorios.', 'error');
                return false;
            }

            if (strPassword != "" || strPasswordConfirm != "") {
                if (strPassword != strPasswordConfirm) {
                    swal('Atención', 'Las contraseñas no son iguales.', 'info')
                    return false
                }
                if (strPassword.length < 5) {
                    swal('Atención', 'La contraseña debe tener un mínimo de 5 caracteres.', 'info')
                    return false
                }
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
            const ajaxUrl = base_url + '/Usuarios/putPerfil';
            const formData = new FormData(formPerfil);
            request.open('POST', ajaxUrl, true);
            request.send(formData);
            request.onreadystatechange = () => {
                if (request.readyState != 4) return;
                if (request.status == 200) {
                    const objData = JSON.parse(request.responseText);
                    if (objData.status) {
                        $('#modalFormPerfil').modal('hide');
                        swal({
                            title: '',
                            text: objData.msg,
                            type: 'success',
                            confirmButtonText: 'Aceptar',
                            closeOnConfirm: false
                        }, (isConfirm) => {
                            if (isConfirm) {
                                location.reload();
                            }
                        })
                    } else {
                        swal('Error', objData.msg, 'error');
                    }
                    divLoading.style.display = 'none';
                    return false
                }

            }


        }
    }

    // Actualizar Datos Fiscales
    if (document.querySelector('#formDataFiscal')) {

        const formDataFiscal = document.querySelector('#formDataFiscal')

        formDataFiscal.onsubmit = (e) => {
            e.preventDefault();
            const strNit = formDataFiscal['txtNit'].value
            const strNombreFiscal = formDataFiscal['txtNombreFiscal'].value
            const strDirFiscal = formDataFiscal['txtDirFiscal'].value

            if (strNit == '' || strNombreFiscal == ''  || strDirFiscal == '') {
                swal('Atencion', 'Todos los campos son obligatorios.', 'error');
                return false;
            }
            divLoading.style.display = 'flex';
            const request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            const ajaxUrl = base_url + '/Usuarios/putDFiscal';
            const formData = new FormData(formDataFiscal);
            request.open('POST', ajaxUrl, true);
            request.send(formData);
            request.onreadystatechange = () => {
                if (request.readyState != 4) return;
                if (request.status == 200) {
                    const objData = JSON.parse(request.responseText);
                    if (objData.status) {
                        $('#modalFormPerfil').modal('hide');
                        swal({
                            title: '',
                            text: objData.msg,
                            type: 'success',
                            confirmButtonText: 'Aceptar',
                            closeOnConfirm: false
                        }, (isConfirm) => {
                            if (isConfirm) {
                                location.reload();
                            }
                        })
                    } else {
                        swal('Error', objData.msg, 'error');
                    }
                    divLoading.style.display = 'none';
                    return false
                }


            }


        }
    }
}, false)

const fntViewUsuario = () => {
    const btnViewUsuario = document.querySelectorAll('.btnViewUsuario');
    btnViewUsuario.forEach(btnViewUsuario => {
        btnViewUsuario.addEventListener('click', (e) => {
            const idpersona = btnViewUsuario.getAttribute('us');
            const request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            const ajaxUrl = base_url + '/Usuarios/getUsuario/' + idpersona;
            request.open('GET', ajaxUrl, true);
            request.send();
            request.onreadystatechange = () => {
                if (request.readyState == 4 && request.status == 200) {
                    const objData = JSON.parse(request.responseText);

                    if (objData.status) {
                        const data = objData.data
                        const estadoUsuario = data.status == 1 ?
                            '<span class="badge badge-success">Activo</span>' :
                            '<span class="badge badge-danger">Inactivo</span>';
                        document.querySelector('#celIdentificacion').innerHTML = data.identificacion;
                        document.querySelector('#celNombre').innerHTML = data.nombres;
                        document.querySelector('#celApellido').innerHTML = data.apellidos;
                        document.querySelector('#celTelefono').innerHTML = data.telefono;
                        document.querySelector('#celEmail').innerHTML = data.email_user;
                        document.querySelector('#celTipoUsuario').innerHTML = data.nombrerol;
                        document.querySelector('#celEstado').innerHTML = estadoUsuario;
                        document.querySelector('#celFechaRegistro').innerHTML = data.fechaRegistro;
                        $('#modalViewUser').modal('show')
                    } else {
                        swal('Error', objData.msg, 'error');

                    }
                }
            }
        })
    })
}

const fntEditUsuario = () => {
    const btnEditUsuario = document.querySelectorAll('.btnEditUsuario');
    btnEditUsuario.forEach(btnEditUsuario => {
        btnEditUsuario.addEventListener('click', (e) => {
            rowTable = btnEditUsuario.parentNode.parentNode.parentNode
            document.querySelector('#titleModal').innerHTML = "Actualizar Usuario";
            document.querySelector('.modal-header').classList.replace("headerRegister", "headerUpdate");
            document.querySelector('#btnActionForm').classList.replace("btn-primary", "btn-info");
            document.querySelector('#btnText').innerHTML = "Actualizar";
            const idpersona = btnEditUsuario.getAttribute('us');
            const request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            const ajaxUrl = base_url + '/Usuarios/getUsuario/' + idpersona;
            request.open('GET', ajaxUrl, true);
            request.send();
            request.onreadystatechange = () => {
                if (request.readyState == 4 && request.status == 200) {
                    const objData = JSON.parse(request.responseText);

                    if (objData.status) {
                        const formUsuario = document.querySelector('#formUsuarios');
                        const data = objData.data
                        formUsuario['idUsuario'].value = data.idpersona
                        formUsuario['txtIdentificacion'].value = data.identificacion
                        formUsuario['txtNombre'].value = data.nombres
                        formUsuario['txtApellido'].value = data.apellidos
                        formUsuario['txtEmail'].value = data.email_user
                        formUsuario['txtTelefono'].value = data.telefono
                        formUsuario['listRolid'].value = data.idrol
                        $('#listRolid').selectpicker('render')
                        if (data.status == 1) {
                            formUsuario['listStatus'].value = 1;
                        } else {
                            formUsuario['listStatus'].value = 2;
                        }
                        $('#listStatus').selectpicker('render')
                        $('#modalFormUsuario').modal('show')
                    } else {
                        swal('Error', objData, 'error')
                    }
                }
            }
        })
    })
}

const fntDelUsuario = () => {
    const btnDelUsuario = document.querySelectorAll('.btnDelUsuario');
    btnDelUsuario.forEach(btnDelUsuario => {
        btnDelUsuario.addEventListener('click', function(e) {
            const idususuario = this.getAttribute('us');
            swal({
                title: 'Eliminar usuario',
                text: '¿Realmente quiere eliminar el usuario?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, eliminar',
                cancelButtonText: 'No, cancelar',
                closeOnConfirm: false,
                closeOnCancel: true
            }, (isConfirm) => {

                if (isConfirm) {
                    const request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
                    const ajaxDelUsuario = base_url + '/Usuarios/delUsuario/';
                    const strData = 'idUsuario=' + idususuario;
                    request.open('POST', ajaxDelUsuario, true);
                    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                    request.send(strData);
                    request.onreadystatechange = () => {
                        if (request.readyState == 4 && request.status == 200) {
                            const objData = JSON.parse(request.responseText);
                            if (objData.status) {
                                swal('Eliminar!', objData.msg, 'success');
                                tableUsuarios.ajax.reload()
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
    document.querySelector('#titleModal').innerHTML = "Nuevo Usuario";
    document.querySelector("#formUsuarios").reset();
    $('#modalFormUsuario').modal('show');
}

const fntRolesUsuario = () => {
    if (document.querySelector('#listRolid')) {
        const ajaxUrl = base_url + '/Roles/getSelectRoles';
        const request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
        request.open('GET', ajaxUrl, true);
        request.send();
        request.onreadystatechange = () => {
            if (request.readyState == 4 && request.status == 200) {
                const select = document.querySelector('#listRolid')
                select.innerHTML = request.responseText;
                $(select).selectpicker('render');

            }
        }
    }

}

const openModalPerfil = () => {
    $('#modalFormPerfil').modal('show')
}

window.addEventListener('load', () => {
    fntRolesUsuario();
})