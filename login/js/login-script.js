// Alternar entre abas de Login e Cadastro
function switchTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const tabs = document.querySelectorAll('.tab-btn');

    tabs.forEach(btn => btn.classList.remove('active'));
    
    if (tab === 'login') {
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
        tabs[0].classList.add('active');
    } else {
        loginForm.classList.remove('active');
        registerForm.classList.add('active');
        tabs[1].classList.add('active');
    }
}

// Mostrar/Ocultar senha
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling;
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

// Lidar com o Login
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('rememberMe').checked;

    if (!email.includes('@')) {
        showToast('Por favor, insira um e-mail válido.', 'error');
        return;
    }

    if (password.length < 4) {
        showToast('A senha deve ter pelo menos 4 caracteres.', 'error');
        return;
    }

    // Salvar no localStorage (mesma lógica da loja)
    localStorage.setItem('userLogged', 'true');
    localStorage.setItem('userEmail', email);
    
    if (remember) {
        localStorage.setItem('savedEmail', email);
        localStorage.setItem('savedPassword', password);
    } else {
        localStorage.removeItem('savedEmail');
        localStorage.removeItem('savedPassword');
    }

    showToast('Login realizado com sucesso! Redirecionando...', 'success');
    
    setTimeout(() => {
        window.location.href = '../loja/index.html';
    }, 1500);
});

// Lidar com o Cadastro (Simulado)
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    if (name.length < 3) {
        showToast('Por favor, insira seu nome completo.', 'error');
        return;
    }

    // Simular salvamento
    localStorage.setItem('userLogged', 'true');
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userName', name);

    showToast('Conta criada com sucesso! Bem-vindo.', 'success');
    
    setTimeout(() => {
        window.location.href = '../loja/index.html';
    }, 1500);
});

// Toast Notifications
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    
    toast.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.3s ease-out reverse forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Preencher campos se "Lembrar de mim" foi usado antes
window.addEventListener('DOMContentLoaded', () => {
    const savedEmail = localStorage.getItem('savedEmail');
    const savedPassword = localStorage.getItem('savedPassword');
    
    if (savedEmail && savedPassword) {
        document.getElementById('email').value = savedEmail;
        document.getElementById('password').value = savedPassword;
        document.getElementById('rememberMe').checked = true;
    }
});
