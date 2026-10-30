// EJEMPLO COMPLETO: Eliminar recordatorio (DELETE).
// Página: llamadoCompleto/recordatorios/eliminar.html, servida por el servidor del proyecto.
// Toda la solicitud y la presentación del resultado están en este archivo.

async function eliminarRecordatorio(evento) {
  // Evitar que el formulario recargue la página al enviarse.
    evento.preventDefault();

    const mensajeEstado = document.querySelector("#estado");
    const boton = document.querySelector("#enviar");
    const resultadoTexto = document.querySelector("#resultado");
    resultadoTexto.textContent = "";
    mensajeEstado.textContent = "Enviando solicitud…";
    mensajeEstado.dataset.type = "loading";
    boton.disabled = true;

    try {
        // 1. Definir la base del endpoint para tareas.
        const endpointBase = "/api/v1/tareas";

        // 2. Leer y validar el ID de la tarea y el ID del recordatorio.
        const idTarea = Number(document.querySelector("#tarea-id").value);
        if (!Number.isSafeInteger(idTarea) || idTarea < 1) {
        throw new Error("El ID de la tarea debe ser un entero mayor que cero.");
        }

        const idRecordatorio = Number(document.querySelector("#recordatorio-id").value);
        if (!Number.isSafeInteger(idRecordatorio) || idRecordatorio < 1) {
        throw new Error("El ID del recordatorio debe ser un entero mayor que cero.");
        }

        // La eliminación se realiza solo si el usuario confirma los IDs elegidos.
        if (!window.confirm(`¿Eliminar el recordatorio con ID ${idRecordatorio} de la tarea ${idTarea}?`)) {
        mensajeEstado.textContent = "Eliminación cancelada.";
        mensajeEstado.dataset.type = "";
        return;
        }

        // 3. Construir la URL anidada con ambos IDs en la ruta.
        const url = `${endpointBase}/${idTarea}/recordatorios/${idRecordatorio}`;
        console.log("URL de la solicitud:", url);

        // 4. Enviar la petición DELETE y esperar la respuesta con await.
        const respuesta = await fetch(url, {
        method: "DELETE",
        headers: {
            Accept: "application/json"
        }
        });

        // 5. DELETE responde 204 cuando tiene éxito y no devuelve cuerpo.
        if (respuesta.status === 204) {
        // 6. Mostrar el estado HTTP de la eliminación.
        mensajeEstado.textContent = "HTTP 204 · Recordatorio eliminado correctamente.";
        mensajeEstado.dataset.type = "success";

        // 7. Informar qué registro se eliminó, sin esperar datos JSON.
        resultadoTexto.textContent = `Se eliminó el recordatorio con ID ${idRecordatorio} asociado a la tarea ${idTarea}. La respuesta no contiene JSON.`;
        console.log(resultadoTexto.textContent);

        // 8. Terminar la función tras completar la eliminación.
        return;
        }

        // Si no recibimos 204, leer el mensaje de error que devuelve el backend.
        const resultado = await respuesta.json();
        throw new Error(resultado.error?.message
        || `Se esperaba HTTP 204, pero el servidor respondió HTTP ${respuesta.status}`);
    } catch (error) {
        // 9. Mostrar errores de conexión, validación o respuestas del backend.
        console.error("No se pudo completar la operación:", error.message);
        mensajeEstado.textContent = error.message;
        mensajeEstado.dataset.type = "error";
    } finally {
        // Permitir otra solicitud tanto si funcionó como si falló.
        boton.disabled = false;
    }
}

// 10. Ejecutar la función al enviar el formulario; abrir la página no envía la operación.
document.querySelector("#formulario-recordatorio").addEventListener("submit", eliminarRecordatorio);