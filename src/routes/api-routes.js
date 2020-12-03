const express =require('express');
const router = express.Router();
const {contactValidator} = require('../validations/contact-validator');

// -- Importation des controlleurs
const apiController = require('../controller/api-controller');

// -- Chargement des Routes

// Récupérer les contacts
router.get('/contacts', apiController.contacts_get);

// Ajouter un contact
router.post('/contacts', contactValidator, apiController.contacts_post);

// Récupérer un contact
router.get('/contacts/:id', apiController.contact_get);

// Mettre à jour un contact
router.put('/contacts/:id', apiController.contact_put);

// Supprimer un contact
router.delete('/contacts/:id', apiController.contact_delete);

// -- Exportation du router avec nos routes
module.exports = router;
