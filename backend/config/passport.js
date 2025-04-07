const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

// Estrategia Local para login
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
            return done(null, false, { message: 'Usuario no encontrado' });
        }
        
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return done(null, false, { message: 'Contraseña incorrecta' });
        }
        
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

// Serialización (Opcional para sesiones)
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialización (Opcional para sesiones)
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

module.exports = passport;