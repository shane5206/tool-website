/* 阿拉伯數字 → 國字大寫（新台幣）轉換器
   - 支援整數
   - 支援負數
   - 輸出大寫（壹貳參…）、小寫（一二三…）、千分位、英文
*/

const DIGITS_UPPER = ['零', '壹', '貳', '參', '肆', '伍', '陸', '柒', '捌', '玖'];
const DIGITS_LOWER = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
const UNITS_SMALL_UPPER = ['', '拾', '佰', '仟'];
const UNITS_SMALL_LOWER = ['', '十', '百', '千'];
const UNITS_BIG_UPPER = ['', '萬', '億', '兆', '京'];
const UNITS_BIG_LOWER = ['', '萬', '億', '兆', '京'];

function convertGroupGeneric(n, digits, smallUnits) {
  if (n === 0) return '';
  const s = String(n);
  let out = '';
  for (let i = 0; i < s.length; i++) {
    const d = parseInt(s[i], 10);
    const u = smallUnits[s.length - 1 - i];
    if (d === 0) {
      out += '零';
    } else {
      out += digits[d] + u;
    }
  }
  out = out.replace(/零+$/, '');
  out = out.replace(/零+/g, '零');
  return out;
}

function toChineseNumeric(numStr, opts) {
  // numStr: digit-only string (no sign, no decimal), e.g. "1234"
  const upper = opts && opts.upper;
  const digits = upper ? DIGITS_UPPER : DIGITS_LOWER;
  const smallUnits = upper ? UNITS_SMALL_UPPER : UNITS_SMALL_LOWER;
  const bigUnits = upper ? UNITS_BIG_UPPER : UNITS_BIG_LOWER;

  if (!numStr || numStr === '0') return digits[0];

  // Split into groups of 4 from the right
  const groups = [];
  let s = numStr;
  while (s.length > 0) {
    const start = Math.max(0, s.length - 4);
    groups.push(parseInt(s.slice(start) || '0', 10));
    s = s.slice(0, start);
  }

  if (groups.length > bigUnits.length) return null;

  let result = '';
  for (let i = groups.length - 1; i >= 0; i--) {
    const g = groups[i];
    const bu = bigUnits[i];
    if (g === 0) {
      // need a 零 if there is more non-zero below
      let hasMore = false;
      for (let j = i - 1; j >= 0; j--) {
        if (groups[j] !== 0) { hasMore = true; break; }
      }
      if (hasMore && result && !result.endsWith('零')) {
        result += '零';
      }
    } else {
      // gap between groups: if this group < 1000 (leading zero in its 4-digit slot), need 零
      if (result && g < 1000 && !result.endsWith('零')) {
        result += '零';
      }
      result += convertGroupGeneric(g, digits, smallUnits) + bu;
    }
  }
  return result;
}

function formatThousands(numStr) {
  // Insert commas every 3 from right
  return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const EN_ONES = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
                 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
                 'seventeen', 'eighteen', 'nineteen'];
const EN_TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const EN_SCALES = ['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion'];

function enBelow1000(n) {
  if (n === 0) return '';
  if (n < 20) return EN_ONES[n];
  if (n < 100) {
    const t = Math.floor(n / 10);
    const o = n % 10;
    return EN_TENS[t] + (o ? '-' + EN_ONES[o] : '');
  }
  const h = Math.floor(n / 100);
  const rest = n % 100;
  return EN_ONES[h] + ' hundred' + (rest ? ' ' + enBelow1000(rest) : '');
}

function toEnglish(numStr) {
  if (!numStr || numStr === '0') return 'zero';
  // Split into groups of 3 from the right
  const groups = [];
  let s = numStr;
  while (s.length > 0) {
    const start = Math.max(0, s.length - 3);
    groups.push(parseInt(s.slice(start) || '0', 10));
    s = s.slice(0, start);
  }
  if (groups.length > EN_SCALES.length) return null;
  const parts = [];
  for (let i = groups.length - 1; i >= 0; i--) {
    if (groups[i] === 0) continue;
    const chunk = enBelow1000(groups[i]);
    parts.push(chunk + (EN_SCALES[i] ? ' ' + EN_SCALES[i] : ''));
  }
  return parts.join(' ');
}

/* ---------- Public API ---------- */

function parseInput(raw) {
  if (raw == null) return { ok: false, error: '請輸入數字' };
  let s = String(raw).trim();
  if (!s) return { ok: false, error: '請輸入數字' };

  // Strip commas, full-width digits, full-width commas, whitespace
  s = s.replace(/[\s,，]/g, '');
  s = s.replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xFEE0));

  let negative = false;
  if (s.startsWith('-') || s.startsWith('－')) {
    negative = true;
    s = s.slice(1);
  } else if (s.startsWith('+')) {
    s = s.slice(1);
  }

  if (!/^\d+$/.test(s)) {
    return { ok: false, error: '請輸入有效的整數（暫不支援小數）' };
  }

  // Strip leading zeros (but keep one if the value is zero)
  s = s.replace(/^0+/, '') || '0';

  if (s.length > 16) {
    return { ok: false, error: '數字過大，目前支援最多 16 位數' };
  }

  return { ok: true, digits: s, negative };
}

function convertAll(raw) {
  const parsed = parseInput(raw);
  if (!parsed.ok) return { ok: false, error: parsed.error };

  const { digits, negative } = parsed;
  const upperBare = toChineseNumeric(digits, { upper: true });
  const lowerBare = toChineseNumeric(digits, { upper: false });
  const english = toEnglish(digits);

  if (!upperBare || !english) {
    return { ok: false, error: '數字過大，無法轉換' };
  }

  const signTxt = negative ? '負' : '';
  // Standard accounting format for TWD
  const twdAccounting = negative
    ? `新台幣（負）${upperBare}元整`
    : `新台幣${upperBare}元整`;

  return {
    ok: true,
    digits,
    negative,
    twdAccounting,
    upper: signTxt + upperBare,
    lower: (negative ? '負' : '') + lowerBare,
    thousands: (negative ? '-' : '') + formatThousands(digits),
    english: (negative ? 'negative ' : '') + english,
    // 位數說明
    digitCount: digits.length,
  };
}

// Expose
window.TWConverter = { convertAll, parseInput };
