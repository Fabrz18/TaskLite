const express = require("express");
const session = require("express-session");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

// Servir archivos estáticos desde 'public'
app.use(express.static(path.join(__dirname, "../public")));

// Middleware
app.use(express.json());  // 📌 Para interpretar JSON
app.use(express.urlencoded({ extended: true })); // 📌 Para interpretar datos de formularios

app.use(cors()); // Permitir peticiones desde el frontend

app.use(session({
    secret: "tasklite-secret-key",  // Clave secreta (cambiar en producción)
    resave: false,  
    saveUninitialized: true,  
    cookie: { secure: false, maxAge: 1000 * 60 * 60 }  // Expira en 1 hora
}));

// Conectar a la base de datos SQLite
const db = new sqlite3.Database("./database/tasklite.db", (err) => {
    if (err) console.error("❌ Error al conectar la base de datos:", err);
    else console.log("✅ Base de datos conectada");
});

// Crear tabla si no existe
db.run(
    `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT NOT NULL,
        password TEXT NOT NULL
        )`
);

// 📌 Ruta para REGISTRO de usuario
app.post("/api/register", async (req, res) => {
    const { username, email, password } = req.body;
    console.log("Datos recibidos en el servidor:", req.body);
    
    if (!username || !password || !email) {
        return res.status(400).json({ success: false, message: "Todos los campos son obligatorios" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        db.run("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [username, email, hashedPassword], (err) => {
            if (err) return res.status(400).json({ success: false, message: err.message });
            res.json.send(true);
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error en el servidor" });
    }
});

// 📌 Ruta para LOGIN
app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    console.log("Datos recibidos en el servidor LOGIN:", req.body);
    db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
        if (err || !user) {
            return res.status(400).json({ success: false, message: "Usuario no encontrado" });
        }
        console.log("Usuario encontrado:", user);
        console.log("Contraseña Encontrada:", user.password)
        // Comparar la contraseña hasheada con la ingresada
        const isMatch = await bcrypt.compare(password, user.password);
    
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Contraseña incorrecta" });
        }
    
        // Guardar en sesión si la contraseña es correcta
        req.session.user = { id: user.id, username: user.username };
        res.json({ success: true, user: req.session.user });
    });
    
});

// 📌 Ruta para verificar si el usuario sigue autenticado
app.get("/api/me", (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

// 📌 Ruta para cerrar sesión
app.post("/api/logout", (req, res) => {
    req.session.destroy(() => {
        res.json({ success: true, message: "Sesión cerrada" });
    });
});

// Iniciar servidor
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
