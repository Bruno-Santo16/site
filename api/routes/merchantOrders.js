const express = require('express');
const router = express.Router();
const { MerchantOrder } = require('mercadopago');

module.exports = (client) => {
    const merchantOrder = new MerchantOrder(client);

    // Buscar Pedido do Comerciante por ID
    router.get('/:id', async (req, res) => {
        try {
            const result = await merchantOrder.get({ merchantOrderId: req.params.id });
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Atualizar Pedido
    router.put('/:id', async (req, res) => {
        try {
            const result = await merchantOrder.update({ merchantOrderId: req.params.id, body: req.body });
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    return router;
};
