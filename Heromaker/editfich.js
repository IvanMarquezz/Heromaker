// editar-ficha.js
document.addEventListener('DOMContentLoaded', async () => {
    const usuarioLogado = sessionStorage.getItem('usuario');
    if (!usuarioLogado) {
        window.location.href = 'login.html';
        return;
    }

    // 1. Pega o ID da ficha da URL
    const params = new URLSearchParams(window.location.search);
    const fichaId = params.get('id');

    if (!fichaId) {
        alert("ID da ficha não encontrado. Redirecionando...");
        window.location.href = 'perfil.html';
        return;
    }

    const form = document.querySelector('.form-container form');

    // 2. Busca os dados da ficha específica no backend
    try {
        const response = await fetch(`http://127.0.0.1:5000/ficha/${fichaId}`);
        const data = await response.json();

        if (data.success) {
            // 3. Preenche todos os campos do formulário com os dados recebidos
            const ficha = data.ficha;
            document.getElementById('nome').value = ficha.nome || '';
            document.getElementById('genero').value = ficha.genero || '';
            document.getElementById('nivel').value = ficha.nivel || '';
            // ... preencha TODOS os outros campos (raça, classe, atributos, etc.)
        } else {
            alert("Erro ao carregar a ficha.");
        }
    } catch (error) {
        console.error("Erro ao buscar dados da ficha:", error);
    }
    
    // 4. Lógica para salvar as ALTERAÇÕES
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        // Coleta os dados (agora atualizados) do formulário
        const personagemAtualizado = {
            id: fichaId, // Inclui o ID para o backend saber qual ficha atualizar
            nome: document.getElementById('nome').value,
            // ... colete TODOS os outros campos
        };

        // Envia para a mesma rota de salvar, mas agora com o ID
        const saveResponse = await fetch('http://127.0.0.1:5000/salvar-ficha', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: usuarioLogado, ficha: personagemAtualizado })
        });
        const result = await saveResponse.json();

        if(result.success) {
            alert("Ficha atualizada com sucesso!");
            window.location.href = 'perfil.html'; // Volta para o perfil
        } else {
            alert("Erro ao atualizar a ficha.");
        }
    });

    // A lógica dos outros botões (foto, preencher auto) pode ser copiada do index.js
});
