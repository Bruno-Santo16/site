/* ============================
   INICIALIZAÇÃO E DADOS
   ============================ */

// Cupons válidos
const COUPONS = {
    'PRIMEIRO10': { type: 'percent', value: 10, description: '10% OFF primeira compra' },
    'JOIAS20': { type: 'percent', value: 20, description: '20% OFF' },
    'LUXO50': { type: 'fixed', value: 50, description: 'R$ 50 OFF' },
    'FRETEGRATIS': { type: 'shipping', value: 0, description: 'Frete grátis' }
};

// Inicializar dados no localStorage se vazio
function initializeLocalStorage() {
    let produtosExistentes = null;
    try {
        const data = localStorage.getItem('produtos');
        produtosExistentes = data ? JSON.parse(data) : null;
    } catch (e) {
        console.error("Erro ao ler produtos do localStorage, resetando...", e);
        localStorage.removeItem('produtos');
    }
    
    // Se não existem produtos, a lista está vazia ou os dados estão corrompidos, reinicializa
    if (!produtosExistentes || !Array.isArray(produtosExistentes) || produtosExistentes.length === 0) {
        const produtosExemplo = [
            { id: 1, nome: 'Anel Eternity Ouro 18k', categoria: 'Anéis', preco: 1890.00, desconto: 0, estoque: 8, descricao: 'Anel clássico em ouro 18k com acabamento polido. Uma peça eterna para momentos inesquecíveis.', imagem: 'https://placehold.co/400x400/d4af37/1a1a1a?text=Anel+Eternity', rating: 4.8, reviews: [] },
            { id: 2, nome: 'Brincos Solitários Diamante', categoria: 'Brincos', preco: 3200.00, desconto: 10, estoque: 4, descricao: 'Brincos sofisticados com diamantes de 0.25ct cada, lapidação brilhante e cravação em garras de ouro branco.', imagem: 'https://placehold.co/400x400/fff/d4af37?text=Brincos+Diamante', rating: 5, reviews: [] },
            { id: 3, nome: 'Colar de Pérolas Akoya', categoria: 'Colares', preco: 2150.00, desconto: 0, estoque: 6, descricao: 'Colar clássico com pérolas Akoya selecionadas e fecho em ouro amarelo 18k.', imagem: 'https://placehold.co/400x400/f0f0f0/d4af37?text=Colar+Perolas', rating: 4.9, reviews: [] },
            { id: 4, nome: 'Pulseira Riviera Zircônia', categoria: 'Pulseiras', preco: 850.00, desconto: 5, estoque: 12, descricao: 'Pulseira modelo Riviera cravejada com zircônias de alta qualidade, banhada a ouro 18k.', imagem: 'https://placehold.co/400x400/d4af37/fff?text=Pulseira+Riviera', rating: 4.7, reviews: [] },
            { id: 5, nome: 'Pingente Gota Safira Azul', categoria: 'Pingentes', preco: 1450.00, desconto: 0, estoque: 5, descricao: 'Pingente elegante em formato de gota com safira azul natural e detalhes em diamantes.', imagem: 'https://placehold.co/400x400/0047ab/fff?text=Pingente+Safira', rating: 4.8, reviews: [] },
            { id: 6, nome: 'Anel Signet Prata 925', categoria: 'Anéis', preco: 420.00, desconto: 0, estoque: 15, descricao: 'Anel estilo sinete em prata 925 com design minimalista e moderno.', imagem: 'https://placehold.co/400x400/c0c0c0/1a1a1a?text=Anel+Signet', rating: 4.5, reviews: [] },
            { id: 7, nome: 'Argolas Infinitas Ouro', categoria: 'Brincos', preco: 1100.00, desconto: 15, estoque: 10, descricao: 'Brincos de argola clássicos com textura diamantada, fabricados em ouro 18k.', imagem: 'https://placehold.co/400x400/d4af37/fff?text=Argolas+Ouro', rating: 4.6, reviews: [] },
            { id: 8, nome: 'Colar Coração Rubi', categoria: 'Colares', preco: 2750.00, desconto: 0, estoque: 3, descricao: 'Corrente veneziana com pingente de coração em rubi natural envolto por ouro rosa.', imagem: 'https://placehold.co/400x400/ffb6c1/d4af37?text=Colar+Rubi', rating: 5, reviews: [] },
            { id: 9, nome: 'Pulseira Bangle Slim', categoria: 'Pulseiras', preco: 1580.00, desconto: 0, estoque: 7, descricao: 'Pulseira rígida estilo bangle, articulada e com fecho de segurança invisível.', imagem: 'https://placehold.co/400x400/fff/d4af37?text=Pulseira+Bangle', rating: 4.6, reviews: [] },
            { id: 10, nome: 'Pingente Árvore da Vida', categoria: 'Pingentes', preco: 680.00, desconto: 10, estoque: 20, descricao: 'Pingente Árvore da Vida vazado em ouro 18k, símbolo de renovação e crescimento.', imagem: 'https://placehold.co/400x400/e8e8e8/d4af37?text=Pingente+Arvore', rating: 4.9, reviews: [] },
            { id: 11, nome: 'Anel Solitário Princess', categoria: 'Anéis', preco: 4500.00, desconto: 0, estoque: 2, descricao: 'Anel solitário com diamante lapidação Princess de 0.50ct, a escolha perfeita para noivados.', imagem: 'https://placehold.co/400x400/d4af37/fff?text=Anel+Princess', rating: 5, reviews: [] },
            { id: 12, nome: 'Brincos Cascade Esmeralda', categoria: 'Brincos', preco: 3800.00, desconto: 0, estoque: 4, descricao: 'Brincos pendentes cascade com esmeraldas colombianas e acabamento premium.', imagem: 'https://placehold.co/400x400/50c878/fff?text=Brincos+Esmeralda', rating: 4.8, reviews: [] }
        ];
        localStorage.setItem('produtos', JSON.stringify(produtosExemplo));
    } else {
        // Garantir que produtos existentes tenham todas as propriedades necessárias
        let mudou = false;
        const prods = produtosExistentes.map(p => {
            if (p.estoque === undefined) { p.estoque = 10; mudou = true; }
            if (p.desconto === undefined) { p.desconto = 0; mudou = true; }
            if (!p.reviews) { p.reviews = []; mudou = true; }
            if (p.rating === undefined) { p.rating = 5; mudou = true; }
            return p;
        });
        if (mudou) localStorage.setItem('produtos', JSON.stringify(prods));
    }

    if (!localStorage.getItem('carrinho')) {
        localStorage.setItem('carrinho', JSON.stringify([]));
    }

    if (!localStorage.getItem('wishlist')) {
        localStorage.setItem('wishlist', JSON.stringify([]));
    }

    if (!localStorage.getItem('pedidos')) {
        localStorage.setItem('pedidos', JSON.stringify([]));
    }

    if (!localStorage.getItem('cuponsUsados')) {
        localStorage.setItem('cuponsUsados', JSON.stringify([]));
    }
}

