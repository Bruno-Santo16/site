# Joias Premium - Loja Online

## 📋 Descrição

Site completo e responsivo de uma loja de joias premium, desenvolvido com HTML, CSS e JavaScript puro. Inclui página de catálogo para clientes e painel administrativo para gerenciamento de produtos. Toda a persistência de dados é feita via `localStorage`.

## 🏗️ Estrutura de Arquivos

```
Site loja/
├── index.html                # Redirecionador (aponta para loja/index.html)
├── loja/
│   ├── index.html           # Página principal (loja cliente)
│   ├── css/
│   │   └── styles.css       # Estilos da loja
│   └── js/
│       └── script.js        # Lógica da loja
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
- Abra `index.html` em um navegador web (abre automaticamente `loja/index.html`)
- Ou acesse diretamente `loja/index.html`
- A loja carregará com 6 produtos de exemplo
- Todos os dados são salvos automaticamente no `localStorage`

### 2. Funcionalidades da Loja

#### Navegar no Catálogo
- Clique nas setas (◀ ▶) ou deslize para navegar entre os produtos
- Em desktop: 3 produtos por slide
- Em mobile: 1 produto por slide

#### Carrinho de Compras
- Clique no ícone do carrinho (🛒) na navbar
- Adicione produtos usando o botão "Adicionar" em cada card
- Modifique quantidades com os botões +/-
- Remova itens conforme necessário
- O contador do carrinho atualiza automaticamente

#### Sistema de Login
- Clique no ícone de usuário na navbar
- Validação: 
  - E-mail deve conter "@"
  - Senha deve ter pelo menos 4 caracteres
- Marque "Lembrar minha senha" para preenchimento automático
- Após login, seu nome aparece na navbar
- Use "Sair" para desconectar

#### Finalizar Compra
- Abra o carrinho
- Clique em "Finalizar Compra"
- Você será solicitado a fazer login se não estiver
- Uma confirmação será exibida com o total

### 3. Painel Administrativo
- Acesse em `admin/index.html`
- **Credenciais padrão:**
  - Usuário: `admin@joias.com`
  - Senha: `admin123`

#### Gerenciamento de Produtos
- **Adicionar Produto:** Clique em "+ Adicionar Novo Produto"
- **Editar Produto:** Clique em "Editar" no card do produto
- **Excluir Produto:** Clique em "Excluir" e confirme
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
- **Desktop:** Layout com 3 produtos por slide
- **Tablet (até 768px):** Navegação otimizada
- **Mobile (até 480px):** 1 produto por slide, menu adaptado

### Cores
- **Primária:** Ouro (#d4af37)
- **Fundo:** Preto degradado (#1a1a1a)
- **Destaque:** Rosa (#ff1493)
- **Sucesso:** Verde (#4caf50)
- **Erro:** Vermelho (#f44336)

### Fontes
- **Tipografia:** Poppins (Google Fonts)
- **Ícones:** Font Awesome 6

## 💾 LocalStorage

Todos os dados são armazenados no `localStorage` do navegador:

### `produtos` (Array)
```javascript
[
  {
    id: 1,
    nome: "Anel de Ouro",
    categoria: "Anéis",
    preco: 1200.00,
    descricao: "Descrição...",
    imagem: "URL da imagem"
  },
  ...
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
    quantidade: 1
  },
  ...
]
```

### `userLogged` (Boolean)
- `"true"` ou `"false"`

### `userEmail` (String)
- E-mail do usuário logado

### `savedEmail` e `savedPassword` (String)
- Salvos apenas se "Lembrar minha senha" foi marcado

## 🔐 Segurança e Notas

⚠️ **IMPORTANTE:**
- As senhas são armazenadas em **plain text** no localStorage quando "Lembrar" é marcado
- Isso é **apenas para demonstração**
- **Nunca use em produção** sem criptografia
- O painel admin usa `sessionStorage`, então o login expira ao fechar a aba

## 📱 Funcionalidades Implementadas

✅ Navbar fixa com logo e ícones
✅ Carrossel responsivo de produtos (3 desktop, 1 mobile)
✅ Navegação por clique e toque (swipe)
✅ Carrinho com sidebar overlay
✅ Gerenciamento de quantidade no carrinho
✅ Sistema de login com validação
✅ Lembrar senha
✅ Persistência de dados no localStorage
✅ Painel administrativo com CRUD
✅ Responsividade completa
✅ Animações suaves
✅ Notificações ao usuário
✅ Design premium com gradientes

## 🛠️ Tecnologias Utilizadas

- **HTML5:** Semântica e estrutura
- **CSS3:** Flexbox, Grid, Gradientes, Animações
- **JavaScript (ES6+):** Manipulação de DOM, LocalStorage
- **Font Awesome 6:** Ícones
- **Google Fonts:** Tipografia

## 📝 Observações

- Todos os IDs de produtos são gerados automaticamente
- As imagens usam o serviço `placehold.co` como placeholder
- O carrossel se adapta automaticamente ao redimensionar
- Animações são suaves e responsivas
- O código está bem comentado e organizado

## 🚨 Troubleshooting

**P: Os dados não persistem?**
- R: Verifique se o localStorage está habilitado no seu navegador

**P: Carrossel não funciona em mobile?**
- R: Certifique-se de usar navegadores modernos (Chrome, Firefox, Safari)

**P: Não consigo acessar o admin?**
- R: Use exatamente `admin@joias.com` e `admin123`

**P: As imagens não carregam?**
- R: Verifique sua conexão com a internet (usado placehold.co)

## 📞 Suporte

Para dúvidas ou melhorias, consulte o código JavaScript comentado em:
- `js/script.js` - Lógica da loja
- `admin/js/admin-script.js` - Lógica do admin

---

**Versão:** 1.0.0  
**Última atualização:** Abril 2026  
**Status:** ✅ Completo e funcionando
