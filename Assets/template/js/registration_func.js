let currentValue = [];
let tienda = '';
/*  Wizard */
	jQuery(function ($) {
		"use strict";
		// Chose here which method to send the email, available:
		// Simple phpmail text/plain > registration.php (default)
		// Phpmaimer text/html > phpmailer/registration_phpmailer.php
		// Phpmaimer text/html SMPT > phpmailer/registration_phpmailer_smpt.php
		// PHPmailer with html template > phpmailer/registration_phpmailer_template.php
		// PHPmailer with html template SMTP> phpmailer/registration_phpmailer_template_smtp.php
		$('form#wrapped').attr('action', 'registration.php');
		$("#wizard_container").wizard({
			stepsWrapper: "#wrapped",
			submit: ".submit",
			beforeSelect: function (event, state) {
				if ($('input#website').val().length != 0) {
					return false;
				}

				if (!state.isMovingForward) return true;

				var inputs = $(this).wizard('state').step.find(':input');
				return !inputs.length || !!inputs.valid();
			},
		}).validate({
			errorPlacement: function (error, element) {
				if (element.is(':radio') || element.is(':checkbox')) {
					error.insertBefore(element.next());
				} else {
					error.insertAfter(element);
				}
			}
		});
		//  progress bar
		$("#progressbar").progressbar();
		$("#wizard_container").wizard({
			afterSelect: function (event, state) {
				$("#progressbar").progressbar("value", state.percentComplete);
				$("#location").text("(" + state.stepsComplete + "/" + state.stepsPossible + ")");
			}
		});
		// Validate select and password match
		$('#wrapped').validate({
			ignore: [],
			rules: {
				select: {
					required: true
				},
				 password1: {
                	required: true,
                    minlength : 5
                },
                password2: {
                	required: true,
                    minlength : 5,
                    equalTo : "#password1"
                }
			},
			errorPlacement: function (error, element) {
				if (element.is('select:hidden')) {
					error.insertAfter(element.next('.nice-select'));
				} else {
					error.insertAfter(element);
				}
			}
		});	

		resize();

		$(window).resize(resize);
		  

	});

function handleClick(myRadio) {
	

	preguntosihaypago = myRadio.value == 'no' ? true : false;

	if(preguntosihaypago){
		document.querySelector('#preguntarwhatssap').style.display = 'block';
		document.querySelector('#cotizacionwhatssap').className = 'required';
		document.querySelector('#nocotizacionwhatssap').className = 'required';
	}else{
		document.querySelector('#preguntarwhatssap').style.display = 'none';
		document.querySelector('#cotizacionwhatssap').className = '';
		document.querySelector('#nocotizacionwhatssap').className = '';
	}

	document.querySelector('#nocotizacionwhatssap').checked  = false
	document.querySelector('#nocotizacionwhatssap').checked = false

}

