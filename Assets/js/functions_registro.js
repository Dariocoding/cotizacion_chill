document.addEventListener('DOMContentLoaded',() => {
    if(document.querySelector('#formRegistro')){
        const formRegistro = document.querySelector('#formRegistro')

        formRegistro.addEventListener('submit',(e) => {
            e.preventDefault();
    
            const strNombre = formRegistro['txtNombres'].value
            const strApellido = formRegistro['txtApellidos'].value
            const strIdentificacion = formRegistro['txtIdentificacion'].value
            const strTelefono = formRegistro['txtTelefono'].value
            const strCorreo = formRegistro['txtCorreo'].value
            const strPass = formRegistro['txtPass'].value
            const strPassConfirm = formRegistro['txtPassConfirm'].value
            const btnRegistro = formRegistro['btnRegistro']
    
    
            if(strNombre == '' || strApellido == '' || strIdentificacion == '' || strTelefono == '' ||
            strCorreo == '' || strPass == '' || strPassConfirm == ''){
                swal('','Todos los datos son obligatorios','warning');
                return false
            }
    
            if(strPass.length < 5){
                swal('Atención.','La contraseña debe tener un mínimo de 5 caracteres.', 'info');
                return false;
            }
            
            if(strPass != strPassConfirm){
                swal('Atención.','Las contraseñas no son iguales.', 'info');
                return false;
            }
    
            const elementsValid = document.getElementsByClassName('valid');
            for (let i = 0; i < elementsValid.length; i++) {
                if (elementsValid[i].classList.contains('is-invalid')) {
                    swal('Atención!', 'Por favor verifique los campos en rojo', 'error');
                    return false;
                }
            }
            btnRegistro.setAttribute('disabled',true)
    
            const request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            const ajaxUrl = base_url + '/Registro/setCliente';
            const formData = new FormData(formRegistro);
            request.open('POST', ajaxUrl, true);
            request.send(formData);
            request.onreadystatechange = () => {
                if (request.readyState == 4 && request.status == 200) {
                    const objData = JSON.parse(request.responseText);
    
                    if (objData.status) {
                        formRegistro.reset();
                        swal('', objData.msg, 'success');
                    } else {
                        swal('Error', objData.msg, 'error')
                    }
                    btnRegistro.removeAttribute('disabled')
                    return false
                }
            }
    
        })
    }

})