const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const { requireAuth } = require("../middleware/authMiddleware");

// ==============================
// REGISTRO
// ==============================

// Mostrar formulario de registro
router.get("/register", (req, res) => {
  res.render("register", {
    error: null,
    success: null,
  });
});

// Procesar registro
router.post("/register", authController.register);

// ==============================
// INICIO DE SESIÓN
// ==============================

// Mostrar formulario de login
router.get("/login", (req, res) => {
  res.render("login", {
    error: null,
  });
});

// Procesar inicio de sesión
router.post("/login", authController.login);

// Mostrar página principal (solo usuarios autenticados)
router.get("/home", requireAuth, (req, res) => {
  res.render("home", {
    user: req.session.user,
  });
});

// Cerrar sesión
router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error("Error al cerrar sesión:", error);
      return res.status(500).send("Error al cerrar sesión");
    }

    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
});

// Exportar rutas
module.exports = router;
