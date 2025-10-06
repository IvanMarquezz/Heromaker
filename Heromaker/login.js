// login.js

document.addEventListener('DOMContentLoaded', () => {
    // --- SELEÇÃO DE TODOS OS ELEMENTOS ---
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email-input');
    const passwordInput = document.getElementById('senha-input');
    const loginMessage = document.getElementById('login-message');
    const createAccountButton = document.getElementById('create-account-button');

    // --- EVENTO PARA O BOTÃO "CRIAR CONTA" ---
    createAccountButton.addEventListener('click', () => {
        window.location.href = 'cadastro.html';
    });

    // --- EVENTO PARA O FORMULÁRIO DE LOGIN ---
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 

        const email = emailInput.value;
        const senha = passwordInput.value;
        loginMessage.textContent = '';

        try {
            const response = await fetch("http://127.0.0.1:5000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, senha })
            });

            const result = await response.json();

            if (result.success) {
                loginMessage.textContent = "✅ Login realizado com sucesso!";
                loginMessage.style.color = "green";

                // --- ATUALIZAÇÃO IMPORTANTE ---
                // Salva o e-mail, nome e a foto do usuário na sessão do navegador
                sessionStorage.setItem("usuario", email);
                sessionStorage.setItem("userName", result.nome);
                sessionStorage.setItem("userPhoto", result.foto_perfil);

                setTimeout(() => {
                    window.location.href = "index.html";
                }, 1000);
            } else {
                loginMessage.textContent = "❌ " + result.message;
                loginMessage.style.color = "red";
            }
        } catch (err) {
            console.error("Erro de conexão:", err);
            loginMessage.textContent = "⚠️ Erro de conexão com o servidor. Verifique se o backend (Python) está rodando.";
            loginMessage.style.color = "orange";
        }
    });
});

