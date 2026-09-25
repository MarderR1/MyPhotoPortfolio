/* Daniil Chernenkiy — portfolio
   Вёрстка работает без JS: скрытые состояния в CSS живут под селектором html.js.
   При prefers-reduced-motion декоративные механизмы ниже не запускаются,
   лайтбокс остаётся: это функциональность, а не анимация. */
(function () {
  'use strict';

  updateYear(); // нужен всегда, поэтому до проверки на reduced-motion
  moveActiveNavFirst(); // и это тоже: порядок ссылок не связан с движением
  galleryLightbox(); // и он работает при любом предпочтении по движению
  backToTopButton(); // кнопка есть всегда: это доступ, а не украшение;
                     // плавность прокрутки она выбирает по предпочтению сама

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  revealOnScroll();
  compactHeaderOnScroll();
  fadeInLoadedImages();

  // Раздел, в котором сейчас находится пользователь, встаёт первым в шапке:
  // порядок в разметке остаётся общим (Главное — Контакты — Мои проекты),
  // меняётся только на загруженной странице.
  function moveActiveNavFirst() {
    var active = document.querySelector('.nav__link.is-active');
    if (!active) return;

    var item = active.parentNode;
    var list = item.parentNode;
    list.insertBefore(item, list.firstElementChild);
  }

  // Год в копирайте футера подставляется автоматически
  function updateYear() {
    var spans = document.querySelectorAll('[data-year]');
    var year = String(new Date().getFullYear());
    Array.prototype.forEach.call(spans, function (el) {
      el.textContent = year;
    });
  }

  // Плавное появление фото: .is-loaded вешается, когда картинка реально
  // загрузилась (для lazy-изображений это момент подхода к вьюпорту).
  // Уже загруженные из кэша проходят по img.complete.
  function fadeInLoadedImages() {
    var images = document.querySelectorAll('.gallery__item img, .about__portrait img, .project-card__media img');
    Array.prototype.forEach.call(images, function (img) {
      if (img.complete && img.naturalWidth > 0) {
        img.classList.add('is-loaded');
        return;
      }
      var onSettle = function () {
        img.classList.add('is-loaded'); // и при ошибке тоже: пустая рамка хуже серого фона
        img.removeEventListener('load', onSettle);
        img.removeEventListener('error', onSettle);
      };
      img.addEventListener('load', onSettle);
      img.addEventListener('error', onSettle);
    });
  }

  function revealOnScroll() {
    var elements = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) return;

    var STAGGER = 70;   // задержка между элементами, появившимися в один момент
    var MAX_STEP = 5;   // но не дольше STAGGER * MAX_STEP на порцию

    var observer = new IntersectionObserver(function (entries) {
      entries
        .filter(function (entry) { return entry.isIntersecting; })
        // Каскад идёт сверху вниз и слева направо, а не в порядке разметки:
        // в masonry колонки заполняются по очереди, и порядок DOM — не визуальный.
        .sort(function (a, b) {
          return (a.boundingClientRect.top - b.boundingClientRect.top) ||
                 (a.boundingClientRect.left - b.boundingClientRect.left);
        })
        .forEach(function (entry, i) {
          var el = entry.target;
          el.style.setProperty('--reveal-delay', Math.min(i, MAX_STEP) * STAGGER + 'ms');
          el.classList.add('is-visible');
          observer.unobserve(el);
        });
    }, { threshold: 0.05, rootMargin: '0px 0px -6% 0px' });

    Array.prototype.forEach.call(elements, function (el) {
      observer.observe(el);
    });
  }

  function compactHeaderOnScroll() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    // На страницах с data-header-compact="off" шапка остаётся развернутой:
    // вместе со сжатием вверх сдвинулся бы центрированный контент.
    if (header.dataset.headerCompact === 'off') return;

    var AFTER = 120;   // px: дальше шапка держится сжатыми
    var BEFORE = 60;   // px: и снова разжимаются не там же, а ниже (см. update)
    var queued = false;

    // Пороги намеренно разнесены: сжатие меняет высоту шапки на ~48px, всё под
    // ней (и текст самой шапки) съезжает, а браузер компенсирует это прокруткой —
    // scroll anchoring. С одним порогом попадал в цикл: шапка сжималась,
    // прокрутку отпускало на 48px выше порога, шапка разжималась — и по кругу,
    // то есть дрожала на границе. Мёртвая полоса больше этих 48px, поэтому
    // компенсация уже не может перетащить скролл через второй порог.
    function update() {
      queued = false;
      var y = window.scrollY;
      if (y > AFTER) header.classList.add('is-compact');
      else if (y < BEFORE) header.classList.remove('is-compact');
    }

    window.addEventListener('scroll', function () {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(update);
    }, { passive: true });

    update(); // страница может открыться уже отпрокрученной (перезагрузка, якорь)
  }

  // ---------- Кнопка «наверх» ----------
  // Строится в JS, как оверлей лайтбокса: без JS в разметке ничего лишнего,
  // а hidden-состояние кнопки живёт под html.js в style.css (секция 14).
  // Кнопка — функциональность, поэтому появляется и при reduced-motion;
  // предпочтение влияет только на способ прокрутки (плавно / мгновенно).
  function backToTopButton() {
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'back-to-top';
    button.setAttribute('aria-label', 'Вернуться к началу страницы');
    button.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" ' +
      'stroke-linecap="square" aria-hidden="true"><path d="M5 15l7-7 7 7"/></svg>';
    document.body.appendChild(button);

    var SHOW_AFTER = 400; // px: чуть ниже первого экрана кнопка появляется...
    // ... и прячется там же. Один порог, без мёртвой полосы как у шапки:
    // кнопка закреплена (position: fixed) и не меняет высоту контента,
    // поэтому scroll anchoring здесь нечего компенсировать — дрожи не будет.

    function update() {
      queued = false; // как в compactHeaderOnScroll: без этого слушатель
                      // отработает один раз и замолкнет навсегда
      button.classList.toggle('is-visible', window.scrollY > SHOW_AFTER);
    }

    var queued = false;
    window.addEventListener('scroll', function () {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(update);
    }, { passive: true });

    button.addEventListener('click', function () {
      var smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
      } else {
        window.scrollTo(0, 0); // старые движки без плавной прокрутки
      }
    });

    update(); // страница может открыться уже отпрокрученной
  }

  // ---------- Лайтбокс галереи ----------
  // Оверлей строится здесь, поэтому в разметке галереи не появляется ничего:
  // без JS и на страницах без галереи фото остаются обычными картинками.
  function galleryLightbox() {
    var figures = document.querySelectorAll('.gallery__item');
    if (!figures.length) return;

    // Порядок просмотра = порядок фигур в DOM, то есть порядок галереи.
    var items = [];
    Array.prototype.forEach.call(figures, function (figure) {
      var img = figure.querySelector('img');
      if (img) items.push({ figure: figure, img: img });
    });
    if (!items.length) return;

    var ICON = 'fill="none" stroke="currentColor" stroke-width="1.25" ' +
               'stroke-linecap="square" aria-hidden="true"';

    var overlay = document.createElement('div');
    overlay.className = 'lightbox';
    overlay.hidden = true;
    overlay.tabIndex = -1;
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Просмотр фотографии');
    overlay.innerHTML =
      '<figure class="lightbox__stage"></figure>' +
      '<button class="lightbox__button lightbox__close" aria-label="Закрыть просмотр">' +
        '<svg viewBox="0 0 24 24" ' + ICON + '><path d="M5 5l14 14M19 5L5 19"/></svg>' +
      '</button>' +
      '<button class="lightbox__button lightbox__nav lightbox__nav--prev" aria-label="Предыдущее фото">' +
        '<svg viewBox="0 0 24 24" ' + ICON + '><path d="M15 3L6 12l9 9"/></svg>' +
      '</button>' +
      '<button class="lightbox__button lightbox__nav lightbox__nav--next" aria-label="Следующее фото">' +
        '<svg viewBox="0 0 24 24" ' + ICON + '><path d="M9 3l9 9-9 9"/></svg>' +
      '</button>';

    var stage = overlay.querySelector('.lightbox__stage');
    var stageImg = null; // текущий слайд: создаётся заново при каждом show()
    var controls = overlay.querySelectorAll('.lightbox__button');

    var current = -1;
    var opener = null;      // фигура, из которой открыли просмотр
    var lastFocused = null; // куда вернуть фокус при закрытии
    var scrollY = 0;
    var touchStart = null;
    var swiped = false;     // жест-перелистывание не должен считаться кликом по фону

    document.body.appendChild(overlay);

    Array.prototype.forEach.call(items, function (item, i) {
      var img = item.img;
      item.figure.classList.add('lightbox-opener');
      item.figure.setAttribute('role', 'button');
      item.figure.setAttribute('tabindex', '0');
      item.figure.setAttribute('aria-label',
        img.alt ? 'Открыть во весь экран: ' + img.alt : 'Открыть фото во весь экран');

      item.figure.addEventListener('click', function () { open(i); });
      item.figure.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
          event.preventDefault(); // иначе пробел прокручивает страницу
          open(i);
        }
      });
    });

    overlay.addEventListener('click', function (event) {
      if (swiped) { swiped = false; return; }
      if (event.target.closest('button')) return; // стрелки и крестик делают своё
      if (event.target === stageImg) return;      // клик по фото ничего не меняет
      close();
    });

    overlay.querySelector('.lightbox__close').addEventListener('click', close);
    overlay.querySelector('.lightbox__nav--prev').addEventListener('click', function () { show(current - 1); });
    overlay.querySelector('.lightbox__nav--next').addEventListener('click', function () { show(current + 1); });

    // Слушатели load/error навешиваются на каждый новый слайд в show():
    // картинка показывается, только когда она реально на экране — до этого
    // под ней тёмный фон, а не рамка надвигающегося изображения.

    overlay.addEventListener('touchstart', function (event) {
      swiped = false;
      touchStart = event.touches.length === 1
        ? { x: event.touches[0].clientX, y: event.touches[0].clientY }
        : null;
    }, { passive: true });

    overlay.addEventListener('touchend', function (event) {
      if (!touchStart) return;
      var touch = event.changedTouches[0];
      var dx = touch.clientX - touchStart.x;
      var dy = touch.clientY - touchStart.y;
      touchStart = null;
      // Вертикальный жест длиннее горизонтального — значит это не перелистывание.
      if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
      swiped = true;
      show(current + (dx < 0 ? 1 : -1));
    }, { passive: true });

    function sourceOf(item) {
      var img = item.img;
      // В сетке стоит лёгкая webp шириной ~1000px — для экрана этого мало,
      // поэтому во весь экран идёт оригинал из атрибута src (jpg).
      return img.getAttribute('src') || img.currentSrc;
    }

    function wrap(index) {
      return (index + items.length) % items.length; // последний листается в первый
    }

    function show(index) {
      current = wrap(index);
      var original = items[current].img;
      var src = sourceOf(items[current]);

      // Каждый слайд — новый <img>, а старый узел удаляется из DOM.
      // Если вместо этого менять src у того же элемента, мобильные
      // движки (WebView в Telegram и подобные) оставляют в текстуре
      // части прежнего фото: при смене соотношения сторон оно
      // «призраком» висит за новым. Удалённый узел исчезает гарантированно,
      // а высота и позиция сцены пересчитываются под новый снимок сами.
      if (stageImg) stageImg.remove();
      stageImg = document.createElement('img');
      stageImg.className = 'lightbox__img';
      stageImg.alt = original.alt || '';
      stageImg.decoding = 'async';
      stageImg.addEventListener('load', function () { stageImg.classList.add('is-loaded'); });
      stageImg.addEventListener('error', function () { stageImg.classList.add('is-loaded'); });
      stageImg.src = src;
      stage.appendChild(stageImg);

      [-1, 1].forEach(function (step) {
        var neighbour = new Image();
        neighbour.src = sourceOf(items[wrap(current + step)]);
      });
    }

    function onKeydown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
      } else if (event.key === 'ArrowRight') {
        show(current + 1);
      } else if (event.key === 'ArrowLeft') {
        show(current - 1);
      } else if (event.key === 'Tab') {
        trapFocus(event);
      }
    }

    // Табуляция не уходит на страницу за оверлеем.
    function trapFocus(event) {
      var first = controls[0];
      var last = controls[controls.length - 1];
      var active = document.activeElement;

      if (event.shiftKey && (active === last || active === overlay)) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    }

    function open(index) {
      opener = items[index].figure;
      lastFocused = document.activeElement;

      scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
      document.documentElement.classList.add('is-lightbox-open'); // фон не прокручивается

      overlay.hidden = false;
      show(index);
      overlay.focus({ preventScroll: true });
      document.addEventListener('keydown', onKeydown, true);
    }

    function close() {
      overlay.hidden = true;
      document.removeEventListener('keydown', onKeydown, true);

      var target = opener || lastFocused;
      if (target) target.focus({ preventScroll: true });

      document.documentElement.classList.remove('is-lightbox-open');
      window.scrollTo(0, scrollY); // возвращаем то же место страницы
    }
  }
})();
