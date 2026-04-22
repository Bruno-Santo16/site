# Joias Premium - Loja Online

## 📋 Descrição

Site completo e responsivo de uma loja de joias premium, desenvolvido com HTML, CSS e JavaScript puro. Inclui página de catálogo para clientes com busca e filtros, carrinho de compras, checkout completo, sistema de avaliações, histórico de pedidos, lista de desejos e painel administrativo para gerenciamento de produtos. Toda a persistência de dados é feita via `localStorage`.

## 🏗️ Estrutura de Arquivos

```
Site loja/
├── index.html                # Redirecionador para loja/index.html
├── loja/
│   ├── index.html           # Página principal da loja
│   ├── css/
│   │   └── styles.css       # Estilos completos da loja
│   └── js/
│   │   └── script.js        # Lógica completa da loja
├── admin/
│   ├── index.html           # Painel administrativo
│   ├── css/
│   │   └── admin-styles.css # Estilos do admin
│   └── js/
│       └── admin-script.js  # Lógica do admin
└── README.md                # Este arquivo
```

## 🚀 Como Usar

### 1. Abrir a Loja
- Abra `index.html` ou `loja/index.html` em um navegador web
- A loja carregará com 12 produtos de exemplo
- Todos os dados são salvos automaticamente no `localStorage`

### 2. Funcionalidades da Loja

#### Navegar no Catálogo
- Role a página para ver produtos organizados por categoria
- Use a **barra de busca** para encontrar produtos por nome ou descrição
- Use os **filtros** para filtrar por categoria e faixa de preço
- Clique em um produto para ver detalhes completos

#### Detalhes do Produto
- Clique em qualquer produto para abrir o modal de detalhes
- Veja imagens ampliadas com zoom
- Leia avaliações de outros clientes
- Escreva sua própria avaliação (requer login)
- Adicione ao carrinho ou à lista de desejos

#### Carrinho de Compras
- Clique no ícone do carrinho (🛒) na navbar
- Adicione produtos usando o botão "Adicionar" em cada card
- Modifique quantidades com os botões +/−
- Remova itens conforme necessário
- Aplique **cupons de desconto**:
  - `PRIMEIRO10` - 10% OFF primeira compra
  - `JOIAS20` - 20% OFF
  - `LUXO50` - R$ 50 OFF
  - `FRETEGRATIS` - Frete grátis
- O contador do carrinho atualiza automaticamente

#### Checkout Completo
1. Clique em "Finalizar Compra" no carrinho
2. Preencha seus dados pessoais
3. Digite o CEP para busca automática de endereço
4. Selecione a forma de pagamento:
   - **Cartão de Crédito**: Preencha os dados do cartão
   - **PIX**: Pagamento instantâneo
   - **Boleto**: Impressão após finalizar
5. Revise o resumo do pedido
6. Clique em "Finalizar Pedido"

#### Lista de Desejos (Wishlist)
- Clique no ícone de coração (❤️) em qualquer produto
- Acesse sua lista pelo ícone na navbar (requer login)
- Mova itens diretamente para o carrinho

#### Sistema de Login
- Clique no ícone de usuário na navbar
- Validação:
  - E-mail deve conter "@"
  - Senha deve ter pelo menos 4 caracteres
- Marque "Lembrar minha senha" para preenchimento automático
- Após login, acesse:
  - Meus Pedidos - Histórico completo de compras
  - Lista de Desejos - Produtos favoritados
  - Minha Conta - Dados do usuário

#### Perfil do Usuário

**Meus Pedidos:**
- Veja todos os pedidos realizados
- Acompanhe o status (Pendente, Concluído, Cancelado)
- Clique em "Ver" para detalhes completos do pedido

**Lista de Desejos:**
- Todos os produtos favoritados
- Adicione ao carrinho diretamente da lista

**Minha Conta:**
- Dados cadastrais
- Data de cadastro
- Total de pedidos realizados

#### Sistema de Avaliações
- Faça login para avaliar produtos
- Dê notas de 1 a 5 estrelas
- Escreva comentários sobre o produto
- Veja a média de avaliações de cada produto

### 3. Painel Administrativo

- Acesse em `admin/index.html`
- **Credenciais padrão:**
  - Usuário: `admin@joias.com`
  - Senha: `admin123`

#### Gerenciamento de Produtos
- **Adicionar Produto:** Clique em "+ Adicionar Novo Produto"
- **Editar Produto:** Clique em "Editar" no card do produto
- **Excluir Produto:** Clique em "Excluir" e confirme
- **Upload de Imagem:** Carregue imagens locais (até 2MB)
- **Campos obrigatórios:**
  - Nome
  - Categoria (Anéis, Brincos, Colares, Pulseiras, Pingentes)
  - Preço (em R$)
  - Descrição

#### Voltar à Loja
- Use o botão "Voltar à Loja" no painel admin
- Clique "Sair" para fazer logout

## 🎨 Design e Responsividade

### Breakpoints
- **Desktop (> 1024px):** Layout completo com 3-4 produtos por linha
- **Tablet (768px - 1024px):** 2 produtos por linha
- **Mobile (< 768px):** 1 produto por linha, menu otimizado

