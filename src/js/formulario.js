'use strict';

const formulario = $('#form-perfume');
let idEdicion = Number(new URLSearchParams(location.search).get('id')) || null;
let imagenElegida = null; // Data URL de la imagen nueva, si el usuario eligió una.

const CAMPOS_VALIDABLES = [
	'nombre',
	'marca',
	'categoria',
	'precio',
	'stock',
	'stock-minimo'
].map(id => $('#' + id));

// Preparación
function llenarMarcasSugeridas() {
	const marcas = [...new Set(cargarPerfumes().map(perfume => perfume.marca))];

	$('#marcas-sugeridas').replaceChildren(...marcas.map(marca => {
		const opcion = document.createElement('option');
		opcion.value = marca;
		return opcion;
	}));
}

function precargarPerfume(perfume) {
	$('#perfume-id').value = perfume.id;
	$('#nombre').value = perfume.nombre;
	$('#marca').value = perfume.marca;
	$('#categoria').value = perfume.categoria;
	$('#aroma').value = perfume.aroma;
	$('#precio').value = perfume.precio;
	$('#stock').value = perfume.stock;
	$('#stock-minimo').value = perfume.stockMinimo;
	$('#descripcion').value = perfume.descripcion;

	const vista = $('#vista-previa');
	vista.src = rutaImagen(perfume);
	vista.hidden = false;

	$('#titulo-formulario').textContent = 'Editar perfume';
	$('#boton-guardar').textContent = 'Guardar cambios';
	document.title = 'Editar perfume · Herrera Perfumes Manager';
}

// Validación
function mensajeDeError(campo) {
	const validez = campo.validity;

	if (validez.valueMissing) return 'Este campo es obligatorio.';
	if (validez.tooShort) return `Escribe al menos ${campo.minLength} caracteres.`;
	if (validez.rangeUnderflow) return `El valor mínimo es ${campo.min}.`;
	if (validez.stepMismatch || validez.badInput) return 'Escribe un número entero.';

	return campo.validationMessage;
}

function validarCampo(campo) {
	if (campo.type === 'text') campo.value = campo.value.trim();

	const mensaje = campo.checkValidity() ? '' : mensajeDeError(campo);
	$('#error-' + campo.id).textContent = mensaje;
	campo.setAttribute('aria-invalid', mensaje ? 'true' : 'false');

	return mensaje;
}

function mostrarResumenErrores(errores) {
	const resumen = $('#resumen-error');
	const items = errores.map(({ campo, mensaje }) => {
		const etiqueta = $(`label[for='${campo.id}']`).textContent.replace('*', '').trim();
		const enlace = document.createElement('a');
		enlace.href = '#' + campo.id;
		enlace.textContent = `${etiqueta}: ${mensaje}`;

		const elemento = document.createElement('li');
		elemento.append(enlace);
		return elemento;
	});

	$('ul', resumen).replaceChildren(...items);
	resumen.hidden = false;
	resumen.focus(); // tabindex="-1" permite enfocarlo y anunciarlo a lectores de pantalla.
}

// Imagen
const TAMANO_MAXIMO = 1024 * 1024; // 1 MB, como indica el HTML.

$('#imagen').addEventListener('change', evento => {
	const archivo = evento.target.files[0];
	const error = $('#error-imagen');

	error.textContent = '';
	imagenElegida = null;

	if (!archivo) return;

    if (!archivo.type.startsWith('image/')) {    
        error.textContent = 'El archivo debe ser una imagen.';    
        evento.target.value = '';    return;  
    }  
    
    if (archivo.size > TAMANO_MAXIMO) {    
        error.textContent = 'La imagen supera 1 MB.';    evento.target.value = '';    return;  
    }  
    
    const lector = new FileReader();  lector.addEventListener('load', () => {    
        imagenElegida = lector.result;    const vista = $('#vista-previa');    
        vista.src = imagenElegida;    
        vista.hidden = false;  
    });  
    lector.readAsDataURL(archivo); 
});

// ---------- Guardar ---------- 

function leerFormulario() {  
    return {    
        nombre: $('#nombre').value.trim(),    
        marca: $('#marca').value.trim(),    
        categoria: $('#categoria').value,    
        aroma: $('#aroma').value.trim() || 'Sin especificar',    
        precio: Number($('#precio').value),    
        stock: Number($('#stock').value),    
        stockMinimo: Number($('#stock-minimo').value),    
        descripcion: $('#descripcion').value.trim() || 'Sin descripción disponible.'  
    }; 
} 

formulario.addEventListener('submit', evento => {  
    evento.preventDefault();   
    const errores = CAMPOS_VALIDABLES    
    .map(campo => ({ campo, mensaje: validarCampo(campo) }))    
    .filter(({ mensaje }) => mensaje !== '');  
    
    if (errores.length > 0) {    
        mostrarResumenErrores(errores);    
        return;  
    }  
    
    $('#resumen-error').hidden = true;  
    const datos = leerFormulario();  
    let guardado;  if (idEdicion) {    
        const actual = obtenerPerfume(idEdicion);    
        guardado = actualizarPerfume(idEdicion, { ...datos, imagen: imagenElegida ?? actual.imagen });  
    } else {    
        guardado = agregarPerfume({ ...datos, imagen: imagenElegida ?? IMAGEN_POR_DEFECTO });  
    }  
    
    if (!guardado) {    
        mostrarAviso('No se pudo guardar. Prueba con una imagen más pequeña.');    
        return;  
    }  
    
    avisarEnSiguientePagina(idEdicion ? 'Cambios guardados.' : 'Perfume guardado correctamente.');  
    location.href = 'inventario.html'; 
}); 
    // Validar cada campo al salir de él 

formulario.addEventListener('focusout', evento => {  
    if (CAMPOS_VALIDABLES.includes(evento.target)) validarCampo(evento.target); 
}); // ---------- Arranque ---------- 

llenarMarcasSugeridas(); 

if (idEdicion) {  
    const perfume = obtenerPerfume(idEdicion);  
    if (perfume) precargarPerfume(perfume);  
    else idEdicion = null; // id inválido: se trata como perfume nuevo 
}