/* ============================
   INICIALIZAÇÃO E DADOS
   ============================ */

// Credenciais admin
const ADMIN_EMAIL = 'admin@joias.com';
const ADMIN_PASSWORD = 'admin123';

// Função para obter produtos do localStorage
function getProdutos() {
    return JSON.parse(localStorage.getItem('produtos')) || [];
}

// Função para obter pedidos do localStorage
function getPedidos() {
    return JSON.parse(localStorage.getItem('pedidos')) || [];
}

// Função para salvar pedidos no localStorage
function savePedidos(pedidos) {
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
}

// Função para salvar produtos no localStorage
function saveProdutos(produtos) {
    localStorage.setItem('produtos', JSON.stringify(produtos));
}

// Verificar se admin está logado
function isAdminLogged() {
    return sessionStorage.getItem('adminLogged') === 'true';
}

// ============================
// LOGIN DO ADMIN
// ============================

function handleAdminLogin(event) {
    event.preventDefault();

    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;

    // Validar credenciais
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
        alert('E-mail ou senha incorretos!');
        return;
    }

    // Salvar login em sessionStorage (mantém apenas durante a sessão)
    sessionStorage.setItem('adminLogged', 'true');
    sessionStorage.setItem('adminEmail', email);

    // Mostrar painel
    showAdminPanel();
}

function handleAdminLogout() {
    sessionStorage.removeItem('adminLogged');
    sessionStorage.removeItem('adminEmail');
    hideAdminPanel();
}

function showAdminPanel() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';

    const email = sessionStorage.getItem('adminEmail');
    const name = email.split('@')[0];
    document.getElementById('adminUserName').textContent = name.charAt(0).toUpperCase() + name.slice(1);

    renderProducts();
    renderPedidos();
}

function hideAdminPanel() {
    document.getElementById('loginContainer').style.display = 'flex';
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('adminEmail').value = '';
    document.getElementById('adminPassword').value = '';
}

// ============================
// GERENCIAMENTO DE PRODUTOS
// ============================

let editingProductId = null;

