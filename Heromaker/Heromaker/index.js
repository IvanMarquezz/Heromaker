/*

// --- 1. SEGURANÇA: VERIFICA SE O USUÁRIO ESTÁ LOGADO ---
const usuarioLogado = sessionStorage.getItem('usuario');

if (!usuarioLogado) {
    alert("Você precisa estar logado para acessar esta página.");
    window.location.href = 'login.html';
}

// --- 2. LÓGICA DA PÁGINA APÓS O HTML CARREGAR ---
document.addEventListener('DOMContentLoaded', () => {

    // --- SELEÇÃO DOS ELEMENTOS DO HTML ---
    const form = document.querySelector('.form-container form');
    const btnAuto = document.querySelector('.btn-auto');
    const fotoContainer = document.getElementById('foto-container-clicavel');
    const fotoUploadInput = document.getElementById('foto-upload');
    const personagemImagem = document.getElementById('personagem-imagem');
    const textoAdicionarFoto = document.getElementById('texto-adicionar-foto');
    const iaMessage = document.getElementById('ia-message');
    const navProfilePic = document.getElementById('nav-profile-pic'); // Pega a foto do perfil na navbar

    // --- ATUALIZAÇÃO DA FOTO DE PERFIL NA NAVBAR (NOVO) ---
    const fotoSalva = sessionStorage.getItem('userPhoto');
    if (fotoSalva && navProfilePic) {
        // Se houver uma foto salva na sessão, exibe-a na navbar
        navProfilePic.src = fotoSalva;
    }

    // --- EVENTO PRINCIPAL: ENVIAR O FORMULÁRIO (GERAR FICHA / SALVAR) ---
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const personagem = {
            nome: document.getElementById('nome').value,
            genero: document.getElementById('genero').value,
            nivel: document.getElementById('nivel').value,
            raca: document.getElementById('raca').value,
            classe: document.getElementById('classe').value,
            forca: document.getElementById('forca').value,
            defesa: document.getElementById('defesa').value,
            inteligencia: document.getElementById('inteligencia').value,
            agilidade: document.getElementById('agilidade').value,
            carisma: document.getElementById('carisma').value
        };

        try {
            const response = await fetch('http://127.0.0.1:5000/salvar-ficha', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: usuarioLogado,
                    ficha: personagem
                })
            });

            const result = await response.json();

            if (result.success) {
                
                // Gera o PDF (a "print" da ficha)
                const elementoParaPdf = document.querySelector('.form-container');
                const opcoes = {
                    margin:       0.5,
                    filename:     `ficha-${personagem.nome || 'personagem'}.pdf`,
                    image:        { type: 'jpeg', quality: 0.98 },
                    html2canvas:  { scale: 2, useCORS: true },
                    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
                };
                
                // Baixa o PDF
                html2pdf().set(opcoes).from(elementoParaPdf).save();

                alert("Ficha salva e PDF gerado! Você será redirecionado para o seu perfil.");
                window.location.href = 'perfil.html';
            } else {
                alert('Erro ao salvar a ficha: ' + result.message);
            }
        } catch (err) {
            console.error('Erro de conexão ao salvar ficha:', err);
            alert('Erro de conexão ao tentar salvar a ficha. Verifique se o backend está rodando corretamente.');
        }
    });

    // --- EVENTO DO BOTÃO "PREENCHER AUTOMATICAMENTE" (COM A IA) ---
    btnAuto.addEventListener('click', async () => {
        if (iaMessage) iaMessage.textContent = 'Gerando ficha com a IA...';
        try {
            const response = await fetch('http://127.0.0.1:5000/gerar-ficha-ia');
            const data = await response.json();

            if (data.success) {
                const ficha = data.ficha;
                document.getElementById('genero').value = ficha.genero;
                document.getElementById('nivel').value = ficha.nivel;
                document.getElementById('raca').value = ficha.raca;
                document.getElementById('classe').value = ficha.classe;
                document.getElementById('forca').value = ficha.forca;
                document.getElementById('defesa').value = ficha.defesa;
                document.getElementById('inteligencia').value = ficha.inteligencia;
                document.getElementById('agilidade').value = ficha.agilidade;
                document.getElementById('carisma').value = ficha.carisma;
                document.getElementById('nome').value = ''; 

                if (iaMessage) iaMessage.textContent = '✅ Ficha preenchida pela IA!';
                
                setTimeout(() => {
                    if (iaMessage) iaMessage.textContent = '';
                }, 3000);
            } else {
                if (iaMessage) iaMessage.textContent = '❌ Erro ao gerar ficha pela IA.';
            }
        } catch (error) {
            console.error("Erro ao chamar a IA:", error);
            if (iaMessage) iaMessage.textContent = '⚠️ Erro de conexão com a IA.';
        }
    });

    // --- EVENTOS PARA A FUNCIONALIDADE DE UPLOAD E PRÉ-VISUALIZAÇÃO DA FOTO ---
    fotoContainer.addEventListener('click', () => {
        fotoUploadInput.click();
    });

    fotoUploadInput.addEventListener('change', (event) => {
        const arquivo = event.target.files[0];
        if (arquivo) {
            const urlDaImagem = URL.createObjectURL(arquivo);
            personagemImagem.src = urlDaImagem;
            textoAdicionarFoto.style.display = 'none';
        } else {
            personagemImagem.src = ''; 
            textoAdicionarFoto.style.display = 'block';
        }
    });
});

*/