// Garante que o script só rode depois que o HTML estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. VERIFICAÇÃO DE LOGIN ---
    const usuarioLogadoEmail = sessionStorage.getItem('usuario');
    const nomeUsuario = sessionStorage.getItem('userName');
    const fotoPerfilData = sessionStorage.getItem('userPhoto');

    // Se não houver usuário logado, redireciona para login
    if (!usuarioLogadoEmail) {
        alert("Acesso negado. Por favor, faça o login.");
        window.location.href = 'login.html';
        return;
    }

    // --- 2. ATUALIZA NAVBAR COM FOTO E NOME ---
    const perfilImg = document.querySelector('img.perfil'); // imagem na navbar
    if (perfilImg && fotoPerfilData) {
        perfilImg.src = fotoPerfilData;
    }

    // Se quiser, podemos adicionar um clique na foto para ir para perfil
    perfilImg.addEventListener('click', () => {
        window.location.href = 'perfil.html';
    });

    // --- 3. FUNÇÃO PARA REDIRECIONAR AO SISTEMA DE FICHA ---
    const sistemaCards = document.querySelectorAll('.sistema');

    sistemaCards.forEach(card => {
        card.addEventListener('click', () => {
            if (card.classList.contains('dnd')) {
                window.location.href = 'criar-ficha.html?sistema=dnd';
            } else if (card.classList.contains('cyberpunk')) {
                window.location.href = 'criar-ficha.html?sistema=cyberpunk';
            } else if (card.classList.contains('ordem-paranormal')) {
                window.location.href = 'criar-ficha.html?sistema=ordem-paranormal';
            }
        });
    });

    // --- 4. OPCIONAL: MENSAGEM DE BOAS-VINDAS ---
    const welcomeMessage = document.getElementById('welcome-message');
    if (welcomeMessage && nomeUsuario) {
        welcomeMessage.textContent = `Seja bem-vindo(a), ${nomeUsuario.toUpperCase()}!`;
    }

});
