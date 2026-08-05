'use strict';

document.documentElement.classList.add('js-ready');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Scroll reveal */
const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && !prefersReducedMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.14,
    rootMargin: '0px 0px -8% 0px'
  });

  revealElements.forEach((element, index) => {
    if (element.classList.contains('reveal--line')) {
      element.style.transitionDelay = `${Math.min(index * 35, 240)}ms`;
    }
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

/* Page progress */
const progressBar = document.querySelector('.scroll-progress span');

function updateScrollProgress() {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
  progressBar.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
}

window.addEventListener('scroll', updateScrollProgress, { passive: true });
window.addEventListener('resize', updateScrollProgress);
updateScrollProgress();

/* Mood selector */
const moodSection = document.querySelector('#mood');
const moodButtons = Array.from(document.querySelectorAll('[data-mood-button]'));
const moodImageWrap = document.querySelector('.mood__image-wrap');
const moodImage = document.querySelector('#mood-image');
const moodCaption = document.querySelector('#mood-caption');
const moodLabel = document.querySelector('#mood-label');
const moodTitle = document.querySelector('#mood-title');
const moodDescription = document.querySelector('#mood-description');
const moodArtists = document.querySelector('#mood-artists');

const moods = {
  float: {
    image: 'images/mood-float.jpg',
    alt: '淡い光の中を漂うような抽象風景',
    caption: 'A SOFT DRIFT THROUGH THE CITY',
    label: 'FEELING 01',
    title: '浮かぶ音',
    description: '身体が少し軽くなり、景色の中を漂うように感じる音。現実から離れるのではなく、現実との距離をほんの少しだけ広げてくれる。',
    artists: [
      {
        name: 'Hiatus Kaiyote',
        album: 'Choose Your Weapon',
        cover: 'images/albums/hiatus-kaiyote-choose-your-weapon.jpg',
        url: 'https://hiatuskaiyote.com/'
      },
      {
        name: 'The Avalanches',
        album: 'Since I Left You',
        cover: 'images/albums/the-avalanches-since-i-left-you.jpg',
        url: 'https://www.theavalanches.com/'
      }
    ]
  },
  deep: {
    image: 'images/mood-deep.jpg',
    alt: '深い青と暗闇へ沈んでいくような抽象風景',
    caption: 'LOW FREQUENCIES AFTER MIDNIGHT',
    label: 'FEELING 02',
    title: '沈む音',
    description: '暗さや静けさの中へ、深く潜っていくように感じる音。考えを止めるのではなく、普段は見えない心の底まで連れていってくれる。',
    artists: [
      {
        name: 'Massive Attack',
        album: 'Mezzanine',
        cover: 'images/albums/massive-attack-mezzanine.jpg',
        url: 'https://www.massiveattack.co.uk/'
      },
      {
        name: 'Madvillain',
        album: 'Madvillainy',
        cover: 'images/albums/madvillain-madvillainy.jpg',
        url: 'https://www.stonesthrow.com/artist/madvillain/'
      }
    ]
  },
  release: {
    image: 'images/mood-release.jpg',
    alt: '暖かな光の粒が輪郭をほどいていく抽象風景',
    caption: 'THE OUTLINE BEGINS TO DISSOLVE',
    label: 'FEELING 03',
    title: 'ほどける音',
    description: '現実の輪郭や時間の感覚が、少し曖昧になる音。意味を追わなくなった瞬間、音の断片が新しい景色としてつながり始める。',
    artists: [
      {
        name: 'Aphex Twin',
        album: 'Syro',
        cover: 'images/albums/aphex-twin-syro.jpg',
        url: 'https://aphextwin.warp.net/'
      },
      {
        name: 'Squarepusher',
        album: 'Ultravisitor',
        cover: 'images/albums/squarepusher-ultravisitor.jpg',
        url: 'https://squarepusher.net/'
      }
    ]
  }
};

function renderMood(moodKey, focusPanel = false) {
  const mood = moods[moodKey];
  if (!mood) return;

  moodSection.dataset.mood = moodKey;

  moodButtons.forEach((button) => {
    const isActive = button.dataset.moodButton === moodKey;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-selected', String(isActive));
    button.tabIndex = isActive ? 0 : -1;
  });

  moodImageWrap.classList.add('is-changing');

  window.setTimeout(() => {
    moodImage.src = mood.image;
    moodImage.alt = mood.alt;
    moodCaption.textContent = mood.caption;
    moodLabel.textContent = mood.label;
    moodTitle.textContent = mood.title;
    moodDescription.textContent = mood.description;
    moodArtists.replaceChildren(...mood.artists.map((artist) => {
      const item = document.createElement('li');
      item.className = 'artist-card';

      const name = document.createElement('p');
      name.className = 'artist-card__name';
      name.textContent = artist.name;

      const link = document.createElement('a');
      link.className = 'artist-card__cover';
      link.href = artist.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.setAttribute('aria-label', `${artist.name}の公式サイトを新しいタブで開く`);

      const cover = document.createElement('img');
      cover.src = artist.cover;
      cover.alt = `${artist.name}『${artist.album}』のアルバムジャケット`;
      cover.loading = 'lazy';

      const externalIcon = document.createElement('span');
      externalIcon.setAttribute('aria-hidden', 'true');
      externalIcon.textContent = '↗';

      const album = document.createElement('p');
      album.className = 'artist-card__album';
      album.textContent = artist.album;

      link.append(cover, externalIcon);
      item.append(name, link, album);
      return item;
    }));

    requestAnimationFrame(() => moodImageWrap.classList.remove('is-changing'));
  }, prefersReducedMotion ? 0 : 240);

  if (focusPanel) {
    document.querySelector('#mood-panel').focus({ preventScroll: true });
  }
}

moodButtons.forEach((button, index) => {
  button.addEventListener('click', () => renderMood(button.dataset.moodButton));

  button.addEventListener('keydown', (event) => {
    const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
    if (!keys.includes(event.key)) return;
    event.preventDefault();

    let nextIndex = index;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % moodButtons.length;
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + moodButtons.length) % moodButtons.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = moodButtons.length - 1;

    moodButtons[nextIndex].focus();
    renderMood(moodButtons[nextIndex].dataset.moodButton);
  });
});

/* Video ambience */
const filmSection = document.querySelector('#film');
const musicVideo = document.querySelector('#music-video');

if (musicVideo) {
  const setPlayingState = (isPlaying) => {
    filmSection.classList.toggle('is-playing', isPlaying);
  };

  musicVideo.addEventListener('play', () => setPlayingState(true));
  musicVideo.addEventListener('pause', () => setPlayingState(false));
  musicVideo.addEventListener('ended', () => setPlayingState(false));
}

/* Subtle pointer parallax on the hero image */
const hero = document.querySelector('.hero');
const heroImage = document.querySelector('.hero__image');

if (hero && heroImage && !prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
  hero.addEventListener('pointermove', (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 8;
    const y = (event.clientY / window.innerHeight - 0.5) * 8;
    heroImage.style.transform = `scale(1.015) translate3d(${x * -0.12}px, ${y * -0.12}px, 0)`;
  });

  hero.addEventListener('pointerleave', () => {
    heroImage.style.transform = 'scale(1) translate3d(0, 0, 0)';
  });
}
