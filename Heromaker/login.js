document.addEventListener('DOMContentLoaded', () => {
    // --- 1. SELEÇÃO DE TODOS OS ELEMENTOS ---
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email-input');
    const passwordInput = document.getElementById('senha-input');
    const loginMessage = document.getElementById('login-message');
    const createAccountButton = document.getElementById('create-account-button');

    // -sessão cria conta
    // Este listener cuida apenas do redirecionamento para a página de cadastro.
    createAccountButton.addEventListener('click', () => {
        window.location.href = 'cadastro.html';
    });

    // alinha as informações 
    loginForm.addEventListener('submit', async (e) => {
        // Impede que a página recarregue
        e.preventDefault(); 

        const email = emailInput.value;
        const senha = passwordInput.value;

        // Limpa mensagens antigas
        loginMessage.textContent = '';

        //comunicação com o backend
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

                sessionStorage.setItem("usuario", email)
                
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
