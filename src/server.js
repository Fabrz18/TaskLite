const express = require("express");
const path = require("path");
const cors = require("cors");
const session = require("express-session");
const authRoutes = require("./routes/AuthRoutes"); // Importamos rutas

// Aplica el middleware solo a rutas protegidas


const app = express();
const PORT = 3000;

// 📌 Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(session({
    secret: "tasklite-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 } // 1 hora 
}));

// 📌 Servir archivos estáticos desde "public"
app.use(express.static(path.join(__dirname, "../public")));


app.get("/dashboard", (req, res,next) => {

        if (req.session && req.session.user) {
            next(); // ✅ Usuario autenticado, permitir acceso
            
        } else {
            return res.redirect("/login?error=No_estás_autenticado"); // ❌ No autenticado, redirigir al login
        }
    return res.sendFile(path.join(__dirname, "../public/pages/dashboard.html"));
});


// 📌 Usar las rutas de autenticación
app.use(authRoutes);

// 📌 Verificar autenticación
app.get("/api/me", (req, res) => {
    if (req.session.user) {
        return res.json({ loggedIn: true, user: req.session.user });
    } else {
        return res.json({ loggedIn: false });
    }
});


// 📌 Cerrar sesión
app.get("/api/logout", (req, res) => {
    req.session.destroy(() => {
        res.clearCookie("connect.sid"); // 🔹 Elimina la cookie de sesión (importante)
        return res.redirect("/login?message=Sesion_cerrada");
    });
});

// 📌 Iniciar servidor
console.log("===== Tasklite =====")
console.log(" ");
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));

