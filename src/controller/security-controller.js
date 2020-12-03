/**
 * Page de Connexion
 * @param req
 * @param res
 */
exports.login_get = (req, res) => {
    res.render('security/login');
}

/**
 * Authentification sur l'application
 * @param req
 * @param res
 */
exports.login_post = (req, res) => {
    res.redirect('/');
}

/**
 * Page de Déconnexion
 * @param req
 * @param res
 */
exports.logout = (req, res) => {
    req.logout();
    res.redirect('/');
}
