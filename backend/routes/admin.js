const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const LotteryResult = require('../models/LotteryResult');

// Ruta solo accesible por administradores
router.get('/dashboard', [auth, admin], async (req, res) => {
  try {
    const results = await LotteryResult.find().sort('-date');
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.post('/add-result', [auth, admin], async (req, res) => {
  try {
    const { date, numbers, balota } = req.body;
    
    const result = new LotteryResult({
      date: new Date(date),
      numbers,
      balota
    });
    
    await result.save();
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar resultado' });
  }
});

module.exports = router;