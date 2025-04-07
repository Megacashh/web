const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  numbers: { type: [Number], required: true, validate: [val => val.length === 5, 'Selecciona 5 números'] },
  balota: { type: Number, min: 1, max: 16 },
  drawDate: { type: Date, default: () => Date.now() + 3*24*60*60*1000 } // Sorteo en 3 días
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);