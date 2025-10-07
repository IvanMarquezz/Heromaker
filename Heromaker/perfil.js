/*

// Garante que o código só vai rodar depois que o HTML da página estiver pronto.
document.addEventListener('DOMContentLoaded', async () => {
    
    // --- 1. VERIFICAÇÃO DE LOGIN E DADOS DO USUÁRIO ---
    const usuarioLogadoEmail = sessionStorage.getItem('usuario');
    const nomeUsuario = sessionStorage.getItem('userName') || usuarioLogadoEmail;
    const fotoPerfilData = sessionStorage.getItem('userPhoto'); // Pega a foto salva na sessão

    // Se não houver usuário logado, redireciona para a tela de login.
    if (!usuarioLogadoEmail) {
        alert("Acesso negado. Por favor, faça o login.");
        window.location.href = 'login.html';
        return; // Para a execução do script.
    }

    // --- 2. SELEÇÃO DOS ELEMENTOS DO HTML ---
    const welcomeMessage = document.getElementById('welcome-message');
    const fichasContainer = document.getElementById('fichas-container');
    const btnEditarFoto = document.getElementById('btn-editar-foto');
    const fotoPerfilImg = document.getElementById('foto-perfil-img');
    const fotoUploadInput = document.getElementById('foto-upload-input');

    // --- 3. ATUALIZA A MENSAGEM DE BOAS-VINDAS E A FOTO DE PERFIL ---
    if (welcomeMessage && nomeUsuario) {
        welcomeMessage.textContent = `SEJA BEM-VINDO, ${nomeUsuario.toUpperCase()}! AQUI ESTÃO SUAS FICHAS`;
    }
    
    // Mostra a foto salva; se não houver, o 'src' fica vazio e o CSS mostra o placeholder cinza.
    if (fotoPerfilImg && fotoPerfilData) {
        fotoPerfilImg.src = fotoPerfilData;
    }

    // --- 4. FUNCIONALIDADE DE EDITAR FOTO ---
    // O botão de editar aciona o clique no input de arquivo escondido.
    btnEditarFoto.addEventListener('click', () => {
        fotoUploadInput.click();
    });

    // Quando o usuário escolhe um novo arquivo de imagem...
    fotoUploadInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Usa a API FileReader para converter a imagem em um formato (Base64) que pode ser salvo.
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            const base64String = reader.result;

            // Mostra a prévia da nova imagem imediatamente.
            fotoPerfilImg.src = base64String;

            // Salva a nova foto na sessão do navegador para acesso rápido.
            sessionStorage.setItem('userPhoto', base64String);
            
            // Envia a nova foto para o backend para salvar permanentemente na conta.
            try {
                const response = await fetch('http://127.0.0.1:5000/salvar-foto-perfil', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: usuarioLogadoEmail, foto_base64: base64String })
                });
                const result = await response.json();
                if (result.success) {
                    console.log("Foto de perfil salva no servidor com sucesso.");
                } else {
                    alert("Erro ao salvar a foto de perfil no servidor.");
                }
            } catch (err) {
                console.error("Erro de conexão ao salvar foto:", err);
                alert("Não foi possível salvar a foto. Verifique a conexão com o servidor.");
            }
        };
    });
    
    // --- 5. BUSCA E EXIBE AS FICHAS SALVAS ---
    try {
        fichasContainer.innerHTML = '<span>Carregando suas fichas...</span>';

        const response = await fetch(`http://127.0.0.1:5000/fichas/${usuarioLogadoEmail}`);
        const data = await response.json();
        
        fichasContainer.innerHTML = '';

        if (data.success && data.fichas.length > 0) {
            data.fichas.forEach(ficha => {
                const fichaElement = document.createElement('div');
                fichaElement.className = 'ficha';
                fichaElement.innerHTML = `
                    <div class="icone-ficha"></div>
                    <span>${ficha.nome || 'Ficha Sem Nome'}</span>
                `;
                fichaElement.addEventListener('click', () => {
                    window.location.href = `editar-ficha.html?id=${ficha.id}`;
                });
                fichasContainer.appendChild(fichaElement);
            });
        } else {
            fichasContainer.innerHTML = '<span>Você ainda não tem nenhuma ficha salva. Volte e crie uma!</span>';
        }
    } catch (error) {
        console.error('Erro ao carregar as fichas:', error);
        fichasContainer.innerHTML = '<span>Ocorreu um erro ao buscar suas fichas. O servidor pode estar offline.</span>';
    }
});

*/