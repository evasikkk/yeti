(function () {
  const list = document.querySelector('.exp-list');
  const detail = document.querySelector('.exp-detail');
  if (!list || !detail) return;

  const cards = Array.from(list.querySelectorAll('.exp-card'));
  const $ = function (s) { return detail.querySelector(s); };

  // ТЕКСТИ ДЛЯ 2-ї ТА 3-ї ЕКСПЕДИЦІЇ ТИМЧАСОВІ: заміни на ті, що дасть дизайнерка.
  const DATA = [
    null, // 1-ша (Лангтанг): беремо оригінальну верстку зі сторінки, див. нижче
    {
      photo: 'img/КХУМБУ.png', photoAlt: 'Регіон Кхумбу',
      coords: '27°59\'30.0"N 86°43\'10.0"E', date: 'січень 2026 року', archive: 'АРХІВ № YQ-400',
      title: 'РЕГІОН<br>КХУМБУ', country: 'НЕПАЛ', month: 'СІЧ', year: '2026',
      goal: 'Обстежити маршрут до льодовика та перевірити записи з фотопасток, які встановили місцеві провідники.',
      facts: ['9', '3&nbsp;400-5&nbsp;300', '5', 'Завершено'],
      desc: 'Команда пройшла стежками на висоті понад три тисячі метрів. Провідники розповіли про слід, що повторюється на одному й тому самому схилі, а фотопастка зафіксувала рух за кілька хвилин до світанку.',
      photos: ['img/пейзажик гір.png', 'img/халабутка.png', 'img/ніга ддля експедицій.png'],
      quote: '«Пастка спрацювала тричі за одну ніч. На кадрах лише туман і тінь, яка швидко зникає за скелею.»',
      cite: '— учасник експедиції YQ-400'
    },
    {
      photo: 'img/СИЧУАНСЬКІ ГОРИ.png', photoAlt: 'Сичуанські гори',
      coords: '29°33\'10.0"N 101°52\'40.0"E', date: 'листопад 2025 року', archive: 'АРХІВ № YQ-399',
      title: 'СИЧУАНСЬКІ<br>ГОРИ', country: 'КИТАЙ', month: 'ЛИС', year: '2025',
      goal: 'Перевірити повідомлення місцевих мисливців і зібрати аудіо- та відеозаписи у хвойних лісах.',
      facts: ['14', '2&nbsp;100-4&nbsp;500', '7', 'Завершено'],
      desc: 'Експедиція працювала в густих хвойних лісах на схилах. Мисливці розповідали про високу постать на межі лісу, а встановлені камери зафіксували кілька коротких записів.',
      photos: ['img/халабутка.png', 'img/ніга ддля експедицій.png', 'img/пейзажик гір.png'],
      quote: '«Ми чули, як щось рухалося між деревами, але щоразу, коли світили туди ліхтарем, там було порожньо.»',
      cite: '— учасник експедиції YQ-399'
    }
  ];

  // зберігаємо оригінальну верстку першої експедиції, щоб при поверненні вона була як у макеті
  const snapshot = {
    photoSrc: $('.exp-photo img').getAttribute('src'), photoAlt: $('.exp-photo img').alt,
    coords: $('.exp-coords').innerHTML, archive: $('.exp-archive').textContent,
    title: $('.exp-title').innerHTML, where: $('.exp-where').innerHTML,
    goal: $('.exp-goal').innerHTML, facts: $('.exp-facts').innerHTML,
    desc: $('.exp-desc').innerHTML, photos: $('.exp-photos').innerHTML, quote: $('.exp-quote').innerHTML
  };

  function render(i) {
    if (i === 0) {
      const im = $('.exp-photo img');
      im.setAttribute('src', snapshot.photoSrc); im.alt = snapshot.photoAlt;
      $('.exp-coords').innerHTML = snapshot.coords;
      $('.exp-archive').textContent = snapshot.archive;
      $('.exp-title').innerHTML = snapshot.title;
      $('.exp-where').innerHTML = snapshot.where;
      $('.exp-goal').innerHTML = snapshot.goal;
      $('.exp-facts').innerHTML = snapshot.facts;
      $('.exp-desc').innerHTML = snapshot.desc;
      $('.exp-photos').innerHTML = snapshot.photos;
      $('.exp-quote').innerHTML = snapshot.quote;
      return;
    }
    const e = DATA[i];
    const im = $('.exp-photo img');
    im.setAttribute('src', e.photo); im.alt = e.photoAlt;
    const spans = $('.exp-coords').querySelectorAll('span');
    spans[0].textContent = e.coords; spans[1].textContent = e.date;
    $('.exp-archive').textContent = e.archive;
    $('.exp-title').innerHTML = e.title;
    $('.exp-where').innerHTML = e.country + ' • <span class="hl">' + e.month + ' <span class="num">' + e.year + '</span></span>';
    $('.exp-goal').textContent = e.goal;
    const vals = $('.exp-facts').querySelectorAll('.val');
    e.facts.forEach(function (f, k) { if (vals[k]) vals[k].innerHTML = f; });
    $('.exp-desc').textContent = e.desc;
    $('.exp-photos').innerHTML = e.photos.map(function (src) { return '<img src="' + src + '" alt="Фото з експедиції">'; }).join('');
    $('.exp-quote p').textContent = e.quote;
    $('.exp-quote cite').textContent = e.cite;
  }

  function select(i) {
    cards.forEach(function (c, k) {
      c.classList.toggle('active', k === i);
      if (k === i) c.setAttribute('aria-current', 'true'); else c.removeAttribute('aria-current');
    });
    render(i);
    // у CSS цих блоків стоїть white-space: nowrap (переноси тільки через <br>), тому для наших текстів вмикаємо звичайний перенос
    ['.exp-goal', '.exp-desc', '.exp-quote p'].forEach(function (s) { $(s).style.whiteSpace = (i === 0) ? '' : 'normal'; });
    const toggle = document.getElementById('expListToggle');   // на телефоні закриваємо випадаючий список
    if (toggle) toggle.checked = false;
  }

  cards.forEach(function (card, i) {
    card.addEventListener('click', function (e) {
      e.preventDefault();               // не переходимо за href="#" / expeditions.html
      select(i);
    });
  });

  // ?e=2 у адресі відкриває потрібну експедицію (1, 2 або 3), зручно для посилань з головної
  const n = parseInt(new URLSearchParams(location.search).get('e'), 10);
  if (n >= 1 && n <= cards.length) select(n - 1);
})();