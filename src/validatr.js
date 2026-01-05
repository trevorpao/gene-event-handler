// Lightweight form validator (ES module, jQuery-free)
// Provides validateField/validateForm APIs and optional DOM event wiring.

'use strict';

const defaultMessages = {
  required: 'This field is required.',
  email: 'Please enter a valid email address.',
  url: 'Please enter a valid URL.',
  number: 'Please enter a valid number.',
  pattern: 'Please match the requested format.',
  min: min => `Please enter a value greater than or equal to ${min}.`,
  max: max => `Please enter a value less than or equal to ${max}.`,
  minlength: len => `Please enter at least ${len} characters.`,
  maxlength: len => `Please enter no more than ${len} characters.`
};

// Registry for user-defined rules; each entry is (name, fn)
// where fn(field, options) => { valid: boolean, message: string }
const customRules = new Map();

const defaultOptions = {
  showFieldErrors: true,
  errorTemplate: '<div class="validatr-err">{{message}}</div>',
  errorClass: 'validatr-err'
};

export function addRule(name, fn) {
  if (!name || typeof name !== 'string') throw new Error('Rule name must be a non-empty string');
  if (typeof fn !== 'function') throw new Error('Rule callback must be a function');
  customRules.set(name, fn);
}

function isEmpty(value) {
  return value === null || value === undefined || `${value}`.trim() === '';
}

function parseNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function isRadioGroupChecked(field) {
  if (!field || !field.name) return !!field && field.checked;
  const fromForm = field.form ? field.form.querySelectorAll(`input[type="radio"][name="${field.name}"]`) : null;
  const candidates = fromForm || document.getElementsByName(field.name);
  return Array.from(candidates || []).some(el => el.type === 'radio' && el.checked);
}

function runRule(field, name, test, message) {
  const ok = test();
  if (ok) return null;
  const msg = typeof message === 'function' ? message() : message;
  return { field, rule: name, message: msg };
}

function clearError(field, options = {}) {
  const cls = options.errorClass || defaultOptions.errorClass;
  if (!field) return;
  let next = field.nextElementSibling;
  while (next && next.classList && next.classList.contains(cls)) {
    const toRemove = next;
    next = next.nextElementSibling;
    toRemove.remove();
  }
}

function renderError(field, message, options = {}) {
  if (!field || !field.parentNode) return;
  clearError(field, options);
  const tmpl = options.errorTemplate || defaultOptions.errorTemplate;
  const cls = options.errorClass || defaultOptions.errorClass;
  const wrapper = document.createElement('div');
  wrapper.innerHTML = tmpl.replace(/{{\s*message\s*}}/g, message);
  let errEl = wrapper.firstElementChild;
  if (!errEl) {
    errEl = document.createElement('div');
    errEl.className = cls;
    errEl.textContent = message;
  } else if (!errEl.classList.contains(cls)) {
    errEl.classList.add(cls);
  }

  field.insertAdjacentElement('afterend', errEl);
}

