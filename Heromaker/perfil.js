// perfil.js

// A função principal é 'async' para podermos usar 'await' na chamada da API
async function carregarFichas() {
    // 1. Pega o usuário logado do sessionStorage
    const usuarioLogado = sessionStorage.getItem('usuario');

    // 2. Segurança: se não houver usuário, redireciona para o login
    if (!usuarioLogado) {
        alert("Acesso negado. Por favor, faça o login.");
        window.location.href = 'login.html';
        return; // Para a execução do script
    }

    // 3. Seleciona o container onde as fichas serão exibidas
    const container = document.getElementById('lista-fichas-container');
    container.innerHTML = '<p>Carregando fichas...</p>'; // Mensagem de feedback inicial

    try {
        // 4. Faz a chamada à API para buscar as fichas do usuário logado
        const response = await fetch(`http://127.0.0.1:5000/fichas/${usuarioLogado}`);
        const data = await response.json();

        // Limpa a mensagem "Carregando..."
        container.innerHTML = '';

        // 5. Verifica se a busca foi bem-sucedida e se existem fichas
        if (data.success && data.fichas.length > 0) {
            // 6. Para cada ficha retornada, cria um card na tela
            data.fichas.forEach(ficha => {
                const card = document.createElement('div');
                card.className = 'ficha-card'; // Para você poder estilizar no CSS
                
                // Preenche o card com as informações da ficha
                card.innerHTML = `
                    <h3>${ficha.nome || 'Personagem sem nome'}</h3> 
                    <p>${ficha.classe || 'Sem classe'}, Nível ${ficha.nivel || 1}</p>
                `;
                
                // 7. Adiciona o evento de clique para redirecionar para a edição
                card.addEventListener('click', () => {
                    // Redireciona para a página de edição, passando o ID da ficha na URL
                    window.location.href = `editar-ficha.html?id=${ficha.id}`;
                });

                // Adiciona o card criado ao container na página
                container.appendChild(card);
            });
        } else {
            // Se não houver fichas, exibe uma mensagem
            container.innerHTML = '<p>Você ainda não criou nenhuma ficha. Clique em "Criar Nova Ficha" para começar!</p>';
        }
    } catch (error) {
        // Se houver um erro de conexão com o servidor
        console.error('Erro ao buscar fichas:', error);
        container.innerHTML = '<p>Ocorreu um erro ao carregar suas fichas. Verifique se o servidor está rodando.</p>';
    }
}

// Garante que o script só vai rodar depois que o HTML da página estiver pronto
document.addEventListener('DOMContentLoaded', carregarFichas);
