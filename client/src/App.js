import React, { useState, useEffect } from 'react';

function App() {
  const [nombre, setNombre] = useState('');
  const [registros, setRegistros] = useState([]);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL;
    if (!apiUrl) {
      console.error("Error: REACT_APP_API_URL no está definida");
      return;
    }

    fetch(`${apiUrl}/api/registros`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error en la petición: ${response.status}`);
        }
        return response.json();
      })
      .then(data => setRegistros(data))
      .catch(error => console.error('Error al obtener registros:', error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const apiUrl = process.env.REACT_APP_API_URL;
    if (!apiUrl) {
      console.error("Error: REACT_APP_API_URL no está definida");
      return;
    }

    fetch(`${apiUrl}/api/guardar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error en la petición: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        alert(data.mensaje);
        setNombre('');
        setRegistros([...registros, { nombre, hora: new Date().toISOString(), mensaje: data.mensaje }]);
      })
      .catch(error => console.error('Error al guardar registro:', error));
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Bienvenidos</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Ingresa tu nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Enviar</button>
      </form>
      <h2 style={styles.subHeading}>Registros</h2>
      <ul style={styles.list}>
        {registros.map((registro) => (
          <li key={registro.id} style={styles.listItem}>
            <strong>{registro.nombre}</strong> - {new Date(registro.hora).toLocaleString()} - {registro.mensaje}
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: { textAlign: 'center', padding: '2rem', fontFamily: 'Arial, sans-serif' },
  heading: { fontSize: '2rem', color: '#333' },
  subHeading: { fontSize: '1.5rem', color: '#666', marginTop: '2rem' },
  form: { margin: '1rem 0' },
  input: { padding: '0.5rem', fontSize: '1rem', marginRight: '0.5rem' },
  button: { padding: '0.5rem 1rem', fontSize: '1rem', backgroundColor: '#4CAF50', color: '#fff', border: 'none' },
  list: { listStyle: 'none', padding: 0 },
  listItem: { padding: '0.5rem', borderBottom: '1px solid #ddd' }
};

export default App;
