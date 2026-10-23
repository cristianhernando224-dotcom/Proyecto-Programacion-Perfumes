'use strict'; 

const id = Number(new URLSearchParams(location.search).get('id')); 
const perfume = obtenerPerfume(id); 

// si no hay id, Number(null) es 0 y no existe 

if (!perfume) 
{
    $('#detalle-error').hidden = false; 
    $('#detalle-perfume').hidden = true; 
} 
else 
    { 
        const estado = calcularEstado(perfume); document.title = `${perfume.nombre} · Herrera Perfumes`; 
        $('#detalle-perfume').dataset.estado = estado; const imagen = $('#detalle-imagen'); imagen.src = rutaImagen(perfume); imagen.alt = `Frasco del perfume ${perfume.nombre}`; 
    } 

$('#detalle-nombre').textContent = perfume.nombre; $('#detalle-descripcion').textContent = perfume.descripcion; 
$('#detalle-marca').textContent = perfume.marca; $('#detalle-categoria').textContent = perfume.categoria; 
$('#detalle-aroma').textContent = perfume.aroma; $('#detalle-precio').textContent = formatearPrecio(perfume.precio); 
$('#detalle-stock').textContent = `${perfume.stock} unidades`; $('#detalle-estado').textContent = ETIQUETAS_ESTADO[estado]; $('#detalle-editar').href = `agregar.html?id=${perfume.id}`;