/* ==========================================================================
   Данные раздела «Мои проекты».

   Здесь живёт ВСЁ содержание раздела: карточки на странице списка и содержимое
   страниц проектов. Верстка при этом одна — править html-файлы не нужно.

   Как добавить проект:
     1. создайте папку projects/Имя-проекта/. В ней четыре места:
          cover.jpg + cover.webp  — обложка карточки (в корне папки проекта);
          photos/                 — фотографии галереи: jpg с длинной стороной 2500;
          photos/webp/            — те же фото для сетки: длинная сторона 1000, q80.
                                    Имя совпадает с jpg, отличаются папка и расширение;
          photos/originals/       — полноразмерные исходники съёмки, сайт их не читает.
        В корне сайта файлов фотографий не остаётся.
     2. скопируйте index.html из папки любого существующего проекта в новую папку —
        содержимое в нём менять не нужно, проект находится по имени папки;
     3. добавьте объект в массив ниже. Порядок в массиве = порядок карточек,
        порядок в images = порядок фотографий в галерее.

   Поля проекта:
     slug    — имя папки проекта (латиницей, как в проводнике);
     title   — название проекта;
     meta    — короткие строки под названием (тип съёмки, место, год, клиент...).
               Любое количество, пустые не показываются;
     summary — абзац краткой информации о съёмке на странице проекта;
     cover   — обложка: src (jpg) + webp + alt + width/height в пикселях;
     images  — фотографии галереи из photos/. Достаточно одного имени файла:
               'photo-01.jpg' — лёгкая версия найдётся сама по имени в photos/webp/,
               а в лайтбоксе откроется jpg. Если webp лежит не там, её путь пишут
               явно: { src: 'photo-01.jpg', webp: 'photo-01.webp' }.
               width/height желательны: без них сетка дёргается при загрузке.
   ========================================================================== */
window.PROJECTS = [
  {
    slug: 'Yuka-drift',
    title: 'Yuka Drift',
    meta: [],
    summary: '',
    cover: { src: 'cover.jpg', webp: 'cover.webp', alt: 'Yuka Drift', width: 1875, height: 2500 },
    images: [
      { src: 'YUKADrift-01.jpg', width: 2500, height: 1667 },
      { src: 'YUKADrift-07.jpg', width: 2500, height: 1336 },
      { src: 'YUKADrift-14.jpg', width: 2500, height: 1667 },
      { src: 'YUKADrift-16.jpg', width: 1667, height: 2500 },
      { src: 'YUKADrift-18.jpg', width: 2500, height: 1666 },
      { src: 'YUKADrift-25.jpg', width: 2500, height: 1666 },
      { src: 'YUKADrift-27.jpg', width: 1667, height: 2500 },
      { src: 'YUKADrift-30.jpg', width: 2500, height: 1666 },
      { src: 'YUKADrift-32.jpg', width: 2500, height: 1667 },
      { src: 'YUKADrift-39.jpg', width: 2500, height: 1666 },
      { src: 'YUKADrift-49.jpg', width: 2500, height: 1667 },
      { src: 'YUKADrift-50.jpg', width: 2500, height: 1667 },
      { src: 'YUKADrift-72.jpg', width: 2500, height: 1667 },
      { src: 'YUKADrift-77.jpg', width: 1875, height: 2500 }
    ]
  },

  {
    slug: 'FashionTerritory',
    title: 'Территория моды',
    meta: [],
    summary: '',
    cover: { src: 'cover.jpg', webp: 'cover.webp', alt: 'Территория моды', width: 1667, height: 2501 },
    images: [
      { src: 'FashionTerritory-001.jpg', width: 1667, height: 2500 },
      { src: 'FashionTerritory-003.jpg', width: 2500, height: 1667 },
      { src: 'FashionTerritory-019.jpg', width: 1667, height: 2500 },
      { src: 'FashionTerritory-037.jpg', width: 1667, height: 2500 },
      { src: 'FashionTerritory-038.jpg', width: 1667, height: 2500 },
      { src: 'FashionTerritory-040.jpg', width: 1667, height: 2500 },
      { src: 'FashionTerritory-042.jpg', width: 1667, height: 2500 },
      { src: 'FashionTerritory-043.jpg', width: 1667, height: 2500 },
      { src: 'FashionTerritory-044.jpg', width: 1667, height: 2500 },
      { src: 'FashionTerritory-045.jpg', width: 1667, height: 2500 },
      { src: 'FashionTerritory-046.jpg', width: 1667, height: 2500 },
      { src: 'FashionTerritory-047.jpg', width: 1667, height: 2500 },
      { src: 'FashionTerritory-048.jpg', width: 2500, height: 1667 },
      { src: 'FashionTerritory-049.jpg', width: 2500, height: 1667 },
      { src: 'FashionTerritory-050.jpg', width: 2500, height: 1666 },
      { src: 'FashionTerritory-052.jpg', width: 1666, height: 2500 },
      { src: 'FashionTerritory-055.jpg', width: 2316, height: 2500 },
      { src: 'FashionTerritory-059.jpg', width: 1667, height: 2500 },
      { src: 'FashionTerritory-065.jpg', width: 1667, height: 2500 },
      { src: 'FashionTerritory-073.jpg', width: 1667, height: 2500 },
      { src: 'FashionTerritory-078.jpg', width: 2500, height: 1666 },
      { src: 'FashionTerritory-080.jpg', width: 2500, height: 1144 },
      { src: 'FashionTerritory-084.jpg', width: 2500, height: 1667 },
      { src: 'FashionTerritory-085.jpg', width: 2500, height: 1667 },
      { src: 'FashionTerritory-087.jpg', width: 2500, height: 1667 },
      { src: 'FashionTerritory_Backstage-001.jpg', width: 2500, height: 1269 },
      { src: 'FashionTerritory_Backstage-008.jpg', width: 2500, height: 1667 },
      { src: 'FashionTerritory_Backstage-009.jpg', width: 2500, height: 1666 },
      { src: 'FashionTerritory_Backstage-020.jpg', width: 1667, height: 2500 }
    ]
  }
];
