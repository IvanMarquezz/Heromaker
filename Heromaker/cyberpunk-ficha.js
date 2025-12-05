
// cyberpunk-ficha.js
// Script específico para a ficha Cyberpunk — preenche os campos solicitados (0-20) e profissão aleatória

(() => {
  // Segurança simples: verifica sessão
  const usuarioLogado = sessionStorage.getItem('usuario');
  if (!usuarioLogado) {
    alert('Você precisa estar logado para acessar esta página.');
    window.location.href = 'login.html';
    return;
  }

  document.addEventListener('DOMContentLoaded', () => {
    // --- Seletores ---
    const form = document.querySelector('.form-container form');
    const btnAuto = document.querySelector('.btn-auto'); // botão "Preencher Automaticamente"
    const iaMessage = document.getElementById('ia-message');

    // foto
    const fotoContainer = document.getElementById('foto-container-clicavel');
    const fotoUploadInput = document.getElementById('foto-upload');
    const personagemImagem = document.getElementById('personagem-imagem');
    const textoAdicionarFoto = document.getElementById('texto-adicionar-foto');
    const navProfilePic = document.getElementById('nav-profile-pic');

    // Preenche foto da navbar a partir da sessão (se houver)
    const fotoSalva = sessionStorage.getItem('userPhoto');
    if (fotoSalva && navProfilePic) navProfilePic.src = fotoSalva;

    // --- Funções utilitárias ---
    const rand0to20 = () => Math.floor(Math.random() * 21);
    const profissaoAleatoriaLocal = () => {
      const op = ['policial', 'mercenário', 'mercado', 'detetive', 'medico'];
      return op[Math.floor(Math.random() * op.length)];
    };

    // Mapeamento dos IDs do HTML (conforme seu template)
    const ids = {
      nivel: 'nivel',           // nível de ciborguização
      pontosVida: 'classe',     // pontos de vida (usado no HTML como "classe")
      forca: 'forca',
      reflexo: 'defesa',        // reflexo usa id "defesa" no HTML
      tecnologia: 'inteligencia',
      agilidade: 'agilidade',
      carisma: 'carisma',
      profissao: 'raca'         // profissão usa id "raca" no HTML
    };

    // --- Preenche localmente (fallback) ---
    function preencherLocalmente() {
      document.getElementById(ids.nivel).value = rand0to20();
      document.getElementById(ids.pontosVida).value = rand0to20();
      document.getElementById(ids.forca).value = rand0to20();
      document.getElementById(ids.reflexo).value = rand0to20();
      document.getElementById(ids.tecnologia).value = rand0to20();
      document.getElementById(ids.agilidade).value = rand0to20();
      document.getElementById(ids.carisma).value = rand0to20();
      document.getElementById(ids.profissao).value = profissaoAleatoriaLocal();
    }

    // --- Handler do botão "Preencher Automaticamente" ---
    if (btnAuto) {
      btnAuto.addEventListener('click', async () => {
        btnAuto.disabled = true;
        const prevText = btnAuto.textContent;
        btnAuto.textContent = 'Gerando...';
        if (iaMessage) iaMessage.textContent = 'Gerando ficha Cyberpunk...';

        // Tenta buscar do backend primeiro
        try {
          const res = await fetch('http://127.0.0.1:5000/gerar-ficha-ia-cyberpunk', { method: 'GET' });
          if (!res.ok) throw new Error('Resposta de rede não OK');

          const data = await res.json();
          if (data && data.success && data.ficha) {
            const f = data.ficha;
            // mapeia e preenche (verifica existência dos elementos antes)
            if (document.getElementById(ids.nivel)) document.getElementById(ids.nivel).value = f.ciborguizacao ?? rand0to20();
            if (document.getElementById(ids.pontosVida)) document.getElementById(ids.pontosVida).value = f.pontos_vida ?? rand0to20();
            if (document.getElementById(ids.forca)) document.getElementById(ids.forca).value = f.forca ?? rand0to20();
            if (document.getElementById(ids.reflexo)) document.getElementById(ids.reflexo).value = f.reflexo ?? rand0to20();
            if (document.getElementById(ids.tecnologia)) document.getElementById(ids.tecnologia).value = f.tecnologia ?? rand0to20();
            if (document.getElementById(ids.agilidade)) document.getElementById(ids.agilidade).value = f.agilidade ?? rand0to20();
            if (document.getElementById(ids.carisma)) document.getElementById(ids.carisma).value = f.carisma ?? rand0to20();
            if (document.getElementById(ids.profissao)) document.getElementById(ids.profissao).value = f.profissao ?? profissaoAleatoriaLocal();

            if (iaMessage) iaMessage.textContent = '✅ Ficha Cyberpunk preenchida pela IA!';
          } else {
            // resposta inesperada do backend — fallback local
            preencherLocalmente();
            if (iaMessage) iaMessage.textContent = '⚠️ IA respondeu sem dados completos. Preenchido localmente.';
          }
        } catch (err) {
          console.warn('Erro ao chamar /gerar-ficha-ia-cyberpunk — usando fallback local', err);
          // fallback local
          preencherLocalmente();
          if (iaMessage) iaMessage.textContent = '⚠️ Sem conexão com IA. Ficha preenchida localmente.';
        } finally {
          setTimeout(() => { if (iaMessage) iaMessage.textContent = ''; }, 2500);
          btnAuto.disabled = false;
          btnAuto.textContent = prevText;
        }
      });
    }

    // --- Upload / preview da foto do personagem (local) ---
    if (fotoContainer && fotoUploadInput && personagemImagem) {
      fotoContainer.addEventListener('click', () => fotoUploadInput.click());

      fotoUploadInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) {
          personagemImagem.src = '';
          textoAdicionarFoto.style.display = 'block';
          sessionStorage.removeItem('userPhoto');
          return;
        }
        const url = URL.createObjectURL(file);
        personagemImagem.src = url;
        textoAdicionarFoto.style.display = 'none';
        // salvar temporariamente na session para navbar
        sessionStorage.setItem('userPhoto', url);

        // opcional: enviar para backend se tiver rota de upload (não obrigatório)
        // Exemplo (comentado):
        // const fd = new FormData();
        // fd.append('foto', file);
        // fd.append('email', usuarioLogado);
        // fetch('http://127.0.0.1:5000/upload-foto', { method: 'POST', body: fd })
        //   .then(r => r.json()).then(console.log).catch(console.error);
      });
    }

    // --- Submissão do formulário: desativa botão enquanto envia ---
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          const originalText = submitBtn.textContent;
          submitBtn.textContent = 'Salvando...';

          // coleta os campos (com base nos ids do HTML)
          const ficha = {};
          const safeGet = id => document.getElementById(id) ? document.getElementById(id).value : null;

          ficha.nome = safeGet('nome');
          ficha.genero = safeGet('genero');
          ficha.ciborguizacao = safeGet(ids.nivel);
          ficha.profissao = safeGet(ids.profissao);
          ficha.pontos_vida = safeGet(ids.pontosVida);
          ficha.forca = safeGet(ids.forca);
          ficha.reflexo = safeGet(ids.reflexo);
          ficha.tecnologia = safeGet(ids.tecnologia);
          ficha.agilidade = safeGet(ids.agilidade);
          ficha.carisma = safeGet(ids.carisma);

          // envia para o backend
          try {
            const res = await fetch('http://127.0.0.1:5000/salvar-ficha', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: usuarioLogado, ficha })
            });
            const j = await res.json();
            if (res.ok && j.success) {
              alert('Ficha salva com sucesso!');
              window.location.href = './perfil.html';
            } else {
              alert('Erro ao salvar ficha: ' + (j.message || res.statusText));
            }
          } catch (err) {
            console.error('Erro ao salvar ficha:', err);
            alert('Erro de conexão. Verifique o backend.');
          } finally {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent = originalText;
            }
          }
        }
      });
    }

  }); // DOMContentLoaded
})();
