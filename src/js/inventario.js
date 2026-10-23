'use strict'; 

function leerFiltros() 
{
    return {
        texto: $('#buscar').value.trim().toLowerCase(),
        categoria: $('#filtro-categoria').value,
        marca: $('#filtro-marca').value,
        estado: $('#filtro-estado').value,
        orden: $('#ordenar').value
    };
}

function filtrarPerfumes(perfumes, filtros) 
{  
    return perfumes.filter(p => {    
        const texto = `${p.nombre} ${p.marca} ${p.categoria}`.toLowerCase();    
        return (!filtros.texto || texto.includes(filtros.texto))      
        && (!filtros.categoria || p.categoria === filtros.categoria)      
        && (!filtros.marca || p.marca === filtros.marca)      
        && (!filtros.estado || calcularEstado(p) === filtros.estado);
    }); 
} 

function ordenarPerfumes(perfumes, orden) 
{  
    const copia = [...perfumes];  // sort() modifica el arreglo: trabajamos sobre una copia  
    switch (orden) {    
        case 'precio-asc':  
            return copia.sort((a, b) => a.precio - b.precio);    
        case 'precio-desc': 
            return copia.sort((a, b) => b.precio - a.precio);    
        case 'stock':       
            return copia.sort((a, b) => b.stock - a.stock);    
        default:            
            return copia.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));  
    } 
} 

function crearFila(perfume) {  
    const clon = $('#plantilla-fila').content.cloneNode(true);  
    const estado = calcularEstado(perfume);  
    $('tr', clon).dataset.estado = estado;  
    const enlace = $('[data-campo="nombre"]', clon);  
    enlace.textContent = perfume.nombre;  
    enlace.href = `detalle.html?id=${perfume.id}`;  
    $('[data-campo="categoria"]', clon).textContent = perfume.categoria;  
    const precio = $('[data-campo="precio"]', clon);  
    precio.value = perfume.precio;  
    precio.textContent = formatearPrecio(perfume.precio);  
    $('[data-campo="stock"]', clon).textContent = perfume.stock;  
    $('[data-campo="estado"]', clon).textContent = ETIQUETAS_ESTADO[estado];  
    const editar = $('[data-accion="editar"]', clon);  
    editar.href = `agregar.html?id=${perfume.id}`;  
    editar.setAttribute('aria-label', `Editar ${perfume.nombre}`);  
    const eliminar = $('[data-accion="eliminar"]', clon);  
    eliminar.dataset.id = perfume.id;  
    eliminar.setAttribute('aria-label', `Eliminar ${perfume.nombre}`);  
    return clon; 
} 

function pintarInventario() {  
    const todos = cargarPerfumes();  
    const filtros = leerFiltros();  
    const resultado = ordenarPerfumes(filtrarPerfumes(todos, filtros), filtros.orden);  
    $('tbody').replaceChildren(...resultado.map(crearFila));  
    $('#resumen-resultados').textContent =    
        `Mostrando ${resultado.length} de ${todos.length} productos`;  
    $('.tabla-contenedor').hidden = resultado.length === 0;  
    $('#sin-resultados').hidden = resultado.length !== 0; 
} 

function llenarMarcas() {  
    const marcas = [...new Set(cargarPerfumes().map(p => p.marca))]    
        .sort((a, b) => a.localeCompare(b, 'es'));  
    for (const marca of marcas) {    
        const opcion = document.createElement('option');    
        opcion.value = marca;    
        opcion.textContent = marca;    
        $('#filtro-marca').append(opcion);    
    } 
}

// --- Eventos ---
const formFiltros = $('.filtros');
formFiltros.addEventListener('input', pintarInventario);

// buscador y selects
formFiltros.addEventListener('submit', e => e.preventDefault());

// Enter en el buscador
formFiltros.addEventListener('reset', () => setTimeout(pintarInventario));

let idPorEliminar = null; 
const dialogo = $('#dialogo-eliminar'); 

$('tbody').addEventListener('click', evento => { 
    const boton = evento.target.closest('[data-accion="eliminar"]'); 
    if (!boton) return; // el clic fue en otra cosa 
    idPorEliminar = Number(boton.dataset.id); // dataset siempre entrega texto 
    const perfume = obtenerPerfume(idPorEliminar); 
    $('#texto-dialogo').textContent = `¿Seguro que deseas eliminar "${perfume.nombre}"? Esta acción no se puede deshacer.`; dialogo.showModal(); 
}); 

dialogo.addEventListener('close', () => { 
    if (dialogo.returnValue === 'eliminar' && idPorEliminar !== null) { 
        const perfume = obtenerPerfume(idPorEliminar); eliminarPerfume(idPorEliminar); pintarInventario(); mostrarAviso(`Se eliminó ${perfume.nombre}.`); 
    } 
    idPorEliminar = null; 
    dialogo.returnValue = ''; 
});

// --- Arranque ---
llenarMarcas();
const categoriaEnUrl = new URLSearchParams(location.search).get('categoria');
if (categoriaEnUrl) $('#filtro-categoria').value = categoriaEnUrl;
pintarInventario();
mostrarAvisoPendiente();