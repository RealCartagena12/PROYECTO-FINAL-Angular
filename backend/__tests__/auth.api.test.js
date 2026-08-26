const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

// Mock email para no enviar correos reales
jest.mock("../services/email.service", () => ({
  enviarCorreoRegistro: jest.fn().mockResolvedValue(true),
  enviarCorreoMfa: jest.fn().mockResolvedValue(true),
}));

let app;
let mongoServer;

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  process.env.JWT_SECRET = "test_secret";
  process.env.Mfa_Enabled = "false"; // 🔥 desactivamos MFA aquí

  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  app = require("../server");
});

afterEach(async () => {
  if (mongoose.connection?.db) {
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Auth API - Registro y Login", () => {

  const usuario = {
    nombre: "Jose",
    email: "jose@test.com",
    equipo: "Patriots",
    password: "123456"
  };

  // ✅ REGISTRO OK
  test("POST /api/users/registrar -> crea usuario correctamente", async () => {

    const res = await request(app)
      .post("/api/users/registrar")
      .send(usuario);

    // Puede ser 200 o 201 según tu controller
    expect([200, 201]).toContain(res.statusCode);

    expect(res.body.message).toBe("Usuario registrado exitosamente");
    expect(res.body.user.email).toBe(usuario.email);
  });


  // ✅ REGISTRO DUPLICADO
  test("POST /api/users/registrar -> error si el email ya existe", async () => {

    // Registrar primera vez
    await request(app)
      .post("/api/users/registrar")
      .send(usuario);

    // Intentar registrar mismo email
    const res = await request(app)
      .post("/api/users/registrar")
      .send(usuario);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("El correo ya existe");
  });


  // ✅ LOGIN OK
  test("POST /api/users/logear -> login correcto devuelve token", async () => {

    await request(app)
      .post("/api/users/registrar")
      .send(usuario);

    const res = await request(app)
      .post("/api/users/logear")
      .send({
        email: usuario.email,
        password: usuario.password
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(usuario.email);
  });


  // ✅ PASSWORD INCORRECTA
  test("POST /api/users/logear -> error si contraseña es incorrecta", async () => {

    await request(app)
      .post("/api/users/registrar")
      .send(usuario);

    const res = await request(app)
      .post("/api/users/logear")
      .send({
        email: usuario.email,
        password: "incorrecta"
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Correo o contraseña incorrectos");
  });

});