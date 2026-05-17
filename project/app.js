/* 工具網 — 共用腳本：字體切換、行動選單、複製工具、首頁轉換器、聯絡表單 */
(function () {

  /* ---------- 字體大小切換 ---------- */
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

  /* ---------- 行動選單 ---------- */
  function initMenu() {
    const btn = document.querySelector('.menu-btn');
    const nav = document.querySelector('.nav');
    if (!btn || !nav) return;
    btn.addEventListener('click', () => nav.classList.toggle('is-open'));
    document.addEventListener('click', e => {
      if (!btn.contains(e.target) && !nav.contains(e.target)) nav.classList.remove('is-open');
    });
  }

  /* ---------- 複製工具 ---------- */
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

  /* 供其他工具腳本呼叫 */
  window.AppUtils = { copyText, flashCopied };

  /* ---------- 首頁：數字轉國字大寫 ---------- */
  function initTool() {
    const form = document.querySelector('[data-tool="convert"]');
    if (!form) return;

    const input         = form.querySelector('.num-input');
    const clearBtn      = form.querySelector('.clear-btn');
    const errEl         = document.querySelector('.tool__error');
    const placeholderEl = document.querySelector('[data-placeholder-state]');
    const mainEl        = document.querySelector('[data-result-main]');
    const valueEl       = document.querySelector('[data-result-value]');
    const metaEl        = document.querySelector('[data-result-meta]');
    const altGrid       = document.querySelector('[data-result-alt]');

    const altSlots = {
      upper:     document.querySelector('[data-alt="upper"]'),
      lower:     document.querySelector('[data-alt="lower"]'),
      thousands: document.querySelector('[data-alt="thousands"]'),
      english:   document.querySelector('[data-alt="english"]'),
    };

    function showError(msg) {
      errEl.textContent = msg;
      errEl.classList.add('is-visible');
      input.classList.add('is-error');
      placeholderEl.style.display = '';
      mainEl.style.display = 'none';
      altGrid.style.display = 'none';
    }
    function clearError() {
      errEl.classList.remove('is-visible');
      input.classList.remove('is-error');
    }

    function digitGroupingLabel(n) {
      if (n <= 4) return '個位 ~ 千位';
      if (n <= 8) return '含「萬」位';
      if (n <= 12) return '含「億」位';
      return '含「兆」位';
    }

    function render(raw) {
      if (!window.TWConverter) return;
      const r = window.TWConverter.convertAll(raw);
      if (!r.ok) {
        if (!raw || !String(raw).trim()) {
          clearError();
          placeholderEl.style.display = '';
          mainEl.style.display = 'none';
          altGrid.style.display = 'none';
          return;
        }
        showError(r.error);
        return;
      }
      clearError();
      placeholderEl.style.display = 'none';
      mainEl.style.display = '';
      altGrid.style.display = '';

      valueEl.textContent = r.twdAccounting;
      metaEl.textContent  = `共 ${r.digitCount} 位數 · ${digitGroupingLabel(r.digitCount)}`;

      altSlots.upper.querySelector('.alt-row__value').textContent     = r.upper;
      altSlots.upper.dataset.copy = r.upper;
      altSlots.lower.querySelector('.alt-row__value').textContent     = r.lower;
      altSlots.lower.dataset.copy = r.lower;
      altSlots.thousands.querySelector('.alt-row__value').textContent = r.thousands;
      altSlots.thousands.dataset.copy = r.thousands;
      altSlots.english.querySelector('.alt-row__value').textContent   = r.english;
      altSlots.english.dataset.copy = r.english;

      const cb = document.querySelector('[data-main-copy]');
      if (cb) cb.dataset.copy = r.twdAccounting;
    }

    function handleInput() {
      const v = input.value;
      if (clearBtn) clearBtn.classList.toggle('is-visible', v.length > 0);
      render(v);
    }

    input.addEventListener('input', handleInput);
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); render(input.value); }
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        input.value = '';
        clearBtn.classList.remove('is-visible');
        render('');
        input.focus();
      });
    }

    form.querySelectorAll('[data-example]').forEach(c => {
      c.addEventListener('click', () => {
        input.value = c.dataset.example;
        if (clearBtn) clearBtn.classList.add('is-visible');
        render(input.value);
        input.focus();
      });
    });

    /* 複製按鈕（委派處理） */
    document.body.addEventListener('click', async e => {
      const btn = e.target.closest('[data-copy-target]');
      if (!btn) return;
      const sel = btn.dataset.copyTarget;
      let text;
      if (sel === 'main') {
        const cb = document.querySelector('[data-main-copy]');
        text = cb && cb.dataset.copy;
      } else {
        const el = document.querySelector(sel);
        text = el && el.dataset.copy;
      }
      if (!text) return;
      const ok = await copyText(text);
      if (ok) flashCopied(btn);
    });

    if (input.value) handleInput();
  }

  /* ---------- 聯絡表單（純前端示意） ---------- */
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

  /* ---------- 啟動 ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    initFontSize();
    initMenu();
    initTool();
    initContact();
  });
})();
