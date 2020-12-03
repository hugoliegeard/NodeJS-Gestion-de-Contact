/**
 * Authentification avec Passport
 */
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user-model');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
}, async (email, password, next) => {

    // Rechercher l'utilisateur via son Email
    const user = await User.findOne({ email: email }).exec();

    // Si aucun utilisateur n'existe avec ce mail...
    if(!user) { return next(null, false) }

    // Vérification du mot de passe
    if( user.password !== password ) { return next(null, false) }

    // Si j'arrive ici, l'utilisateur peut être authentifié
    return next(null, user);
}));

passport.serializeUser((user, next) => { next(null, user.id) });
passport.deserializeUser(async (id, next) => {
    const user = await User.findById(id).exec();
    next(null, user);
})

module.exports = passport;
