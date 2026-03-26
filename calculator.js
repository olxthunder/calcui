/* ============================================
   CalcUI — Calculator Logic
   ============================================ */

const state = {
  current: '0',
  expression: '',
  operator: null,
  operand: null,
  justCalculated: false,
  waitingForOperand: false,
};

// ── DOM refs ──
const resultEl    = document.querySelector('.display__result');
const expressionEl = document.querySelector('.display__expression');
const displayEl   = document.querySelector('.display');
const themeBtn    = document.querySelector('.header__theme-btn');
const themeIcon   = document.querySelector('.header__theme-icon');

// ── SVG icons ──
const ICON_MOON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>';
const ICON_SUN  = '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="3" fill="currentColor"/><path d="M9 1v2M9 15v2M1 9h2M15 9h2M3.22 3.22l1.42 1.42M13.36 13.36l1.42 1.42M3.22 14.78l1.42-1.42M13.36 4.64l1.42-1.42" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';

// ── Theme ──
let isDark = false;

themeBtn.addEventListener('click', () => {
  isDark = !isDark;
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  themeIcon.innerHTML = isDark ? ICON_SUN : ICON_MOON;
});

// ── Render ──
function updateFontSizes() {
  const resultLen = state.current.length;
  resultEl.classList.remove('display__result--md', 'display__result--sm', 'display__result--xs');
  if      (resultLen >= 13) resultEl.classList.add('display__result--xs');
  else if (resultLen >= 10) resultEl.classList.add('display__result--sm');
  else if (resultLen >= 7)  resultEl.classList.add('display__result--md');

  const exprLen = state.expression.length;
  expressionEl.classList.remove('display__expression--sm', 'display__expression--xs');
  if      (exprLen >= 20) expressionEl.classList.add('display__expression--xs');
  else if (exprLen >= 15) expressionEl.classList.add('display__expression--sm');
}

function render() {
  resultEl.textContent = state.current;
  expressionEl.textContent = state.expression;
  displayEl.classList.toggle('display--error', state.current === 'Error');
  if (state.current === 'Error') {
    resultEl.style.fontSize = '36px';
  } else {
    resultEl.style.fontSize = '';
  }
  updateFontSizes();

  // Highlight active operator button
  document.querySelectorAll('.btn--operator').forEach(btn => {
    btn.classList.remove('is-active');
  });
  if (state.operator && !state.justCalculated) {
    const activeBtn = document.querySelector(`[data-op="${state.operator}"]`);
    if (activeBtn) activeBtn.classList.add('is-active');
  }
}

// ── Input handlers ──
function inputDigit(digit) {
  if (state.justCalculated || state.waitingForOperand) {
    state.current = digit;
    state.expression = state.justCalculated ? '' : state.expression;
    state.justCalculated = false;
    state.waitingForOperand = false;
  } else {
    state.current = state.current === '0' ? digit : state.current + digit;
  }
  render();
}

function inputDot() {
  if (state.justCalculated || state.waitingForOperand) {
    state.current = '0.';
    state.justCalculated = false;
    state.waitingForOperand = false;
  } else if (!state.current.includes('.')) {
    state.current += '.';
  }
  render();
}

function inputOperator(op) {
  const val = parseFloat(state.current);

  if (state.operator && !state.justCalculated) {
    const result = calculate(state.operand, val, state.operator);
    state.current = formatResult(result);
    state.operand = result;
    state.expression = `${state.current} ${op}`;
  } else {
    state.operand = val;
    state.expression = `${state.current} ${op}`;
  }

  state.operator = op;
  state.justCalculated = false;
  state.waitingForOperand = true;
  render();
}

function inputEquals() {
  if (!state.operator || state.operand === null) return;

  const val = parseFloat(state.current);
  const result = calculate(state.operand, val, state.operator);

  state.expression = `${state.operand} ${state.operator} ${val} =`;
  state.current = formatResult(result);
  state.operator = null;
  state.operand = null;
  state.justCalculated = true;
  render();
}

function calculate(a, b, op) {
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '×': return a * b;
    case '÷': return b !== 0 ? a / b : 'Error';
    default:  return b;
  }
}

function formatResult(val) {
  if (val === 'Error') return 'Error';
  const str = parseFloat(val.toFixed(10)).toString();
  return str;
}

function inputClear() {
  state.current = '0';
  state.expression = '';
  state.operator = null;
  state.operand = null;
  state.justCalculated = false;
  state.waitingForOperand = false;
  render();
}

function inputBackspace() {
  if (state.justCalculated) { inputClear(); return; }
  state.current = state.current.length > 1
    ? state.current.slice(0, -1)
    : '0';
  render();
}

function inputPercent() {
  const val = parseFloat(state.current);
  state.current = formatResult(val / 100);
  render();
}

// ── Button Grid wiring ──
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const action = btn.dataset.action;
    const value  = btn.dataset.value;

    switch (action) {
      case 'digit':    inputDigit(value);    break;
      case 'dot':      inputDot();           break;
      case 'operator': inputOperator(value); break;
      case 'equals':   inputEquals();        break;
      case 'clear':    inputClear();         break;
      case 'backspace':inputBackspace();     break;
      case 'percent':  inputPercent();       break;
    }
  });
});

// ── Keyboard support ──
document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') inputDigit(e.key);
  else if (e.key === '.') inputDot();
  else if (e.key === '+') inputOperator('+');
  else if (e.key === '-') inputOperator('-');
  else if (e.key === '*') inputOperator('×');
  else if (e.key === '/') { e.preventDefault(); inputOperator('÷'); }
  else if (e.key === 'Enter' || e.key === '=') inputEquals();
  else if (e.key === 'Backspace') inputBackspace();
  else if (e.key === 'Escape') inputClear();
  else if (e.key === '%') inputPercent();
});

// ── Init ──
render();
