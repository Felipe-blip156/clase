import { consultarEstado } from "../../api/health.js";
import {
    listarRecordatorio, obtenerRecordatorio, crearRecordatorio,
    reemplazarRecordatorio, actualizarRecordatorio, eliminarRecordatorio
} from "../../api/recordatorios.js";
import {
    recordatorioEjemplo,
    reemplazoRecordatorioEjemplo,
    cambiosRecordatorioEjemplo,
    filtrosRecordatorioEjemplo
} from "./datos.js";

// Cada ejemplo se ejecuta únicamente cuando una página llama a ejecutar().
// Para operaciones por ID, usar uno devuelto por listarRecordatorio o crearRecordatorio.
export const ejemplos = {
    health: {
        etiqueta: "Estado del servicio", metodo: "GET", ruta: "/health",
        descripcion: "Comprueba que el backend puede conectarse a MySQL.",
        ejecutar: () => consultarEstado()
    },
    listar: {
        etiqueta: "Listar recordatorio", metodo: "GET", ruta: "/recordatorio",
        descripcion: "Consulta con filtros, ordenamiento y paginación. Elimina activa para incluir ambos estados.",
        entrada: "Filtros (JSON)", datos: filtrosRecordatorioEjemplo,
        ejecutar: (idTarea, filtros) => listarRecordatorio(idTarea, filtros)
    },
    obtener: {
        etiqueta: "Consultar un recordatorio", metodo: "GET", ruta: "/recordatorio/:id", requiereId: true,
        descripcion: "Consulta un recordatorio existente por su identificador.",
        ejecutar: (idTarea, idRecordatorio) => obtenerRecordatorio(idTarea, idRecordatorio)
    },
    crear: {
    etiqueta: "Crear un recordatorio",
    metodo: "POST",
    ruta: "/recordatorio",
    descripcion: "Crea una recordatorio.",
    entrada: "Nueva recordatorio (JSON)",
    datos: recordatorioEjemplo,
    ejecutar: (id, recordatorio) => crearRecordatorio(recordatorio)
},
    reemplazar: {
        etiqueta: "Reemplazar un recordatorio", metodo: "PUT", ruta: "/recordatorio/:id", requiereId: true,
        descripcion: "Reemplaza los datos de un recordatorio existente con el objeto completo.",
        entrada: "recordatorio completo (JSON)", datos: reemplazoRecordatorioEjemplo,
        ejecutar: (idTarea, idRecordatorio, recordatorio) => reemplazarRecordatorio(idTarea, idRecordatorio, recordatorio)
    },
    actualizar: {
        etiqueta: "Actualizar algunos campos", metodo: "PATCH", ruta: "/recordatorio/:id", requiereId: true,
        descripcion: "Modifica únicamente los campos enviados.",
        entrada: "Cambios (JSON)", datos: cambiosRecordatorioEjemplo,
        ejecutar: (idTarea, idRecordatorio, cambios) => actualizarRecordatorio(idTarea, idRecordatorio, cambios)
    },
    eliminar: {
        etiqueta: "Eliminar un recordatorio", metodo: "DELETE", ruta: "/recordatorio/:id", requiereId: true,
        descripcion: "Elimina de la base de datos el recordatorio indicado. Una respuesta 204 no contiene JSON.",
        ejecutar: (idTarea, idRecordatorio) => eliminarRecordatorio(idTarea, idRecordatorio)
    }
};
