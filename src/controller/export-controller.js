const puppeteer = require('puppeteer');
const Contact = require('../models/contact-model');

/**
 * Générer un PDF avec Puppeteer
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.pdf = async (req, res) => {
    try {
        const contacts = await Contact.find().exec();
        res.render('pdf/contacts', {layout: 'pdfLayout.hbs', 'contacts': contacts.map(contact => contact.toJSON())}, (
            async (err, html) => {
                const browser = await puppeteer.launch();
                const page = await browser.newPage();
                await page.setContent(html);
                const pdfName = `contacts-${Date.now()}.pdf`;
                await page.pdf({
                    path: `public/pdf/${pdfName}`,
                    format: 'A4'
                });

                await browser.close();
                res.redirect(`/public/pdf/${pdfName}`);
            }
        ));
    } catch (err) {
        return res.status(500).send({message: err.message});
    }
};

/**
 * Générer un fichier Excel
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.xlsx = async (req, res) => {
    try {
        const xlsxContacts = [];
        const contacts = await Contact.find().exec();
        contacts.map(contact => contact.toJSON());
        for (let contact of contacts) {
            xlsxContacts.push({
                id: contact._id,
                prenom: contact.prenom,
                nom: contact.nom,
                email: contact.email,
                tel: contact.tel
            });
        }
        res.xls('contacts.xlsx', xlsxContacts);
    } catch (err) {
        return res.status(500).send({message: err.message});
    }
};
