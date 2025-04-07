const express = require('express');
const router = express.Router();
const PayPal = require('paypal-rest-sdk');
const auth = require('../middleware/auth');

router.post('/create', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    
    const create_payment_json = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal'
      },
      redirect_urls: {
        return_url: `${process.env.BASE_URL}/payment/success`,
        cancel_url: `${process.env.BASE_URL}/payment/cancel`
      },
      transactions: [{
        item_list: {
          items: [{
            name: 'Recarga de saldo',
            sku: 'recarga',
            price: amount.toFixed(2),
            currency: 'USD',
            quantity: 1
          }]
        },
        amount: {
          currency: 'USD',
          total: amount.toFixed(2)
        },
        description: 'Recarga de saldo para juegos de lotería'
      }]
    };

    PayPal.payment.create(create_payment_json, (error, payment) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al crear pago' });
      } else {
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === 'approval_url') {
            return res.json({ approvalUrl: payment.links[i].href });
          }
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.get('/success', auth, (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    payer_id: payerId,
    transactions: [{
      amount: {
        currency: 'USD',
        total: req.query.amount
      }
    }]
  };

  PayPal.payment.execute(paymentId, execute_payment_json, async (error, payment) => {
    if (error) {
      console.error(error);
      return res.redirect('/?payment=error');
    } else {
      // Aquí actualizarías el saldo del usuario en tu base de datos
      try {
        const user = await User.findById(req.user.id);
        user.balance += parseFloat(req.query.amount);
        await user.save();
        
        res.redirect('/?payment=success');
      } catch (err) {
        console.error(err);
        res.redirect('/?payment=error');
      }
    }
  });
});

router.get('/cancel', (req, res) => {
  res.redirect('/?payment=cancelled');
});

module.exports = router;