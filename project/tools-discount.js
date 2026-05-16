/* 折扣 / 毛利率 計算器 */
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
  function fmtPct(n, digits) {
    if (!isFinite(n)) return '—';
    return (Math.round(n * Math.pow(10, digits || 2)) / Math.pow(10, digits || 2)).toFixed(digits || 2) + '%';
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

  function calcDiscount(root) {
    const priceEl = root.querySelector('#d-price');
    const discEl  = root.querySelector('#d-disc');
    const stats   = root.querySelector('[data-discount-stats]');
    const ph      = root.querySelector('[data-discount-placeholder]');

    function render() {
      const price = parseNum(priceEl.value);
      const disc  = parseNum(discEl.value);
      if (!isFinite(price) || !isFinite(disc)) {
        stats.style.display = 'none';
        ph.style.display = '';
        return;
      }
      // 折數 8 = 0.8 倍。允許 0–10 折。
      const factor = disc / 10;
      const finalPrice = price * factor;
      const saved = price - finalPrice;
      const offPct = (1 - factor) * 100;
      const payPct = factor * 100;

      root.querySelector('[data-d-final]').textContent = fmtMoney(finalPrice);
      root.querySelector('[data-d-percent]').textContent = '支付原價的 ' + fmtPct(payPct, 1);
      root.querySelector('[data-d-save]').textContent = fmtMoney(saved);
      root.querySelector('[data-d-off]').textContent = '折扣 ' + fmtPct(offPct, 1);
      root.querySelector('[data-d-rate]').textContent = fmtPct(offPct, 1);

      stats.style.display = '';
      ph.style.display = 'none';
    }
    priceEl.addEventListener('input', render);
    discEl.addEventListener('input', render);
  }

  function calcMargin(root) {
    const costEl  = root.querySelector('#m-cost');
    const priceEl = root.querySelector('#m-price');
    const stats   = root.querySelector('[data-margin-stats]');
    const ph      = root.querySelector('[data-margin-placeholder]');

    function render() {
      const cost  = parseNum(costEl.value);
      const price = parseNum(priceEl.value);
      if (!isFinite(cost) || !isFinite(price) || price === 0 || cost === 0) {
        stats.style.display = 'none';
        ph.style.display = '';
        return;
      }
      const profit = price - cost;
      const margin = (profit / price) * 100;
      const markup = (profit / cost) * 100;

      root.querySelector('[data-m-profit]').textContent = fmtMoney(profit);
      root.querySelector('[data-m-margin]').textContent = fmtPct(margin, 2);
      root.querySelector('[data-m-markup]').textContent = fmtPct(markup, 2);

      stats.style.display = '';
      ph.style.display = 'none';
    }
    costEl.addEventListener('input', render);
    priceEl.addEventListener('input', render);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const root = document.querySelector('[data-tool="discount-margin"]');
    if (!root) return;
    initTabs(root);
    calcDiscount(root);
    calcMargin(root);
  });
})();
