const mongoose = require('mongoose');

const lotteryResultSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  numbers: { type: [Number], required: true },
  balota: { type: Number, required: true }
});

module.exports = mongoose.model('LotteryResult', lotteryResultSchema);