const express = require('express');
const router = express.Router();
const { Preference } = require('mercadopago');

module.exports = (client) => {
    const preference = new Preference(client);

    // Criar Preferência (Checkout Pro)
    router.post('/', async (req, res) => {
        try {
            const result = await preference.create({ body: req.body });
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Buscar Preferência
    router.get('/:id', async (req, res) => {
        try {
            const result = await preference.get({ preferenceId: req.params.id });
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    return router;
};
