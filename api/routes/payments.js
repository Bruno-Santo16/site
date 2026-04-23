const express = require('express');
const router = express.Router();
const { Payment, PaymentRefund } = require('mercadopago');

module.exports = (client) => {
    const payment = new Payment(client);
    const refund = new PaymentRefund(client);

    // Criar Pagamento (Checkout API)
    router.post('/', async (req, res) => {
        try {
            const result = await payment.create({ body: req.body });
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Buscar Pagamento por ID
    router.get('/:id', async (req, res) => {
        try {
            const result = await payment.get({ id: req.params.id });
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Reembolsar Pagamento (Total ou Parcial)
    router.post('/:id/refunds', async (req, res) => {
        try {
            const result = await refund.create({ 
                paymentId: req.params.id, 
                body: req.body // Pode conter { amount: 10.50 } para reembolso parcial
            });
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Cancelar Pagamento
    router.put('/:id', async (req, res) => {
        try {
            // No SDK v2, cancelar é atualizar o status para 'cancelled'
            const result = await payment.capture({ 
                id: req.params.id, 
                body: { status: 'cancelled' } 
            });
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    return router;
};
