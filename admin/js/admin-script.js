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

    productsGrid.innerHTML = produtos.map(produto => `
        <div class="product-item">
            <div class="product-image-container">
                <img src="${produto.imagem}" alt="${produto.nome}" onerror="this.src='https://placehold.co/200x200?text=${produto.nome}'">
            </div>
            <div class="product-details">
                <div class="product-category">${produto.categoria}</div>
                <div class="product-name">${produto.nome}</div>
                <div class="product-price">R$ ${produto.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
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
    `).join('');
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
    const image = document.getElementById('productImage').value || 'https://placehold.co/200x200?text=Joia';
    const description = document.getElementById('productDescription').value;

    // Validações
    if (!name || !category || !price || price <= 0 || !description) {
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
            imagem: image,
            descricao: description
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
