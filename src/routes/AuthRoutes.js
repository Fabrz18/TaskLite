const express = require("express");
const path = require("path");
const db = require("../ConnectDB");
const bcrypt = require("bcrypt");


const router = express.Router(); // Usamos Router en vez de app





router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login?message=Logout_exitoso");
    });
});
// 📌 Servir páginas sin mostrar ".html" en la URL
router.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/pages/register.html"));
});

router.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/pages/login.html"));
});
router.get("/inicio", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/index.html"));
});
router.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/pages/dashboard.html"));
});
// 📌 REGISTRO de usuario
router.post("/api/register", async (req, res) => {
    const { username, email, password } = req.body;
    console.log("Datos recibidos en el servidor:", req.body);
    
    if (!username || !password || !email) {
        return res.redirect("/register?error=Todos_los_campos_son_obligatorios");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        db.run("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [username, email, hashedPassword], (err) => {
            if (err) {
                return res.redirect("/register?error=" + encodeURIComponent(err.message));
            }
            res.redirect("/login?message=Registro_exitoso");
        });
    } catch (error) {
        res.redirect("/register?error=Error_en_el_servidor");
    }
});

// 📌 LOGIN
router.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    console.log("Datos recibidos en el servidor LOGIN:", req.body);
    
    db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
        if (err || !user) {
            return res.redirect("/login?error=Usuario_no_encontrado");
        }
        
        console.log("Usuario encontrado:", user);
        
        // Comparar contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.redirect("/login?error=Contraseña_incorrecta");
        }

        // Guardar sesión
        req.session.user = { id: user.userid, username: user.username };
        res.redirect("/dashboard?message=Login_exitoso");
    });
});

module.exports = router;
