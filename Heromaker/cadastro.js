
document.addEventListener('DOMContentLoaded', () => {
    // elementos do formulario do cadastro
    const cadastroForm = document.querySelector('.form-container form'); 
    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    const confirmarSenhaInput = document.getElementById('confirmar-senha');
    const cadastroMessage = document.getElementById('cadastro-message'); // funçoes do botao cadastro

    //Adiciona area de evento no botao
    cadastroForm.addEventListener('submit', async (e) => {
        // resert a pagina caso as informações estejam repetidas
        e.preventDefault();

        // reconhe as informações
        const nome = nomeInput.value;
        const email = emailInput.value;
        const senha = senhaInput.value;
        const confirmarSenha = confirmarSenhaInput.value;

        // Validação no front-end: verifica se as senhas coincidem
        if (senha !== confirmarSenha) {
            cadastroMessage.textContent = "❌ As senhas não coincidem. Tente novamente.";
            cadastroMessage.style.color = "red";
            return; // Para a execução aqui
        }

        // Envia os dados para a API
        try {
            const response = await fetch("http://127.0.0.1:5000/cadastrar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                // Envia nome, email e senha no corpo da requisição
                body: JSON.stringify({ nome, email, senha }) 
            });

            const result = await response.json();

            //Trata a resposta do backend
            if (response.ok) {
                cadastroMessage.textContent = "✅ Cadastro realizado com sucesso! Redirecionando...";
                cadastroMessage.style.color = "green";

                setTimeout(() => {
                    window.location.href = "login.html";
                }, 2000);
            } else { // Se o backend retornou um erro (ex: email já existe)
                cadastroMessage.textContent = "❌ " + result.message;
                cadastroMessage.style.color = "red";
            }
        } catch (err) {
            console.error("Erro de conexão:", err);
            cadastroMessage.textContent = "⚠️ Erro de conexão com o servidor. Verifique se o backend (Python) está rodando.";
            cadastroMessage.style.color = "orange";
        }
    });
});
