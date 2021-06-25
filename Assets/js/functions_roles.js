let tableRoles
const divLoading = document.querySelector('#divLoading');
document.addEventListener('DOMContentLoaded', () => {
    tableRoles = $('#tableRoles').DataTable({
		aProcessing:true,
		aServerSide:true,
        language: spanish_json,
        ajax: {
            url: ' '+base_url+'/Roles/getRoles',
            dataSrc : ''
        },

        columns: [
            {data: 'idrol'},
            {data: 'nombrerol'},
            {data: 'descripcion'},
            {data: 'status'},
            {data: 'options'},
        ],

        responsive: true,
        bDestroy: true,
        iDisplayLength: 10,
        order: [
            [0, 'asc']
        ],
    })

    const formRol = document.querySelector('#formRol');
    formRol.onsubmit = (e) => {
        e.preventDefault();
        const strNombre = formRol['txtNombre'].value;
        const strDescripcion = formRol['txtDescripcion'].value;
        const intStatus = formRol['listStatus'].value;

        if(strNombre == '' || strDescripcion == '' || intStatus ==''){
            swal('Atencion', 'Todos los campos son obligatorios', 'error');
            return false
        }
        divLoading.style.display = 'flex';
        const request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP')
        const ajaxUrl = base_url+ '/Roles/setRol';
        const formData = new FormData(formRol);
        request.open('POST',ajaxUrl,true)
        request.send(formData)
        request.onreadystatechange = () => {
            if(request.readyState == 4 && request.status == 200){
                const objData = JSON.parse(request.responseText);
                if(objData.status){
                    $('#modalFormRol').modal("hide");
                    formRol.reset();
                    swal('Roles de usuario', objData.msg,'success');
                    tableRoles.ajax.reload()
                }else{
                    swal('Error',objData.msg,'error');
                }
                divLoading.style.display = 'none';
                return false;
            }
        }

    }

    tableRoles.on('draw',() => {
        fntEditRol();
        fntDelRol();
        fntPermisos();
        
    })



})


const openModal = () => {
    document.querySelector('#idRol').value ="";
    document.querySelector('.modal-header').classList.replace("headerUpdate", "headerRegister");
    document.querySelector('#btnActionForm').classList.replace("btn-info", "btn-primary");
    document.querySelector('#btnText').innerHTML ="Guardar";
    document.querySelector('#titleModal').innerHTML = "Nuevo Rol";
    document.querySelector("#formRol").reset();
	$('#modalFormRol').modal('show');
}

const fntEditRol = () => {
    const btnEditRol = document.querySelectorAll(".btnEditRol");
    btnEditRol.forEach(function(btnEditRol) {
        btnEditRol.addEventListener('click', function(){

            document.querySelector('#titleModal').innerHTML ="Actualizar Rol";
            document.querySelector('.modal-header').classList.replace("headerRegister", "headerUpdate");
            document.querySelector('#btnActionForm').classList.replace("btn-primary", "btn-info");
            document.querySelector('#btnText').innerHTML ="Actualizar";

            const idrol = this.getAttribute("rl");
            const request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            const ajaxUrl  = base_url+'/Roles/getRol/'+idrol;
            request.open("GET",ajaxUrl ,true);
            request.send();

            request.onreadystatechange = function(){
                if(request.readyState == 4 && request.status == 200){
                    
                    const objData = JSON.parse(request.responseText);
                    if(objData.status)
                    {
                        document.querySelector("#idRol").value = objData.data.idrol;
                        document.querySelector("#txtNombre").value = objData.data.nombrerol;
                        document.querySelector("#txtDescripcion").value = objData.data.descripcion;

                        if(objData.data.status == 1)
                        {
                            optionSelect = '<option value="1" selected class="notBlock">Activo</option>';
                        }else{
                            optionSelect = '<option value="2" selected class="notBlock">Inactivo</option>';
                        }
                        const htmlSelect = `${optionSelect}
                                          <option value="1">Activo</option>
                                          <option value="2">Inactivo</option>
                                        `;
                        document.querySelector("#listStatus").innerHTML = htmlSelect;
                        $('#modalFormRol').modal('show');
                    }else{
                        swal("Error", objData.msg , "error");
                    }
                }
            }
            
        });
    });
}


const fntDelRol = () => {
    const btnDelRol = document.querySelectorAll('.btnDelRol');
    btnDelRol.forEach(btnDelRol => {
        btnDelRol.addEventListener('click', function (e) {
            const idrol = this.getAttribute('rl');
            swal({
                title: 'Eliminar rol',
                text: '¿Realmente quiere eliminar el rol?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, eliminar',
                cancelButtonText: 'No, cancelar',
                closeOnConfirm: false,
                closeOnCancel: true
            }, (isConfirm) => {

                if(isConfirm){
                    const request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
                    const ajaxDelRol = base_url + '/Roles/delRol/';
                    const strData = 'idrol='+idrol;
                    request.open('POST',ajaxDelRol,true);
                    request.setRequestHeader('Content-type','application/x-www-form-urlencoded');
                    request.send(strData);
                    request.onreadystatechange = () => {
                        if(request.readyState == 4 && request.status == 200){
                            const objData = JSON.parse(request.responseText);
                            if(objData.status){
                                swal('Eliminar!', objData.msg, 'success');
                                tableUsuarios.ajax.reload()
                            }else{
                                swal('Atencion!',objData.msg,'error');
                            }
                        }
                    } 
                }

            })
            
        } )
    })
}

const fntPermisos = () => {
    const btnPermisosRol = document.querySelectorAll('.btnPermisosRol');
    btnPermisosRol.forEach(btnPermisosRol => {
        btnPermisosRol.addEventListener('click', function (e) {
            const idrol = this.getAttribute('rl');
            const request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            const ajaxUrl = base_url + '/Permisos/getPermisosRol/' + idrol
            request.open('GET',ajaxUrl,true);
            request.send();

            request.onreadystatechange = () => {
                if(request.readyState == 4 && request.status == 200){
                    document.querySelector('#contentAjax').innerHTML = request.responseText;
                    $('.modalPermisos').modal('show')
                    document.querySelector('#formPermisos').addEventListener('submit',fntSavePermisos,false);
                }
            }

            
        })
    })
}

const fntSavePermisos = (event) => {
    event.preventDefault();
    const request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    const ajaxUrl = base_url + '/Permisos/setPermisos';
    const formData = new FormData(event.target);
    request.open('POST',ajaxUrl,true);
    request.send(formData);

    request.onreadystatechange = () => {
        if(request.readyState == 4 && request.status == 200){
            const objData = JSON.parse(request.responseText);
            if(objData.status)
            {
                swal('Permisos de Usuario', objData.msg, 'success')
            }else
            {
                swal('Error', objData.msg, 'error')
            }
        }
    }
}



