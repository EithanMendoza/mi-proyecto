// Cargar variables de entorno desde el archivo .env 
require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;
const environment = process.env.NODE_ENV || 'desarrollo';  // Usar variable de entorno para el entorno

// Configurar CORS para permitir conexiones desde el frontend en Vercel
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));

// Configuración de Express para procesar JSON
app.use(express.json());

// Función para crear una conexión a la base de datos
function connectToDatabase() {
  return mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 3306,
  });
}

let db = connectToDatabase();

// Manejar errores de conexión y reconectar automáticamente
db.connect(err => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    setTimeout(connectToDatabase, 5000);  // Reintento de conexión tras 5 segundos
  } else {
    console.log('Conexión exitosa a la base de datos');
  }
});

db.on('error', err => {
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.error('Conexión a la base de datos perdida. Reconectando...');
    db = connectToDatabase();
  } else {
    console.error('Error en la base de datos:', err);
  }
});

// Ruta para guardar un registro
app.post('/api/guardar', (req, res) => {
  const { nombre } = req.body;
  const mensaje = `¡Bienvenido, ${nombre}!`;

  const query = 'INSERT INTO registros (nombre, mensaje) VALUES (?, ?)';
  db.query(query, [nombre, mensaje], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al guardar en la base de datos');
    } else {
      res.json({ mensaje });
    }
  });
});

// Ruta para obtener todos los registros
app.get('/api/registros', (req, res) => {
  const query = 'SELECT * FROM registros';
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al obtener registros');
    } else {
      res.json(results);
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en ${environment} en http://localhost:${port}`);
});
