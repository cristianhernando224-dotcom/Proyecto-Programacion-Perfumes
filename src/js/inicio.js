'use strict'; 

function pintarResumen(perfumes) 
{ 
    $('#resumen-productos').textContent = perfumes.length; 
    $('#resumen-bajo-stock').textContent = perfumes.filter(p => calcularEstado(p) === 'stock-bajo').length; 
    $('#resumen-categorias').textContent = new Set(perfumes.map(p => p.categoria)).size; 
    $('#resumen-inventario').textContent = formatearPrecio( perfumes.reduce((suma, p) => suma + p.precio * p.stock, 0) );
} 

function crearTarjeta(perfume) 
{ 
    const clon = $('#plantilla-tarjeta').content.cloneNode(true); 
    const estado = calcularEstado(perfume); 

    $('.tarjeta', clon).dataset.estado = estado; 
    const img = $('img', clon); 

    img.src = rutaImagen(perfume); 

    img.alt = `Frasco del perfume ${perfume.nombre}`; 

    $('[data-campo="marca"]', clon).textContent = perfume.marca; const enlace = $('[data-campo="nombre"]', clon); 

    enlace.textContent = perfume.nombre;  enlace.href = `detalle.html?id=${perfume.id}`; 
    
    const precio = $('[data-campo="precio"]', clon); 
    precio.value = perfume.precio;                    
    precio.textContent = formatearPrecio(perfume.precio);   
    $('[data-campo="stock"]', clon).textContent = `${perfume.stock} unidades · `; 
} 

$('[data-campo="estado"]', clon).textContent = ETIQUETAS_ESTADO[estado]; 
return clon; 

function pintarDestacados(perfumes) 
{ 
    const nodos = perfumes.slice(0, 4).map(crearTarjeta); 
    $('#lista-destacados').replaceChildren(...nodos); 
} 

const perfumes = cargarPerfumes(); 
pintarResumen(perfumes); 
pintarDestacados(perfumes);