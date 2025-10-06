
const usuarioLogado = sessionStorage.getItem('usuario');
if (!usuarioLogado) {
    alert("Você precisa estar logado para acessar esta página.");
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {

    // (A seleção de elementos no topo permanece a mesma)
    const form = document.querySelector('.form-container form');
    const btnAuto = document.querySelector('.btn-auto');
    // ... (seleção dos elementos da foto) ...

    // (O evento de 'submit' para salvar e gerar PDF permanece o mesmo)
    form.addEventListener('submit', async (event) => {
        // ... (seu código para salvar, gerar PDF e redirecionar) ...
    });

    // --- LÓGICA ATUALIZADA PARA O BOTÃO "PREENCHER AUTOMATICAMENTE" ---
    btnAuto.addEventListener('click', async () => {
        // Pega o elemento de mensagem para dar feedback
        const iaMessage = document.getElementById('ia-message');
        if (iaMessage) iaMessage.textContent = 'Gerando ficha com a IA...';

        try {
            // 1. Chama a nova rota no backend
            const response = await fetch('http://127.0.0.1:5000/gerar-ficha-ia');
            const data = await response.json();

            // 2. Se a resposta for bem-sucedida, atualiza a página
            if (data.success) {
                const ficha = data.ficha;

                // 3. Preenche cada campo do formulário com os dados recebidos
                document.getElementById('genero').value = ficha.genero;
                document.getElementById('nivel').value = ficha.nivel;
                document.getElementById('raca').value = ficha.raca;
                document.getElementById('classe').value = ficha.classe;
                document.getElementById('forca').value = ficha.forca;
                document.getElementById('defesa').value = ficha.defesa;
                document.getElementById('inteligencia').value = ficha.inteligencia;
                document.getElementById('agilidade').value = ficha.agilidade;
                document.getElementById('carisma').value = ficha.carisma;
                
                // Limpa o campo nome, como solicitado
                document.getElementById('nome').value = ''; 

                if (iaMessage) iaMessage.textContent = '✅ Ficha preenchida pela IA!';
                
                // Remove a mensagem após alguns segundos
                setTimeout(() => {
                    if (iaMessage) iaMessage.textContent = '';
                }, 3000);
            } else {
                if (iaMessage) iaMessage.textContent = '❌ Erro ao gerar ficha.';
            }
        } catch (error) {
            console.error("Erro ao chamar a IA:", error);
            if (iaMessage) iaMessage.textContent = '⚠️ Erro de conexão com a IA.';
        }
    });

});
