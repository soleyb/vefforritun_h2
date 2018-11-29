import { el, empty } from './lib/helpers';


// ------------------------------- //
// ---------- Universal ---------- //
// ------------------------------- //
function getSlug() {
  const { search } = window.location;
  if (search === '') return null;
  return search.split('=')[1];
}

function saekjaFyrirlestra() {
  return fetch('../lectures.json')
    .then(res => res.json())
    .catch(error => console.error('Villa við að sækja gögn', error));
}

function klaradirFyrirlestrar() {
  const local = localStorage.getItem('klaradirFyrirlestrar');
  if (local === null) return [];
  return JSON.parse(local).slugs;
}


// ------------------------------- //
// ----------- Forsíða ----------- //
// ------------------------------- //

// Finnur alla takka sem eru grænir
function graenirTakkar() {
  const graenir = [];
  const { children } = document.querySelector('.takkar');
  Array.from(children).forEach((child) => {
    if (child.classList.contains('takkar__takki--merkt')) {
      graenir.push(child.textContent.toLowerCase());
    }
  });
  return graenir;
}

// Síar í burtu alla fyrirlestra sem eru ekki í völdum flokkum.
function merktirFyrirlestrar(lects) {
  // granirTakkar skilar Array lista
  const valdirTakkar = graenirTakkar();
  if (valdirTakkar.length === 0) return lects;

  const siad = lects.filter(lect => valdirTakkar.includes(lect.category));
  return siad;
}

// Fallið makeGreen gerir takkan sem smellt var á grænan
// ef hann var grár og öfugt
function makeGreen(e) {
  e.target.classList.toggle('takkar__takki');
  e.target.classList.toggle('takkar__takki--merkt');
}

// Fall til að búa til boxin af fyrirlestrum á forsíðu.
// Tekur inn safn af öllum fyrirlestrum sem á að sýna á forsíðu.
function setjaSamanBoxes(lects) {
  const boxes = document.querySelector('.boxes');
  empty(boxes);

  Array.from(lects).forEach((lect) => {
    // Búum til boxið, köllum það box
    const box = el('div',
      el('a',
        el('img', lect.thumbnail === undefined ? '' : lect.thumbnail),
        el('div',
          el('h4', lect.category),
          el('div',
            el('h3', lect.title),
            el('span','✔')))));

    // Setjum boxið inn í index.html
    boxes.appendChild(box);

    // Bætum við klösum
    box.classList.add('boxes__box');
    box.classList.add('boxes__box__bg');
    box.setAttribute('id', lect.slug);
    box.querySelector('a').classList.add('boxes__a');
    box.querySelector('a').setAttribute('href', `fyrirlestur.html?slug=${lect.slug}`);
    box.querySelector('img').classList.add('boxes__mynd');
    box.querySelector('div').classList.add('boxes__fyrirsogn');
    box.querySelector('h4').classList.add('boxes__fyrirsogn__flokkur');
    box.querySelector('div > div').classList.add('boxes__fyrirsogn__titilcheck');
    box.querySelector('h3').classList.add('boxes__fyrirsogn__titill');
    if (klaradirFyrirlestrar().includes(lect.slug)) box.querySelector('span').classList.add('boxes__fyrirsogn__check');
    else box.querySelector('span').classList.add('boxes__fyrirsogn__uncheck');
    if (lect.thumbnail === undefined) {
      box.querySelector('img').classList.add('img__nothumb');
    }
    const kf = klaradirFyrirlestrar();
    if (kf !== null && kf.includes(lect.slug)) {
      box.querySelector('.boxes__fyrirsogn').classList.add('klaradur');
    }
  });
}

// Fall sem hendir út öllum fyrirlestum nema þeim eina sem á að birtast.
// Tekur inn alla fyrirlestra og slugID á völdum fyrirlestri.
function valdiFyrirlestur(lects, slugid) {
  const filtered = Array.from(lects).filter(lect => lect.slug === slugid);
  return filtered === null ? null : filtered[0];
}

// Sækir fyrirlestra og upplýsingar um þá í json hlut.
function hladaBoxes() {
  saekjaFyrirlestra()
    .then((data) => {
      const item = merktirFyrirlestrar(data.lectures);
      setjaSamanBoxes(item);
    });
}


// ------------------------------- //
// --------- Fyrirlestrar -------- //
// ------------------------------- //