### Cores
- **Primária:** Ouro (#d4af37)
- **Fundo:** Preto degradê (#1a1a1a → #0d0d0d)
- **Destaque:** Rosa (#ff1493)
- **Sucesso:** Verde (#4caf50)
- **Erro:** Vermelho (#f44336)
- **Estrelas:** Amarelo (#ffc107)

### Fontes
- **Tipografia:** Poppins (Google Fonts)
- **Ícones:** Font Awesome 6

### Animações
- Hover effects em produtos
- Slide-in para notificações toast
- Fade-in para modais
- Shimmer para loading skeletons
- Sparkle no ícone da logo

## 💾 LocalStorage

Todos os dados são armazenados no `localStorage` do navegador:

### `produtos` (Array)
```javascript
[
  {
    id: 1,
    nome: "Anel de Ouro 18k",
    categoria: "Anéis",
    preco: 1200.00,
    descricao: "Descrição detalhada...",
    imagem: "URL da imagem",
    rating: 4.5,
    reviews: [
      {
        nome: "João",
        rating: 5,
        texto: "Produto excelente!",
        data: "2026-04-20T00:00:00Z"
      }
    ]
  }
]
```

### `carrinho` (Array)
```javascript
[
  {
    id: 1,
    nome: "Anel de Ouro",
    categoria: "Anéis",
    preco: 1200.00,
    descricao: "Descrição...",
    imagem: "URL da imagem",
    quantidade: 2
  }
]
```

### `wishlist` (Array)
Lista de produtos favoritados pelo usuário.

### `pedidos` (Array)
```javascript
[
  {
    id: 1234567890,
    data: "2026-04-20T15:30:00Z",
    cliente: {
      nome: "João Silva",
      email: "joao@email.com",
      telefone: "(11) 99999-9999"
    },
    endereco: {
      cep: "01000-000",
      rua: "Rua Exemplo",
      numero: "123",
      complemento: "Apto 10",
      bairro: "Centro",
      cidade: "São Paulo - SP"
    },
    pagamento: "credit",
    itens: [...],
    subtotal: 1200.00,
    desconto: 120.00,
    frete: 0,
    total: 1080.00,
    status: "pending",
    cupom: "PRIMEIRO10"
  }
]
```

### `cuponsUsados` (Array)
Cupons já utilizados pelo usuário (um uso por cupom).

### `userLogged`, `userEmail`, `savedEmail`, `savedPassword`
Dados de autenticação do usuário.

## 🔐 Segurança e Notas

⚠️ **IMPORTANTE:**
- As senhas são armazenadas em **plain text** no localStorage quando "Lembrar" é marcado
- Isso é **apenas para demonstração**
- **Nunca use em produção** sem criptografia adequada
- O painel admin usa `sessionStorage`, então o login expira ao fechar a aba
- Dados sensíveis como cartão de crédito **não são realmente processados**

## 📱 Funcionalidades Implementadas

### Loja
✅ Navbar fixa com logo animado
✅ Busca de produtos por nome/descrição
✅ Filtros por categoria e faixa de preço
✅ Grid de produtos responsivo
✅ Modal de detalhes do produto
✅ Zoom de imagem
✅ Sistema de avaliações com estrelas
✅ Carrinho com sidebar overlay
✅ Cupons de desconto
✅ Checkout completo com CEP automático
✅ Múltiplas formas de pagamento
✅ Lista de desejos (wishlist)
✅ Histórico de pedidos
✅ Perfil do usuário
✅ Toast notifications
✅ Loading overlays
✅ Máscaras de formulário (telefone, CEP, cartão)

### Admin
✅ Login administrativo
✅ CRUD completo de produtos
✅ Upload de imagens locais
✅ Validação de formulários
✅ Confirmação de exclusão
✅ Notificações toast

## 🛠️ Tecnologias Utilizadas

- **HTML5:** Semântica e estrutura
- **CSS3:** Flexbox, Grid, Gradientes, Animações, Variáveis CSS
- **JavaScript (ES6+):** Manipulação de DOM, LocalStorage, Fetch API
- **Font Awesome 6:** Ícones
- **Google Fonts:** Tipografia Poppins
- **ViaCEP API:** Busca automática de endereços

## 📝 Observações

- Todos os IDs de produtos são gerados automaticamente
- As imagens usam o serviço `placehold.co` como placeholder
- O código está bem comentado e organizado
- 12 produtos de exemplo pré-carregados
- Cupons de desconto com uso único por usuário
- Frete grátis para compras acima de R$ 500

## 🚨 Troubleshooting

**P: Os dados não persistem?**
- R: Verifique se o localStorage está habilitado no seu navegador

**P: A busca de CEP não funciona?**
- R: Verifique sua conexão com a internet (API ViaCEP)

**P: Não consigo acessar o admin?**
- R: Use exatamente `admin@joias.com` e `admin123`

**P: As imagens não carregam?**
- R: Verifique sua conexão com a internet (usado placehold.co)

**P: Cupom não aplica desconto?**
- R: Verifique se já usou este cupom antes (uso único)

## 🎯 Próximas Melhorias (Sugestões)

- Integração com gateway de pagamento real
- Envio de e-mail de confirmação
- Painel de analytics para admin
- Sistema de notificações push
- Chat de atendimento
- Integração com correios para cálculo de frete

## 📞 Suporte

Para dúvidas ou melhorias, consulte o código JavaScript comentado em:
- `loja/js/script.js` - Lógica completa da loja
- `admin/js/admin-script.js` - Lógica do admin

---

**Versão:** 2.0.0  
**Última atualização:** Abril 2026  
**Status:** ✅ Completo com todas as features

### Features da Versão 2.0:
- ✨ Busca e filtros de produtos
- ✨ Página de detalhes do produto
- ✨ Zoom de imagem
- ✨ Sistema de avaliações
- ✨ Checkout completo com formulário
- ✨ Busca automática de CEP
- ✨ Múltiplas formas de pagamento
- ✨ Cupons de desconto
- ✨ Histórico de pedidos
- ✨ Lista de desejos
- ✨ Perfil do usuário
- ✨ Toast notifications
- ✨ Máscaras de formulário
- ✨ Loading states
- ✨ Animações refinadas
