const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rota para processar o pedido e gerar o link da InfinitePay
app.post('/create_preference', async (req, res) => {
    console.log('--- REQUISIÇÃO RECEBIDA (Gerando link InfinitePay) ---');
    try {
        const { items, totals, customer, address, external_reference } = req.body;

        const handle = process.env.INFINITEPAY_HANDLE;
        if (!handle) {
            throw new Error('INFINITEPAY_HANDLE não configurado no .env');
        }

        // Calcula o fator de desconto para aplicar proporcionalmente em cada item
        // Se subtotal é 100 e desconto é 10, cada item terá 10% de desconto
        const discountFactor = totals.subtotal > 0 ? (totals.subtotal - totals.discount) / totals.subtotal : 1;

        // Formata itens para o padrão da InfinitePay (preço em centavos)
        const infinitePayItems = items.map(item => ({
            name: item.nome, // Testando 'name' novamente pois alguns logs mostraram sucesso com ele
            description: item.nome, // Enviando ambos para garantir compatibilidade
            price: Math.round(item.preco * discountFactor * 100), // Aplica desconto e converte para centavos
            quantity: parseInt(item.quantidade)
        }));

        // Adiciona o frete como um item (Frete sempre positivo)
        if (totals.shipping > 0) {
            infinitePayItems.push({
                name: 'Frete',
                description: 'Custo de entrega',
                price: Math.round(totals.shipping * 100),
                quantity: 1
            });
        }

        // Formata o telefone para o padrão +55XXXXXXXXXXX
        let phoneNumber = customer.phone.replace(/\D/g, '');
        if (phoneNumber.length === 11) {
            phoneNumber = `+55${phoneNumber}`;
        }

        const payload = {
            handle: handle,
            order_nsu: external_reference.toString(),
            items: infinitePayItems,
            customer: {
                name: customer.nome,
                email: customer.email,
                phone_number: phoneNumber
            },
            address: {
                cep: address.cep.replace(/\D/g, ''),
                street: address.street,
                number: address.number,
                complement: address.complement,
                neighborhood: address.neighborhood,
                city: address.city
            },
            redirect_url: `http://127.0.0.1:5500/loja/index.html?status=success&order_id=${external_reference}`,
            webhook_url: `https://seu-webhook.com/webhook`
        };

        console.log('Enviando payload para InfinitePay:', JSON.stringify(payload, null, 2));

        const response = await fetch('https://api.infinitepay.io/invoices/public/checkout/links', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const responseText = await response.text();
        let data;
        
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            console.error('Falha ao parsear JSON da InfinitePay. Resposta bruta:', responseText);
            return res.status(500).json({ 
                error: 'Resposta inválida da InfinitePay',
                raw: responseText 
            });
        }

        if (!response.ok) {
            console.error('Erro na API da InfinitePay:', data);
            return res.status(response.status).json({ 
                error: 'Erro ao gerar link de pagamento',
                details: data 
            });
        }

        console.log('Sucesso! Link gerado:', data.url);

        res.json({ 
            init_point: data.url 
        });

    } catch (error) {
        console.error('Erro no servidor:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint de Webhook para receber notificações de pagamento
app.post('/webhook', (req, res) => {
    console.log('--- WEBHOOK RECEBIDO ---');
    const notification = req.body;
    console.log('Dados do Webhook:', JSON.stringify(notification, null, 2));
    res.status(200).send('OK');
});

app.listen(port, '0.0.0.0', () => {
  console.log('--- SERVIDOR INFINITEPAY ONLINE ---');
  console.log(`Rodando em: http://127.0.0.1:${port}`);
});
