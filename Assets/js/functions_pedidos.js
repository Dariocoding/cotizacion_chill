let tablePedidos
const divLoading = document.querySelector('#divLoading');
document.addEventListener('DOMContentLoaded', () => {
    if(document.querySelector('#tablePedidos')){
        tablePedidos = $('#tablePedidos').DataTable({
            aProcessing: true,
            aServerSide: true,
            language: spanish_json,
            ajax: {
                url: ' ' + base_url + '/Pedidos/getPedidos',
                dataSrc: ''
            },
    
            columns: [{
                    data: 'idpedido'
                },
                {
                    data: 'transaccion'
                },
                {
                    data: 'fecha'
                },
                {
                    data: 'monto'
                },
                {
                    data: 'tipopago'
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
                        "columns": [0,1,2,3,4]
                    }
                },
                {
                    'extend': 'excelHtml5',
                    'text': '<i class="fas fa-file-excel"></i> Excel',
                    'titleAttr': 'Exportar a Excel',
                    'className': 'btn btn-success',
                    'exportOptions': {
                        "columns": [0,1,2,3,4]
                    }
                },
                {
                    'extend': 'pdfHtml5',
                    'text': '<i class="fas fa-file-pdf"></i> PDF',
                    'titleAttr': 'Exportar a PDF',
                    'className': 'btn btn-danger',
                    'exportOptions': {
                        "columns": [0,1,2,3,4]
                    }
                },
                {
                    'extend': 'csvHtml5',
                    'text': '<i class="fas fa-file-csv"></i> CSV',
                    'titleAttr': 'Exportar a CSV',
                    'className': 'btn btn-info',
                    'exportOptions': {
                        "columns": [0,1,2,3,4]
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
    }

})

function fntTransaccion(idTransaccion){
    const request = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    const ajaxUrl = base_url + '/pedidos/getTransaccion/' + idTransaccion;
    divLoading.style.display = 'flex';
    request.open('GET',ajaxUrl,true);
    request.send();
    request.onreadystatechange = () => {
        if(request.readyState == 4 && request.status == 200){
            const objData = JSON.parse(request.responseText);
            if(objData.status){
                document.querySelector('#divModal').innerHTML = objData.html;
                $('#modalReembolso').modal('show');
            }else{
                swal('Error',objData.msg,'error')
            }
            divLoading.style.display = 'none';
            return false;
        }
    }
}

function fntReembolsar(){
    const idtransaccion = document.querySelector('#idtransaccion').value
    const observacion = document.querySelector('#txtObservacion').value

    if(idtransaccion == '' || observacion == ''){
        swal('','Complete los datos para continuar.','error');

        return false;
    }

    swal({
        title: 'Hacer Reembolso',
        text: '¿Realmente quiere realizar el reembolso?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, reembolsar',
        cancelButtonText: 'No, cancelar',
        closeOnConfirm: true,
        closeOnCancel: true
    }, (isConfirm) => {

        if (isConfirm) {
            $('#modalReembolso').modal('hide');
            divLoading.style.display = 'flex';
            const request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            const ajaxUrl = base_url + '/Pedidos/setReembolso/';
            let formData = new FormData();
            formData.append('idtransaccion',idtransaccion);
            formData.append('observacion',observacion);
            request.open('POST', ajaxUrl, true);
            request.send(formData);
            request.onreadystatechange = () => {
                if(request.readyState != 4) return;
                if(request.status == 200) {
                    const objData = JSON.parse(request.responseText);
                    if(objData.status){
                        window.location.reload();
                    }else{
                        swal('',objData.msg,'error');
                    }
                    divLoading.style.display = 'none';
                    return false;
                }

            }
        }

    })


}

function fntEditInfo(element,idpedido){
    rowTable = element.parentNode.parentNode.parentNode
    const request = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    const ajaxUrl = base_url+'/Pedidos/getPedido/'+idpedido;
    divLoading.style.display = 'flex';
    request.open('GET',ajaxUrl,true)
    request.send()
    request.onreadystatechange = () => {
        if(request.readyState == 4 && request.status == 200){
            const objData = JSON.parse(request.responseText);
            if(objData.status){
                document.querySelector('#divModal').innerHTML = objData.html
                $('#modalFormPedido').modal('show');
                $('select').selectpicker();
                fntUpdateInfo();
            }else{
                swal('Error',objData.msg,'error')
            }
            divLoading.style.display = 'none'
            return false
        }
    }
}

function fntUpdateInfo(){
    const formUpdatePedido = document.querySelector('#formUpdatePedio');
    formUpdatePedido.onsubmit = (e) => {
        e.preventDefault();
        let transaccion;
        if(document.querySelector('#txtTransaccion')){
            transaccion = document.querySelector('#txtTransaccion').value
            if(transaccion == ''){
                swal('','Complete los datos para continuar','error');
                return false;
            }
        }
        const request = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
        const ajaxUrl = base_url + '/Pedidos/setPedido/';
        divLoading.style.display = 'flex';
        const formData = new FormData(formUpdatePedido);
        request.open('POST',ajaxUrl,true);
        request.send(formData);
        request.onreadystatechange = () => {
            if(request.readyState != 4) return;
            if(request.status == 200){
                const objData = JSON.parse(request.responseText);
                if(objData.status){
                    swal('',objData.msg,'success')
                    $('#modalFormPedido').modal('hide');

                    if(document.querySelector('#txtTransaccion')){
                        rowTable.cells[1].textContent = document.querySelector('#txtTransaccion').value
                        rowTable.cells[4].textContent = document.querySelector('#listTipopago').selectedOptions[0].innerText;
                        rowTable.cells[5].textContent = document.querySelector('#listEstado').value
                    }else{
                        rowTable.cells[5].textContent = document.querySelector('#listEstado').value
                    }
                }else{
                    swal('',objData.msg,'error')
                }
                divLoading.style.display = 'none';
                return false;
            }
        }
    }
}