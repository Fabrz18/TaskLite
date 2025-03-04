const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database/tasklite.db", (err) => {
    if (err) console.error("❌ Error al conectar la base de datos:", err);
    else console.log("✅ Base de datos conectada");
});
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        userid INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT NOT NULL,
        password TEXT NOT NULL
    )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS tasks ( 
        taskid INTEGER PRIMARY KEY AUTOINCREMENT,
        taskname TEXT NOT NULL,
        taskstatus BOOLEAN NOT NULL,
        userid INTEGER NOT NULL,
        FOREIGN KEY (userid) REFERENCES users(userid)
    )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS posts ( 
        postid INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        date DATE NOT NULL,
        userid INTEGER NOT NULL,
        FOREIGN KEY (userid) REFERENCES users(userid)
    )`);
});


module.exports =  db;