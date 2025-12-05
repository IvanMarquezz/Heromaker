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
    const navProfilePic = document.getElementById('nav-profile-pica'); // CORRIGIDO!

    // --- ATUALIZA FOTO DA NAVBAR ---
    const fotoSalva = sessionStorage.getItem('userPhoto');
    if (fotoSalva && navProfilePic) {
        navProfilePic.src = fotoSalva;
    }

    // --- EVENTO PRINCIPAL: ENVIAR FORMULÁRIO ---
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const personagem = {
            nome: document.getElementById('nome').value,
            genero: document.getElementById('genero').value,

            // 🔥 IDs corrigidos
            nivel: document.getElementById('nivel').value,
            origem: document.getElementById('raca').value,
            trilha: document.getElementById('classe').value,

            // 🔥 IDs corrigidos
            forca: document.getElementById('forca').value,
            presenca: document.getElementById('defesa').value,
            intelecto: document.getElementById('inteligencia').value,
            agilidade: document.getElementById('agilidade').value,
            vigor: document.getElementById('carisma').value
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

                // Gera o PDF
                const elementoParaPdf = document.querySelector('.form-container');
                const opcoes = {
                    margin: 0.5,
                    filename: `ordemparanormal-${personagem.nome || 'personagem'}.pdf`,
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2, useCORS: true },
                    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
                };

                html2pdf().set(opcoes).from(elementoParaPdf).save();

                alert("Ficha salva e PDF gerado! Você será redirecionado para o seu perfil.");
                window.location.href = 'perfil.html';

            } else {
                alert('Erro ao salvar a ficha: ' + result.message);
            }
        } catch (err) {
            console.error('Erro ao salvar ficha:', err);
            alert('Erro de conexão ao salvar. Verifique o backend.');
        }
    });

    // --- IA: PREENCHER AUTOMATICAMENTE ---
    btnAuto.addEventListener('click', async () => {

    iaMessage.textContent = 'Gerando ficha com a IA...';

    try {
        const response = await fetch('http://127.0.0.1:5000/gerar-ficha-ia-op');
        const data = await response.json();

        if (data.success) {
            const f = data.ficha;

            document.getElementById('nivel').value = f.nivel;
            document.getElementById('forca').value = f.forca;
            document.getElementById('defesa').value = f.presenca;
            document.getElementById('inteligencia').value = f.intelecto;
            document.getElementById('agilidade').value = f.agilidade;
            document.getElementById('carisma').value = f.vigor;

            document.getElementById('raca').value = f.origem;
            document.getElementById('classe').value = f.trilha;

            iaMessage.textContent = '✅ Ficha preenchida pela IA!';
            setTimeout(() => iaMessage.textContent = '', 3000);

        } else {
            iaMessage.textContent = '❌ Erro ao gerar ficha pela IA.';
        }

    } catch (error) {
        console.error("Erro ao chamar IA:", error);
        iaMessage.textContent = '⚠️ Erro de conexão.';
    }
});

    // --- UPLOAD DE FOTO ---
    fotoContainer.addEventListener('click', () => {
        fotoUploadInput.click();
    });

    fotoUploadInput.addEventListener('change', (event) => {
        const arquivo = event.target.files[0];
        if (arquivo) {
            const url = URL.createObjectURL(arquivo);
            personagemImagem.src = url;
            textoAdicionarFoto.style.display = 'none';
        } else {
            personagemImagem.src = '';
            textoAdicionarFoto.style.display = 'block';
        }
    });
});
