(function () {
  var THEME_KEY = 'theme';

  function getSystemPrefersDark() {
    return (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    );
  }

  function applyTheme(theme) {
    var root = document.documentElement;
    if (!root) return;

    if (theme === 'light' || theme === 'dark') {
      root.setAttribute('data-theme', theme);
    } else {
      root.removeAttribute('data-theme');
    }

    var toggle = document.getElementById('theme-toggle');
    if (!toggle) return;
    var effectiveTheme = theme;
    if (!effectiveTheme) {
      effectiveTheme = getSystemPrefersDark() ? 'dark' : 'light';
    }
    toggle.setAttribute('data-mode', effectiveTheme);
    toggle.setAttribute('aria-pressed', effectiveTheme === 'dark');
  }

  function initTheme() {
    var stored = null;
    try {
      stored = window.localStorage.getItem(THEME_KEY);
    } catch (e) {}

    if (stored === 'light' || stored === 'dark') {
      // User has explicitly chosen a theme; always respect it.
      applyTheme(stored);
    } else {
      // No stored preference: start from system preference without persisting.
      applyTheme(null);
    }

    var toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        var current;
        try {
          current = window.localStorage.getItem(THEME_KEY);
        } catch (err) {}

        var effective = current;
        if (effective !== 'light' && effective !== 'dark') {
          // If nothing stored yet, derive the current effective theme from system.
          effective = getSystemPrefersDark() ? 'dark' : 'light';
        }

        var next = effective === 'dark' ? 'light' : 'dark';

        try {
          window.localStorage.setItem(THEME_KEY, next);
        } catch (e2) {}

        applyTheme(next);
      });
    }
  }

  function initHeaderNav() {
    var header = document.querySelector('.site-nav');
    if (!header) return;
    header.addEventListener('click', function (e) {
      if (e.target.closest('a, button')) return;
      window.location.href = header.querySelector('a')?.href || '/';
    });
  }

  initTheme();
  initHeaderNav();
})();
