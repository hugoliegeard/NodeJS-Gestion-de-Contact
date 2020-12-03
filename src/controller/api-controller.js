const Contact = require('../models/contact-model');
const {validationResult} = require('express-validator');

/**
 * Afficher les contacts
 * @param req
 * @param res
 */
exports.contacts_get = async (req, res) => {
    try {
        const contacts = await Contact.find().exec();
        res.status(200).json({
            status: 200,
            method: req.method,
            data: contacts
        });
    } catch (err) {
        return res.status(400).json({message: err.message});
    }
};

/**
 * Créer un nouveau contact
 * @param req
 * @param res
 */
exports.contacts_post = (req, res) => {
    const body = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            'errors': errors.array()
        });
    } else {
        const contact = new Contact(body);
        contact.save(err => {
            res.status(201).json({
                status: 201,
                method: req.method,
                data: contact
            });
        });
    }
};

/**
 * Afficher un contact via son ID
 * @param req
 * @param res
 */
exports.contact_get = (req, res) => {
};

/**
 * Modifier un contact via son ID
 * @param req
 * @param res
 */
exports.contact_put = (req, res) => {
};

/**
 * Supprimer un contact via son ID
 * @param req
 * @param res
 */
exports.contact_delete = (req, res) => {
};
