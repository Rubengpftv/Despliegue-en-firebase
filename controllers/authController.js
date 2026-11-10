const { auth } = require("../config/firebase");

// ==========================================
// REGISTRO DE USUARIOS
// ==========================================

const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Crear usuario en Firebase Authentication
    const userRecord = await auth.createUser({
      email: email,
      password: password,
    });

    console.log("Usuario registrado:", userRecord.uid);

    // Mostrar confirmación
    res.render("register", {
      success: `Usuario ${userRecord.email} registrado correctamente.`,
      error: null,
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error.code);

    let errorMessage = "No se pudo registrar el usuario.";

    if (error.code === "auth/email-already-exists") {
      errorMessage = "Este correo electrónico ya está registrado.";
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "El correo electrónico no es válido.";
    } else if (error.code === "auth/invalid-password") {
      errorMessage = "La contraseña no cumple los requisitos.";
    }

    res.status(400).render("register", {
      error: errorMessage,
      success: null,
    });
  }
};

// ==========================================
// INICIO DE SESIÓN
// ==========================================

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Enviar credenciales a Firebase Authentication
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      },
    );

    const data = await response.json();

    // Comprobar respuesta de Firebase
    if (!response.ok) {
      throw new Error(data.error?.message || "LOGIN_FAILED");
    }

    // Guardar usuario en la sesión
    req.session.user = {
      uid: data.localId,
      email: data.email,
    };

    // Guardar la sesión antes de redirigir
    req.session.save((error) => {
      if (error) {
        console.error("Error guardando la sesión:", error);
        return res.status(500).send("Error al guardar la sesión");
      }

      console.log("Usuario autenticado:", data.email);
      console.log("Sesión guardada correctamente");

      // Redirigir a Home
      res.redirect("/home");
    });
  } catch (error) {
    console.error("Error en el login:", error.message);

    let errorMessage = "No se pudo iniciar sesión.";

    if (
      error.message === "INVALID_LOGIN_CREDENTIALS" ||
      error.message === "EMAIL_NOT_FOUND" ||
      error.message === "INVALID_PASSWORD"
    ) {
      errorMessage = "Correo electrónico o contraseña incorrectos.";
    }

    res.status(401).render("login", {
      error: errorMessage,
    });
  }
};

// ==========================================
// EXPORTAR CONTROLADORES
// ==========================================

module.exports = {
  register,
  login,
};
