// Cargar variables de entorno
require("dotenv").config();

const express = require("express");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const path = require("path");

// Inicializar Firebase antes de cargar las rutas
require("./config/firebase");

// Importar rutas
const authRoutes = require("./routes/authRoutes");

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// Configurar motor de plantillas
app.set("view engine", "ejs");

// Middleware para procesar formularios
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    store: new FileStore({
      path: path.join(__dirname, "sessions"),
      ttl: 3600,
      retries: 0,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60,
    },
  }),
);

// Rutas de autenticación
app.use("/", authRoutes);

// Ruta principal
app.get("/", (req, res) => {
  res.send("Servidor Express conectado correctamente con Firebase");
});

// Ruta de prueba EJS
app.get("/test", (req, res) => {
  res.render("test");
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
  console.log("Firebase Admin SDK inicializado correctamente");
});
