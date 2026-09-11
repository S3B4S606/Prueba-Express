// Validar que el nombre tenga mínimo 3 letras
function validarNombre(nombre) {
    if (!nombre) {
        return false;
    }

    const nombreLimpio = nombre.trim();

    if (nombreLimpio.length < 3) {
        return false;
    }

    return /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(nombreLimpio);
}

// Validar correo electrónico
function validarCorreo(correo) {
    if (!correo) {
        return false;
    }

    const expresionCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return expresionCorreo.test(correo);
}

// Generar ID automático
function generarId(listaAprendices) {

    if (listaAprendices.length === 0) {
        return 1;
    }

    const ids = listaAprendices
        .filter(aprendiz => aprendiz !== null && aprendiz !== undefined)
        .map(aprendiz => Number(aprendiz.id))
        .filter(id => Number.isInteger(id) && id > 0);

    if (ids.length === 0) {
        return 1;
    }

    return Math.max(...ids) + 1;
}

module.exports = {
    validarNombre,
    validarCorreo,
    generarId
};