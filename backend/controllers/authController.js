const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registro de usuario
exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verificar si el usuario ya está registrado
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'El correo ya está registrado.' });
        }

        // Encriptar contraseña antes de guardar
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });

        await newUser.save();

        // Generar token JWT
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ 
            success: true, 
            token, 
            user: { id: newUser._id, email: newUser.email }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar usuario.', error: error.message });
    }
};

// Inicio de sesión
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar usuario en la base de datos
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Correo o contraseña incorrectos.' });
        }

        // Comparar la contraseña ingresada con la guardada
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Correo o contraseña incorrectos.' });
        }

        // Generar token JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ 
            success: true, 
            token, 
            user: { id: user._id, email: user.email, balance: user.balance } 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al iniciar sesión.', error: error.message });
    }
};

// Obtener datos del usuario actual
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los datos del usuario.', error: error.message });
    }
};