(() => {
  if (window.__testTimerHUDSetup) return;
  window.__testTimerHUDSetup = true;

  let initialized = false;

  function initTimerHUD() {
    if (initialized) return;
    initialized = true;

    // Info text
    const info = document.createElement('div');
    info.textContent = 'Delete = init | U = start/stop | I = reset';
    Object.assign(info.style, {
      position: 'fixed',
      left: '10px',
      bottom: '10px',
      fontSize: '14px',
      color: '#fff',
      opacity: '0.8',
      zIndex: 999999,
      pointerEvents: 'none',
      fontFamily: 'sans-serif',
    });
    document.body.appendChild(info);

    // HUD (top-left now)
    const hud = document.createElement('div');
    hud.id = 'test-timer-hud';
    hud.textContent = '00:00.0';

    Object.assign(hud.style, {
      position: 'fixed',
      top: '10px',
      left: '10px', // moved to left side
      padding: '8px 12px',
      background: 'rgba(0, 0, 0, 0.75)',
      color: '#0f0',
      fontFamily: 'monospace',
      fontSize: '20px',
      borderRadius: '4px',
      zIndex: 999999,
      userSelect: 'none',
      pointerEvents: 'none',
    });

    document.body.appendChild(hud);

    let running = false;
    let elapsedMs = 0;
    let startTime = 0;
    let intervalId = null;

    function formatTime(ms) {
      const totalSeconds = ms / 1000;
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = Math.floor(totalSeconds % 60);
      const tenths = Math.floor((ms % 1000) / 100);
      return (
        String(minutes).padStart(2, '0') +
        ':' +
        String(seconds).padStart(2, '0') +
        '.' +
        tenths
      );
    }

    function updateHUD() {
      hud.textContent = formatTime(elapsedMs);
    }

    function startTimer() {
      if (running) return;
      running = true;
      hud.style.color = '#0f0';
      startTime = Date.now() - elapsedMs;
      intervalId = setInterval(() => {
        elapsedMs = Date.now() - startTime;
        updateHUD();
      }, 100);
    }

    function stopTimer() {
      if (!running) return;
      running = false;
      hud.style.color = '#f00';
      clearInterval(intervalId);
      intervalId = null;
    }

    function resetTimer() {
      elapsedMs = 0;
      updateHUD();
      if (running) {
        startTime = Date.now();
      }
    }

    // Keybinds active after HUD is initialized
    window.addEventListener('keydown', (e) => {
      const tag = (e.target && e.target.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (e.code === 'KeyU') {
        e.preventDefault();
        running ? stopTimer() : startTimer();
      } else if (e.code === 'KeyI') {
        e.preventDefault();
        resetTimer();
      }
    });

    updateHUD();
  }

  // Press Delete to initialize HUD once per page
  window.addEventListener('keydown', (e) => {
    if (initialized) return;
    const tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

    if (e.code === 'Delete') {
      e.preventDefault();
      initTimerHUD();
    }
  });
})();