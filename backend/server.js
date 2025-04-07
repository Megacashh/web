const express = require('express');
const path = require('path');
const app = express();

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Ruta principal que sirve el HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Otras rutas de API que necesites
app.get('/api/data', (req, res) => {
  res.json({ message: "Datos desde el backend" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});