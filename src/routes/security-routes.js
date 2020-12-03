const express =require('express');
const router = express.Router();
const passport = require('passport');
const securityController = require('../controller/security-controller');

router.get('/login', securityController.login_get);
router.get('/logout', securityController.logout);
router.post('/login',
    passport.authenticate('local', { failureRedirect: '/security/login' }),
    securityController.login_post);

// -- Exportation du router avec nos routes
module.exports = router;