// Funções de localStorage
function getProdutos() {
    try {
        const produtos = localStorage.getItem('produtos');
        return produtos ? JSON.parse(produtos) : [];
    } catch (e) {
        console.error("Erro ao carregar produtos:", e);
        return [];
    }
}

function saveProdutos(produtos) {
    localStorage.setItem('produtos', JSON.stringify(produtos));
}

function getCarrinho() {
    try {
        const carrinho = localStorage.getItem('carrinho');
        return carrinho ? JSON.parse(carrinho) : [];
    } catch (e) {
        return [];
    }
}

function saveCarrinho(carrinho) {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

function getWishlist() {
    try {
        const wishlist = localStorage.getItem('wishlist');
        return wishlist ? JSON.parse(wishlist) : [];
    } catch (e) {
        return [];
    }
}

function saveWishlist(wishlist) {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

function getPedidos() {
    try {
        const pedidos = localStorage.getItem('pedidos');
        return pedidos ? JSON.parse(pedidos) : [];
    } catch (e) {
        return [];
    }
}

function savePedidos(pedidos) {
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
}

// ============================
// MÁSCARAS DE FORMULÁRIO
// ============================

function setupMasks() {
    // Máscara de telefone
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
            value = value.replace(/(\d)(\d{4})$/, '$1-$2');
            e.target.value = value.slice(0, 15);
        });
    }

    // Máscara de CEP
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/^(\d{5})(\d)/, '$1-$2');
            e.target.value = value.slice(0, 9);
        });
    }

    // Máscara de cartão de crédito
    const cardNumber = document.getElementById('cardNumber');
    if (cardNumber) {
        cardNumber.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{4})(\d)/g, '$1 $2');
            e.target.value = value.slice(0, 19);
        });
    }

    // Máscara de validade
    const cardExpiry = document.getElementById('cardExpiry');
    if (cardExpiry) {
        cardExpiry.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/^(\d{2})(\d)/, '$1/$2');
            e.target.value = value.slice(0, 5);
        });
    }
}

// Buscar endereço pelo CEP
function fetchAddress(cep) {
    cep = cep.replace(/\D/g, '');
    if (cep.length === 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (!data.erro) {
                    document.getElementById('street').value = data.logradouro;
                    document.getElementById('neighborhood').value = data.bairro;
                    document.getElementById('city').value = `${data.localidade} - ${data.uf}`;
                    document.getElementById('number').focus();
                    showToast('Endereço preenchido automaticamente!', 'success');
                } else {
                    showToast('CEP não encontrado!', 'error');
                }
            })
            .catch(() => showToast('Erro ao buscar CEP!', 'error'));
    }
}

// ============================
// RENDERIZAÇÃO DE PRODUTOS
// ============================

let filteredProdutos = null;

