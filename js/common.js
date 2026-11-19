(function () {
  const MODALS = ['#joinModal', '#mapModal'];
  const BURGER = '.burger-checkbox, .menu-toggle';
  let locked = false;

  function lock() {
    if (locked) return;
    const sb = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    if (sb > 0) document.body.style.paddingRight = sb + 'px'; // чтобы вёрстка не прыгала
    locked = true;
  }

  function unlock() {
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    locked = false;
  }

  function sync() {
    const modalOpen = MODALS.includes(location.hash);
    const burgerOpen = !!document.querySelector('.burger-checkbox:checked, .menu-toggle:checked');
    (modalOpen || burgerOpen) ? lock() : unlock();
  }

  window.yqLock = { lock, unlock, sync }; // пригодится в lightbox.js

  window.addEventListener('hashchange', sync);
  document.addEventListener('change', function (e) {
    if (e.target.matches(BURGER)) sync();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.burger-checkbox:checked, .menu-toggle:checked')
      .forEach(function (c) { c.checked = false; });
    if (MODALS.includes(location.hash)) {
      const y = window.scrollY;
      location.hash = '';       // закрывает модалку (:target)
      window.scrollTo(0, y);    // без прыжка наверх
    }
    sync();
  });

  sync();
})();

// Виправлення модалки карти (перебиває загальне .modal-content)
(function () {
  var s = document.createElement('style');
  s.textContent =
    '#mapModal .map-modal-content{max-height:none;overflow:hidden;border:none;width:100vw;height:100vh;padding:0}' +
    '#mapModal .full-map-image{width:100vw;height:100vh;object-fit:cover}';
  document.head.appendChild(s);
})();