function renderProducts() {
    const produtos = getProdutos();
    const productsGrid = document.getElementById('productsGrid');

    if (produtos.length === 0) {
        productsGrid.innerHTML = '<div class="empty-message">Nenhum produto cadastrado. Adicione um novo produto!</div>';
        return;
    }

    productsGrid.innerHTML = produtos.map(produto => {
        const temDesconto = produto.desconto > 0;
        const precoComDesconto = temDesconto ? produto.preco * (1 - produto.desconto / 100) : produto.preco;
        const estoqueBaixo = produto.estoque < 5;

        return `
        <div class="product-item">
            <div class="product-image-container">
                <img src="${produto.imagem}" alt="${produto.nome}" onerror="this.src='https://placehold.co/200x200?text=${produto.nome}'">
                ${temDesconto ? `<div class="admin-badge">-${produto.desconto}%</div>` : ''}
            </div>
            <div class="product-details">
                <div class="product-category">${produto.categoria}</div>
                <div class="product-name">${produto.nome}</div>
                <div class="product-price">
                    ${temDesconto ? `<span style="text-decoration: line-through; color: #888; font-size: 0.9rem;">R$ ${produto.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span><br>` : ''}
                    R$ ${precoComDesconto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <div class="product-stock" style="color: ${estoqueBaixo ? 'var(--error-color)' : 'var(--success-color)'}; font-weight: 600;">
                    Estoque: ${produto.estoque} unid
                </div>
                <div class="product-description">${produto.descricao}</div>
            </div>
            <div class="product-actions">
                <button class="edit-btn" onclick="editProduct(${produto.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="delete-btn" onclick="deleteProduct(${produto.id})">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </div>
        </div>
    `}).join('');
}

// ============================
// DESCONTOS EM MASSA
// ============================

function applyBulkDiscount() {
    const target = document.getElementById('bulkDiscountTarget').value;
    const value = parseInt(document.getElementById('bulkDiscountValue').value);

    if (isNaN(value) || value < 0 || value > 100) {
        alert('Por favor, insira um valor de desconto válido entre 0 e 100.');
        return;
    }

    let produtos = getProdutos();
    let count = 0;

    produtos = produtos.map(p => {
        let apply = false;
        if (target === 'all') apply = true;
        else if (target === 'low-stock' && p.estoque < 5) apply = true;
        else if (p.categoria === target) apply = true;

        if (apply) {
            p.desconto = value;
            count++;
        }
        return p;
    });

    if (count > 0) {
        saveProdutos(produtos);
        renderProducts();
        showNotification(`Desconto de ${value}% aplicado a ${count} produtos!`, 'success');
        document.getElementById('bulkDiscountValue').value = '';
    } else {
        showNotification('Nenhum produto atende aos critérios selecionados.', 'info');
    }
}

// ============================
// GERENCIAMENTO DE PEDIDOS
// ============================

function renderPedidos() {
    const pedidos = getPedidos();
    const container = document.getElementById('pedidosContainer');

    if (!container) return;

    if (pedidos.length === 0) {
        container.innerHTML = '<div class="empty-message">Nenhum pedido realizado.</div>';
        return;
    }

    container.innerHTML = `
        <div class="orders-list">
            ${pedidos.sort((a, b) => new Date(b.data) - new Date(a.data)).map(pedido => `
                <div class="order-card" style="background: var(--light-bg); border: 1px solid var(--border-color); border-radius: 10px; padding: 1.5rem; margin-bottom: 1.5rem;">
                    <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; margin-bottom: 1rem;">
                        <div>
                            <strong style="color: var(--primary-color); font-size: 1.2rem;">Pedido #${pedido.id}</strong>
                            <div style="font-size: 0.9rem; color: #888;">Realizado em: ${new Date(pedido.data).toLocaleString('pt-BR')}</div>
                        </div>
                        <span class="order-status ${pedido.status}" style="padding: 0.5rem 1rem; border-radius: 20px; font-weight: 600; ${pedido.status === 'pending' ? 'background: rgba(255, 152, 0, 0.2); color: #ff9800;' : pedido.status === 'completed' ? 'background: rgba(76, 175, 80, 0.2); color: #4caf50;' : 'background: rgba(244, 67, 54, 0.2); color: #f44336;'}">
                            ${pedido.status === 'pending' ? 'Pendente' : pedido.status === 'completed' ? 'Concluído' : 'Cancelado'}
                        </span>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                        <div>
                            <h4 style="margin-bottom: 0.5rem; color: var(--primary-color);">Dados do Cliente</h4>
                            <p><strong>Nome:</strong> ${pedido.cliente.nome}</p>
                            <p><strong>E-mail:</strong> ${pedido.cliente.email}</p>
                            <p><strong>Telefone:</strong> ${pedido.cliente.telefone}</p>
                            
                            <h4 style="margin-top: 1rem; margin-bottom: 0.5rem; color: var(--primary-color);">Endereço de Entrega</h4>
                            <p>${pedido.endereco.rua}, ${pedido.endereco.numero} ${pedido.endereco.complemento ? `(${pedido.endereco.complemento})` : ''}</p>
                            <p>${pedido.endereco.bairro} - ${pedido.endereco.cidade}</p>
                            <p><strong>CEP:</strong> ${pedido.endereco.cep}</p>
                        </div>

                        <div>
                            <h4 style="margin-bottom: 0.5rem; color: var(--primary-color);">Produtos</h4>
                            <div style="display: flex; flex-direction: column; gap: 10px;">
                                ${pedido.itens.map(item => `
                                    <div style="display: flex; align-items: center; gap: 10px; background: var(--dark-bg); padding: 5px; border-radius: 5px;">
                                        <img src="${item.imagem}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
                                        <div style="flex: 1;">
                                            <div style="font-size: 0.9rem; font-weight: 600;">${item.nome}</div>
                                            <div style="font-size: 0.8rem; color: #888;">Qtd: ${item.quantidade} x R$ ${item.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                            <div style="margin-top: 1rem; padding-top: 0.5rem; border-top: 1px dashed #444; text-align: right;">
                                <div>Subtotal: R$ ${pedido.subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                                <div>Frete: R$ ${pedido.frete.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                                ${pedido.desconto > 0 ? `<div style="color: var(--error-color);">Desconto: -R$ ${pedido.desconto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>` : ''}
                                <div style="font-size: 1.2rem; font-weight: 700; color: var(--primary-color); margin-top: 5px;">Total: R$ ${pedido.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                            </div>
                        </div>
                    </div>

                    ${pedido.status === 'pending' ? `
                        <div style="margin-top: 1.5rem; display: flex; gap: 10px; justify-content: flex-end;">
                            <button onclick="updatePedidoStatus(${pedido.id}, 'completed')" class="btn-primary" style="width: auto; background: var(--success-color);">
                                <i class="fas fa-check"></i> Concluir Pedido
                            </button>
                            <button onclick="updatePedidoStatus(${pedido.id}, 'cancelled')" class="btn-danger" style="width: auto;">
                                <i class="fas fa-times"></i> Cancelar Pedido
                            </button>
                        </div>
                    ` : ''}
                </div>
            `).join('')}
        </div>
    `;
}

function updatePedidoStatus(pedidoId, status) {
    const pedidos = getPedidos();
    const index = pedidos.findIndex(p => p.id === pedidoId);

    if (index === -1) return;

    const statusText = {
        'completed': 'concluído',
        'cancelled': 'cancelado'
    };

    if (confirm(`Tem certeza que deseja marcar este pedido como ${statusText[status]}?`)) {
        pedidos[index].status = status;
        savePedidos(pedidos);
        renderPedidos();
        showNotification(`Pedido ${statusText[status]} com sucesso!`, 'success');
    }
}

function openProductForm() {
    document.getElementById('productFormSection').style.display = 'block';
    document.getElementById('formTitle').textContent = 'Adicionar Novo Produto';
    document.getElementById('productForm').reset();
    editingProductId = null;
    
    // Scroll até o formulário
    document.getElementById('productFormSection').scrollIntoView({ behavior: 'smooth' });
}

function closeProductForm() {
    document.getElementById('productFormSection').style.display = 'none';
    document.getElementById('productForm').reset();
    document.getElementById('imageStatus').textContent = '';
    editingProductId = null;
}

// Lidar com seleção de imagem local
function handleImageFileSelect(event) {
    const file = event.target.files[0];
    const status = document.getElementById('imageStatus');
    const inputUrl = document.getElementById('productImage');

    if (file) {
        if (file.size > 2 * 1024 * 1024) { // Limite de 2MB para localStorage
            alert('A imagem é muito grande! Por favor, escolha uma imagem com menos de 2MB.');
            event.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            inputUrl.value = e.target.result; // Salva o Base64 no campo de URL
            status.textContent = `Imagem carregada: ${file.name}`;
        };
        reader.readAsDataURL(file);
    }
}

function editProduct(produtoId) {
    const produtos = getProdutos();
    const produto = produtos.find(p => p.id === produtoId);

    if (!produto) return;

    // Preencher formulário
    document.getElementById('productName').value = produto.nome;
    document.getElementById('productCategory').value = produto.categoria;
    document.getElementById('productPrice').value = produto.preco;
    document.getElementById('productDiscount').value = produto.desconto || 0;
    document.getElementById('productStock').value = produto.estoque || 0;
    document.getElementById('productImage').value = produto.imagem;
    document.getElementById('productDescription').value = produto.descricao;

    // Mostrar formulário
    document.getElementById('productFormSection').style.display = 'block';
    document.getElementById('formTitle').textContent = 'Editar Produto';
    editingProductId = produtoId;

    // Scroll até o formulário
    document.getElementById('productFormSection').scrollIntoView({ behavior: 'smooth' });
}

function deleteProduct(produtoId) {
    const produtos = getProdutos();
    const produto = produtos.find(p => p.id === produtoId);

    if (!produto) return;

    // Mostrar modal de confirmação
    document.getElementById('confirmMessage').textContent = `Deseja realmente excluir "${produto.nome}"?`;
    document.getElementById('confirmOverlay').classList.add('active');
    document.getElementById('confirmModal').classList.add('active');

    // Salvar ID para exclusão
    document.getElementById('confirmDeleteBtn').onclick = () => {
        let todos = getProdutos();
        todos = todos.filter(p => p.id !== produtoId);
        saveProdutos(todos);
        renderProducts();
        closeConfirmModal();
        showNotification('Produto excluído com sucesso!', 'success');
    };
}

function closeConfirmModal() {
    document.getElementById('confirmOverlay').classList.remove('active');
    document.getElementById('confirmModal').classList.remove('active');
}

function handleProductFormSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('productName').value;
    const category = document.getElementById('productCategory').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const discount = parseInt(document.getElementById('productDiscount').value) || 0;
    const stock = parseInt(document.getElementById('productStock').value) || 0;
    const image = document.getElementById('productImage').value || 'https://placehold.co/200x200?text=Joia';
    const description = document.getElementById('productDescription').value;

    // Validações
    if (!name || !category || isNaN(price) || price <= 0 || !description) {
        alert('Por favor, preencha todos os campos corretamente!');
        return;
    }

    let produtos = getProdutos();

    if (editingProductId) {
        // Editar produto existente
        const index = produtos.findIndex(p => p.id === editingProductId);
        if (index !== -1) {
            produtos[index] = {
                ...produtos[index],
                nome: name,
                categoria: category,
                preco: price,
                desconto: discount,
                estoque: stock,
                imagem: image,
                descricao: description
            };
            showNotification('Produto atualizado com sucesso!', 'success');
        }
    } else {
        // Adicionar novo produto
        const newProduct = {
            id: Math.max(...produtos.map(p => p.id), 0) + 1,
            nome: name,
            categoria: category,
            preco: price,
            desconto: discount,
            estoque: stock,
            imagem: image,
            descricao: description,
            rating: 5,
            reviews: []
        };
        produtos.push(newProduct);
        showNotification('Produto adicionado com sucesso!', 'success');
    }

    saveProdutos(produtos);
    renderProducts();
    closeProductForm();
}

// ============================
// NOTIFICAÇÕES
// ============================

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    `;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        ${message}
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================
// EVENT LISTENERS
// ============================

document.addEventListener('DOMContentLoaded', () => {
    // Verificar se admin já está logado
    if (isAdminLogged()) {
        showAdminPanel();
    }

    // Login
    document.getElementById('adminLoginForm').addEventListener('submit', handleAdminLogin);

    // Buttons
    document.getElementById('addProductBtn').addEventListener('click', openProductForm);
    document.getElementById('cancelFormBtn').addEventListener('click', closeProductForm);
    document.getElementById('logoutAdminBtn').addEventListener('click', handleAdminLogout);
    document.getElementById('backToStoreBtn').addEventListener('click', () => {
        window.location.href = '../loja/index.html';
    });

    // Form
    document.getElementById('productForm').addEventListener('submit', handleProductFormSubmit);
    document.getElementById('productImageFile').addEventListener('change', handleImageFileSelect);

    // Modal
    document.getElementById('cancelDeleteBtn').addEventListener('click', closeConfirmModal);
    document.getElementById('confirmOverlay').addEventListener('click', closeConfirmModal);
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

    .notification {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .notification i {
        font-size: 1.2rem;
    }
`;
document.head.appendChild(style);
