'use strict'; 

const CLAVE_ALMACEN = 'herrera-perfumes'; 

function guardarPerfumes(lista) 
{ 
    try 
    { 
        localStorage.setItem(CLAVE_ALMACEN, JSON.stringify(lista)); 
        return true; 
    } catch (error) 
    { 
        console.error('No se pudo guardar:', error); 
        return false; 
    } 
} 

function cargarPerfumes() {
    try 
    {  
        const texto = localStorage.getItem(CLAVE_ALMACEN); 
        if (texto) return JSON.parse(texto); 
    } catch (error) 
    { 
        console.error('Datos dañados, se reinicia el catálogo:', error); 
    }  
    
    const iniciales = structuredClone(PERFUMES_INICIALES); guardarPerfumes(iniciales); 
    return iniciales; 
} 

function obtenerPerfume(id) 
{ 
    return cargarPerfumes().find(p => p.id === id); 
} 

function agregarPerfume(datos) 
{ const lista = cargarPerfumes(); 
    const nuevoId = Math.max(0, ...lista.map(p => p.id)) + 1; const perfume = { ...datos, id: nuevoId }; 
    lista.push(perfume); 
    guardarPerfumes(lista); 
    return perfume; 
} 

function actualizarPerfume(id, cambios) 
{ 
    const lista = cargarPerfumes().map(p => p.id === id ? { ...p, ...cambios, id } : p);
    return guardarPerfumes(lista); 
} 

function eliminarPerfume(id) 
{ 
    return guardarPerfumes(cargarPerfumes().filter(p => p.id !== id)); 
} 

function reiniciarCatalogo() 
{ 
    localStorage.removeItem(CLAVE_ALMACEN); 
}