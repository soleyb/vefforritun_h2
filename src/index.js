import { el, empty } from './lib/helpers';


// ------------------------------- //
// ---------- Universal ---------- //
// ------------------------------- //


function saekjaFyrirlestra() {
  return fetch('../lectures.json')
    .then(res => res.json())
    .catch(error => console.error('Villa við að sækja gögn', error));
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

// Sækir upplýsingar um fyrirlestur sem smellt er á.
// Setur slugID á þeim fyrirlestri í localStorage.
function saekjaFyrirlestur(e) {
  let node = e.target;
  while (!node.classList.contains('boxes__box')) node = node.parentNode;
  const slug = node.id;
  window.localStorage.setItem('slug', slug);
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
          el('h3', lect.title))));

    // Setjum boxið inn í index.html
    boxes.appendChild(box);

    // Bætum við klösum
    box.classList.add('boxes__box');
    box.classList.add('boxes__box__bg');
    box.setAttribute('id', lect.slug);
    box.addEventListener('click', saekjaFyrirlestur, true);
    box.querySelector('a').classList.add('boxes__a');
    box.querySelector('a').setAttribute('href', 'fyrirlestur.html');
    box.querySelector('img').classList.add('boxes__mynd');
    box.querySelector('div').classList.add('boxes__fyrirsogn');
    box.querySelector('h4').classList.add('boxes__fyrirsogn__flokkur');
    box.querySelector('h3').classList.add('boxes__fyrirsogn__titill');
    if (lect.thumbnail === undefined) {
      box.querySelector('img').classList.add('img__nothumb');
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


// Fall sem setur saman fyrirlestur á fyrirlestrarsíðu.
function buaTilFyrirlestur(lecture) {
  // TODO Klára þetta fall.
  const page = document.querySelector('.efni');
  const {
    category,
    content,
    image,
    title,
  } = lecture; // +slug +thumbnail eru til staðar

  document.querySelector('.haus2').appendChild(el('img', image));
  document.querySelector('.haus2').appendChild(el('h3', category));
  document.querySelector('.haus2').appendChild(el('h1', title));

  content.forEach((element) => {
    switch (element.type) {
      case 'youtube':
        const elem = el('iframe', element.data);
        elem.setAttribute('width', '1280');
        elem.setAttribute('height', '720');
        elem.setAttribute('frameborder', '0');
        elem.setAttribute('allowfullscreen', '');
        page.appendChild(elem);
        break;
      case 'text':
        page.appendChild(el('p', element.data));
        break;
      case 'quote':
        page.appendChild(el('quote', element.data));
        break;
      case 'image':
        page.appendChild(el('img', element.data));
        page.appendChild(el('p', element.caption));
        break;
      case 'heading':
        page.appendChild(el('h2', element.data));
        break;
      case 'list':
        // TODO Fix this
        // þetta virkar ekki alveg. Þarf að láta allt í element.data
        // fara í li sem er svo allt inní ul
        page.appendChild(el('ul', ...Array.from(element.data).map(x => el('li', x))));
        break;
      case 'code':
        page.appendChild(el('pre', ...Array.from(element.data).map(x => el('code', x))));
        break;
      default:
        break;
    }
  });
}

// Main fall sem keyrir allt.
document.addEventListener('DOMContentLoaded', () => {
  const page = document.querySelector('body');
  const isLecturePage = page.classList.contains('lecture-page');

  if (isLecturePage) {
    saekjaFyrirlestra().then((data) => {
      // Slug er slugið fyrir valinn fyrirlestur
      const slug = window.localStorage.getItem('slug');
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
