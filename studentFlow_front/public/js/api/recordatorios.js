import { request } from "./http.js";

function recordatorioPath(id) {
  const parsed = Number(id);

  if (!Number.isSafeInteger(parsed) || parsed < 1) {
    throw new TypeError("El ID debe ser un entero mayor que cero.");
  }

  return `/recordatorio/${parsed}`;
}

export function listarRecordatorio(filtros = {}) {
  return request("/recordatorio", { query: filtros });
}

export function obtenerRecordatorio(id) {
  return request(recordatorioPath(id));
}

export function crearRecordatorio(recordatorio) {
  return request("/recordatorio", {
    method: "POST",
    body: recordatorio
  });
}

export function reemplazarRecordatorio(id, recordatorio) {
  return request(recordatorioPath(id), {
    method: "PUT",
    body: recordatorio
  });
}

export function actualizarRecordatorio(id, cambios) {
  return request(recordatorioPath(id), {
    method: "PATCH",
    body: cambios
  });
}

export function eliminarRecordatorio(id) {
  return request(recordatorioPath(id), {
    method: "DELETE"
  });
}