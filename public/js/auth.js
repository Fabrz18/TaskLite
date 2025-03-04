const express = require("express");
const router = express.Router();

router.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Validar credenciales (esto luego irá con la base de datos)
    if (username === "admin" && password === "1234") {
        req.session.user = username;  // Guardar usuario en sesión
        res.json({ success: true, message: "Login exitoso" });
    } else {
        res.status(401).json({ success: false, message: "Credenciales incorrectas" });
    }
});

router.get("/me", (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

router.post("/logout", (req, res) => {
    req.session.destroy(() => {
        res.json({ success: true, message: "Sesión cerrada" });
    });
});

module.exports = router;

document.getElementById("signup-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const email = document.getElementById("email").value;
    
    // ❌ NO enviamos el campo confirmPassword al backend
    const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }) // Enviar solo estos campos
    })  ;

    const data = await response.json();

    if (data.success) {
        alert("Registro exitoso");
        window.location.href = "/login.html"; // Redirigir a la página de login
    } else {
        alert(data.message);
    }
});