function getVals(element,controlType) {
	const value = element.value
	const e_commerce = 'https://decofixsoluciones.com';
	const web_blog = 'https://lachicadejengibre.com';
	const web_negocio = 'https://distribuidorasaovicente.com';
	const web_emprendedores = 'https://gaconsultoresglobales.com';
	switch (controlType) {

		// Que tipo de página web estás buscando? 
		case 'question_1':
			if(currentValue.length >= 2){
				currentValue = [];

				const radios = document.querySelectorAll('input[type=radio]')

				radios.forEach(radio => {
					if(radio.getAttribute('name') != 'question_1'){
						radio.checked = false
					}
				})

				document.querySelector('#preguntarwhatssap').style.display = 'none';
				document.querySelector('#cotizacionwhatssap').className = '';
				document.querySelector('#nocotizacionwhatssap').className = '';
			}


			if(value == 'Tienda Online'){
				currentValue[0] = 100;
				document.querySelector('#wrapper-webs-cotizacion').innerHTML = htmlwebs(e_commerce)
			}else if(value == 'Web con blog'){
				currentValue[0] = 50;
				document.querySelector('#wrapper-webs-cotizacion').innerHTML = htmlwebs(web_blog)
			}else if(value == 'Web para emprendedor'){
				currentValue[0] = 50;
				document.querySelector('#wrapper-webs-cotizacion').innerHTML = htmlwebs(web_emprendedores)
			}else if(value == 'Web para negocio'){
				currentValue[0] = 100;
				document.querySelector('#wrapper-webs-cotizacion').innerHTML = htmlwebs(web_negocio);
			}

			tienda = value

		break;
		//En tu página web se van a realizar pagos?
		case 'question_2':

			if(value == 'si'){
				if(tienda == 'Web con blog' || tienda == 'Web para negocio'){
					currentValue[1] = 100;
				}else{
					currentValue[1] = 70;
				}
			}else{
				currentValue[1] = 0;
			}

			handleClick(element)

		break;
		
		// Que diseño quieres que tenga tu página?
		case 'question_4':

			if(value == 'Tengo un boceto'){
				if(tienda == 'Web con blog' || tienda == 'Web para negocio'){
					currentValue[2] = 40;
				}else{
					currentValue[2] = 50;
				}
			}else if(value == 'Estoy abierto a propuestas'){
				if(tienda == 'Web con blog' || tienda == 'Web para negocio'){
					currentValue[2] = 40;
				}else{
					currentValue[2] = 50;
				}
			}else if(value == 'Tengo una idea exacta'){
				if(tienda == 'Web con blog' || tienda == 'Web para negocio'){
					currentValue[2] = 60;
				}else{
					currentValue[2] = 80;
				}
			}else if(value == 'Tengo una plantilla'){
				if(tienda == 'Web con blog' || tienda == 'Web para negocio'){
					currentValue[2] = 30;
				}else{
					currentValue[2] = 50;
				}
			}else if(value == 'Tengo una web modelo'){
				if(tienda == 'Web con blog' || tienda == 'Web para negocio'){
					currentValue[2] = 30;
				}else{
					currentValue[2] = 50;
				}
			}

		break;
		// ¿Qué tan grande necesitas tu página web?
		case 'question_5': 

			if(value == 'Muy pequeña (Hasta 3 secciones)'){
				currentValue[3] = 10;
			}else if(value == 'Pequeña (Hasta 5 secciones)'){
				currentValue[3] = 15;
			}else if(value == 'Mediana (Hasta 10 secciones y 3 subpáginas)'){
				currentValue[3] = 40;
			}else if(value == 'Grande (Entre 11 y 20 secciones y hasta 6 sub-páginas)'){
				currentValue[3] = 80;
			}else if(value == 'Gigante (Hasta 50 secciones y 15 sub-páginas)'){
				currentValue[3] = 150;
			}
		break;

		// ¿Tú página web necesita login o registro de usuarios?
		case 'question_6': 


			if(value == 'si'){
				if(tienda == 'Web con blog'){
					currentValue[4] = 50;
				}else if(tienda == 'Web para negocio'){
					currentValue[4] = 70;
				}else{
					currentValue[4] = 30;
				}
			}else{
				currentValue[4] = 0;
			}

		break;
		
		// ¿Va a ser una página web multidioma? 
		case 'question_7': 

			if(value == 'Solo en español'){
				currentValue[4] = 0;

			}else if(value == 'Solo en inglés'){
				currentValue[4] = 0;

			}else if(value == 'En español / inglés'){
				currentValue[4] = 100;

			}else if(value == 'Más de 2 idiomas'){
				currentValue[4] = 200;

			}

		break;

		//  ¿Deseas posicionar de forma natural tu Página Web en Google?
		case 'question_8': 

			if(value == 'si'){
				currentValue[5] = 50;
	
			}else {
				currentValue[5] = 0;

			}
	
		break;

		//  ¿Cómo deseas actualizar tu Página Web?
		case 'question_9': 

			if(value == 'Actualizaciones por parte de ustedes'){
				if(tienda == 'Web para negocio'){
					currentValue[6] = 100;
				}else if(tienda == 'Web con blog'){
					currentValue[6] = 60;

				}else {
					currentValue[6] = 50;
				}

			}else {
				currentValue[6] = 0;

			}

		break;

		// ¿En qué etapa se encuentra tu página web?
		case 'question_10': 

			if(value == 'Aún no comienzo'){
				currentValue[7] = 65;

	
			}else if(value == 'Ya tengo el dominio'){
				currentValue[7] = 60;

			}else if(value == 'Ya tengo el hosting'){
				currentValue[7] = 15;

			}else if(value == 'Ya tengo dominio y hosting'){
				currentValue[7] = 0;

			}
		break;


	}

	changeValue()
}

function frameLoaded(e){
	e.target.style.display = 'block'
	$('#content-spinners').remove();
}

function changeValue(){
	if(currentValue.length == 0){
		document.querySelector('#cotizaciontotal').innerHTML = '0$';
	}else{
		total = 0
		for (let i = 0; i < currentValue.length; i++) {
			total += currentValue[i];
		}
		document.querySelector('#cotizaciontotal').innerHTML = total + '$';
		document.querySelector('#totalCotizacionFinalStep').innerHTML = total + '$'

	}
}

function htmlwebs(name_web){
	document.querySelector('#wrapper-webs-cotizacion').classList = 'col-lg-6 content-left p-0 m-0 '

	const web = `
		<h2 class="text-center font-italic font-weight-bolder text-white p-3 m-0">Web Modelo</h2>
		<div class="d-flex justify-content-center mt-5" id="content-spinners">
			<div class="spinner-grow text-primary m-2" role="status">
			<span class="sr-only">Loading...</span>
			</div>
			<div class="spinner-grow text-secondary m-2" role="status">
				<span class="sr-only">Loading...</span>
			</div>
			<div class="spinner-grow text-success m-2" role="status">
				<span class="sr-only">Loading...</span>
			</div>
		</div>

		<iframe onload="frameLoaded(event);" style="display:none" width="100%" height="100%" src="${name_web}" frameborder="0"></iframe>
	`

	return web
}

function resize(){
	const container = document.querySelector('#wrapper-webs-cotizacion').parentElement
	const childrens = container.children

	if(window.innerWidth <= 991){
		container.style.display = 'flex';
		childrens[0].style.order = 2;
		childrens[1].style.order = 1;
		childrens[0].style.height = '550px'

	}else{
		childrens[0].style.order = 1;
		childrens[1].style.order = 2;
		childrens[0].style.height = ''
	}
}