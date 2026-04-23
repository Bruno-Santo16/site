const express = require('express');
const cors = require('cors');
const { MercadoPagoConfig, Preference } = require('mercadopago');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN 
});

// Importação das Pastas do Postman
const preferenceRoutes = require('./routes/preferences')(client);
const paymentRoutes = require('./routes/payments')(client);
const qrCodeRoutes = require('./routes/qrCodes')(client);
const merchantOrderRoutes = require('./routes/merchantOrders')(client);
const oauthRoutes = require('./routes/oauth')(client);

app.use('/v1/preferences', preferenceRoutes);
app.use('/v1/payments', paymentRoutes);
app.use('/v1/qr_codes', qrCodeRoutes);
app.use('/v1/merchant_orders', merchantOrderRoutes);
app.use('/v1/oauth', oauthRoutes);

app.post('/create_preference', async (req, res) => {
    console.log('--- REQUISIÇÃO RECEBIDA DO SITE ---');
    try {
        const { items, customer, paymentMethod } = req.body;
        
        console.log('Método Selecionado no Site:', paymentMethod);
        console.log('Cliente:', customer.email);

        const pref = new Preference(client);
        
        const preferenceData = {
            body: {
                items: items.map(i => ({ 
                    id: String(i.id), 
                    title: String(i.nome), 
                    quantity: Number(i.quantidade), 
                    unit_price: Number(i.preco), 
                    currency_id: 'BRL' 
                })),
                payer: { 
                    email: customer.email 
                },
                back_urls: {
                    success: 'http://127.0.0.1:5500/loja/index.html',
                    failure: 'http://127.0.0.1:5500/loja/index.html',
                    pending: 'http://127.0.0.1:5500/loja/index.html'
                },
                payment_methods: {
                    excluded_payment_methods: [],
                    excluded_payment_types: [],
                    installments: 12
                }
            }
        };

        // Lógica de exclusão agressiva
        if (paymentMethod === 'pix') {
            console.log('BLOQUEANDO TUDO EXCETO PIX...');
            preferenceData.body.payment_methods = {
                excluded_payment_types: [
                    { id: 'credit_card' },
                    { id: 'debit_card' },
                    { id: 'ticket' },
                    { id: 'atm' }
                ],
                installments: 1
            };
        } else if (paymentMethod === 'boleto') {
            console.log('BLOQUEANDO TUDO EXCETO BOLETO...');
            preferenceData.body.payment_methods = {
                excluded_payment_types: [
                    { id: 'credit_card' },
                    { id: 'debit_card' },
                    { id: 'bank_transfer' }
                ]
            };
        } else {
            console.log('Checkout padrão (Cartão habilitado)');
        }

        const result = await pref.create(preferenceData);
        
        console.log('Sucesso! Link de checkout:', result.init_point);
        res.json({ id: result.id, init_point: result.init_point });
    } catch (error) {
        console.error('Erro na API:', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, '0.0.0.0', () => {
  console.log('--- API MERCADO PAGO ONLINE ---');
  console.log(`Servidor rodando em: http://127.0.0.1:${port}`);
});
