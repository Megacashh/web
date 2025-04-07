// Importaciones obligatorias al inicio
const express = require('express');
const router = express.Router(); // <-- ¡Esta línea es crucial!

// Importa tus modelos y middlewares
const LotteryResult = require('../models/LotteryResult');
const auth = require('../middleware/auth');

/**
 * Ruta GET para resultados históricos
 * Ejemplo de uso: GET /api/lottery/historic
 */
router.get('/historic', async (req, res) => {
    try {
        const results = await LotteryResult.find().sort('-date');
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener resultados' });
    }
});

/**
 * Ruta POST para jugar
 * Ejemplo de uso: POST /api/lottery/play
 */
router.post('/play', auth, async (req, res) => {
    try {
        const { numbers } = req.body;
        
        if (!numbers || numbers.length !== 5) {
            return res.status(400).json({ error: 'Debes seleccionar 5 números' });
        }

        // Lógica para guardar el ticket...
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Error al procesar jugada' });
    }
});

// Exportación ESENCIAL
module.exports = router; // <-- ¡No olvides esta línea!