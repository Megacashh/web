const Ticket = require('../models/Ticket');
const LotteryResult = require('../models/LotteryResult');

exports.play = async (req, res) => {
  try {
    const { numbers, isRandom } = req.body;
    
    const selectedNumbers = isRandom ? generateRandomNumbers() : numbers;
    
    const ticket = await Ticket.create({
      user: req.user._id,
      numbers: selectedNumbers,
      balota: Math.floor(Math.random() * 16) + 1
    });

    res.status(201).json({ ticket });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

function generateRandomNumbers() {
  const numbers = [];
  while (numbers.length < 5) {
    const num = Math.floor(Math.random() * 43) + 1;
    if (!numbers.includes(num)) numbers.push(num);
  }
  return numbers.sort((a, b) => a - b);
}