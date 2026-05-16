/* 工具網 — shared app behaviours: font-size toggle, mobile menu, copy utility */
(function () {

  /* ---------- Font size toggle ---------- */
  const FS_KEY = 'tw_fs';
  const FS_SIZES = { sm: '15px', md: '16px', lg: '18px', xl: '20px' };

  function applyFontSize(key) {
    document.documentElement.style.setProperty('--fs-base', FS_SIZES[key] || FS_SIZES.md);
    document.querySelectorAll('.fs-toggle button').forEach(b => {
      b.classList.toggle('is-active', b.dataset.fs === key);
    });
  }

  function setFontSize(key) {
    try { localStorage.setItem(FS_KEY, key); } catch (e) {}
    applyFontSize(key);
  }

  function initFontSize() {
    let saved;
    try { saved = localStorage.getItem(FS_KEY); } catch (e) {}
    applyFontSize(saved || 'md');
    document.querySelectorAll('.fs-toggle button').forEach(b => {
      b.addEventListener('click', () => setFontSize(b.dataset.fs));
    });
  }

  /* ---------- Mobile menu ---------- */
  function initMenu() {
    const btn = document.querySelector('.menu-btn');
    const nav = document.querySelector('.nav');
    if (!btn || !nav) return;
    btn.addEventListener('click', () => nav.classList.toggle('is-open'));
    document.addEventListener('click', e => {
      if (!btn.contains(e.target) && !nav.contains(e.target)) {
        nav.classList.remove('is-open');
      }
    });
  }

  /* ---------- Copy utility ---------- */
  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;opacity:0;';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); document.body.removeChild(ta); return true; }
      catch (err) { document.body.removeChild(ta); return false; }
    }
  }

  function flashCopied(btn) {
    const orig = btn.innerHTML;
    btn.innerHTML = '已複製';
    btn.classList.add('is-copied');
    setTimeout(() => { btn.innerHTML = orig; btn.classList.remove('is-copied'); }, 1400);
  }

  /* Expose copy helpers for tool scripts */
  window.AppUtils = { copyText, flashCopied };

  /* ---------- Contact form (no-backend demo) ---------- */
  function initContact() {
    const form = document.querySelector('.contact-form');
    if (!form) return;
    const success = form.querySelector('.form-success');
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (success) success.classList.add('is-visible');
      form.querySelectorAll('input, textarea, select').forEach(el => {
        if (el.type !== 'submit') el.value = '';
      });
      setTimeout(() => success && success.classList.remove('is-visible'), 4000);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initFontSize();
    initMenu();
    initContact();
  });
})();
