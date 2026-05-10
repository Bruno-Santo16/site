const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// 1. Configurações de Segurança de Cabeçalho
app.use(helmet());

// 2. Configuração de CORS
const corsOptions = {
    origin: '*', // Permitir todas as origens temporariamente para teste, ou restrinja às suas
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// 3. AUMENTO DE LIMITE DE PAYLOAD (Crítico para o erro 413)
// Configurado antes de qualquer rota
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 4. Rate Limiting
const createPreferenceLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, // Aumentado para evitar bloqueios em testes
    message: { error: 'Muitas requisições. Tente novamente em breve.' }
});

// Rota para processar o pedido e gerar o link da InfinitePay
app.post('/create_preference', createPreferenceLimiter, async (req, res) => {
    console.log('--- REQUISIÇÃO RECEBIDA ---');
    try {
        const { items, totals, customer, address, external_reference } = req.body;

        if (!items || !totals || !customer || !address || !external_reference) {
            return res.status(400).json({ error: 'Dados incompletos no pedido' });
        }

        const handle = process.env.INFINITEPAY_HANDLE;
        if (!handle) {
            return res.status(500).json({ error: 'Erro de configuração interna: Handle ausente' });
        }

        const subtotal = parseFloat(totals.subtotal) || 0;
        const discount = parseFloat(totals.discount) || 0;
        const discountFactor = subtotal > 0 ? (subtotal - discount) / subtotal : 1;

        const infinitePayItems = items.map(item => ({
            name: (item.nome || 'Produto').substring(0, 100),
            description: (item.nome || 'Produto').substring(0, 255),
            price: Math.round(parseFloat(item.preco) * discountFactor * 100),
            quantity: Math.max(1, parseInt(item.quantidade))
        }));

        const shippingPrice = Math.round(parseFloat(totals.shipping || 0) * 100);
        if (shippingPrice > 0) {
            infinitePayItems.push({
                name: 'Frete',
                description: 'Custo de entrega',
                price: shippingPrice,
                quantity: 1
            });
        }

        let phoneNumber = (customer.phone || '').replace(/\D/g, '');
        if (phoneNumber.length === 11) phoneNumber = `+55${phoneNumber}`;

        const payload = {
            handle: handle,
            order_nsu: external_reference.toString(),
            items: infinitePayItems,
            customer: {
                name: (customer.nome || '').substring(0, 100),
                email: (customer.email || '').substring(0, 100),
                phone_number: phoneNumber
            },
            address: {
                cep: (address.cep || '').replace(/\D/g, ''),
                street: (address.street || '').substring(0, 100),
                number: (address.number || '').substring(0, 20),
                complement: (address.complement || '').substring(0, 100),
                neighborhood: (address.neighborhood || '').substring(0, 100),
                city: (address.city || '').substring(0, 100)
            },
            redirect_url: `https://site-loja-frontend.onrender.com/loja/index.html?status=success&order_id=${external_reference}`,
            webhook_url: `https://seu-webhook.com/webhook`
        };

        const response = await fetch('https://api.infinitepay.io/invoices/public/checkout/links', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const responseText = await response.text();
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            return res.status(500).json({ error: 'Resposta inválida do gateway' });
        }

        if (!response.ok) {
            return res.status(response.status).json({ error: 'Erro no gateway', details: data });
        }

        res.json({ init_point: data.url });

    } catch (error) {
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
});

app.post('/webhook', (req, res) => {
    res.status(200).send('OK');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`--- SERVIDOR ONLINE NA PORTA ${port} ---`);
});
