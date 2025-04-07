const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');
const { check } = require('express-validator');
const rateLimit = require('express-rate-limit');
const asyncHandler = require('../utils/asyncHandler');

// Rate limiting para seguridad
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20, // Límite de 20 peticiones por IP
  message: 'Demasiados intentos, por favor intente más tarde'
});

/**
 * @route POST /api/auth/register
 * @desc Registrar nuevo usuario en Mega Cash
 * @access Publico
 */
router.post('/register', 
  authLimiter,
  [
    check('email')
      .isEmail()
      .withMessage('Por favor ingrese un correo válido')
      .normalizeEmail(),
    check('password')
      .isLength({ min: 6 })
      .withMessage('La contraseña debe tener al menos 6 caracteres')
      .matches(/\d/)
      .withMessage('La contraseña debe contener al menos un número'),
    check('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Las contraseñas no coinciden');
      }
      return true;
    })
  ],
  asyncHandler(authController.register)
);

/**
 * @route POST /api/auth/login
 * @desc Iniciar sesión en Mega Cash
 * @access Publico
 */
router.post('/login',
  authLimiter,
  [
    check('email')
      .isEmail()
      .withMessage('Por favor ingrese un correo válido')
      .normalizeEmail(),
    check('password')
      .notEmpty()
      .withMessage('La contraseña es requerida')
  ],
  passport.authenticate('local', { 
    session: false,
    failWithError: true 
  }),
  asyncHandler(authController.login),
  // Manejo de errores de autenticación
  (err, req, res, next) => {
    return res.status(401).json({ 
      success: false,
      error: 'Credenciales inválidas',
      timestamp: new Date().toISOString()
    });
  }
);

/**
 * @route GET /api/auth/me
 * @desc Obtener datos del usuario actual
 * @access Privado (Requiere autenticación JWT)
 */
router.get('/me',
  passport.authenticate('jwt', { session: false }),
  asyncHandler(authController.getUser)
);

/**
 * @route GET /api/auth/verify
 * @desc Verificar token JWT
 * @access Privado
 */
router.get('/verify',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        email: req.user.email,
        balance: req.user.balance,
        role: req.user.role
      },
      issuedAt: new Date(req.user.iat * 1000),
      expiresAt: new Date(req.user.exp * 1000)
    });
  }
);

module.exports = router;