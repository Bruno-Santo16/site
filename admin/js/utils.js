/* ============================
   UTILITÁRIOS PARA ADMIN
   ============================ */

// Exportar dados do localStorage
function exportData() {
    const data = {
        produtos: JSON.parse(localStorage.getItem('produtos') || '[]'),
        pedidos: JSON.parse(localStorage.getItem('pedidos') || '[]'),
        cuponsUsados: JSON.parse(localStorage.getItem('cuponsUsados') || '[]'),
        exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-joias-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    alert('Dados exportados com sucesso!');
}

// Importar dados do localStorage
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);

            if (data.produtos) {
                localStorage.setItem('produtos', JSON.stringify(data.produtos));
            }
            if (data.pedidos) {
                localStorage.setItem('pedidos', JSON.stringify(data.pedidos));
            }

            alert('Dados importados com sucesso! A página será recarregada.');
            location.reload();
        } catch (err) {
            alert('Erro ao importar dados. Verifique o arquivo.');
            console.error(err);
        }
    };
    reader.readAsText(file);
}

// Limpar todos os dados
function clearAllData() {
    if (confirm('TEM CERTEZA? Isso apagará TODOS os dados (produtos, pedidos, etc.). Esta ação não pode ser desfeita!')) {
        if (confirm('Tem certeza absoluta? Clique em OK para confirmar.')) {
            localStorage.clear();
            alert('Todos os dados foram apagados. A página será recarregada.');
            location.reload();
        }
    }
}

// Estatísticas do dashboard
function getDashboardStats() {
    const produtos = JSON.parse(localStorage.getItem('produtos') || '[]');
    const pedidos = JSON.parse(localStorage.getItem('pedidos') || '[]');

    const totalProdutos = produtos.length;
    const totalPedidos = pedidos.length;
    const totalVendas = pedidos.reduce((sum, p) => sum + p.total, 0);
    const pedidosPendentes = pedidos.filter(p => p.status === 'pending').length;

    // Produto mais vendido
    const vendasPorProduto = {};
    pedidos.forEach(p => {
        p.itens.forEach(item => {
            vendasPorProduto[item.nome] = (vendasPorProduto[item.nome] || 0) + item.quantidade;
        });
    });

    let produtoMaisVendido = null;
    let maxVendas = 0;
    for (const [nome, qtd] of Object.entries(vendasPorProduto)) {
        if (qtd > maxVendas) {
            maxVendas = qtd;
            produtoMaisVendido = nome;
        }
    }

    return {
        totalProdutos,
        totalPedidos,
        totalVendas,
        pedidosPendentes,
        produtoMaisVendido,
        maxVendas
    };
}

// Renderizar dashboard
function renderDashboard() {
    const stats = getDashboardStats();

    const dashboard = document.getElementById('dashboardStats');
    if (!dashboard) return;

    dashboard.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
            <div style="background: var(--light-bg); padding: 1.5rem; border-radius: 10px; border: 1px solid var(--border-color);">
                <div style="color: #888; font-size: 0.9rem; margin-bottom: 0.5rem;">Total de Produtos</div>
                <div style="font-size: 2rem; font-weight: 700; color: var(--primary-color);">${stats.totalProdutos}</div>
            </div>
            <div style="background: var(--light-bg); padding: 1.5rem; border-radius: 10px; border: 1px solid var(--border-color);">
                <div style="color: #888; font-size: 0.9rem; margin-bottom: 0.5rem;">Total de Pedidos</div>
                <div style="font-size: 2rem; font-weight: 700; color: var(--info-color);">${stats.totalPedidos}</div>
            </div>
            <div style="background: var(--light-bg); padding: 1.5rem; border-radius: 10px; border: 1px solid var(--border-color);">
                <div style="color: #888; font-size: 0.9rem; margin-bottom: 0.5rem;">Total de Vendas</div>
                <div style="font-size: 2rem; font-weight: 700; color: var(--success-color);">R$ ${stats.totalVendas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            </div>
            <div style="background: var(--light-bg); padding: 1.5rem; border-radius: 10px; border: 1px solid var(--border-color);">
                <div style="color: #888; font-size: 0.9rem; margin-bottom: 0.5rem;">Pedidos Pendentes</div>
                <div style="font-size: 2rem; font-weight: 700; color: var(--warning-color);">${stats.pedidosPendentes}</div>
            </div>
        </div>
        ${stats.produtoMaisVendido ? `
            <div style="background: var(--light-bg); padding: 1rem; border-radius: 10px; border: 1px solid var(--border-color); margin-bottom: 2rem;">
                <div style="color: #888; font-size: 0.9rem; margin-bottom: 0.5rem;">Produto Mais Vendido</div>
                <div style="font-size: 1.3rem; font-weight: 600; color: var(--text-light);">${stats.produtoMaisVendido}</div>
                <div style="color: var(--primary-color); font-size: 0.9rem;">${stats.maxVendas} unidades vendidas</div>
            </div>
        ` : ''}
    `;
}

// Adicionar menu de utilidades no admin
function addUtilitiesMenu() {
    const navbar = document.querySelector('.admin-navbar .navbar-container');
    if (!navbar) return;

    const utilitiesDiv = document.createElement('div');
    utilitiesDiv.className = 'navbar-actions';
    utilitiesDiv.style.display = 'flex';
    utilitiesDiv.style.gap = '1rem';
    utilitiesDiv.style.alignItems = 'center';

    utilitiesDiv.innerHTML = `
        <button onclick="exportData()" style="background: var(--success-color); color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 0.5rem;" title="Exportar dados">
            <i class="fas fa-download"></i> Exportar
        </button>
        <label style="background: var(--info-color); color: white; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 0.5rem;" title="Importar dados">
            <i class="fas fa-upload"></i> Importar
            <input type="file" accept=".json" onchange="importData(event)" style="display: none;">
        </label>
        <button onclick="clearAllData()" style="background: var(--error-color); color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 0.5rem;" title="Limpar todos os dados">
            <i class="fas fa-trash"></i> Limpar Tudo
        </button>
    `;

    // Inserir antes do botão de logout
    const logoutBtn = navbar.querySelector('#logoutAdminBtn');
    if (logoutBtn) {
        navbar.insertBefore(utilitiesDiv, logoutBtn.parentElement);
    }
}

// Adicionar dashboard no admin
function addDashboardSection() {
    const main = document.querySelector('.admin-main .container');
    if (!main) return;

    const dashboardSection = document.createElement('section');
    dashboardSection.id = 'dashboardStats';
    dashboardSection.style.marginBottom = '2rem';

    const header = main.querySelector('.admin-header');
    if (header) {
        main.insertBefore(dashboardSection, header.nextElementSibling);
        renderDashboard();
    }
}

// Inicializar utilitários quando o DOM carregar
document.addEventListener('DOMContentLoaded', () => {
    // Verificar se está na página admin
    if (document.getElementById('adminPanel')) {
        addUtilitiesMenu();
        addDashboardSection();
    }
});
