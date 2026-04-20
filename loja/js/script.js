/* ============================
   INICIALIZAÇÃO E DADOS
   ============================ */

// Inicializar dados no localStorage se vazio ou inexistente
function initializeLocalStorage() {
    const produtosExistentes = localStorage.getItem('produtos');
    if (!produtosExistentes || JSON.parse(produtosExistentes).length === 0) {
        const produtosExemplo = [
            {
                id: 1,
                nome: 'Anel de Ouro',
                categoria: 'Anéis',
                preco: 1200.00,
                descricao: 'Anel clássico de ouro 18k com design elegante',
                imagem: 'https://placehold.co/200x200?text=Anel+Ouro'
            },
            {
                id: 2,
                nome: 'Brinco de Diamante',
                categoria: 'Brincos',
                preco: 1500.00,
                descricao: 'Brinco sofisticado com diamante certificado',
                imagem: 'https://placehold.co/200x200?text=Brinco+Diamante'
            },
            {
                id: 3,
                nome: 'Colar de Pérola',
                categoria: 'Colares',
                preco: 890.00,
                descricao: 'Colar elegante com pérola natural',
                imagem: 'https://placehold.co/200x200?text=Colar+Perola'
            },
            {
                id: 4,
                nome: 'Pulseira de Ouro',
                categoria: 'Pulseiras',
                preco: 950.00,
                descricao: 'Pulseira delicada com acabamento premium',
                imagem: 'https://placehold.co/200x200?text=Pulseira+Ouro'
            },
            {
                id: 5,
                nome: 'Pingente Safira',
                categoria: 'Pingentes',
                preco: 1100.00,
                descricao: 'Pingente com safira azul natural',
                imagem: 'https://placehold.co/200x200?text=Pingente+Safira'
            },
            {
                id: 6,
                nome: 'Anel de Prata',
                categoria: 'Anéis',
                preco: 450.00,
                descricao: 'Anel moderno de prata esterlina',
                imagem: 'https://placehold.co/200x200?text=Anel+Prata'
            }
        ];
        localStorage.setItem('produtos', JSON.stringify(produtosExemplo));
    }

    if (!localStorage.getItem('carrinho')) {
        localStorage.setItem('carrinho', JSON.stringify([]));
    }
}

// Função para obter produtos do localStorage
function getProdutos() {
    try {
        const produtos = localStorage.getItem('produtos');
        return produtos ? JSON.parse(produtos) : [];
    } catch (e) {
        console.error("Erro ao carregar produtos:", e);
        return [];
    }
}

// Função para obter carrinho do localStorage
function getCarrinho() {
    try {
        const carrinho = localStorage.getItem('carrinho');
        return carrinho ? JSON.parse(carrinho) : [];
    } catch (e) {
        return [];
    }
}

