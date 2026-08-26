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
let randomSpy;

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  process.env.JWT_SECRET = "test_secret";
  process.env.Mfa_Enabled = "true";

  // ✅ Mock correcto para tu genCode()
  randomSpy = jest.spyOn(Math, "random").mockReturnValue(0.012345);

  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  app = require("../server");
});

afterEach(async () => {
  // ✅ Limpia DB solo si está conectada
  if (mongoose.connection?.db) {
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {
  // ✅ restore correcto
  randomSpy.mockRestore();

  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("MFA flow real con Math.random mockeado", () => {
  const usuario = {
    nombre: "Jose",
    email: "jose@test.com",
    equipo: "Patriots",
    password: "123456",
  };
  // Test para el flujo completo de MFA con código correcto
  test("Login -> verify con código correcto", async () => {
    await request(app).post("/api/users/registrar").send(usuario);

    const login = await request(app).post("/api/users/logear").send({
      email: usuario.email,
      password: usuario.password,
    });

    expect(login.statusCode).toBe(200);
    expect(login.body.mfaRequired).toBe(true);
    expect(login.body.mfaToken).toBeDefined();

    const codigoEsperado = Math.floor(100000 + 0.012345 * 900000).toString();

    const verify = await request(app).post("/api/users/mfa/verify").send({
      mfaToken: login.body.mfaToken,
      code: codigoEsperado,
    });

    expect(verify.statusCode).toBe(200);
    expect(verify.body.token).toBeDefined();
  });
  // Test para verify con código incorrecto
  test("Verify con código incorrecto -> debe fallar", async () => {
    await request(app).post("/api/users/registrar").send(usuario);

    const login = await request(app).post("/api/users/logear").send({
      email: usuario.email,
      password: usuario.password,
    });

    const verify = await request(app).post("/api/users/mfa/verify").send({
      mfaToken: login.body.mfaToken,
      code: "000000",
    });

    expect([400, 401]).toContain(verify.statusCode);
  });
});