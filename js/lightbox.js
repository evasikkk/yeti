(function () {
  const grid = document.getElementById('evGrid');
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll('.ev-card'));
  const TYPE_LABEL = { photo: 'Фотографія', video: 'Відео', audio: 'Аудіозапис', testimony: 'Свідчення' };

  // Інформація про кожен доказ (ключ = alt картинки). Тексти можна змінювати.
  const DATA = {
    'Відбиток ноги на землі': {
      title: 'СЛІД У ДОЛИНІ ЛАНГТАНГ', date: '14 ЛЮТОГО 2026', place: 'Долина Лангтанг, Непал',
      coords: '28°12\'51.8"N 85°42\'22.0"E',
      text: 'Слід виявили на світанку неподалік від базового табору. Незвичний розмір і форма відбитка не збігаються зі слідами відомих тварин регіону. Поруч інших слідів не знайдено.'
    },
    'Силует істоти в лісі': {
      title: 'ЗАПИС З ФОТОПАСТКИ', date: '12 ЛИСТОПАДА 2025', place: 'Сичуанські гори, Китай',
      coords: '29°33\'10.0"N 101°52\'40.0"E',
      text: 'Камера зафіксувала високу постать на краю лісу. Запис триває чотирнадцять секунд, розрізнити деталі неможливо.'
    },
    'Аудіозапис': {
      title: 'АУДІОЗАПИС', date: '8 СІЧНЯ 2025', place: 'Східні Гімалаї, Тибет',
      coords: '29°39\'05.0"N 94°21\'30.0"E',
      text: 'Низький протяжний звук, записаний увечері біля перевалу. Частота не збігається з голосами тварин, відомих у цьому регіоні.'
    },
    'Зразок шерсті': {
      title: 'ЗРАЗОК ШЕРСТІ', date: '3 БЕРЕЗНЯ 2025', place: 'Земля Королеви Мод, Антарктида',
      coords: '72°01\'20.0"S 12°45\'10.0"E',
      text: 'Пучок грубої сірої шерсті знайдено серед уламків каміння. Довжина волосин перевищує звичайну для відомих тварин регіону.'
    },
    'Сліди на снігу': {
      title: 'ЛАНЦЮЖОК СЛІДІВ', date: '19 КВІТНЯ 2025', place: 'Берег моря Росса, Антарктида',
      coords: '77°50\'30.0"S 166°40\'20.0"E',
      text: 'Ланцюжок слідів тягнеться на кілька сотень метрів і обривається біля скелі. Глибина відбитків вказує на велику вагу.'
    },
    'Розірваний намет': {
      title: 'РОЗІРВАНИЙ НАМЕТ', date: '27 ЛИПНЯ 2025', place: 'Гори Елсворт, Антарктида',
      coords: '78°35\'00.0"S 85°50\'00.0"W',
      text: 'Намет залишили на ніч без людей. Зранку тканина була розірвана зсередини назовні, а запаси їжі лишилися на місці.'
    },
    'Істота в нічному лісі': {
      title: 'НІЧНЕ СПОСТЕРЕЖЕННЯ', date: '5 ЖОВТНЯ 2025', place: 'Амазонія, Бразилія',
      coords: '3°07\'40.0"S 60°01\'30.0"W',
      text: 'Нічна камера зафіксувала високу постать між деревами. Запис коротший за десять секунд.'
    },
    'Пошкоджене дерево': {
      title: 'ПОШКОДЖЕНЕ ДЕРЕВО', date: '22 ВЕРЕСНЯ 2025', place: 'Британська Колумбія, Канада',
      coords: '49°44\'50.0"N 123°07\'20.0"W',
      text: 'На стовбурі глибокі борозни на висоті понад два метри. Сліди розташовані значно вище, ніж дістає ведмідь.'
    },
    'Розмитий силует істоти': {
      title: 'РОЗМИТИЙ СИЛУЕТ', date: '14 ЛЮТОГО 2025', place: 'Острів Росса, Антарктида',
      coords: '77°31\'00.0"S 167°10\'00.0"E',
      text: 'Знімок зроблено з відстані близько ста метрів. Контури розмиті через сніг, але зріст перевищує два метри.'
    }
  };

  // ---------- стилі (додаємо з JS, щоб не чіпати style.css) ----------
  const style = document.createElement('style');
  style.textContent =
    '.yq-lb{position:fixed;inset:0;z-index:9999;display:none;align-items:center;justify-content:center;padding:4vh 4vw;' +
    'background:rgba(0,0,0,.55);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);font-family:var(--font-body,monospace)}' +
    '.yq-lb.yq-open{display:flex}' +
    '.yq-lb-box{position:relative;width:min(75vw,820px);max-height:85vh;overflow:auto;box-sizing:border-box;background:#0a0a0a;' +
    'border:1px solid var(--clr-accent,#9ef01a);padding:16px;color:#d8d8d8}' +
    '.yq-lb-img{display:block;max-width:100%;max-height:58vh;margin:0 auto;object-fit:contain}' +
    '.yq-lb-title{margin:14px 0 4px;color:var(--clr-accent,#9ef01a);font-size:16px;letter-spacing:.08em}' +
    '.yq-lb-meta{margin:0 0 8px;font-size:12px;opacity:.75}' +
    '.yq-lb-text{margin:0;font-size:13px;line-height:1.5}' +
    '.yq-lb-close{position:absolute;top:8px;right:12px;background:none;border:0;color:var(--clr-accent,#9ef01a);font:700 22px/1 var(--font-body,monospace);cursor:pointer}' +
    '.yq-lb-nav{position:absolute;top:30%;background:rgba(0,0,0,.6);border:1px solid var(--clr-accent,#9ef01a);color:var(--clr-accent,#9ef01a);' +
    'width:36px;height:36px;font-size:18px;cursor:pointer}' +
    '.yq-lb-prev{left:8px}.yq-lb-next{right:8px}' +
    '@media (max-width:768px){.yq-lb-box{width:92vw}.yq-lb-img{max-height:45vh}}';
  document.head.appendChild(style);

  // ---------- розмітка вікна ----------
  const lb = document.createElement('div');
  lb.className = 'yq-lb';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.innerHTML =
    '<div class="yq-lb-box">' +
      '<button type="button" class="yq-lb-close" aria-label="Закрити">×</button>' +
      '<button type="button" class="yq-lb-nav yq-lb-prev" aria-label="Попередній">&larr;</button>' +
      '<button type="button" class="yq-lb-nav yq-lb-next" aria-label="Наступний">&rarr;</button>' +
      '<img class="yq-lb-img" alt="">' +
      '<h3 class="yq-lb-title"></h3>' +
      '<p class="yq-lb-meta"></p>' +
      '<p class="yq-lb-text"></p>' +
    '</div>';
  document.body.appendChild(lb);

  const el = {
    img: lb.querySelector('.yq-lb-img'),
    title: lb.querySelector('.yq-lb-title'),
    meta: lb.querySelector('.yq-lb-meta'),
    text: lb.querySelector('.yq-lb-text'),
    close: lb.querySelector('.yq-lb-close'),
    prev: lb.querySelector('.yq-lb-prev'),
    next: lb.querySelector('.yq-lb-next')
  };

  let current = null;     // відкрита картка
  let lastFocus = null;

  function infoFor(card) {
    const img = card.querySelector('img:not(.ev-play)');
    const alt = img ? img.alt.trim() : '';
    const d = DATA[alt] || { title: alt.toUpperCase(), date: '', place: '', coords: '', text: '' };
    return { img: img, d: d, type: TYPE_LABEL[card.dataset.type] || '' };
  }

  function visibleCards() {
    return cards.filter(function (c) { return c.style.display !== 'none'; });
  }

    // у CSS тексту панелі стоїть white-space: nowrap, тому рядки переносимо самі (<br>)
  function setWrapped(node, text, max) {
    if (!node) return;
    const words = text.split(' ');
    const lines = [];
    let line = '';
    words.forEach(function (w) {
      if (line && (line + ' ' + w).length > max) { lines.push(line); line = w; }
      else line = line ? line + ' ' + w : w;
    });
    if (line) lines.push(line);
    node.textContent = '';
    lines.forEach(function (l, i) {
      if (i) node.appendChild(document.createElement('br'));
      node.appendChild(document.createTextNode(l));
    });
  }

  // ---------- права панель з деталями (десктоп) ----------
  function fillPanel(info) {
    const q = function (s) { return document.querySelector(s); };
    const set = function (s, v) { const n = q(s); if (n) n.textContent = v; };
    set('.ev-detail-title', info.d.title);
    set('.ev-detail-date', info.d.date);
    set('.ev-detail-place', info.d.place);
    setWrapped(q('.ev-detail-text'), info.d.text, 46);
    const meta = document.querySelectorAll('.ev-detail-meta li');
    if (meta[0]) meta[0].innerHTML = '<span class="label">Тип:</span> ' + info.type;
    if (meta[2]) meta[2].innerHTML = '<span class="label">Координати:</span> ' + info.d.coords;
    const big = q('.ev-detail-img');
    if (big && info.img) { big.src = info.img.getAttribute('src'); big.alt = info.d.title; }
  }

  // ---------- відкриття / закриття ----------
  function show(card) {
    const info = infoFor(card);
    current = card;
    el.img.src = info.img ? info.img.getAttribute('src') : '';
    el.img.alt = info.d.title;
    el.title.textContent = info.d.title;
    el.meta.textContent = [info.d.date, info.d.place, info.type].filter(Boolean).join(' • ');
    el.text.textContent = info.d.text;
    const many = visibleCards().length > 1;
    el.prev.style.display = el.next.style.display = many ? '' : 'none';
    fillPanel(info);
  }

  function open(card) {
    lastFocus = card;
    show(card);
    lb.classList.add('yq-open');
    if (window.yqLock) window.yqLock.lock(); else document.body.style.overflow = 'hidden';
    el.close.focus();
  }

  function close() {
    if (!lb.classList.contains('yq-open')) return;
    lb.classList.remove('yq-open');
    if (window.yqLock) window.yqLock.unlock(); else document.body.style.overflow = '';
    current = null;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function step(dir) {
    const list = visibleCards();
    if (!current || list.length < 2) return;
    const i = list.indexOf(current);
    show(list[(i + dir + list.length) % list.length]);
  }

  // ---------- події ----------
  grid.addEventListener('click', function (e) {
    const card = e.target.closest('.ev-card');
    if (!card) return;
    e.preventDefault();               // перша картка — посилання #evDetail, не переходимо
    open(card);
  });

  lb.addEventListener('click', function (e) { if (e.target === lb) close(); }); // клік по темному тлу
  el.close.addEventListener('click', close);
  el.prev.addEventListener('click', function () { step(-1); });
  el.next.addEventListener('click', function () { step(1); });

  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('yq-open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'ArrowRight') step(1);
  });
})();