function klaraFyrirlestur() {
  let local = JSON.parse(localStorage.getItem('klaradirFyrirlestrar'));
  const slug = getSlug();

  // Ef enginn fyrirlestur hefur verið kláraður skráum við þennan sem fyrsta
  // Annars togglum við hvort hann sé búinn.
  if (local === null) local = { slugs: [] };
  if (local.slugs.includes(slug)) local.slugs.splice(local.slugs.indexOf(slug), 1);
  else local.slugs.push(slug);
  localStorage.setItem('klaradirFyrirlestrar', JSON.stringify(local));

  // HTML partur
  const takki = document.querySelector('.takkar__klara');
  if (takki.innerHTML === 'Klára fyrirlestur') {
    takki.innerHTML = '✔ Fyrirlestur kláraður'
    takki.classList.add('takkar__klara__buinn');
  }
  else {
    takki.innerHTML = 'Klára fyrirlestur'
    takki.classList.remove('takkar__klara__buinn');
  }
}

// Fall sem setur saman fyrirlestur á fyrirlestrarsíðu.
function buaTilFyrirlestur(lecture) {
  const page = document.querySelector('.efni');
  const {
    category,
    content,
    image,
    title,
    slug,
  } = lecture; // +thumbnail eru til staðar

  // Event listeners fyrir fyrirlestrasíðu.
  const klaraTakki = document.querySelector('.takkar__klara');
  klaraTakki.addEventListener('click', klaraFyrirlestur);

  // Hér kemur HTML uppsetningin á síðunni.
  document.querySelector('.haus2').appendChild(el('img', image));
  document.querySelector('.haus2').appendChild(el('h3', category));
  document.querySelector('.haus2').appendChild(el('h1', title));
  if (klaradirFyrirlestrar().includes(lecture.slug)) {
    const takki = document.querySelector('.takkar__klara')
    takki.classList.add('takkar__klara__buinn');
    takki.innerHTML = '✔ Fyrirlestur kláraður'
  }

  content.forEach((element) => {
    let child;
    switch (element.type) {
      case 'youtube':
        child = el('iframe', element.data);
        child.setAttribute('width', '1280');
        child.setAttribute('height', '720');
        child.setAttribute('frameborder', '0');
        child.setAttribute('allowfullscreen', '');
        break;
      case 'text':
        child = el('div', ...element.data.split('\n').map(x => el('p', x)));
		child.classList.add('efni__balkur');
        break;
      case 'quote':
        child = el('blockquote', el('p', element.data));
        if (element.attribute !== undefined) child.appendChild(el('cite', element.attribute));
		child.classList.add('efni__tilvitnun');
        break;
      case 'image':
        child = el('figure', el('img', element.data));
        if (element.caption !== undefined) child.appendChild(el('figcaption', element.caption));
        child.classList.add('efni__myndtexti');
        break;
      case 'heading':
        child = el('h2', element.data);
		child.classList.add('efni__fyrirsogn');
        break;
      case 'list':
        child = el('ul', ...Array.from(element.data).map(x => el('li', x)));
		child.classList.add('efni__listi');
        break;
      case 'code':
        child = el('pre', ...Array.from(element.data).map(x => el('code', x)));
		child.classList.add('efni__kodi');
        break;
      default:
        break;
    }
    page.appendChild(child);
  });
}


// ------------------------------- //
// ------------- Main ------------ //
// ------------------------------- //


// Main fall sem keyrir allt.
document.addEventListener('DOMContentLoaded', () => {
  const page = document.querySelector('body');
  const isLecturePage = page.classList.contains('lecture-page');

  // Mismunandi keyrslur eftir hvor síðan er.
  if (isLecturePage) {
    saekjaFyrirlestra().then((data) => {
      // Ef farið er beint á /fyrirlestur.html er enginn fyrirlestur
      // til að sýna, svo notanda er beint á forsíðu.
      if (getSlug() === null) window.location = '/';
      const slug = getSlug();
      const fyrirlestur = valdiFyrirlestur(data.lectures, slug);
      buaTilFyrirlestur(fyrirlestur);
    });
  } else {
    hladaBoxes();

    // EventListener fyrir að gera takkana græna
    // og endurhlaða fyrirlestralista
    const { children } = document.querySelector('.takkar');
    Array.from(children).forEach((child) => {
      child.addEventListener('click', makeGreen);
      child.addEventListener('click', hladaBoxes);
    });
  }
});
