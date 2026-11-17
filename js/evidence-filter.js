(function () {
  const grid = document.getElementById('evGrid');
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll('.ev-card'));
  const counter = document.getElementById('evCount');
  const resetBtn = document.getElementById('evResetBtn');
  const groups = {
    type: Array.from(document.querySelectorAll('input[name="type"]')),
    region: Array.from(document.querySelectorAll('input[name="region"]'))
  };

  // Регіон кожного доказу за alt картинки. Хочеш інакше: змінюй праву частину.
  const REGION_BY_ALT = {
    'Відбиток ноги на землі': 'south-asia',
    'Силует істоти в лісі': 'east-asia',
    'Аудіозапис': 'east-asia',
    'Зразок шерсті': 'antarctica',
    'Сліди на снігу': 'antarctica',
    'Розірваний намет': 'antarctica',
    'Істота в нічному лісі': 'south-america',
    'Пошкоджене дерево': 'north-america',
    'Розмитий силует істоти': 'antarctica'
  };

  cards.forEach(function (card) {
    const img = card.querySelector('img:not(.ev-play)');
    card.dataset.region = (img && REGION_BY_ALT[img.alt.trim()]) || '';
  });

  // повідомлення, коли нічого не знайдено
  const emptyMsg = document.createElement('div');
  emptyMsg.textContent = 'За вибраними фільтрами доказів не знайдено';
  Object.assign(emptyMsg.style, { display: 'none', padding: '40px 0', textAlign: 'center', opacity: '0.7' });
  grid.insertAdjacentElement('afterend', emptyMsg);

  // цифри біля чекбоксів рахуємо з реальних карток
  function setCount(input, n) {
    const el = input.closest('label') && input.closest('label').querySelector('.ev-count');
    if (el) el.textContent = n;
  }
  Object.keys(groups).forEach(function (name) {
    groups[name].forEach(function (input) {
      const n = input.value === 'all'
        ? cards.length
        : cards.filter(function (c) { return c.dataset[name] === input.value; }).length;
      setCount(input, n);
    });
  });

  function selected(name) {
    return groups[name]
      .filter(function (i) { return i.checked && i.value !== 'all'; })
      .map(function (i) { return i.value; });
  }

  function apply() {
    const types = selected('type');
    const regions = selected('region');
    let shown = 0;
    cards.forEach(function (card) {
      const ok = (!types.length || types.includes(card.dataset.type)) &&
                 (!regions.length || regions.includes(card.dataset.region));
      card.style.display = ok ? '' : 'none';
      if (ok) shown++;
    });
    if (counter) counter.textContent = shown;
    emptyMsg.style.display = shown ? 'none' : 'block';
  }

  function onChange(name, changed) {
    const inputs = groups[name];
    const all = inputs.find(function (i) { return i.value === 'all'; });
    if (changed.value === 'all') {
      inputs.forEach(function (i) { i.checked = (i === all); });
    } else {
      all.checked = !inputs.some(function (i) { return i !== all && i.checked; });
    }
    apply();
  }

  Object.keys(groups).forEach(function (name) {
    groups[name].forEach(function (input) {
      input.addEventListener('change', function () { onChange(name, input); });
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      Object.keys(groups).forEach(function (name) {
        groups[name].forEach(function (i) { i.checked = (i.value === 'all'); });
      });
      apply();  
    });
  }

  apply();
})();