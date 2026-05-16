/* ============================================================
   App-level scripts: header, font size toggle, copy buttons,
   tool wiring (on pages that have the tool).
   ============================================================ */

(function () {
  /* ---------- Font size toggle (shared) ---------- */
  const FS_KEY = 'tw_fs';
  const FS_SIZES = { sm: '15px', md: '16px', lg: '18px', xl: '20px' };

  function applyFontSize(key) {
    const px = FS_SIZES[key] || FS_SIZES.md;
    document.documentElement.style.setProperty('--fs-base', px);
    document.querySelectorAll('.fs-toggle button').forEach((b) => {
      b.classList.toggle('is-active', b.dataset.fs === key);
    });
  }
  function setFontSize(key) {
    try { localStorage.setItem(FS_KEY, key); } catch (e) {}
    applyFontSize(key);
    // also propagate to tweaks
    window.parent && window.parent.postMessage({
      type: '__edit_mode_set_keys',
      edits: { fontSize: key },
    }, '*');
  }

  function initFontSize() {
    let saved;
    try { saved = localStorage.getItem(FS_KEY); } catch (e) {}
    saved = saved || (window.TWEAK_DEFAULTS && window.TWEAK_DEFAULTS.fontSize) || 'md';
    applyFontSize(saved);
    document.querySelectorAll('.fs-toggle button').forEach((b) => {
      b.addEventListener('click', () => setFontSize(b.dataset.fs));
    });
  }

  /* ---------- Mobile menu ---------- */
  function initMenu() {
    const btn = document.querySelector('.menu-btn');
    const nav = document.querySelector('.nav');
    if (!btn || !nav) return;
    btn.addEventListener('click', () => nav.classList.toggle('is-open'));
    document.addEventListener('click', (e) => {
      if (!btn.contains(e.target) && !nav.contains(e.target)) nav.classList.remove('is-open');
    });
  }

  /* ---------- Copy helper ---------- */
  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); document.body.removeChild(ta); return true; }
      catch (err) { document.body.removeChild(ta); return false; }
    }
  }

  function flashCopied(btn, original) {
    const label = btn.dataset.labelCopied || '已複製';
    const oldHTML = btn.innerHTML;
    btn.classList.add('is-copied');
    if (!btn.classList.contains('alt-row__copy')) {
      btn.innerHTML = label;
    }
    setTimeout(() => {
      btn.classList.remove('is-copied');
      btn.innerHTML = oldHTML;
    }, 1400);
  }

  /* ---------- Tool wiring (homepage) ---------- */
  function initTool() {
    const form = document.querySelector('[data-tool="convert"]');
    if (!form) return;

    const input = form.querySelector('.num-input');
    const clearBtn = form.querySelector('.clear-btn');
    const errEl = document.querySelector('.tool__error');
    const placeholderEl = document.querySelector('[data-placeholder-state]');
    const mainEl = document.querySelector('[data-result-main]');
    const valueEl = document.querySelector('[data-result-value]');
    const metaEl = document.querySelector('[data-result-meta]');
    const altGrid = document.querySelector('[data-result-alt]');

    const altSlots = {
      upper: document.querySelector('[data-alt="upper"]'),
      lower: document.querySelector('[data-alt="lower"]'),
      thousands: document.querySelector('[data-alt="thousands"]'),
      english: document.querySelector('[data-alt="english"]'),
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
      // returns 萬/億/兆 marker explanation
      if (n <= 4) return '個位 ~ 千位';
      if (n <= 8) return '含「萬」位';
      if (n <= 12) return '含「億」位';
      return '含「兆」位';
    }

    function render(raw) {
      const r = window.TWConverter.convertAll(raw);
      if (!r.ok) {
        if (!raw || !String(raw).trim()) {
          // empty: reset to placeholder
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
      metaEl.textContent = `共 ${r.digitCount} 位數 · ${digitGroupingLabel(r.digitCount)}`;

      altSlots.upper.querySelector('.alt-row__value').textContent = r.upper;
      altSlots.upper.dataset.copy = r.upper;

      altSlots.lower.querySelector('.alt-row__value').textContent = r.lower;
      altSlots.lower.dataset.copy = r.lower;

      altSlots.thousands.querySelector('.alt-row__value').textContent = r.thousands;
      altSlots.thousands.dataset.copy = r.thousands;

      altSlots.english.querySelector('.alt-row__value').textContent = r.english;
      altSlots.english.dataset.copy = r.english;

      // also stash main copy text on the copy button
      const cb = document.querySelector('[data-main-copy]');
      cb.dataset.copy = r.twdAccounting;
    }

    function handleInput() {
      const v = input.value;
      clearBtn.classList.toggle('is-visible', v.length > 0);
      render(v);
    }

    input.addEventListener('input', handleInput);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); render(input.value); }
    });

    clearBtn.addEventListener('click', () => {
      input.value = '';
      clearBtn.classList.remove('is-visible');
      render('');
      input.focus();
    });

    form.querySelectorAll('[data-example]').forEach((c) => {
      c.addEventListener('click', () => {
        input.value = c.dataset.example;
        clearBtn.classList.add('is-visible');
        render(input.value);
        input.focus();
      });
    });

    // delegated copy clicks
    document.body.addEventListener('click', async (e) => {
      const btn = e.target.closest('[data-copy-target]');
      if (!btn) return;
      const sel = btn.dataset.copyTarget;
      let text;
      if (sel === 'main') {
        text = document.querySelector('[data-main-copy]').dataset.copy;
      } else {
        const el = document.querySelector(sel);
        text = el && el.dataset.copy;
      }
      if (!text) return;
      const ok = await copyText(text);
      if (ok) flashCopied(btn);
    });

    // initial state
    if (input.value) handleInput();
  }

  /* ---------- Contact form (fake) ---------- */
  function initContact() {
    const form = document.querySelector('.contact-form');
    if (!form) return;
    const success = form.querySelector('.form-success');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      success.classList.add('is-visible');
      form.querySelectorAll('input, textarea, select').forEach((el) => {
        if (el.type !== 'submit') el.value = '';
      });
      setTimeout(() => success.classList.remove('is-visible'), 4000);
    });
  }

  /* ---------- Tweaks (font size only) ---------- */
  function initTweaks() {
    window.TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
      "fontSize": "md"
    }/*EDITMODE-END*/;

    let panel = null;
    function ensurePanel() {
      if (panel) return panel;
      panel = document.createElement('div');
      panel.id = 'tweaks-panel';
      panel.innerHTML = `
        <div class="tweaks__head">
          <strong>Tweaks</strong>
          <button class="tweaks__close" aria-label="關閉">×</button>
        </div>
        <div class="tweaks__row">
          <div class="tweaks__label">字體大小</div>
          <div class="fs-toggle" data-tweak-fs>
            <button data-fs="sm">小</button>
            <button data-fs="md">標準</button>
            <button data-fs="lg">大</button>
            <button data-fs="xl">特大</button>
          </div>
        </div>
        <p class="tweaks__hint">提示：標題列也有相同切換鈕。</p>
      `;
      const style = document.createElement('style');
      style.textContent = `
        #tweaks-panel {
          position: fixed; bottom: 20px; right: 20px; z-index: 9999;
          background: #fff; border: 1px solid var(--border-strong);
          border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,.12);
          padding: 14px 16px 12px; min-width: 240px; font-family: 'Noto Serif TC', serif;
        }
        #tweaks-panel .tweaks__head {
          display:flex; align-items:center; justify-content:space-between;
          margin-bottom: 10px; font-size: .95rem; color: var(--ink-900);
        }
        #tweaks-panel .tweaks__close {
          background: transparent; border: 0; font-size: 18px; cursor: pointer; color: var(--ink-500);
        }
        #tweaks-panel .tweaks__label { font-size: .85rem; color: var(--ink-500); margin-bottom: 6px; }
        #tweaks-panel .tweaks__hint { color: var(--ink-400); font-size: .75rem; margin: 10px 0 0; }
      `;
      document.head.appendChild(style);
      document.body.appendChild(panel);

      panel.querySelector('.tweaks__close').addEventListener('click', () => {
        panel.style.display = 'none';
        try { window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*'); } catch (e) {}
      });
      panel.querySelectorAll('[data-tweak-fs] button').forEach((b) => {
        b.addEventListener('click', () => setFontSize(b.dataset.fs));
      });
      return panel;
    }

    window.addEventListener('message', (e) => {
      const t = e.data && e.data.type;
      if (t === '__activate_edit_mode') {
        const p = ensurePanel();
        p.style.display = '';
        // sync active state
        const saved = (function(){ try { return localStorage.getItem(FS_KEY); } catch(e){ return null; } })() || 'md';
        p.querySelectorAll('[data-tweak-fs] button').forEach((b) => {
          b.classList.toggle('is-active', b.dataset.fs === saved);
        });
      } else if (t === '__deactivate_edit_mode') {
        if (panel) panel.style.display = 'none';
      }
    });

    try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch (e) {}
  }

  /* ---------- Boot ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    initFontSize();
    initMenu();
    initTool();
    initContact();
    initTweaks();
  });
})();
