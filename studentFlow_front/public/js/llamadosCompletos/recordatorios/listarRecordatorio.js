// EJEMPLO: consultar el listado de recordatorios de una tarea del API.
// Cargar desde una página servida por el frontend.

async function listarRecordatorio() {
    const endpoint = "http://localhost:3000/api/v1/recordatorio";

    const filtros = new URLSearchParams({
        page: "1",
        limit: "20",
        sort: "fecha_hora",
        order: "asc"
    });

    const url = `${endpoint}?${filtros.toString()}`;
    console.log("URL que vamos a consultar:", url);

    // Verificamos ambos IDs por compatibilidad con el HTML
    const cuerpoTabla = document.querySelector("#recordatorio-body") || document.querySelector("#resultado-body");
    const mensajeEstado = document.querySelector("#estado");
    const resumenPaginacion = document.querySelector("#paginacion");
    const botonRecargar = document.querySelector("#recargar-recordatorio") || document.querySelector("#enviar");

    if (cuerpoTabla) cuerpoTabla.replaceChildren();
    if (resumenPaginacion) resumenPaginacion.textContent = "";
    if (botonRecargar) botonRecargar.disabled = true;
    if (mensajeEstado) {
        mensajeEstado.textContent = "Consultando recordatorios…";
        mensajeEstado.dataset.type = "loading";
    }

    try {
        const respuesta = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" }
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok || resultado.success === false) {
        throw new Error(resultado.error?.message || `La consulta falló con el estado HTTP ${respuesta.status}`);
        }

        const recordatorio = resultado.data;
        const paginacion = resultado.meta;

        console.table(recordatorio);

        if (cuerpoTabla) {
        for (const recordatorio of recordatorio) {
            const fila = document.createElement("tr");
            const valores = [
            recordatorio.id,
            recordatorio.mensaje,
            recordatorio.fecha_hora,
            recordatorio.canal,
            recordatorio.leido ? "Leído" : "No leído",
            recordatorio.tarea ?? "Sin tarea",
            recordatorio.materia ?? "Sin materia"
            ];

            for (const valor of valores) {
            const celda = document.createElement("td");
            celda.textContent = valor;
            fila.append(celda);
            }
            cuerpoTabla.append(fila);
        }
        }

        if (mensajeEstado) {
        mensajeEstado.textContent = recordatorio.length === 0
            ? "No se encontraron recordatorios."
            : "Recordatorios consultados correctamente.";
        mensajeEstado.dataset.type = "success";
        }

        if (resumenPaginacion && recordatorio.length > 0) {
        resumenPaginacion.textContent = `Mostrando ${recordatorio.length} de ${paginacion.total} recordatorio. Página ${paginacion.page} de ${paginacion.pages}.`;
        }
    } catch (error) {
        console.error("No se pudieron listar los recordatorios:", error.message);
        if (mensajeEstado) {
        mensajeEstado.textContent = `No se pudieron listar los recordatorios: ${error.message}`;
        mensajeEstado.dataset.type = "error";
        }
    } finally {
        if (botonRecargar) botonRecargar.disabled = false;
    }
}

// Ejecutar automáticamente al cargar la página
listarRecordatorio();

// Permitir recargar al hacer clic en el botón
document.querySelector("#recargar-recordatorio")?.addEventListener("click", listarRecordatorio);