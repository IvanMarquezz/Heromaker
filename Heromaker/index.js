const usuarioLogado = sessionStorage.getItem('usuario');

if (!usuarioLogado) {
    alert("Você precisa estar logado para acessar esta página.");
    window.location.href = 'login.html';
}

// --- 2. LÓGICA DA PÁGINA APÓS O HTML CARREGAR ---
document.addEventListener('DOMContentLoaded', () => {

    // --- SELEÇÃO DOS ELEMENTOS DO FORMULÁRIO ---
    const form = document.querySelector('.form-container form');
    const btnAuto = document.querySelector('.btn-auto');

    // --- SELEÇÃO DOS ELEMENTOS DA FOTO (NOVO) ---
    const fotoContainer = document.getElementById('foto-container-clicavel');
    const fotoUploadInput = document.getElementById('foto-upload');
    const personagemImagem = document.getElementById('personagem-imagem');
    const textoAdicionarFoto = document.getElementById('texto-adicionar-foto');

    // --- EVENTO DE SUBMIT PARA GERAR A FICHA E O PDF ---
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        // Coleta dos dados do formulário
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

        console.log("Dados da Ficha:", personagem);

        // Geração do PDF
        const elementoParaPdf = document.querySelector('.form-container');
        const opcoes = {
            margin:       1,
            filename:     `ficha-${personagem.nome || 'personagem'}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true }, // useCORS: true é importante para imagens
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(opcoes).from(elementoParaPdf).save();
    });

    // --- EVENTO PARA O BOTÃO "PREENCHER AUTOMATICAMENTE" ---
    btnAuto.addEventListener('click', () => {
        const rolarAtributo = () => Math.floor(Math.random() * 16) + 3;

        document.getElementById('forca').value = rolarAtributo();
        document.getElementById('defesa').value = rolarAtributo();
        document.getElementById('inteligencia').value = rolarAtributo();
        document.getElementById('agilidade').value = rolarAtributo();
        document.getElementById('carisma').value = rolarAtributo();
    });

    // --- EVENTOS PARA A LÓGICA DA FOTO (NOVO) ---
    // Faz o container clicável "clicar" no input escondido
    fotoContainer.addEventListener('click', () => {
        fotoUploadInput.click();
    });

    // Escuta por mudanças no input de arquivo (quando o jogador escolhe uma foto)
    fotoUploadInput.addEventListener('change', (event) => {
        const arquivo = event.target.files[0];

        if (arquivo) {
            const urlDaImagem = URL.createObjectURL(arquivo);
            personagemImagem.src = urlDaImagem; // Mostra a imagem
            textoAdicionarFoto.style.display = 'none'; // Esconde o texto
        }
    });
});