function renderCategories(produtos = null) {
    console.log("Chamando renderCategories...");
    const container = document.getElementById('categoryContainer');
    if (!container) {
        console.error("Container 'categoryContainer' não encontrado no HTML!");
        return;
    }

    // Lógica de fallback para os produtos
    let produtosToRender = produtos;
    if (produtosToRender === null) {
        produtosToRender = filteredProdutos !== null ? filteredProdutos : getProdutos();
    }

    console.log(`Produtos para renderizar: ${produtosToRender.length}`);

    if (produtosToRender.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: white;">
                <p style="font-size: 1.2rem; margin-bottom: 1rem;">Nenhum produto encontrado.</p>
                <button onclick="resetLojaTotal()" class="btn-secondary" style="background: var(--primary-color); color: var(--dark-bg);">
                    Resetar Banco de Dados
                </button>
            </div>
        `;
        return;
    }

    // Agrupar por categoria
    const categorias = [...new Set(produtosToRender.map(p => p.categoria || 'Geral'))];

    container.innerHTML = categorias.map(cat => {
        const produtosDaCat = produtosToRender.filter(p => (p.categoria || 'Geral') === cat);

        return `
            <div class="category-group">
                <h2 class="category-title">${cat}</h2>
                <div class="products-grid">
                    ${produtosDaCat.map(produto => {
                        const desconto = produto.desconto || 0;
                        const estoque = produto.estoque !== undefined ? produto.estoque : 10;
                        const precoComDesconto = desconto > 0 ? produto.preco * (1 - desconto / 100) : produto.preco;
                        const semEstoque = estoque <= 0;

                        return `
                        <div class="product-card ${semEstoque ? 'out-of-stock' : ''}">
                            ${desconto > 0 ? `<div class="product-badge">-${desconto}%</div>` : ''}
                            ${semEstoque ? `<div class="out-of-stock-badge">Esgotado</div>` : ''}
                            <div class="product-image" onclick="openProductModal(${produto.id})">
                                <img src="${produto.imagem}" alt="${produto.nome}" onerror="this.src='https://placehold.co/400x400?text=${encodeURIComponent(produto.nome)}'">
                                <div class="product-image-overlay">
                                    <button class="image-overlay-btn" onclick="event.stopPropagation(); openProductModal(${produto.id})">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="image-overlay-btn" onclick="event.stopPropagation(); toggleWishlist(${produto.id})">
                                        <i class="fas fa-heart"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="product-info">
                                <div class="product-category">${produto.categoria}</div>
                                <div class="product-name" onclick="openProductModal(${produto.id})">${produto.nome}</div>
                                <div class="product-rating">
                                    <span class="stars">${getStars(produto.rating || 5)}</span>
                                    <span class="rating-count">(${produto.reviews ? produto.reviews.length : 0})</span>
                                </div>
                                <div class="product-price">
                                    ${desconto > 0 ? `<span class="old-price">R$ ${produto.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>` : ''}
                                    R$ ${precoComDesconto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </div>
                                <div class="product-description">${produto.descricao}</div>
                                <div class="product-actions">
                                    <button class="add-to-cart-btn" onclick="addToCart(${produto.id})" ${semEstoque ? 'disabled' : ''}>
                                        <i class="fas fa-shopping-cart"></i> ${semEstoque ? 'Indisponível' : 'Adicionar'}
                                    </button>
                                    <button class="wishlist-btn ${isInWishlist(produto.id) ? 'active' : ''}" onclick="toggleWishlist(${produto.id})">
                                        <i class="fas fa-heart"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `}).join('')}
                </div>
            </div>
        `;
    }).join('');
}

function getStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    let stars = '';
    for (let i = 0; i < fullStars; i++) stars += '<i class="fas fa-star"></i>';
    if (hasHalf) stars += '<i class="fas fa-star-half-alt"></i>';
    for (let i = fullStars + (hasHalf ? 1 : 0); i < 5; i++) stars += '<i class="far fa-star"></i>';
    return stars;
}

// ============================
// BUSCA E FILTROS
// ============================

function handleSearch(event) {
    if (event.key === 'Enter') {
        applyFilters();
    }
}

function handleFilter() {
    applyFilters();
}

function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const priceFilter = document.getElementById('priceFilter').value;

    let produtos = getProdutos();

    // Filtrar por busca
    if (searchTerm) {
        produtos = produtos.filter(p =>
            p.nome.toLowerCase().includes(searchTerm) ||
            p.descricao.toLowerCase().includes(searchTerm)
        );
    }

    // Filtrar por categoria
    if (categoryFilter) {
        produtos = produtos.filter(p => p.categoria === categoryFilter);
    }

    // Filtrar por preço
    if (priceFilter) {
        const [min, max] = priceFilter.split('+')[0].split('-').map(Number);
        produtos = produtos.filter(p => {
            if (priceFilter.includes('+')) {
                return p.preco >= min;
            }
            return p.preco >= min && p.preco <= max;
        });
    }

    filteredProdutos = produtos;
    renderCategories(produtos);

    // Mostrar mensagem se nenhum resultado
    if (produtos.length === 0 && (searchTerm || categoryFilter || priceFilter)) {
        showToast('Nenhum produto encontrado com esses filtros', 'warning');
    }
}

// ============================
// CARRINHO
// ============================

let appliedCoupon = null;

function addToCart(produtoId, quantidade = 1) {
    const produtos = getProdutos();
    const produto = produtos.find(p => p.id === produtoId);

    if (!produto) return;

    if (produto.estoque <= 0) {
        showToast('Produto esgotado!', 'error');
        return;
    }

    let carrinho = getCarrinho();
    const itemExistente = carrinho.find(item => item.id === produtoId);

    if (itemExistente) {
        if (itemExistente.quantidade + quantidade > produto.estoque) {
            showToast('Quantidade máxima em estoque atingida!', 'warning');
            return;
        }
        itemExistente.quantidade += quantidade;
    } else {
        carrinho.push({
            ...produto,
            quantidade: quantidade
        });
    }

    saveCarrinho(carrinho);
    updateCartUI();
    updateWishlistCount();

    showToast(`${produto.nome} adicionado ao carrinho!`, 'success');
}

function removeFromCart(produtoId) {
    let carrinho = getCarrinho();
    carrinho = carrinho.filter(item => item.id !== produtoId);
    saveCarrinho(carrinho);
    updateCartUI();
    showToast('Item removido do carrinho', 'info');
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
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartTotal = document.getElementById('cartTotal');
    const cartDiscountRow = document.getElementById('cartDiscountRow');
    const cartDiscount = document.getElementById('cartDiscount');

    // Atualizar contador
    const totalItems = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';

    // Atualizar itens do carrinho
    if (carrinho.length === 0) {
        cartItems.innerHTML = `
            <p class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                Seu carrinho está vazio
            </p>
        `;
    } else {
        cartItems.innerHTML = carrinho.map(item => {
            const temDesconto = item.desconto > 0;
            const precoComDesconto = temDesconto ? item.preco * (1 - item.desconto / 100) : item.preco;

            return `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.imagem}" alt="${item.nome}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.nome}</div>
                    <div class="cart-item-price">
                        ${temDesconto ? `<span style="text-decoration: line-through; color: #888; font-size: 0.8rem; margin-right: 5px;">R$ ${item.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>` : ''}
                        R$ ${precoComDesconto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                    <div class="cart-item-controls">
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantidade - 1})">−</button>
                            <span class="quantity-display">${item.quantidade}</span>
                            <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantidade + 1})">+</button>
                        </div>
                        <button class="remove-item-btn" onclick="removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `}).join('');
    }

    // Calcular totais
    const subtotal = carrinho.reduce((sum, item) => {
        const temDesconto = item.desconto > 0;
        const precoComDesconto = temDesconto ? item.preco * (1 - item.desconto / 100) : item.preco;
        return sum + (precoComDesconto * item.quantidade);
    }, 0);
    
    let discount = 0;
    let shipping = subtotal > 500 ? 0 : 29.90;

    if (appliedCoupon) {
        if (appliedCoupon.type === 'percent') {
            discount = subtotal * (appliedCoupon.value / 100);
        } else if (appliedCoupon.type === 'fixed') {
            discount = appliedCoupon.value;
        } else if (appliedCoupon.type === 'shipping') {
            shipping = 0;
        }
    }

    const total = Math.max(0, subtotal - discount + shipping);

    // Atualizar displays
    if (cartSubtotal) {
        cartSubtotal.textContent = `R$ ${subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    }

    if (cartDiscountRow && appliedCoupon) {
        cartDiscountRow.style.display = 'flex';
        cartDiscount.textContent = `- R$ ${discount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    } else if (cartDiscountRow) {
        cartDiscountRow.style.display = 'none';
    }

    if (cartTotal) {
        cartTotal.textContent = `R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    }

    // Atualizar checkout
    updateCheckoutUI();
}

let checkoutShippingValue = null;

function calculateShipping() {
    const cep = document.getElementById('cep').value;
    if (cep.length < 8) {
        showToast('Por favor, insira um CEP válido!', 'warning');
        return;
    }

    const carrinho = getCarrinho();
    const subtotal = carrinho.reduce((sum, item) => {
        const temDesconto = item.desconto > 0;
        const precoComDesconto = temDesconto ? item.preco * (1 - item.desconto / 100) : item.preco;
        return sum + (precoComDesconto * item.quantidade);
    }, 0);

    if (subtotal > 500) {
        checkoutShippingValue = 0;
    } else {
        // Simulação: CEPs começando com 0 ou 1 são mais perto (SP/RJ)
        checkoutShippingValue = (cep.startsWith('0') || cep.startsWith('1')) ? 15.00 : 35.00;
    }

    showToast(`Frete calculado com sucesso!`, 'success');
    updateCheckoutUI();
}

function updateCheckoutUI() {
    const carrinho = getCarrinho();
    const checkoutItems = document.getElementById('checkoutOrderItems');

    if (!checkoutItems) return;

    if (carrinho.length === 0) {
        checkoutItems.innerHTML = '<p style="color: #888; text-align: center;">Carrinho vazio</p>';
        document.getElementById('checkoutSubtotal').textContent = 'R$ 0,00';
        document.getElementById('checkoutTotal').textContent = 'R$ 0,00';
        return;
    }

    const subtotal = carrinho.reduce((sum, item) => {
        const temDesconto = item.desconto > 0;
        const precoComDesconto = temDesconto ? item.preco * (1 - item.desconto / 100) : item.preco;
        return sum + (precoComDesconto * item.quantidade);
    }, 0);

    let discount = 0;
    let shipping = subtotal > 500 ? 0 : (checkoutShippingValue !== null ? checkoutShippingValue : 29.90);

    if (appliedCoupon) {
        if (appliedCoupon.type === 'percent') {
            discount = subtotal * (appliedCoupon.value / 100);
        } else if (appliedCoupon.type === 'fixed') {
            discount = appliedCoupon.value;
        } else if (appliedCoupon.type === 'shipping') {
            shipping = 0;
        }
    }

    const total = Math.max(0, subtotal - discount + shipping);

    checkoutItems.innerHTML = carrinho.map(item => {
        const temDesconto = item.desconto > 0;
        const precoComDesconto = temDesconto ? item.preco * (1 - item.desconto / 100) : item.preco;

        return `
        <div class="order-item">
            <div class="order-item-name">
                <div class="order-item-image">
                    <img src="${item.imagem}" alt="${item.nome}">
                </div>
                <div>
                    <div>${item.nome}</div>
                    <div class="order-item-qty">Qtd: ${item.quantidade}</div>
                </div>
            </div>
            <div>
                ${temDesconto ? `<div style="text-decoration: line-through; color: #888; font-size: 0.8rem; text-align: right;">R$ ${(item.preco * item.quantidade).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>` : ''}
                <div>R$ ${(precoComDesconto * item.quantidade).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            </div>
        </div>
    `}).join('');

    document.getElementById('checkoutSubtotal').textContent = `R$ ${subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    document.getElementById('checkoutShipping').textContent = shipping === 0 ? 'Grátis' : `R$ ${shipping.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

    const discountRow = document.getElementById('checkoutDiscountRow');
    if (appliedCoupon) {
        discountRow.style.display = 'flex';
        document.getElementById('checkoutDiscount').textContent = `- R$ ${discount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    } else {
        discountRow.style.display = 'none';
    }

    document.getElementById('checkoutTotal').textContent = `R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
}

async function placeOrder() {
    const carrinho = getCarrinho();

    if (carrinho.length === 0) {
        showToast('Seu carrinho está vazio!', 'error');
        return;
    }

    if (!isUserLogged()) {
        showToast('Faça login para finalizar o pedido', 'warning');
        openLoginModal();
        return;
    }

    // Validar campos
    const requiredFields = ['firstName', 'lastName', 'checkoutEmail', 'phone', 'cep', 'street', 'number', 'neighborhood', 'city'];
    let isValid = true;

    requiredFields.forEach(field => {
        const input = document.getElementById(field);
        if (input && !input.value.trim()) {
            input.style.borderColor = 'var(--error-color)';
            isValid = false;
        } else if (input) {
            input.style.borderColor = 'var(--border-color)';
        }
    });

    if (!isValid) {
        showToast('Preencha todos os campos obrigatórios!', 'error');
        return;
    }

    // Mostrar Loading
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) loadingOverlay.style.display = 'flex';

    // Calcular totais
    const subtotal = carrinho.reduce((sum, item) => {
        const temDesconto = item.desconto > 0;
        const precoComDesconto = temDesconto ? item.preco * (1 - item.desconto / 100) : item.preco;
        return sum + (precoComDesconto * item.quantidade);
    }, 0);
    
    let discount = 0;
    let shipping = subtotal > 500 ? 0 : (checkoutShippingValue !== null ? checkoutShippingValue : 29.90);

    if (appliedCoupon) {
        if (appliedCoupon.type === 'percent') {
            discount = subtotal * (appliedCoupon.value / 100);
        } else if (appliedCoupon.type === 'fixed') {
            discount = appliedCoupon.value;
        } else if (appliedCoupon.type === 'shipping') {
            shipping = 0;
        }
    }

    const total = Math.max(0, subtotal - discount + shipping);

    const external_reference = Date.now();
    const orderData = {
        external_reference: external_reference,
        items: carrinho.map(item => ({
            id: item.id,
            nome: item.nome,
            quantidade: item.quantidade,
            preco: item.desconto > 0 ? item.preco * (1 - item.desconto / 100) : item.preco,
            imagem: item.imagem
        })),
        customer: {
            nome: document.getElementById('firstName').value + ' ' + document.getElementById('lastName').value,
            email: document.getElementById('checkoutEmail').value,
            phone: document.getElementById('phone').value
        },
        address: {
            cep: document.getElementById('cep').value,
            street: document.getElementById('street').value,
            number: document.getElementById('number').value,
            complement: document.getElementById('complement').value,
            neighborhood: document.getElementById('neighborhood').value,
            city: document.getElementById('city').value
        },
        totals: {
            subtotal,
            discount,
            shipping,
            total
        },
        paymentMethod: 'infinitepay'
    };

    try {
        // Salva o pedido pendente para recuperar na volta
        localStorage.setItem('pendingOrder', JSON.stringify(orderData));

        const response = await fetch('http://127.0.0.1:3000/create_preference', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                items: orderData.items,
                customer: orderData.customer,
                address: orderData.address,
                totals: orderData.totals,
                paymentMethod: orderData.paymentMethod,
                external_reference: external_reference
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.details || 'Erro desconhecido na API');
        }

        const preference = await response.json();
        
        // Redireciona para o checkout da InfinitePay
        window.location.href = preference.init_point;

    } catch (error) {
        console.error('Erro ao processar pedido:', error);
        showToast('Erro ao conectar com o serviço de pagamentos. Verifique se a API está rodando.', 'error');
        if (loadingOverlay) loadingOverlay.style.display = 'none';
    }
}

// Função para finalizar o pedido após retorno da InfinitePay
function finalizeOrderAfterPayment(status) {
    const pendingOrder = JSON.parse(localStorage.getItem('pendingOrder'));
    if (!pendingOrder) return;

    if (status === 'success' || status === 'pending') {
        const pedido = {
            id: pendingOrder.external_reference || Date.now(),
            data: new Date().toISOString(),
            cliente: pendingOrder.customer,
            endereco: pendingOrder.address,
            pagamento: pendingOrder.paymentMethod,
            itens: pendingOrder.items,
            subtotal: pendingOrder.totals.subtotal,
            desconto: pendingOrder.totals.discount,
            frete: pendingOrder.totals.shipping,
            total: pendingOrder.totals.total,
            status: status === 'success' ? 'completed' : 'pending',
            cupom: appliedCoupon ? appliedCoupon.code : null
        };

        // Salvar pedido
        const pedidos = getPedidos();
        pedidos.push(pedido);
        savePedidos(pedidos);

        // Diminuir estoque
        const todosProdutos = getProdutos();
        pendingOrder.items.forEach(item => {
            const prodIndex = todosProdutos.findIndex(p => p.id === item.id);
            if (prodIndex !== -1) {
                todosProdutos[prodIndex].estoque -= item.quantidade;
            }
        });
        saveProdutos(todosProdutos);

        // Limpar dados temporários
        saveCarrinho([]);
        localStorage.removeItem('pendingOrder');
        
        showOrderConfirmation(pedido);
    } else {
        showToast('O pagamento não foi concluído. Tente novamente.', 'warning');
        localStorage.removeItem('pendingOrder');
    }
}

function showOrderConfirmation(pedido) {
    const statusText = {
        'credit': 'pagamento por cartão de crédito',
        'pix': 'pagamento via PIX',
        'boleto': 'pagamento por boleto'
    };

    alert(`🎉 Pedido realizado com sucesso!

Número do pedido: #${pedido.id}
Total: R$ ${pedido.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
Forma de pagamento: ${statusText[pedido.pagamento]}

Obrigado pela sua compra!`);

    // Voltar para home
    showHome();
}

// ============================
// WISHLIST
// ============================

function toggleWishlist(produtoId) {
    let wishlist = getWishlist();
    const index = wishlist.findIndex(p => p.id === produtoId);

    if (index > -1) {
        wishlist.splice(index, 1);
        showToast('Removido da lista de desejos', 'info');
    } else {
        const produtos = getProdutos();
        const produto = produtos.find(p => p.id === produtoId);
        if (produto) {
            wishlist.push(produto);
            showToast('Adicionado à lista de desejos!', 'success');
        }
    }

    saveWishlist(wishlist);
    updateWishlistCount();
    renderCategories(); // Agora renderCategories já lida com o fallback internamente
}

function isInWishlist(produtoId) {
    const wishlist = getWishlist();
    return wishlist.some(p => p.id === produtoId);
}

function updateWishlistCount() {
    const wishlist = getWishlist();
    const count = wishlist.length;
    const wishlistCount = document.getElementById('wishlistCount');
    const wishlistIcon = document.getElementById('wishlistIcon');

    if (wishlistCount) {
        wishlistCount.textContent = count;
        wishlistCount.style.display = count > 0 ? 'flex' : 'none';
    }

    if (wishlistIcon) {
        wishlistIcon.style.display = isUserLogged() ? 'block' : 'none';
    }
}

function renderWishlist() {
    const wishlist = getWishlist();
    const container = document.getElementById('wishlistContainer');
    const noItemsMsg = document.getElementById('noWishlistMessage');

    if (!container) return;

    if (wishlist.length === 0) {
        container.innerHTML = '';
        if (noItemsMsg) noItemsMsg.style.display = 'block';
        return;
    }

    if (noItemsMsg) noItemsMsg.style.display = 'none';

    container.innerHTML = wishlist.map(produto => `
        <div class="wishlist-item">
            <div class="wishlist-item-image" onclick="openProductModal(${produto.id})">
                <img src="${produto.imagem}" alt="${produto.nome}">
            </div>
            <div class="wishlist-item-info">
                <div class="wishlist-item-name">${produto.nome}</div>
                <div class="wishlist-item-price">R$ ${produto.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                <div class="wishlist-actions">
                    <button class="move-to-cart-btn" onclick="addToCart(${produto.id}); toggleWishlist(${produto.id});">
                        <i class="fas fa-shopping-cart"></i> Mover
                    </button>
                    <button class="remove-wishlist-btn" onclick="toggleWishlist(${produto.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// ============================
// PEDIDOS / HISTÓRICO
// ============================

function renderOrders() {
    const pedidos = getPedidos();
    const tbody = document.getElementById('ordersTableBody');
    const noOrdersMsg = document.getElementById('noOrdersMessage');

    if (!tbody) return;

    if (pedidos.length === 0) {
        if (noOrdersMsg) noOrdersMsg.style.display = 'block';
        tbody.innerHTML = '';
        return;
    }

    if (noOrdersMsg) noOrdersMsg.style.display = 'none';

    tbody.innerHTML = pedidos.sort((a, b) => new Date(b.data) - new Date(a.data)).map(pedido => `
        <tr>
            <td>#${pedido.id}</td>
            <td>${new Date(pedido.data).toLocaleDateString('pt-BR')}</td>
            <td>R$ ${pedido.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
            <td>
                <span class="order-status ${pedido.status}">
                    ${pedido.status === 'pending' ? 'Pendente' : pedido.status === 'completed' ? 'Concluído' : 'Cancelado'}
                </span>
            </td>
            <td>
                <button class="view-order-btn" onclick="viewOrderDetail(${pedido.id})">
                    <i class="fas fa-eye"></i> Ver
                </button>
            </td>
        </tr>
    `).join('');
}

function viewOrderDetail(pedidoId) {
    const pedidos = getPedidos();
    const pedido = pedidos.find(p => p.id === pedidoId);

    if (!pedido) return;

    const statusText = {
        'pending': 'Pendente',
        'completed': 'Concluído',
        'cancelled': 'Cancelado'
    };

    const content = document.getElementById('orderDetailContent');
    content.innerHTML = `
        <div class="order-detail-header">
            <h3>Pedido #${pedido.id}</h3>
            <span class="order-status ${pedido.status}">${statusText[pedido.status]}</span>
        </div>

        <div class="order-detail-grid">
            <div class="order-detail-section">
                <h4><i class="fas fa-user"></i> Cliente</h4>
                <p>${pedido.cliente.nome}</p>
                <p>${pedido.cliente.email}</p>
                <p>${pedido.cliente.telefone}</p>
            </div>
            <div class="order-detail-section">
                <h4><i class="fas fa-map-marker-alt"></i> Entrega</h4>
                <p>${pedido.endereco.rua}, ${pedido.endereco.numero}</p>
                <p>${pedido.endereco.complemento || ''}</p>
                <p>${pedido.endereco.bairro}</p>
                <p>${pedido.endereco.cidade}</p>
                <p>CEP: ${pedido.endereco.cep}</p>
            </div>
        </div>

        <div class="order-items-list">
            <h4><i class="fas fa-box"></i> Itens do Pedido</h4>
            ${pedido.itens.map(item => `
                <div class="order-item-row">
                    <span>${item.quantidade}x ${item.nome}</span>
                    <span>R$ ${(item.preco * item.quantidade).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
            `).join('')}
        </div>

        <div class="order-total-row">
            <span>Total</span>
            <span>R$ ${pedido.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </div>
    `;

    document.getElementById('orderDetailModal').classList.add('active');
    document.getElementById('modalOverlay').classList.add('active');
}

// ============================
// PRODUTO MODAL
// ============================

function openProductModal(produtoId) {
    const produtos = getProdutos();
    const produto = produtos.find(p => p.id === produtoId);

    if (!produto) return;

    const content = document.getElementById('productModalContent');
    const avgRating = produto.reviews && produto.reviews.length > 0
        ? produto.reviews.reduce((sum, r) => sum + r.rating, 0) / produto.reviews.length
        : produto.rating || 0;

    const temDesconto = produto.desconto > 0;
    const precoComDesconto = temDesconto ? produto.preco * (1 - produto.desconto / 100) : produto.preco;
    const semEstoque = produto.estoque <= 0;

    content.innerHTML = `
        <div class="product-modal-image">
            <img src="${produto.imagem}" alt="${produto.nome}" id="modalProductImage">
            <div class="product-modal-zoom" onclick="openImageZoom('${produto.imagem}')">
                <i class="fas fa-search-plus"></i>
            </div>
            ${temDesconto ? `<div class="product-modal-badge">-${produto.desconto}%</div>` : ''}
        </div>

        <div class="product-modal-info">
            <div class="product-modal-category">${produto.categoria}</div>
            <h2>${produto.nome}</h2>
            <div class="product-modal-rating">
                <span class="stars">${getStars(avgRating)}</span>
                <span class="rating-count">${produto.reviews ? produto.reviews.length : 0} avaliações</span>
            </div>
            <div class="product-modal-price">
                ${temDesconto ? `<span class="old-price">R$ ${produto.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>` : ''}
                R$ ${precoComDesconto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div class="product-modal-description">${produto.descricao}</div>

            <div class="product-modal-quantity">
                <label>Quantidade:</label>
                <div class="quantity-selector">
                    <button type="button" onclick="decreaseModalQty()" ${semEstoque ? 'disabled' : ''}>−</button>
                    <input type="number" id="modalQuantity" value="1" min="1" max="${produto.estoque}" ${semEstoque ? 'disabled' : ''}>
                    <button type="button" onclick="increaseModalQty()" ${semEstoque ? 'disabled' : ''}>+</button>
                </div>
            </div>

            <div class="product-modal-actions">
                <button class="modal-add-to-cart" onclick="addToCartFromModal(${produto.id})" ${semEstoque ? 'disabled' : ''}>
                    <i class="fas fa-shopping-cart"></i> ${semEstoque ? 'Indisponível' : 'Adicionar ao Carrinho'}
                </button>
                <button class="modal-add-wishlist" onclick="toggleWishlist(${produto.id})">
                    <i class="fas fa-heart"></i>
                </button>
            </div>

            <div class="product-modal-reviews">
                <h3>Avaliações dos Clientes</h3>
                <div class="review-summary">
                    <div class="review-average">
                        <div class="number">${avgRating.toFixed(1)}</div>
                        <div class="stars">${getStars(avgRating)}</div>
                    </div>
                    <div class="review-bars">
                        ${[5,4,3,2,1].map(star => {
                            const count = produto.reviews ? produto.reviews.filter(r => r.rating === star).length : 0;
                            const total = produto.reviews ? produto.reviews.length : 1;
                            const percent = (count / total) * 100;
                            return `
                                <div class="review-bar">
                                    <span>${star} <i class="fas fa-star"></i></span>
                                    <div class="bar"><div class="bar-fill" style="width: ${percent}%"></div></div>
                                    <span>${count}</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <div class="reviews-list" id="reviewsList">
                    ${produto.reviews && produto.reviews.length > 0 ? produto.reviews.map(review => `
                        <div class="review-item">
                            <div class="review-header">
                                <span class="reviewer-name">${review.nome}</span>
                                <span class="review-date">${new Date(review.data).toLocaleDateString('pt-BR')}</span>
                            </div>
                            <div class="review-stars">${getStars(review.rating)}</div>
                            <p class="review-text">${review.texto}</p>
                        </div>
                    `).join('') : '<p style="color: #888;">Nenhuma avaliação ainda. Seja o primeiro a avaliar!</p>'}
                </div>

                ${isUserLogged() ? `
                    <button class="write-review-btn" onclick="showWriteReviewForm()">
                        <i class="fas fa-pen"></i> Escrever Avaliação
                    </button>
                    <div class="write-review-form" id="writeReviewForm" style="display: none;">
                        <h4>Avalie este produto</h4>
                        <div class="star-rating-input">
                            <input type="radio" name="star" id="star5" value="5"><label for="star5">★</label>
                            <input type="radio" name="star" id="star4" value="4"><label for="star4">★</label>
                            <input type="radio" name="star" id="star3" value="3"><label for="star3">★</label>
                            <input type="radio" name="star" id="star2" value="2"><label for="star2">★</label>
                            <input type="radio" name="star" id="star1" value="1"><label for="star1">★</label>
                        </div>
                        <textarea id="reviewText" placeholder="Escreva sua avaliação..." rows="3"></textarea>
                        <div class="form-submit-row">
                            <button class="btn-submit-review" onclick="submitReview(${produto.id})">Enviar Avaliação</button>
                            <button class="btn-cancel-review" onclick="hideWriteReviewForm()">Cancelar</button>
                        </div>
                    </div>
                ` : '<p style="color: #888; font-size: 0.9rem;">Faça login para escrever uma avaliação.</p>'}
            </div>
        </div>
    `;

    document.getElementById('productModal').classList.add('active');
    document.getElementById('modalOverlay').classList.add('active');
}

let currentModalProductId = null;

function decreaseModalQty() {
    const input = document.getElementById('modalQuantity');
    if (input && input.value > 1) input.value = parseInt(input.value) - 1;
}

function increaseModalQty() {
    const input = document.getElementById('modalQuantity');
    if (input) input.value = parseInt(input.value) + 1;
}

function addToCartFromModal(produtoId) {
    const quantidade = parseInt(document.getElementById('modalQuantity').value) || 1;
    addToCart(produtoId, quantidade);
    closeProductModal();
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
    document.getElementById('modalOverlay').classList.remove('active');
}

// ============================
// AVALIAÇÕES
// ============================

function showWriteReviewForm() {
    document.getElementById('writeReviewForm').style.display = 'block';
}

function hideWriteReviewForm() {
    document.getElementById('writeReviewForm').style.display = 'none';
}

function submitReview(produtoId) {
    const ratingInput = document.querySelector('input[name="star"]:checked');
    const textInput = document.getElementById('reviewText');

    if (!ratingInput) {
        showToast('Selecione uma quantidade de estrelas!', 'warning');
        return;
    }

    if (!textInput.value.trim()) {
        showToast('Escreva sua avaliação!', 'warning');
        return;
    }

    const rating = parseInt(ratingInput.value);
    const texto = textInput.value.trim();
    const userEmail = localStorage.getItem('userEmail') || 'Anônimo';
    const userName = userEmail.split('@')[0];

    // Atualizar produto
    const produtos = getProdutos();
    const produtoIndex = produtos.findIndex(p => p.id === produtoId);

    if (produtoIndex === -1) return;

    const produto = produtos[produtoIndex];

    if (!produto.reviews) {
        produto.reviews = [];
    }

    produto.reviews.push({
        nome: userName,
        email: userEmail,
        rating: rating,
        texto: texto,
        data: new Date().toISOString()
    });

    // Recalcular rating médio
    const totalRating = produto.reviews.reduce((sum, r) => sum + r.rating, 0);
    produto.rating = totalRating / produto.reviews.length;

    produtos[produtoIndex] = produto;
    saveProdutos(produtos);

    showToast('Avaliação enviada com sucesso!', 'success');
    hideWriteReviewForm();
    openProductModal(produtoId);
}

// ============================
// IMAGE ZOOM
// ============================

function openImageZoom(imageSrc) {
    document.getElementById('zoomedImage').src = imageSrc;
    document.getElementById('imageZoomModal').classList.add('active');
}

function closeImageZoom() {
    document.getElementById('imageZoomModal').classList.remove('active');
}

// ============================
// PERFIL DO USUÁRIO
// ============================

function showProfile(section = 'orders') {
    if (!isUserLogged()) {
        openLoginModal();
        return;
    }

    // Esconder outras páginas
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('checkoutPage').style.display = 'none';
    document.getElementById('profilePage').style.display = 'block';

    // Esconder todas as seções
    document.querySelectorAll('.profile-section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.profile-menu button').forEach(btn => btn.classList.remove('active'));

    // Mostrar seção selecionada
    document.getElementById(`profile${section.charAt(0).toUpperCase() + section.slice(1)}`).classList.add('active');

    // Atualizar menu
    const menuIndex = ['orders', 'wishlist', 'account'].indexOf(section);
    if (menuIndex >= 0) {
        document.querySelectorAll('.profile-menu button')[menuIndex].classList.add('active');
    }

    // Carregar dados
    const email = localStorage.getItem('userEmail') || '';
    const name = email.split('@')[0];

    document.getElementById('profileName').textContent = name;
    document.getElementById('profileEmail').textContent = email;

    // Preencher dados da conta
    document.getElementById('accountName').value = name;
    document.getElementById('accountEmail').value = email;
    document.getElementById('accountRegisterDate').value = new Date().toLocaleDateString('pt-BR');
    const pedidos = getPedidos();
    document.getElementById('accountTotalOrders').value = pedidos.length;

    // Renderizar conteúdo
    if (section === 'orders') renderOrders();
    if (section === 'wishlist') renderWishlist();

    // Fechar dropdown
    document.getElementById('profileDropdown').style.display = 'none';
}

// ============================
// NAVEGAÇÃO ENTRE PÁGINAS
// ============================

function showHome() {
    document.getElementById('homePage').style.display = 'block';
    document.getElementById('checkoutPage').style.display = 'none';
    document.getElementById('profilePage').style.display = 'none';
    window.location.hash = '';
}

function showCheckout() {
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('profilePage').style.display = 'none';
    document.getElementById('checkoutPage').style.display = 'block';
    updateCheckoutUI();
}

// ============================
// LOGIN
// ============================

function isUserLogged() {
    return localStorage.getItem('userLogged') === 'true';
}

function updateLoginUI() {
    const loginIcon = document.getElementById('loginIcon');
    const userLogged = document.getElementById('userLogged');
    const userName = document.getElementById('userName');
    const wishlistIcon = document.getElementById('wishlistIcon');

    if (isUserLogged()) {
        const email = localStorage.getItem('userEmail') || '';
        const name = email.split('@')[0];
        loginIcon.style.display = 'none';
        userLogged.style.display = 'flex';
        userName.textContent = name.charAt(0).toUpperCase() + name.slice(1);
        if (wishlistIcon) wishlistIcon.style.display = 'block';
    } else {
        loginIcon.style.display = 'block';
        userLogged.style.display = 'none';
        if (wishlistIcon) wishlistIcon.style.display = 'none';
    }

    updateWishlistCount();
}

function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberPassword = document.getElementById('rememberPassword').checked;

    if (!email.includes('@')) {
        showToast('E-mail inválido!', 'error');
        return;
    }

    if (password.length < 4) {
        showToast('Senha deve ter pelo menos 4 caracteres!', 'error');
        return;
    }

    localStorage.setItem('userLogged', 'true');
    localStorage.setItem('userEmail', email);

    if (rememberPassword) {
        localStorage.setItem('savedEmail', email);
        localStorage.setItem('savedPassword', password);
    }

    updateLoginUI();
    closeLoginModal();
    showToast(`Bem-vindo, ${email.split('@')[0]}!`, 'success');
}

function handleLogout() {
    localStorage.removeItem('userLogged');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('savedEmail');
    localStorage.removeItem('savedPassword');

    updateLoginUI();
    closeCartSidebar();
    document.getElementById('profileDropdown').style.display = 'none';
    showHome();
    showToast('Você saiu de sua conta', 'info');
}

// ============================
// MODAIS E EVENTOS
// ============================

function openCartSidebar() {
    document.getElementById('cartSidebar').classList.add('open');
    document.getElementById('overlay').classList.add('active');
}

function closeCartSidebar() {
    document.getElementById('cartSidebar').classList.remove('open');
    document.getElementById('overlay').classList.remove('active');
}

function openLoginModal() {
    window.location.href = '../login/index.html';
}

function closeLoginModal() {
    document.getElementById('loginModal').classList.remove('active');
    document.getElementById('modalOverlay').classList.remove('active');
}

// Toast notifications
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        warning: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${icons[type]}"></i> ${message}`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('toast-hide');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Profile dropdown
function toggleProfileDropdown() {
    const dropdown = document.getElementById('profileDropdown');
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
}

// ============================
// EVENT LISTENERS
// ============================

document.addEventListener('DOMContentLoaded', () => {
    console.log("Iniciando carregamento da loja...");

    // Verificar retorno do Checkout (AbacatePay ou InfinitePay)
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('status');
    const transactionNsu = urlParams.get('transaction_nsu');
    const orderNsu = urlParams.get('order_nsu');

    if (paymentStatus || (transactionNsu && orderNsu)) {
        // Se houver transactionNsu, consideramos como sucesso do InfinitePay
        const status = paymentStatus || (transactionNsu ? 'success' : null);
        if (status) {
            finalizeOrderAfterPayment(status);
        }
    }

    // Inicializar
    try {
        initializeLocalStorage();
        console.log("LocalStorage inicializado.");
        renderCategories();
        console.log("Categorias renderizadas.");
        updateCartUI();
        updateLoginUI();
        setupMasks();
    } catch (e) {
        console.error("Erro durante a inicialização:", e);
    }

    // Restaurar login
    const savedEmail = localStorage.getItem('savedEmail');
    const savedPassword = localStorage.getItem('savedPassword');
    if (savedEmail && savedPassword) {
        const emailInput = document.getElementById('email');
        const passInput = document.getElementById('password');
        const rememberInput = document.getElementById('rememberPassword');
        if (emailInput) emailInput.value = savedEmail;
        if (passInput) passInput.value = savedPassword;
        if (rememberInput) rememberInput.checked = true;
    }

    // Cart
    document.getElementById('cartIcon')?.addEventListener('click', openCartSidebar);
    document.getElementById('closeCartBtn')?.addEventListener('click', closeCartSidebar);
    document.getElementById('overlay')?.addEventListener('click', closeCartSidebar);
    document.getElementById('checkoutBtn')?.addEventListener('click', showCheckout);

    // Login
    document.getElementById('loginIcon')?.addEventListener('click', openLoginModal);
    document.getElementById('closeLoginBtn')?.addEventListener('click', closeLoginModal);
    document.getElementById('modalOverlay')?.addEventListener('click', () => {
        closeLoginModal();
        closeProductModal();
        closeCartSidebar();
        const orderModal = document.getElementById('orderDetailModal');
        if (orderModal) orderModal.classList.remove('active');
    });
    document.getElementById('logoutBtn')?.addEventListener('click', handleLogout);
    document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
    document.getElementById('forgotPasswordLink')?.addEventListener('click', (e) => {
        e.preventDefault();
        const email = document.getElementById('email')?.value;
        if (email && email.includes('@')) {
            showToast(`E-mail de recuperação enviado para: ${email}`, 'success');
        } else {
            showToast('Digite seu e-mail acima!', 'warning');
        }
    });

    // Product modal
    document.getElementById('closeProductModalBtn')?.addEventListener('click', closeProductModal);

    // Order detail modal
    document.getElementById('closeOrderDetailBtn')?.addEventListener('click', () => {
        const orderModal = document.getElementById('orderDetailModal');
        if (orderModal) {
            orderModal.classList.remove('active');
            document.getElementById('modalOverlay')?.classList.remove('active');
        }
    });

    // Profile dropdown
    document.getElementById('profileIcon')?.addEventListener('click', toggleProfileDropdown);

    // Wishlist icon
    document.getElementById('wishlistIcon')?.addEventListener('click', () => {
        if (isUserLogged()) {
            showProfile('wishlist');
        } else {
            openLoginModal();
        }
    });

    // Click outside dropdown
    document.addEventListener('click', (e) => {
        const dropdown = document.getElementById('profileDropdown');
        const profileIcon = document.getElementById('profileIcon');
        if (dropdown && !dropdown.contains(e.target) && !profileIcon.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });

    // Scroll navbar effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(26, 26, 26, 0.98)';
        } else {
            navbar.style.background = 'rgba(26, 26, 26, 0.9)';
        }
    });

    // Verificação de emergência: tenta renderizar várias vezes no início para garantir sincronia
    let attempts = 0;
    const rescueInterval = setInterval(() => {
        attempts++;
        const container = document.getElementById('categoryContainer');
        const hasProducts = container && container.querySelectorAll('.product-card').length > 0;
        
        if (!hasProducts) {
            console.log(`Tentativa de resgate ${attempts}...`);
            initializeLocalStorage();
            renderCategories();
        } else {
            clearInterval(rescueInterval);
            console.log("Produtos carregados com sucesso.");
        }

        if (attempts >= 5) clearInterval(rescueInterval);
    }, 800);
});

// Função para resetar tudo se necessário (pode ser chamada pelo console)
function resetLojaTotal() {
    localStorage.clear();
    location.reload();
}
