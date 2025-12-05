document.addEventListener('DOMContentLoaded', () => {

    console.log("cadastro.js carregado!");

    const cadastroForm = document.querySelector('.form-container form'); 
    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    const confirmarSenhaInput = document.getElementById('confirmar-senha');
    const cadastroMessage = document.getElementById('cadastro-message');

    cadastroForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log("Formulário enviado!");

        const nome = nomeInput.value.trim();
        const email = emailInput.value.trim();
        const senha = senhaInput.value;
        const confirmarSenha = confirmarSenhaInput.value;

        if (senha !== confirmarSenha) {
            cadastroMessage.textContent = "❌ As senhas não coincidem.";
            cadastroMessage.style.color = "red";
            return;
        }

        try {
            console.log("Enviando para API...");

            const response = await fetch("http://127.0.0.1:5000/cadastrar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nome, email, senha })
            });

            console.log("Status da resposta:", response.status);

            const result = await response.json();
            console.log("Resultado recebido:", result);

            if (result.success) {
                cadastroMessage.textContent = "✅ Cadastro realizado! Redirecionando...";
                cadastroMessage.style.color = "green";

                // Salva mensagem pro login
                localStorage.setItem("msgCadastro", "Cadastro concluído!");

                console.log("Redirecionamento em 1 segundo...");
                
                setTimeout(() => {
                    console.log("Redirecionando AGORA para login.html");
                    window.location.href = "login.html";
                }, 1000);

            } else {
                cadastroMessage.textContent = "❌ " + result.message;
                cadastroMessage.style.color = "red";
            }

        } catch (err) {
            console.error("Erro de conexão:", err);
            cadastroMessage.textContent = "⚠ Erro ao conectar com o servidor.";
            cadastroMessage.style.color = "orange";
        }
    });
});
