/* QR Code 產生器 — 純前端，使用 qrcode 函式庫 */
(function () {

  /* ---- 狀態 ---- */
  let currentMode = 'text'; // 'text' | 'wifi' | 'vcard'
  let debounceTimer = null;

  /* ---- DOM refs (set in init) ---- */
  let canvasBox, emptyMsg, downloadBtn, copyImgBtn;

  /* ---- QR 尺寸對應 ---- */
  const SIZE_MAP = { sm: 160, md: 240, lg: 320 };

  /* ---- 依模式組合 QR 內容字串 ---- */
  function buildContent() {
    if (currentMode === 'text') {
      return document.getElementById('qr-text').value.trim();
    }
    if (currentMode === 'wifi') {
      const ssid = document.getElementById('wifi-ssid').value;
      const pass = document.getElementById('wifi-pass').value;
      const sec  = document.getElementById('wifi-sec').value;
      if (!ssid) return '';
      const escapedSsid = ssid.replace(/[\\;,":]/g, c => '\\' + c);
      const escapedPass = pass.replace(/[\\;,":]/g, c => '\\' + c);
      return `WIFI:T:${sec};S:${escapedSsid};P:${escapedPass};;`;
    }
    if (currentMode === 'vcard') {
      const name  = document.getElementById('vc-name').value.trim();
      const phone = document.getElementById('vc-phone').value.trim();
      const email = document.getElementById('vc-email').value.trim();
      const url   = document.getElementById('vc-url').value.trim();
      const org   = document.getElementById('vc-org').value.trim();
      if (!name && !phone && !email) return '';
      const lines = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        name  ? `FN:${name}` : '',
        org   ? `ORG:${org}` : '',
        phone ? `TEL;TYPE=CELL:${phone}` : '',
        email ? `EMAIL:${email}` : '',
        url   ? `URL:${url}` : '',
        'END:VCARD'
      ].filter(Boolean);
      return lines.join('\n');
    }
    return '';
  }

  /* ---- 產生 QR code ---- */
  function render() {
    const content = buildContent();
    const sizeKey = document.getElementById('qr-size').value;
    const ecLevel = document.getElementById('qr-ec').value;
    const px = SIZE_MAP[sizeKey] || 240;

    // clear box
    canvasBox.innerHTML = '';

    if (!content) {
      canvasBox.appendChild(emptyMsg);
      downloadBtn.disabled = true;
      copyImgBtn.disabled = true;
      return;
    }

    const canvas = document.createElement('canvas');
    canvasBox.appendChild(canvas);

    QRCode.toCanvas(canvas, content, {
      width: px,
      margin: 2,
      errorCorrectionLevel: ecLevel,
      color: { dark: '#1A1410', light: '#ffffff' }
    }, function (err) {
      if (err) {
        canvasBox.innerHTML = '';
        const msg = document.createElement('p');
        msg.style.cssText = 'color:#B91C1C;font-size:.9rem;padding:12px;text-align:center;';
        msg.textContent = '內容過長或包含無法編碼的字元，請縮短後再試。';
        canvasBox.appendChild(msg);
        downloadBtn.disabled = true;
        copyImgBtn.disabled = true;
        return;
      }
      downloadBtn.disabled = false;
      copyImgBtn.disabled = false;
    });
  }

  function debouncedRender() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(render, 180);
  }

  /* ---- 下載 PNG ---- */
  function download() {
    const canvas = canvasBox.querySelector('canvas');
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = 'qrcode.png';
    a.click();
  }

  /* ---- 複製圖片到剪貼簿 ---- */
  async function copyImage() {
    const canvas = canvasBox.querySelector('canvas');
    if (!canvas) return;
    try {
      canvas.toBlob(async blob => {
        try {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          window.AppUtils.flashCopied(copyImgBtn);
        } catch {
          /* fallback: 提示下載 */
          const btn = copyImgBtn;
          const orig = btn.textContent;
          btn.textContent = '請改用下載';
          setTimeout(() => { btn.textContent = orig; }, 1800);
        }
      });
    } catch {
      const orig = copyImgBtn.textContent;
      copyImgBtn.textContent = '請改用下載';
      setTimeout(() => { copyImgBtn.textContent = orig; }, 1800);
    }
  }

  /* ---- 切換 tab ---- */
  function switchTab(mode) {
    currentMode = mode;
    document.querySelectorAll('.tabs__btn').forEach(b => {
      b.classList.toggle('is-active', b.dataset.tab === mode);
    });
    document.querySelectorAll('.tab-panel').forEach(p => {
      p.classList.toggle('is-active', p.dataset.panel === mode);
    });
    render();
  }

  /* ---- init ---- */
  function init() {
    const root = document.querySelector('[data-tool="qr"]');
    if (!root) return;

    canvasBox   = document.getElementById('qr-canvas-box');
    downloadBtn = document.getElementById('qr-download');
    copyImgBtn  = document.getElementById('qr-copy-img');

    emptyMsg = document.createElement('p');
    emptyMsg.className = 'qr-empty';
    emptyMsg.textContent = '輸入內容後\n自動產生 QR Code';
    emptyMsg.style.whiteSpace = 'pre-line';
    canvasBox.appendChild(emptyMsg);

    downloadBtn.disabled = true;
    copyImgBtn.disabled  = true;

    /* tab buttons */
    root.querySelectorAll('.tabs__btn').forEach(btn => {
      btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    /* all inputs → debounced render */
    root.querySelectorAll('input, textarea, select').forEach(el => {
      el.addEventListener('input', debouncedRender);
    });

    /* size / EC level selects */
    document.getElementById('qr-size').addEventListener('change', render);
    document.getElementById('qr-ec').addEventListener('change', render);

    /* buttons */
    downloadBtn.addEventListener('click', download);
    copyImgBtn.addEventListener('click', copyImage);

    /* example chips */
    root.querySelectorAll('[data-example]').forEach(chip => {
      chip.addEventListener('click', () => {
        const tab  = chip.dataset.tab || 'text';
        const val  = chip.dataset.example;
        switchTab(tab);
        const target = document.getElementById('qr-text');
        if (target) { target.value = val; render(); }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', init);
  window.TWQr = { render };
})();
