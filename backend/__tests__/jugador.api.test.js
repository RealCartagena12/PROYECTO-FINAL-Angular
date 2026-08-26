const request = require("supertest");
const moongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");


let app;
let mongoServer;

beforeAll(async () => {
    process.env.NODE_ENV = "test";

    mongoServer = await MongoMemoryServer.create();
    const Uri = mongoServer.getUri();

    await moongoose.connect(Uri);
    app = require("../server");
});

afterAll(async () => {
    await moongoose.disconnect();
    await mongoServer.stop();
});

// Limpiar la base de datos después de cada test
afterEach(async () => {
    const collections = await moongoose.connection.db.collections();
    for (const collection of collections) {
        await collection.deleteMany({});
    }
});


// Tests de integración para la API de jugadores
describe("API Jugadores (Integración) - /api/jugadores", () => {
    const jugadorValido = {
        nombre: "Jerry Rice",
        pista1:  "Es wide receiver.",
        pista2: "Jugó principalmente en la NFC.",
        pista3: "Leyenda de San Francisco 49ers.",
        pista4: "Récords históricos de recepciones."
    };
// Test para crear un nuevo jugador
    test("POST /api/jugadores - Crear un nuevo jugador", async () => {
        const res = await request(app).post("/api/jugadores").send(jugadorValido);
        
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Jugador creado exitosamente");
        expect(res.body.jugador.nombre).toBe(jugadorValido.nombre);
        expect(res.body.jugador.pista1).toBe(jugadorValido.pista1);
        expect(res.body.jugador.pista2).toBe(jugadorValido.pista2);
        expect(res.body.jugador.pista3).toBe(jugadorValido.pista3);
        expect(res.body.jugador.pista4).toBe(jugadorValido.pista4);
        expect(res.body.jugador._id).toBeDefined();
    });
// Tests para validación de campos requeridos
        test("POST /api/jugadores - Validación de campos requeridos", async () => {
        const res = await request(app).post("/api/jugadores").send({ ...jugadorValido, nombre: "" });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("El nombre es obligatorio.");
        });
// Validación de pistas requeridas
     test("POST /api/jugadores - Validación de pistas requeridas", async () => {
        const res = await request(app).post("/api/jugadores").send({ ...jugadorValido, pista1: "" });
        expect(res.statusCode).toBe(400);
       expect(res.body.error).toBe("Todas las pistas (pista1, pista2, pista3, pista4) son obligatorias.");
     });

    // Test para actualizar un jugador existente
        test("PUT /api/jugadores/:id - Actualizar un jugador existente", async () => {
        // Primero, crear un jugador
        const creado = await request(app).post("/api/jugadores").send(jugadorValido);
        const id = creado.body.jugador._id;

        // Luego, actualizarlo
        const res = await request(app).put(`/api/jugadores/${id}`).send({ ...jugadorValido, nombre: "Jerry Rice Actualizado" });
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Jugador actualizado exitosamente");
        expect(res.body.jugador.nombre).toBe("Jerry Rice Actualizado");
        });

        test("PUT /api/jugadores/:id -> 404 si no existe", async () => {
            const fakeId = new moongoose.Types.ObjectId().toString();

            const res = await request(app).put(`/api/jugadores/${fakeId}`).send({ ...jugadorValido, nombre: "Jugador No Existe" });
            expect(res.statusCode).toBe(404);
            expect(res.body.error).toBe("Jugador no encontrado");       
        });

        // test para eliminar un jugador existente
        test("DELETE /api/jugadores/:id - Eliminar un jugador existente", async () => {
            const creado = await request(app).post("/api/jugadores").send(jugadorValido);
            const id = creado.body.jugador._id;
            const res = await request(app).delete(`/api/jugadores/${id}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Jugador eliminado exitosamente");
        });

            test("DELETE /api/jugadores/:id -> 404 si no existe", async () => {
                const fakeId = new moongoose.Types.ObjectId().toString();

                const res = await request(app).delete(`/api/jugadores/${fakeId}`);
                expect(res.statusCode).toBe(404);
                expect(res.body.error).toBe("Jugador no encontrado");
            });

});