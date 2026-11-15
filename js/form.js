(function () {
  const API_URL = 'https://jsonplaceholder.typicode.com/posts'; // тестовый API: принимает запрос и отвечает «ок»
  const ERROR_COLOR = '#ff5c5c';
  const forms = Array.from(document.querySelectorAll('.join-form'));

  forms.forEach(initForm);

  // при закрытии модалки (крестик или Esc) возвращаем форму в исходный вид
  window.addEventListener('hashchange', function () {
    if (location.hash !== '#joinModal') forms.forEach(function (f) { f._yqReset && f._yqReset(); });
  });

  function initForm(form) {
    const btn = form.querySelector('button');
    if (!btn) return;

    const texts = form.querySelectorAll('input[type="text"]');
    const fields = {
      name: texts[0],
      place: texts[1],
      email: form.querySelector('input[type="email"]'),
      role: form.querySelector('select'),
      about: form.querySelector('textarea')
    };

    // каждое правило возвращает текст ошибки или '' если всё хорошо
    const rules = [
      { el: fields.name,  test: function (v) { return v.trim().length < 2 ? "Вкажіть ім'я" : ''; } },
      { el: fields.place, test: function (v) { return v.trim().length < 2 ? 'Вкажіть країну та місто' : ''; } },
      { el: fields.email, test: function (v) {
          if (!v.trim()) return 'Вкажіть пошту';
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Пошта має містити @ і домен';
        } },
      { el: fields.role,  test: function (v) { return !v ? 'Оберіть напрямок' : ''; } }
    ];

    form.noValidate = true;
    if (getComputedStyle(form).position === 'static') form.style.position = 'relative';

    const btnLabel = btn.textContent;
    let thanksBox = null;

    const mq = window.matchMedia('(max-width: 768px)');
    // ---------- подсказки и красные рамки ----------
    function showError(rule, msg) {
      if (!rule.hint) {
        rule.hint = document.createElement('div');
        rule.hint.style.color = ERROR_COLOR;
        rule.hint.style.fontSize = '11px';
        rule.hint.style.lineHeight = '1.2';
      }
      rule.hint.textContent = msg;
      rule.hint.style.display = 'block';
      placeHint(rule);
      rule.el.style.borderColor = ERROR_COLOR;
      rule.el.style.boxShadow = '0 0 0 1px ' + ERROR_COLOR;
    }

    function clearError(rule) {
      if (rule.hint) rule.hint.style.display = 'none';
      rule.el.style.borderColor = '';
      rule.el.style.boxShadow = '';
    }

    function placeHint(rule) {
      const h = rule.hint;
      if (mq.matches) {
        // телефон: подсказка в потоке, сразу под полем
        Object.assign(h.style, { position: 'static', margin: '4px 0 6px', maxWidth: '', pointerEvents: '' });
        if (h.previousElementSibling !== rule.el) rule.el.insertAdjacentElement('afterend', h);
      } else {
        // десктоп: подсказка «парит» под полем и ничего не сдвигает
        if (h.parentNode !== form) form.appendChild(h);
        const f = form.getBoundingClientRect();
        const r = rule.el.getBoundingClientRect();
        Object.assign(h.style, {
          position: 'absolute', margin: '0', pointerEvents: 'none', zIndex: '2',
          left: (r.left - f.left) + 'px',
          top: (r.bottom - f.top + 2) + 'px',
          maxWidth: Math.max(r.width, 140) + 'px'
        });
      }
    }

    rules.forEach(function (rule) {
      rule.el.addEventListener('input', function () { clearError(rule); });
      rule.el.addEventListener('change', function () { clearError(rule); });
    });
    window.addEventListener('resize', function () {
      rules.forEach(function (rule) {
        if (rule.hint && rule.hint.style.display === 'block') placeHint(rule);
      });
    });

    // ---------- кнопка ----------
    function setBusy(busy) {
      btn.disabled = busy;
      btn.textContent = busy ? 'Відправка...' : btnLabel;
      btn.style.opacity = busy ? '0.6' : '';
      btn.style.cursor = busy ? 'not-allowed' : '';
    }

    // ---------- отправка ----------
    async function onSubmit(e) {
      e.preventDefault();
      if (btn.disabled) return; // защита от повторных кликов

      let firstBad = null;
      rules.forEach(function (rule) {
        const msg = rule.test(rule.el.value);
        if (msg) { showError(rule, msg); if (!firstBad) firstBad = rule.el; }
        else clearError(rule);
      });
      if (firstBad) { firstBad.focus(); return; }

      setBusy(true);
      try {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: fields.name.value.trim(),
            place: fields.place.value.trim(),
            email: fields.email.value.trim(),
            role: fields.role.value,
            about: fields.about ? fields.about.value.trim() : ''
          })
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        showThanks();
      } catch (err) {
        setBusy(false);
        btn.textContent = 'Помилка. Спробуйте ще раз';
        setTimeout(function () { if (!btn.disabled) btn.textContent = btnLabel; }, 3000);
      }
    }

    function showThanks() {
      const closeEl = form.closest('.modal-content, .modal-overlay');
      const xEl = closeEl && closeEl.querySelector('.modal-close');
      const accent = xEl ? getComputedStyle(xEl).color : '#a8ff1a'; // зелёный как у крестика
      thanksBox = document.createElement('div');
      thanksBox.textContent = 'Дякуємо, ваша заявка прийнята!';
      Object.assign(thanksBox.style, {
        textAlign: 'center', padding: '40px 16px', fontSize: '18px', color: accent
      });
      form.style.display = 'none';
      form.insertAdjacentElement('beforebegin', thanksBox);
    }

    form._yqReset = function () {
      if (thanksBox) { thanksBox.remove(); thanksBox = null; }
      form.style.display = '';
      form.reset();
      rules.forEach(clearError);
      setBusy(false);
    };

    btn.addEventListener('click', onSubmit);
    form.addEventListener('submit', onSubmit);
  }
})();