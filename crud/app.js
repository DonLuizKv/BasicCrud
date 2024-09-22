import express, { json } from 'express';
import database from './database.js';
import cors from "cors";
import bcryptjs from "bcrypt";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(json());
app.use(cors());

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

//todo ENDPOINTS
//? create
app.post("/register/auth", async (req, res) => {
    if (!req.body) {
        return res.status(400).send({ "status": 400, "message": "Bad Request" });
    }
    //llamado de datos
    const id = randomId();
    const { username, email, password } = req.body;
    
    try {
        // Verificar si el usuario o email ya existen
        const connection = await database.getConexion();
        const [existingUser] = await connection.query("SELECT id FROM users WHERE username = ? OR email = ?", [username, email]);
        if (existingUser.length > 0) {
            return res.status(400).send({ "status": 400, "message": "El usuario o email ya están registrados" });
        }

        //consulta
        await connection.query("INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)", [id, username, email, password]);
        console.log("User inserted successfully");

        //respuesta
        return res.status(200).send({ "status": 200, "message": "User registered successfully" });

    } catch (error) {
        console.error("Error inserting user:", error);
        return res.status(500).send({ "status": 500, "message": "Internal Server Error" });
    }
});

app.get("/users/data", async (req, res) => {
    try {
        const connection = await database.getConexion();
        const [rows] = await connection.query('SELECT * FROM users');
        res.json(rows);
    } catch (error) {
        console.error('Error retrieving user data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//? update

app.put('/users/update', async (req, res) => {
    const { id, username, email, password } = req.body;

    if (!id || !username || !email || !password) {
        return res.status(400).send({ "status": 400, "message": "error" });
    }

    try {
        const connection = await database.getConexion();
        await connection.query('UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?', [username, email, password, id]);
        res.status(200).send({ "status": 200, "message": 'User updated successfully' });
    } catch (error) {
        console.log(error);
        res.status(400).send({ "status": 400, "message": "Error ha ocurrido" });
    }
});

//? delete
app.delete('/users/delete', async (req, res) => {
    const id = req.body.id;

    if (!id) {
        return res.status(400).json({ message: 'Error, this user no exist' });
    }

    try {
        const connection = await database.getConexion();
        const result = await connection.query('DELETE FROM users WHERE id = ?', [Number(id)]);

        if (!result) {
            return res.status(400).json({ message: 'User not found' });
        }

        return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        return res.status(400).json({ message: 'An error occurred while deleting the user' });
    }
});

//*functions
function randomId() {
    const num = Math.floor(1000 + Math.random() * 9000);
    return num;
}

function encriptPassword(password) {
    const plainPassword = password;

    const saltRounds = 10;

    bcryptjs.hash(plainPassword, saltRounds, function (err, hash) {
        if (err) {
            return err;
        } else {
            console.log('Hash:', hash);
            return 50;
        }
    });
}
