/* ==========================================================================
   Рендер раздела «Мои проекты» по данным из projects.js.

   Один скрипт на оба типа страниц: если адрес выглядит как projects/<slug>/,
   собирается страница проекта, иначе — список карточек.

   ВАЖНО: скрипт ставится в html ДО js/main.js. Лайтбокс, проявка картинок и
   появление при скролле читают разметку в момент запуска, поэтому галерея
   должна быть собрана раньше.
   ========================================================================== */
(function () {
  'use strict';

  var projects = window.PROJECTS || [];
  var PHOTOS_DIR = 'photos/'; // фотографии проекта — в своей папке внутри папки проекта
  var WEBP_DIR = 'webp/';     // и лёгкие версии сетки: photos/webp/то-же-имя.webp
  var slug = currentSlug();

  if (slug) renderProject(find(slug));
  else renderList();

  // ---------- Список проектов ----------
  function renderList() {
    var host = document.querySelector('[data-projects]');
    if (!host) return;

    projects.forEach(function (project, i) {
      var link = el('a', 'project-card__link');
      link.href = project.slug + '/index.html';

      var media = el('figure', 'project-card__media');
      media.appendChild(pictureOf(project.cover, project.slug + '/', project.title, i === 0));
      link.appendChild(media);

      link.appendChild(el('h2', 'project-card__title', project.title));

      var meta = metaLine(project);
      if (meta) link.appendChild(el('p', 'project-card__meta', meta));

      var card = el('article', 'project-card reveal');
      card.appendChild(link);
      host.appendChild(card);
    });
  }

  // ---------- Страница проекта ----------
  function renderProject(project) {
    if (!project) return;

    document.title = project.title + ' — Daniil Chernenkiy';
    setText('[data-project-title]', project.title);

    var meta = metaLine(project);
    if (meta) setText('[data-project-meta]', meta);
    if (project.summary) setText('[data-project-summary]', project.summary);

    var gallery = document.querySelector('[data-project-gallery]');
    var placeholder = document.querySelector('[data-project-empty]');
    var images = project.images || [];

    if (!images.length) {
      if (gallery) gallery.hidden = true; // пустая секция не даёт лишних отступов
      return;                            // заглушка остаётся на месте
    }
    if (placeholder) placeholder.remove();

    images.forEach(function (raw, i) {
      var photo = lightweight(typeof raw === 'string' ? { src: raw } : raw);
      var figure = el('figure', 'gallery__item reveal'); // тот же класс, что на главной: лайтбокс подхватывает
      figure.appendChild(pictureOf(photo, PHOTOS_DIR, project.title + ' — ' + (i + 1), i === 0));
      gallery.appendChild(figure);
    });
  }

  // ---------- Помощники ----------
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function setText(selector, text) {
    var node = document.querySelector(selector);
    if (!node) return;
    node.textContent = text;
    node.hidden = false; // пустые строки в шаблоне скрыты, чтобы не давать лишних отступов
  }

  function metaLine(project) {
    return (project.meta || []).filter(Boolean).join(' · ');
  }

  // Лёгкая версия для сетки подставляется по имени файла: photos/webp/x.webp к
  // photos/x.jpg. Целый jpg остаётся запаской для браузеров без webp и тем, что
  // открывается во весь экран. Свой путь в photo.webp перекрывает это правило.
  function lightweight(photo) {
    if (photo.webp !== undefined) return photo;
    var copy = {};
    for (var key in photo) {
      if (Object.prototype.hasOwnProperty.call(photo, key)) copy[key] = photo[key];
    }
    copy.webp = WEBP_DIR + photo.src.replace(/\.[^.]*$/, '') + '.webp';
    return copy;
  }

  // src — путь от страницы, где стоит картинка: для карточек это '<slug>/',
  // для галереи проекта — 'photos/'.
  function pictureOf(photo, src, alt, eager) {
    var img = el('img');
    img.src = src + photo.src;
    img.alt = photo.alt || alt || '';
    if (photo.width) img.width = photo.width;
    if (photo.height) img.height = photo.height;
    img.loading = eager ? 'eager' : 'lazy';
    img.decoding = 'async';
    if (eager) img.setAttribute('fetchpriority', 'high');

    if (!photo.webp) return img; // webp-версии нет — показываем оригинал

    var source = el('source');
    source.srcset = src + photo.webp;
    source.type = 'image/webp';

    var picture = el('picture');
    picture.appendChild(source);
    picture.appendChild(img);
    return picture;
  }

  // Имя папки проекта = его slug, поэтому страницы проектов ничем не отличаются
  // друг от друга и копируются как есть.
  function currentSlug() {
    var path = location.pathname;
    try { path = decodeURIComponent(path); } catch (e) { /* кривые %% в пути */ }

    var parts = path.split('/');
    for (var i = parts.length - 1; i >= 0; i--) {
      var name = parts[i].replace(/\.html$/i, '');
      if (find(name)) return name;
    }
    return null;
  }

  function find(slug) {
    for (var i = 0; i < projects.length; i++) {
      if (projects[i].slug === slug) return projects[i];
    }
    return null;
  }
})();
