/**
 * Chargement des variables d'environnements
 * npm i dotenv
 */
const dotenv = require('dotenv');
dotenv.config({path: '.env'});

/**
 * Import du Framework Express
 * ----------------------------
 * Installation : npm install express
 */
const express = require('express');

/**
 * Initialisation de l'application Express
 * @type {*|Express}
 */
const app = express();
const port = process.env.PORT || 3000;

/**
 * Configuration du templating Handlebars
 */

const hbs = require('express-handlebars');
const helpers = require('handlebars-helpers')();

helpers.ifIn = (collection = [], param, value) => {
    for (let i = 0; i < collection.length; i++) {
        if (collection[i][param] === value) {
            return collection[i];
        }
    }
    return false;
}

app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/',
    helpers: helpers
}))

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

/**
 * Récupérer les données POST
 * https://github.com/expressjs/body-parser#readme
 * https://www.npmjs.com/package/body-parser
 */
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

/**
 * Configuration de la connexion à MongoDB
 * cf. https://www.npmjs.com/package/mongoose
 * npm install mongoose
 * @type {Mongoose}
 */
const mongoose = require('mongoose');
const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

/**
 * Configuration des sessions avec Express
 * https://www.npmjs.com/package/express-session
 * https://www.npmjs.com/package/cookie-parser
 */
const cookieParser = require('cookie-parser');
const session = require('express-session');

app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {secure: false}
}));

// Configuration des notifications flash
app.use((req, res, next) => {
    res.locals.flash = req.session.flash;
    delete req.session.flash;
    next();
});

/**
 * Json2XLS Middleware
 * https://www.npmjs.com/package/json2xls
 */
app.use(require('json2xls').middleware);

/**
 * Passport Initialize
 * @type {Authenticator}
 */
const passport = require('./src/services/passport');
app.use(passport.initialize());
app.use(passport.session());

/**
 * Permet de gérer l'affichage de nos assets
 * https://expressjs.com/fr/starter/static-files.html
 */
app.use('/public', express.static(__dirname + '/public'));

/**
 * Mise en Place du Routage
 */
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn('/security/login');
app.get('/admin/*', ensureLoggedIn, (req, res, next) => {
    next();
});

app.get('/', (req, res) => {
    res.redirect('/admin');
});

app.use('/admin', require('./src/routes/admin-routes'));
app.use('/security', require('./src/routes/security-routes'));
app.use('/api', require('./src/routes/api-routes'));

/** Gestion des erreurs 404 **/
app.use((req, res) => {
    res.status(404).render('error');
});

/**
 * Démarrage du serveur et écoute
 * des connexions sur le port 3000
 */
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}/`);
    console.log(`Press CTRL + C to stop\n`);
});
