import mysql from 'mysql2/promise';

async function getConexion() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',    // Dirección del servidor de la base de datos
            user: 'root',         // Usuario de la base de datos
            password: '',         // Contraseña del usuario de la base de datos
            database: 'electivaCrud', // Nombre de la base de datos
        });
        console.log("Conexión a la base de datos exitosa");
        return connection;
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error);
        throw error; // Puedes lanzar un error para detener la aplicación si no se puede conectar
    }
}

export default {
    getConexion,
};
