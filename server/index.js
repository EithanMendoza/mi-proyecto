// Cargar variables de entorno desde el archivo .env 
require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;  // Modificación aquí para permitir configurar el puerto desde .env o usar 5000 por defecto

// Configurar CORS para permitir conexiones desde el frontend en Vercel
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));

// Configuración de Express para procesar JSON
app.use(express.json());

// Configuración de la base de datos usando variables de entorno
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos');
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
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
