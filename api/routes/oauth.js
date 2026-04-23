const express = require('express');
const router = express.Router();
const { OAuth } = require('mercadopago');

module.exports = (client) => {
    const oauth = new OAuth(client);

    // Gerar link de autorização para outros vendedores
    router.get('/authorization', (req, res) => {
        const url = `https://auth.mercadopago.com.br/authorization?client_id=${process.env.MP_CLIENT_ID}&response_type=code&platform_id=mp&redirect_uri=${process.env.MP_REDIRECT_URI}`;
        res.json({ url });
    });

    // Trocar código por Token de acesso
    router.post('/token', async (req, res) => {
        try {
            const result = await oauth.create({ 
                body: {
                    client_id: process.env.MP_CLIENT_ID,
                    client_secret: process.env.MP_CLIENT_SECRET,
                    code: req.body.code,
                    grant_type: 'authorization_code',
                    redirect_uri: process.env.MP_REDIRECT_URI
                }
            });
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    return router;
};
