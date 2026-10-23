'use strict';

const CLAVE_ALMACEN = 'herrera-perfumes';

function normalizarPerfume(p) {
    return {
        id: Number(p.id),
        nombre: p.nombre ?? p.name ?? '',
        marca: p.marca ?? p.brand ?? '',
        categoria: p.categoria ?? p.category ?? 'Unisex',
        precio: Number(p.precio ?? p.price ?? 0),
        stock: Number(p.stock ?? 0),
        stockMinimo: Number(p.stockMinimo ?? p.minStock ?? 3),
        imagen: p.imagen ?? p.image ?? IMAGEN_POR_DEFECTO,
        aroma: p.aroma ?? 'Sin especificar',
        descripcion: p.descripcion ?? p.description ?? 'Sin descripción disponible.'
    };
}

function guardarPerfumes(lista) {
    try {
        localStorage.setItem(CLAVE_ALMACEN, JSON.stringify(lista.map(normalizarPerfume)));
        return true;
    } catch (error) {
        console.error('No se pudo guardar:', error);
        return false;
    }
}

function cargarPerfumes() {
    try {
        const texto = localStorage.getItem(CLAVE_ALMACEN);
        if (texto) {
            const lista = JSON.parse(texto);
            if (Array.isArray(lista)) {
                const normalizados = lista.map(normalizarPerfume);
                // Migra automáticamente datos guardados con la estructura antigua.
                localStorage.setItem(CLAVE_ALMACEN, JSON.stringify(normalizados));
                return normalizados;
            }
        }
    } catch (error) {
        console.error('Datos dañados, se reinicia el catálogo:', error);
    }

    const iniciales = PERFUMES_INICIALES.map(normalizarPerfume);
    guardarPerfumes(iniciales);
    return iniciales;
}

function obtenerPerfume(id) {
    return cargarPerfumes().find(p => p.id === Number(id));
}

function agregarPerfume(datos) {
    const lista = cargarPerfumes();
    const nuevoId = Math.max(0, ...lista.map(p => Number(p.id) || 0)) + 1;
    const perfume = normalizarPerfume({ ...datos, id: nuevoId });
    lista.push(perfume);
    if (!guardarPerfumes(lista)) return null;
    return perfume;
}

function actualizarPerfume(id, cambios) {
    const lista = cargarPerfumes();
    const existe = lista.some(p => p.id === Number(id));
    if (!existe) return false;
    return guardarPerfumes(lista.map(p => p.id === Number(id)
        ? normalizarPerfume({ ...p, ...cambios, id: Number(id) })
        : p));
}

function eliminarPerfume(id) {
    const lista = cargarPerfumes();
    const nuevaLista = lista.filter(p => p.id !== Number(id));
    if (nuevaLista.length === lista.length) return false;
    return guardarPerfumes(nuevaLista);
}

function reiniciarCatalogo() {
    localStorage.removeItem(CLAVE_ALMACEN);
}