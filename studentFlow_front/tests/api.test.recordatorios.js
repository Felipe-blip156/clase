import test from "node:test";
import assert from "node:assert/strict";
import { ApiError } from "../public/js/api/http.js";
import { consultarEstado } from "../public/js/api/health.js";
import {
    listarRecordatorios, obtenerRecordatorio, crearRecordatorio,
    reemplazarRecordatorio, actualizarRecordatorio, eliminarRecordatorio
} from "../public/js/api/recordatorios.js";
import { recordatorioEjemplo, reemplazoEjemplo, cambiosEjemplo } from "../public/js/examples/recordatorios/datos.js";

test("los siete endpoints anidados envían método, ruta y cuerpo correctos", async t => {
    const calls = [];
    t.mock.method(globalThis, "fetch", async (url, options) => {
        calls.push({ url, ...options });
        return options.method === "DELETE"
        ? new Response(null, { status: 204 })
        : Response.json({ success: true, data: { id: 7, id_tarea: 3 } });
    });
    await consultarEstado();
    await listarRecordatorios(3);
    await obtenerRecordatorio(3, 7);
    await crearRecordatorio(3, recordatorioEjemplo);
    await reemplazarRecordatorio(3, 7, reemplazoEjemplo);
    await actualizarRecordatorio(3, 7, cambiosEjemplo);
    assert.equal(await eliminarRecordatorio(3, 7), null);

    assert.deepEqual(calls.map(({ url, method }) => [method, url]), [
        ["GET", "/api/v1/health"], ["GET", "/api/v1/tareas/3/recordatorios"],
        ["GET", "/api/v1/tareas/3/recordatorios/7"], ["POST", "/api/v1/tareas/3/recordatorios"],
        ["PUT", "/api/v1/tareas/3/recordatorios/7"], ["PATCH", "/api/v1/tareas/3/recordatorios/7"],
        ["DELETE", "/api/v1/tareas/3/recordatorios/7"]
    ]);
    for (const [index, payload] of [[3, recordatorioEjemplo], [4, reemplazoEjemplo], [5, cambiosEjemplo]]) {
        assert.deepEqual(JSON.parse(calls[index].body), payload);
        assert.equal(calls[index].headers["Content-Type"], "application/json");
    }
    assert.equal(calls[0].body, undefined);
    });

    test("los filtros conservan caracteres especiales; la respuesta conserva meta", async t => {
    const payload = { success: true, data: [], meta: { page: 2, limit: 5, total: 6, pages: 2 } };
    t.mock.method(globalThis, "fetch", async url => {
        const query = new URL(url, "http://localhost").searchParams;
        assert.equal(query.get("search"), "Entregar & Revisar");
        assert.equal(query.get("page"), "2");
        assert.equal(query.get("limit"), "5");
        assert.equal(query.get("sort"), "fecha_hora");
        assert.equal(query.get("order"), "desc");
        assert.equal(query.has("omitido"), false);
        return Response.json(payload);
    });
    assert.deepEqual(await listarRecordatorios(3, {
        search: "Entregar & Revisar", page: 2, limit: 5,
        sort: "fecha_hora", order: "desc", omitido: undefined
    }), payload);
    });

    test("errores del API conservan estado, código y mensaje", async t => {
    t.mock.method(globalThis, "fetch", async () => Response.json({
        success: false, error: { code: "INVALID_DATE", message: "La fecha y hora del recordatorio no son válidas." }
    }, { status: 400 }));
    await assert.rejects(crearRecordatorio(3, recordatorioEjemplo), error => {
        assert.ok(error instanceof ApiError);
        assert.equal(error.status, 400);
        assert.equal(error.code, "INVALID_DATE");
        assert.equal(error.message, "La fecha y hora del recordatorio no son válidas.");
        return true;
    });
    });

    test("una caída de red produce un error comprensible", async t => {
    t.mock.method(globalThis, "fetch", async () => { throw new TypeError("fetch failed"); });
    await assert.rejects(consultarEstado(), { name: "ApiError", code: "NETWORK_ERROR", status: 0 });
    });

    test("una respuesta HTML inesperada no se trata como JSON válido", async t => {
    t.mock.method(globalThis, "fetch", async () => new Response("<html>Error</html>", { status: 502 }));
    await assert.rejects(consultarEstado(), { code: "INVALID_RESPONSE", status: 502 });
    });

    test("IDs inválidos de tarea o recordatorio no envían solicitudes", t => {
    const fetchMock = t.mock.method(globalThis, "fetch", () => { throw new Error("No debería llamarse"); });
    for (const id of [0, -1, "abc", "", "1/2", 1.5, Number.MAX_SAFE_INTEGER + 1]) {
        assert.throws(() => obtenerRecordatorio(3, id), TypeError);
        assert.throws(() => obtenerRecordatorio(id, 7), TypeError);
    }
    assert.equal(fetchMock.mock.callCount(), 0);
});