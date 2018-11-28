import { el, empty } from './lib/helpers';


// ------------------------------- //
// ----------- Forsíða ----------- //
// ------------------------------- //

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
  saekjaFyrirlestra();
}

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

// Fall til að búa til boxin af fyrirlestrum á forsíðu.
// Tekur inn safn af öllum fyrirlestrum sem á að sýna á forsíðu.
function setjaSamanBoxes(lects) {
  const boxes = document.querySelector('.boxes');
  empty(boxes);

  Array.from(lects).forEach((lect) => {
    // TODO Fjarlægja if lykkju.
    if (lect.thumbnail == null && false) {
      lect.thumbnail = 'img/thumbnone.jpg';
    }
    // Búum til boxið, köllum það box
    const box = el('div',
      el('a',
        el('img', lect.thumbnail),
        el('div',
          el('h4', lect.category),
          el('h3', lect.title)),
      ),
    );

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
    if (lect.thumbnail === null) box.classList.add('img__nothumb');
    box.querySelector('div').classList.add('boxes__fyrirsogn');
    box.querySelector('h4').classList.add('boxes__fyrirsogn__flokkur');
    box.querySelector('h3').classList.add('boxes__fyrirsogn__titill');
  });
}

// Fall sem hendir út öllum fyrirlestum nema þeim eina sem á að birtast.
// Tekur inn alla fyrirlestra og slugID á völdum fyrirlestri.
function valdiFyrirlestur(lects, slugid) {
  const filtered = Array.from(lects).filter(lect => lect.slug === slugid);
  return filtered === null ? null : filtered[0];
}

// Fallið fá fyrirlestur fær allar upplýsingar um fyrirlestur sem smellt er á
// Sækir upplýsingar um fyrirlestur sem smellt er á.
// Setur slugID á þeim fyrirlestri í localStorage.
function saekjaFyrirlestur(e) {
  let node = e.target;
  while (!node.classList.contains('boxes__box')) node = node.parentNode;
  const slug = node.id;
  window.localStorage.setItem('slug', slug);
}


// ------------------------------- //
// --------- Fyrirlestrar -------- //
// ------------------------------- //


// Fall sem setur saman fyrirlestur á fyrirlestrarsíðu.
function buaTilFyrirlestur(item) {
  // TODO Hverju er verið kalla með???
  console.log(item);
}


// ------------------------------- //
// ---------- Universal ---------- //
// ------------------------------- //


// Sækir fyrirlestra og upplýsingar um þá í json hlut.
function saekjaFyrirlestra() {
  fetch('../lectures.json')
    .then(res => res.json())
    .then((data) => {
      const body = document.querySelector('body');
      const item = merktirFyrirlestrar(data.lectures);
      setjaSamanBoxes(item);
    })
    .catch(error => console.error('Villa við að sækja gögn', error));
}

// Main fall sem keyrir allt.
document.addEventListener('DOMContentLoaded', () => {
  const page = document.querySelector('body');
  const isLecturePage = page.classList.contains('lecture-page');

  if (isLecturePage) {
    // Slug er slugið fyrir valinn fyrirlestur
    const slug = window.localStorage.getItem('slug');
    const fyrirlestur = valdiFyrirlestur(slug);
    buaTilFyrirlestur(fyrirlestur);
  } else {
    saekjaFyrirlestra();

    // EventListener fyrir að gera takkana græna
    const { children } = document.querySelector('.takkar');
    Array.from(children).forEach((child) => {
      child.addEventListener('click', makeGreen);
    });
  }
});