function validateField(field, options = {}) {
  const { messages = defaultMessages, onFieldValidate } = options;
  const value = field.value || '';
  const tag = (field.tagName || '').toLowerCase();
  const typeAttr = (field.getAttribute('type') || '').toLowerCase();
  const type = tag === 'select' ? 'select' : typeAttr;
  const errs = [];
  const customError = field.getAttribute('data-error');

  const msgWrap = base => {
    if (!customError) return base;
    // 若有自訂錯誤訊息，一律優先使用；函式型訊息也以自訂訊息覆蓋
    return typeof base === 'function' ? customError : customError;
  };

  const pushErr = err => {
    if (err) errs.push(err);
  };

  const isChoice = type === 'checkbox' || type === 'radio';
  const isSelect = tag === 'select';

  if (field.hasAttribute('required')) {
    if (type === 'checkbox') {
      pushErr(runRule(field, 'required', () => field.checked, msgWrap(messages.required)));
    } else if (type === 'radio') {
      pushErr(runRule(field, 'required', () => isRadioGroupChecked(field), msgWrap(messages.required)));
    } else if (isSelect) {
      pushErr(runRule(field, 'required', () => !isEmpty(value), msgWrap(messages.required)));
    } else {
      pushErr(runRule(field, 'required', () => !isEmpty(value), msgWrap(messages.required)));
    }
  }

  if (!isEmpty(value) && !isChoice && !isSelect) {
    if (type === 'email') {
      const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
      pushErr(runRule(field, 'email', () => re.test(value), msgWrap(messages.email)));
    }

    if (type === 'url') {
      const re = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w-./?%&=]*)?$/i;
      pushErr(runRule(field, 'url', () => re.test(value), msgWrap(messages.url)));
    }

    if (type === 'number') {
      const n = parseNumber(value);
      pushErr(runRule(field, 'number', () => n !== null, msgWrap(messages.number)));
      const minAttr = field.getAttribute('min');
      if (minAttr !== null) {
        const min = parseNumber(minAttr);
        if (min !== null) pushErr(runRule(field, 'min', () => n >= min, () => msgWrap(messages.min(min))));
      }
      const maxAttr = field.getAttribute('max');
      if (maxAttr !== null) {
        const max = parseNumber(maxAttr);
        if (max !== null) pushErr(runRule(field, 'max', () => n <= max, () => msgWrap(messages.max(max))));
      }
    }

    const pattern = field.getAttribute('pattern');
    if (pattern) {
      const re = new RegExp(pattern);
      pushErr(runRule(field, 'pattern', () => re.test(value), msgWrap(messages.pattern)));
    }

    const minlength = parseInt(field.getAttribute('minlength'), 10);
    if (Number.isInteger(minlength)) {
      pushErr(runRule(field, 'minlength', () => value.length >= minlength, () => msgWrap(messages.minlength(minlength))));
    }

    const maxlength = parseInt(field.getAttribute('maxlength'), 10);
    if (Number.isInteger(maxlength)) {
      pushErr(runRule(field, 'maxlength', () => value.length <= maxlength, () => msgWrap(messages.maxlength(maxlength))));
    }
  }

  // Custom rules registered via addRule and opted-in with data-{name}
  customRules.forEach((fn, name) => {
    if (!field.hasAttribute(`data-${name}`)) return;
    const res = fn(field, options) || {};
    if (res.valid) return;
    const message = res.message !== undefined ? res.message : messages[name] || 'Invalid value.';
    pushErr({ field, rule: name, message: msgWrap(message) });
  });

  const result = { valid: errs.length === 0, errors: errs, field };
  if (options.showFieldErrors !== false) {
    if (result.valid) {
      clearError(field, options);
    } else if (errs.length) {
      renderError(field, errs[0].message, options);
    }
  }
  if (typeof onFieldValidate === 'function') onFieldValidate(result);
  return result;
}

function validateForm(form, options = {}) {
  const fields = Array.from(form.querySelectorAll('input, textarea, select'));
  const errors = [];

  fields.forEach(field => {
    const res = validateField(field, options);
    if (!res.valid) errors.push(...res.errors);
  });

  const result = { valid: errors.length === 0, errors };

  if (!result.valid && options.showAlert !== false) {
    const first = errors[0];
    const msg = first && first.message ? first.message : '請填寫必填欄位';
  }

  if (typeof options.onValidate === 'function') options.onValidate(result);
  return result.valid;
}

function attach(form, options = {}) {
  const handler = evt => {
    const res = validateField(evt.target, options);
    if (!res.valid && options.preventInvalid !== false) {
      evt.preventDefault();
      evt.stopPropagation();
    }
  };

  form.addEventListener('blur', handler, true);
  form.addEventListener('change', handler, true);
  form.addEventListener('input', handler, true);

  return () => {
    form.removeEventListener('blur', handler, true);
    form.removeEventListener('change', handler, true);
    form.removeEventListener('input', handler, true);
  };
}

const validatr = { validateField, validateForm, attach };
validatr.addRule = addRule;

// Provide legacy-compatible globals if available.
if (typeof window !== 'undefined') {
  window.validatr = validatr;
  if (window.$ && window.$.fn) {
    window.$.validatr = validatr; // basic compatibility shim
  }
}

export default validatr;
