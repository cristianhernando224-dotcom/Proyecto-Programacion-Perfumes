'use strict'; 
const $ = (selector, raiz = document) => raiz.querySelector(selector); 
const $$ = (selector, raiz = document) => [...raiz.querySelectorAll(selector)]; 

const IMAGEN_POR_DEFECTO = 'khamrah.jpg'; 
const ETIQUETAS_ESTADO = 
{
    'disponible': 'Disponible', 
    'stock-bajo': 'Stock bajo', 
    'agotado': 'Agotado' 
}; 

function formatearPrecio(valor) 
{ 
    return '$' + Number(valor).toLocaleString('es-CO'); 
} 

// Devuelve el mismo texto que usa tu CSS en data-estado 

function calcularEstado(perfume) 
{ 
    if (perfume.stock === 0) return 'agotado'; 
    
    if (perfume.stock <= perfume.stockMinimo) return 'stock-bajo'; 
    
    return 'disponible'; 
} 

function rutaImagen(perfume) 
{ 
    if (perfume.imagen.startsWith('data:')) return perfume.imagen; 
    
    return 'img/catalog/' + perfume.imagen; 
} 

let temporizadorAviso; function mostrarAviso(mensaje) 
{ 
    const aviso = $('#aviso'); if (!aviso) return; 
    aviso.textContent = mensaje; clearTimeout(temporizadorAviso);
    temporizadorAviso = setTimeout(() => { aviso.textContent = ''; 
    }, 3000); 
} 

// Para mostrar un aviso DESPUÉS de cambiar de página 

function avisarEnSiguientePagina(mensaje) 
{ 
    sessionStorage.setItem('aviso-pendiente', mensaje); 
} 

function mostrarAvisoPendiente() 
{ 
    const mensaje = sessionStorage.getItem('aviso-pendiente'); 
    if (!mensaje) return; sessionStorage.removeItem('aviso-pendiente'); 
    mostrarAviso(mensaje); 
}