// Função para salvar carrinho no localStorage
function saveCarrinho(carrinho) {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

// ============================
// PRODUTOS POR CATEGORIA (GRID)
// ============================

function renderCategories() {
    const produtos = getProdutos();
    const container = document.getElementById('categoryContainer');
    
    if (!container) return;
    
    container.innerHTML = '';

    if (produtos.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 2rem;">Nenhum produto disponível no momento.</p>';
        return;
    }

    // Agrupar produtos por categoria
    const categorias = [...new Set(produtos.map(p => p.categoria))];

    categorias.forEach(cat => {
        const produtosDaCat = produtos.filter(p => p.categoria === cat);
        
        const section = document.createElement('div');
        section.className = 'category-group';
        
        section.innerHTML = `
            <h2 class="category-title">${cat}</h2>
            <div class="products-grid">
                ${produtosDaCat.map(produto => `
                    <div class="product-card">
                        <div class="product-image">
                            <img src="${produto.imagem}" alt="${produto.nome}" onerror="this.src='https://placehold.co/200x200?text=${produto.nome}'">
                        </div>
                        <div class="product-info">
                            <div class="product-category">${produto.categoria}</div>
                            <div class="product-name">${produto.nome}</div>
                            <div class="product-price">R$ ${produto.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                            <div class="product-description">${produto.descricao}</div>
                            <button class="add-to-cart-btn" onclick="addToCart(${produto.id})">
                                <i class="fas fa-shopping-cart"></i> Adicionar
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        container.appendChild(section);
    });
}

// ============================
// CARRINHO
// ============================

function addToCart(produtoId) {
    const produtos = getProdutos();
    const produto = produtos.find(p => p.id === produtoId);
    
    if (!produto) return;

    const carrinho = getCarrinho();
    const itemExistente = carrinho.find(item => item.id === produtoId);

    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        carrinho.push({
            ...produto,
            quantidade: 1
        });
    }

    saveCarrinho(carrinho);
    updateCartUI();
    
    // Feedback visual
    showNotification(`${produto.nome} adicionado ao carrinho!`);
}

function removeFromCart(produtoId) {
    let carrinho = getCarrinho();
    carrinho = carrinho.filter(item => item.id !== produtoId);
    saveCarrinho(carrinho);
    updateCartUI();
}

function updateCartQuantity(produtoId, quantidade) {
    const carrinho = getCarrinho();
    const item = carrinho.find(item => item.id === produtoId);

    if (item) {
        item.quantidade = Math.max(1, quantidade);
        saveCarrinho(carrinho);
        updateCartUI();
    }
}

function updateCartUI() {
    const carrinho = getCarrinho();
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    // Atualizar contador
    const totalItems = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
    cartCount.textContent = totalItems;

    // Atualizar itens do carrinho
    if (carrinho.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Carrinho vazio</p>';
    } else {
        cartItems.innerHTML = carrinho.map(item => `
            <div class="cart-item">
                <div class="cart-item-header">
                    <span class="cart-item-name">${item.nome}</span>
                    <span class="cart-item-price">R$ ${item.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantidade - 1})">−</button>
                        <span class="quantity-display">${item.quantidade}</span>
                        <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantidade + 1})">+</button>
                    </div>
                    <button class="remove-item-btn" onclick="removeFromCart(${item.id})">Remover</button>
                </div>
            </div>
        `).join('');
    }

    // Atualizar total
    const total = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    cartTotal.textContent = `R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
}

// ============================
// MODAIS E EVENTOS
// ============================

function openCartSidebar() {
    const cartSidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');
    cartSidebar.classList.add('open');
    overlay.classList.add('active');
}

function closeCartSidebar() {
    const cartSidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');
    cartSidebar.classList.remove('open');
    overlay.classList.remove('active');
}

function openLoginModal() {
    const loginModal = document.getElementById('loginModal');
    const modalOverlay = document.getElementById('modalOverlay');
    loginModal.classList.add('active');
    modalOverlay.classList.add('active');
}

function closeLoginModal() {
    const loginModal = document.getElementById('loginModal');
    const modalOverlay = document.getElementById('modalOverlay');
    loginModal.classList.remove('active');
    modalOverlay.classList.remove('active');
}

// ============================
// LOGIN DO CLIENTE
// ============================

function isUserLogged() {
    return localStorage.getItem('userLogged') === 'true';
}

function getUserEmail() {
    return localStorage.getItem('userEmail');
}

function updateLoginUI() {
    const loginIcon = document.getElementById('loginIcon');
    const userLogged = document.getElementById('userLogged');
    const userName = document.getElementById('userName');

    if (isUserLogged()) {
        const email = getUserEmail();
        const name = email.split('@')[0];
        loginIcon.style.display = 'none';
        userLogged.style.display = 'flex';
        userName.textContent = name.charAt(0).toUpperCase() + name.slice(1);
    } else {
        loginIcon.style.display = 'block';
        userLogged.style.display = 'none';
    }
}

function validateEmail(email) {
    return email.includes('@');
}

function validatePassword(password) {
    return password.length >= 4;
}

function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberPassword = document.getElementById('rememberPassword').checked;

    // Validação
    if (!validateEmail(email)) {
        alert('E-mail inválido! Deve conter @');
        return;
    }

    if (!validatePassword(password)) {
        alert('Senha inválida! Mínimo 4 caracteres');
        return;
    }

    // Salvar login
    localStorage.setItem('userLogged', 'true');
    localStorage.setItem('userEmail', email);

    if (rememberPassword) {
        localStorage.setItem('savedEmail', email);
        localStorage.setItem('savedPassword', password);
    }

    updateLoginUI();
    closeLoginModal();
    showNotification(`Bem-vindo, ${email.split('@')[0]}!`);
}

function handleLogout() {
    localStorage.removeItem('userLogged');
    localStorage.removeItem('userEmail');
    updateLoginUI();
    closeCartSidebar();
    showNotification('Você saiu de sua conta');
}

function handleForgotPassword() {
    const email = document.getElementById('email').value;
    if (!email || !email.includes('@')) {
        alert('Por favor, insira um e-mail válido!');
        return;
    }
    alert(`E-mail de recuperação enviado para: ${email}`);
}

// ============================
// NOTIFICAÇÃO
// ============================

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--success-color);
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================
// CHECKOUT
// ============================

function handleCheckout() {
    const carrinho = getCarrinho();
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }

    if (!isUserLogged()) {
        alert('Por favor, faça login antes de finalizar a compra');
        closeCartSidebar();
        openLoginModal();
        return;
    }

    const total = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    alert(`Compra realizada com sucesso!\nTotal: R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n\nObrigado pela compra!`);
    
    // Limpar carrinho
    saveCarrinho([]);
    updateCartUI();
    closeCartSidebar();
}

// ============================
// TOUCH/SWIPE PARA MOBILE
// ============================

let touchStartX = 0;
let touchEndX = 0;

function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
        nextSlide();
    } else if (touchEndX > touchStartX + 50) {
        prevSlide();
    }
}

// ============================
// EVENT LISTENERS
// ============================

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar
    initializeLocalStorage();
    renderCategories();
    updateCartUI();
    updateLoginUI();

    // Restaurar login se "lembrar" estava marcado
    const savedEmail = localStorage.getItem('savedEmail');
    const savedPassword = localStorage.getItem('savedPassword');
    if (savedEmail && savedPassword) {
        document.getElementById('email').value = savedEmail;
        document.getElementById('password').value = savedPassword;
        document.getElementById('rememberPassword').checked = true;
    }

    // Carousel
    // (Os carrosséis são controlados individualmente pelas funções prevSlide/nextSlide via onclick)

    // Cart
    document.getElementById('cartIcon').addEventListener('click', openCartSidebar);
    document.getElementById('closeCartBtn').addEventListener('click', closeCartSidebar);
    document.getElementById('overlay').addEventListener('click', closeCartSidebar);
    document.getElementById('checkoutBtn').addEventListener('click', handleCheckout);

    // Login
    document.getElementById('loginIcon').addEventListener('click', openLoginModal);
    document.getElementById('closeLoginBtn').addEventListener('click', closeLoginModal);
    document.getElementById('modalOverlay').addEventListener('click', closeLoginModal);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('forgotPasswordLink').addEventListener('click', (e) => {
        e.preventDefault();
        handleForgotPassword();
    });

    // Responsividade
    window.addEventListener('resize', () => {
        renderCategories();
    });
    });

/* CSS para animações */
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
