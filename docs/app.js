document.addEventListener('DOMContentLoaded', () => {
  const timerDisplay = document.getElementById('timer');
  const startBtn = document.getElementById('start');
  const pauseBtn = document.getElementById('pause');
  const resetBtn = document.getElementById('reset');
  const getQuoteBtn = document.getElementById('getQuote');
  const quoteTextEl = document.getElementById('quoteText');
  const toggleHighlightBtn = document.getElementById('toggleHighlight');
  const apiStatusEl = document.getElementById('apiStatus');
  const themeToggleBtn = document.getElementById('themeToggle');
  const installBtn = document.getElementById('btnInstall');

  let timerInterval = null;
  let totalSeconds = 25 * 60;
  let isRunning = false;
  let isHighlighting = false;
  let deferredPrompt = null;

  // Detecta se está rodando no GitHub Pages
  const isGithubPages = window.location.hostname.includes('github.io');

  // Só usa API local quando não estiver no Pages
  const API_URL = isGithubPages
    ? null
    : (window.API_URL || 'http://localhost:3000/api/quote');

  function updateTimerDisplay() {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(
      seconds
    ).padStart(2, '0')}`;
  }

  function startTimer() {
    if (isRunning) return;
    isRunning = true;
    startBtn.innerHTML = '<i class="fas fa-pause"></i> Pausar';
    pauseBtn.style.display = 'inline-flex';

    timerInterval = setInterval(() => {
      totalSeconds--;
      updateTimerDisplay();
      if (totalSeconds <= 0) finishPomodoro();
    }, 1000);
  }

  function pauseTimer() {
    if (!isRunning) return;
    isRunning = false;
    clearInterval(timerInterval);
    startBtn.innerHTML = '<i class="fas fa-play"></i> Continuar';
    pauseBtn.style.display = 'none';
  }

  function resetTimer(autoStart = false) {
    clearInterval(timerInterval);
    isRunning = false;
    totalSeconds = 25 * 60;
    updateTimerDisplay();
    startBtn.innerHTML = '<i class="fas fa-play"></i> Iniciar';
    pauseBtn.style.display = 'none';
    if (autoStart) setTimeout(startTimer, 1000);
  }

  function finishPomodoro() {
    clearInterval(timerInterval);
    isRunning = false;

    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }

    const oldTitle = document.title;
    document.title = 'Pomodoro finalizado!';
    alert('Pomodoro finalizado! Hora de uma pausa.');
    document.title = oldTitle;

    resetTimer(true);
  }

  async function fetchQuote() {
    // Se estiver no Pages, mostra texto fixo e não chama a API local
    if (!API_URL) {
      quoteTextEl.textContent =
        'Frase dinâmica disponível apenas quando a API local (Docker) está rodando.';
      quoteTextEl.dataset.author = 'ExtCrias API local';
      apiStatusEl.classList.add('offline');
      apiStatusEl.classList.remove('online');
      return;
    }

    quoteTextEl.textContent = 'Buscando nova frase...';
    quoteTextEl.dataset.author = '';

    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.statusText}`);
      }
      const data = await response.json();
      quoteTextEl.textContent = data.content || 'Sem frase';
      quoteTextEl.dataset.author = `— ${data.author || 'Desconhecido'}`;
      apiStatusEl.classList.remove('offline');
      apiStatusEl.classList.add('online');
    } catch (err) {
      console.error(err);
      quoteTextEl.textContent =
        'Não foi possível carregar a frase. Verifique a API.';
      quoteTextEl.dataset.author = 'Erro';
      apiStatusEl.classList.add('offline');
      apiStatusEl.classList.remove('online');
    }
  }

  function highlightLinks() {
    if (!isHighlighting) return;
    document
      .querySelectorAll('a[href]:not(.highlighted)')
      .forEach((link) => {
        link.classList.add('highlighted');
        link.classList.add('highlight-link');
        setTimeout(() => link.classList.remove('highlight-link'), 2000);
      });
  }

  function toggleHighlighting() {
    isHighlighting = !isHighlighting;
    if (isHighlighting) {
      toggleHighlightBtn.innerHTML =
        '<i class="fas fa-highlighter"></i> Destacar Links (ON)';
      toggleHighlightBtn.classList.add('active');
      highlightLinks();
      setInterval(highlightLinks, 3000);
    } else {
      toggleHighlightBtn.innerHTML =
        '<i class="fas fa-highlighter"></i> Destacar Links (OFF)';
      toggleHighlightBtn.classList.remove('active');
    }
  }

  function applyTheme(theme) {
    const icon = theme === 'dark' ? 'fa-moon' : 'fa-sun';
    document.documentElement.setAttribute('data-theme', theme);
    themeToggleBtn.innerHTML = `<i class="fas ${icon}"></i>`;
    localStorage.setItem('theme', theme);
  }

  function toggleTheme() {
    const current =
      document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    applyTheme(next);
  }

  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('sw.js')
        .catch((err) => console.error('SW error', err));
    }
  }

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    installBtn.style.display = 'inline-flex';
  });

  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    installBtn.style.display = 'none';
  });

  startBtn.addEventListener('click', () => {
    if (isRunning) pauseTimer();
    else startTimer();
  });
  pauseBtn.addEventListener('click', pauseTimer);
  resetBtn.addEventListener('click', () => resetTimer(false));

  getQuoteBtn.addEventListener('click', fetchQuote);
  toggleHighlightBtn.addEventListener('click', toggleHighlighting);
  themeToggleBtn.addEventListener('click', toggleTheme);

  const prefersDark =
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('theme');
  applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));
  updateTimerDisplay();
  fetchQuote();
  toggleHighlighting();
  registerServiceWorker();
});
