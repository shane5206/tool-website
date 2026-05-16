/* 民國 / 西元 日期轉換 */
(function () {
  const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];
  const CN_DIGITS = ['零','一','二','三','四','五','六','七','八','九'];

  function cnYear(y) {
    return String(y).split('').map((c) => CN_DIGITS[parseInt(c, 10)]).join('');
  }
  function cnNum(n) {
    // 1-31 → 一 / 十 / 十一 / 二十 / 二十一 / 三十 / 三十一
    if (n < 10) return CN_DIGITS[n];
    if (n === 10) return '十';
    if (n < 20) return '十' + CN_DIGITS[n - 10];
    if (n === 20) return '二十';
    if (n < 30) return '二十' + CN_DIGITS[n - 20];
    if (n === 30) return '三十';
    return '三十' + CN_DIGITS[n - 30];
  }

  function validDate(y, m, d) {
    if (!Number.isInteger(y) || !Number.isInteger(m) || !Number.isInteger(d)) return false;
    if (y < 1912 || m < 1 || m > 12 || d < 1 || d > 31) return false;
    const dt = new Date(y, m - 1, d);
    return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
  }

  function daysBetween(a, b) {
    const ms = 24 * 60 * 60 * 1000;
    const aUTC = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const bUTC = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.round((aUTC - bUTC) / ms);
  }

  function init() {
    const root = document.querySelector('[data-tool="date"]');
    if (!root) return;

    const rY = root.querySelector('#r-year');
    const rM = root.querySelector('#r-month');
    const rD = root.querySelector('#r-day');
    const gY = root.querySelector('#g-year');
    const gM = root.querySelector('#g-month');
    const gD = root.querySelector('#g-day');
    const err = root.querySelector('[data-date-error]');

    const resultEl = document.querySelector('[data-date-result]');
    const phEl = document.querySelector('[data-date-placeholder]');
    const mainEl = document.querySelector('[data-date-main]');
    const wEl = document.querySelector('[data-date-weekday]');
    const cEl = document.querySelector('[data-date-chinese]');
    const dEl = document.querySelector('[data-date-diff]');

    let lock = false;

    function showError(msg) {
      err.textContent = msg;
      err.classList.add('is-visible');
      resultEl.style.display = 'none';
      phEl.style.display = '';
    }
    function clearError() {
      err.classList.remove('is-visible');
    }

    function render(gY_, gM_, gD_) {
      const date = new Date(gY_, gM_ - 1, gD_);
      const weekday = WEEKDAYS[date.getDay()];
      const rocY = gY_ - 1911;
      const today = new Date(); today.setHours(0,0,0,0);
      const diff = daysBetween(date, today);

      mainEl.textContent = `民國 ${rocY} 年 ${gM_} 月 ${gD_} 日　/　西元 ${gY_} 年 ${gM_} 月 ${gD_} 日`;
      wEl.textContent = '星期' + weekday;
      cEl.textContent = `中華民國${cnYear(rocY)}年${cnNum(gM_)}月${cnNum(gD_)}日`;
      let diffTxt;
      if (diff === 0) diffTxt = '今天';
      else if (diff > 0) diffTxt = diff + ' 天後';
      else diffTxt = Math.abs(diff) + ' 天前';
      dEl.textContent = diffTxt;

      resultEl.style.display = '';
      phEl.style.display = 'none';
    }

    function fromROC() {
      if (lock) return;
      const y = parseInt(rY.value, 10);
      const m = parseInt(rM.value, 10);
      const d = parseInt(rD.value, 10);
      if (!Number.isInteger(y) || !Number.isInteger(m) || !Number.isInteger(d)) {
        clearError();
        resultEl.style.display = 'none';
        phEl.style.display = '';
        return;
      }
      const gY_ = y + 1911;
      if (!validDate(gY_, m, d)) { showError('日期不合法，請確認年月日。'); return; }
      clearError();
      lock = true;
      gY.value = gY_; gM.value = m; gD.value = d;
      lock = false;
      render(gY_, m, d);
    }

    function fromAD() {
      if (lock) return;
      const y = parseInt(gY.value, 10);
      const m = parseInt(gM.value, 10);
      const d = parseInt(gD.value, 10);
      if (!Number.isInteger(y) || !Number.isInteger(m) || !Number.isInteger(d)) {
        clearError();
        resultEl.style.display = 'none';
        phEl.style.display = '';
        return;
      }
      if (!validDate(y, m, d)) { showError('日期不合法，請確認年月日。'); return; }
      clearError();
      lock = true;
      rY.value = y - 1911; rM.value = m; rD.value = d;
      lock = false;
      render(y, m, d);
    }

    [rY, rM, rD].forEach((el) => el.addEventListener('input', fromROC));
    [gY, gM, gD].forEach((el) => el.addEventListener('input', fromAD));

    // Preset buttons
    function setFromOffset(days) {
      const d = new Date();
      d.setHours(0,0,0,0);
      d.setDate(d.getDate() + days);
      lock = true;
      gY.value = d.getFullYear();
      gM.value = d.getMonth() + 1;
      gD.value = d.getDate();
      lock = false;
      fromAD();
    }
    root.querySelectorAll('[data-preset]').forEach((b) => {
      b.addEventListener('click', () => {
        const v = b.dataset.preset;
        if (v === 'today') setFromOffset(0);
        else setFromOffset(parseInt(v, 10));
      });
    });

    // Initial: today
    setFromOffset(0);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
