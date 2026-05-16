/* 營業稅 / 發票試算 */
(function () {
  function parseNum(s) {
    if (s == null) return NaN;
    s = String(s).trim().replace(/[,，\s]/g, '').replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xFEE0));
    if (!s) return NaN;
    const n = parseFloat(s);
    return isFinite(n) ? n : NaN;
  }
  function fmtMoney(n) {
    if (!isFinite(n)) return '—';
    const negative = n < 0;
    const abs = Math.abs(n);
    const rounded = Math.round(abs * 100) / 100;
    const [int, frac] = rounded.toFixed(2).split('.');
    const intF = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const tail = frac === '00' ? '' : '.' + frac.replace(/0+$/, '');
    return (negative ? '-' : '') + intF + tail;
  }
  function initTabs(root) {
    const buttons = root.querySelectorAll('[data-tab]');
    const panels = root.querySelectorAll('[data-panel]');
    buttons.forEach((b) => {
      b.addEventListener('click', () => {
        buttons.forEach((x) => x.classList.toggle('is-active', x === b));
        const key = b.dataset.tab;
        panels.forEach((p) => p.classList.toggle('is-active', p.dataset.panel === key));
      });
    });
  }

  function vatAdd(root) {
    const net = root.querySelector('#v-net');
    const rate = root.querySelector('#v-rate-add');
    const stats = root.querySelector('[data-add-stats]');
    const ph = root.querySelector('[data-add-placeholder]');
    function render() {
      const n = parseNum(net.value);
      const r = parseNum(rate.value);
      if (!isFinite(n) || !isFinite(r)) {
        stats.style.display = 'none'; ph.style.display = ''; return;
      }
      const taxRate = r / 100;
      const tax = n * taxRate;
      const gross = n + tax;
      root.querySelector('[data-add-net]').textContent = fmtMoney(n);
      root.querySelector('[data-add-tax]').textContent = fmtMoney(tax);
      root.querySelector('[data-add-tax-sub]').textContent = '未稅 × ' + r + '%';
      root.querySelector('[data-add-gross]').textContent = fmtMoney(gross);
      stats.style.display = ''; ph.style.display = 'none';
    }
    net.addEventListener('input', render);
    rate.addEventListener('input', render);
  }

  function vatIncl(root) {
    const gross = root.querySelector('#v-gross');
    const rate = root.querySelector('#v-rate-incl');
    const stats = root.querySelector('[data-incl-stats]');
    const ph = root.querySelector('[data-incl-placeholder]');
    function render() {
      const g = parseNum(gross.value);
      const r = parseNum(rate.value);
      if (!isFinite(g) || !isFinite(r)) {
        stats.style.display = 'none'; ph.style.display = ''; return;
      }
      const taxRate = r / 100;
      const n = g / (1 + taxRate);
      const tax = g - n;
      root.querySelector('[data-incl-net]').textContent = fmtMoney(n);
      root.querySelector('[data-incl-tax]').textContent = fmtMoney(tax);
      root.querySelector('[data-incl-tax-sub]').textContent = '含稅 × ' + r + '/' + (100 + r);
      root.querySelector('[data-incl-gross]').textContent = fmtMoney(g);
      stats.style.display = ''; ph.style.display = 'none';
    }
    gross.addEventListener('input', render);
    rate.addEventListener('input', render);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const root = document.querySelector('[data-tool="vat"]');
    if (!root) return;
    initTabs(root);
    vatAdd(root);
    vatIncl(root);
  });
})();
