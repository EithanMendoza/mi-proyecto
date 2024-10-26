const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 5000;

// Configurar CORS para permitir conexiones desde el frontend
app.use(cors({ origin: 'http://localhost:3000' }));

// Configuración de Express para procesar JSON
app.use(express.json());

// Configuración de la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'example'
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
