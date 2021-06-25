$('.login-content [data-toggle="flip"]').click(function() {
    $('.login-box').toggleClass('flipped');
    return false;
});

const divLoading = document.querySelector('#divLoading');
document.addEventListener('DOMContentLoaded', () => {
    if(document.querySelector('#formLogin')){
        const formLogin = document.querySelector('#formLogin');
        formLogin.onsubmit = (e) => {
            e.preventDefault();

            const strEmail = formLogin['txtEmail'].value
            const strPassword = formLogin['txtPassword'].value

            if(strEmail == "" || strPassword == ""){
                swal("Por favor", "Escriba usuario y contraseña", "error")
                return false;
            }
            divLoading.style.display = 'flex';
            const request = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP')
            const ajaxUrl = base_url + '/Login/LoginUser';
            const formData = new FormData(formLogin);
            request.open("POST",ajaxUrl);
            request.send(formData);

            request.onreadystatechange = () => {
                if(request.readyState == 4 && request.status == 200) {
                    const objData = JSON.parse(request.responseText);
                    if(objData.status){
                        swal('', 'Sesion iniciada correctamentte. ','success')
                        window.location.reload(false)
                    }else{
                        swal('Atencion', objData.msg,'error')
                        document.querySelector('#txtPassword').value ='';
                    }
                    divLoading.style.display = 'none';
                    return false
                }
            }

        }
    }

    if(document.querySelector('#formRecetPass')){
        const formReset = document.querySelector('#formRecetPass');
        formReset.onsubmit = (e) => {
            e.preventDefault();

            const strEmail = formReset['txtEmailReset'].value;
            if(strEmail == ''){
                swal('Por favor','Escribe tu correo Electronico.', 'error');
                return false;
            }
            divLoading.style.display = 'flex';
            const request = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            const ajaxUrl = base_url + '/Login/resetPass';
            const formData = new FormData(formReset);
            request.open('POST',ajaxUrl,true);
            request.send(formData)
            request.onreadystatechange = () => {
                if(request.readyState == 4 && request.status == 200){
                    const objData = JSON.parse(request.responseText);
                    if(objData.status){
                        swal({
                            title: '',
                            text: objData.msg,
                            type: 'success',
                            confirmButton: 'Aceptar',
                            closeOnConfirm: false,
                        }, (isConfirm) => {
                            if(isConfirm){
                            }
                        })
                    }else{
                        swal('Atencion',objData.msg,'error');
                    }
                    divLoading.style.display = 'none';
                    return false;
                }
                
            }


        }
    }

    if(document.querySelector('#formCambiarPass')){
        const formCambiarPass = document.querySelector('#formCambiarPass');
        formCambiarPass.onsubmit = (e) => {
            e.preventDefault();

            const strPassword = formCambiarPass['txtPassword'].value;
            const strPasswordConfirm = formCambiarPass['txtPasswordConfirm'].value;
            const idUsuario = formCambiarPass['idUsuario'].value;

            if(strPassword == '' || strPasswordConfirm == '' || idUsuario == ''){
                swal('Por favor','Escribe la nueva contraseña.', 'error');
                return false;
            }

            if(strPassword.length < 5){
                swal('Atención.','La contraseña debe tener un mínimo de 5 caracteres.', 'info');
                return false;
            }
            
            if(strPassword != strPasswordConfirm){
                swal('Atención.','Las contraseñas no son iguales.', 'info');
                return false;
            }
            divLoading.style.display = 'flex';
            const request = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            const ajaxUrl = base_url + '/Login/setPassword';
            const formData = new FormData(formCambiarPass);
            request.open('POST',ajaxUrl,true);
            request.send(formData)
            request.onreadystatechange = () => {
                if(request.readyState != 4) return;
                if(request.status == 200){
                    const objData = JSON.parse(request.responseText);
                    if(objData.status){
                        swal({
                            title: '',
                            text: objData.msg,
                            type: 'success',
                            confirmButtonText: 'Iniciar sesión',
                            closeOnConfirm: false 
                        }, (isConfirm) => {
                            if(isConfirm){
                                window.location = base_url+ '/login'
                            }
                        })
                }else{
                    swal('Atencion', objData.msg,'error');
                }
                divLoading.style.display = 'none';
                    
                }
                
            }


        }
    }
},false)