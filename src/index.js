
document.addEventListener('DOMContentLoaded', () => {
  const page = document.querySelector('body');
  const isLecturePage = page.classList.contains('lecture-page');

  if (isLecturePage) {

    // TODO útfæra fyrir fyrirlestrasíðu -- K
    // slug er slugið fyrir valinn fyrirlestur
    const slug = window.localStorage.getItem('fyrirlesturSlug');

  } else {

    saekjaFyrirlestra();

    // EventListener fyrir að gera takkana græna
    const { children } = document.querySelector('.takkar');
    Array.from(children).forEach((child) => {
      child.addEventListener('click', makeGreen);

    });
  }
});

// Fallið makeGreen gerir takka sem smellt var á grænan
// ef hann var grár og öfugt
function makeGreen(e) {
  e.target.classList.toggle('takkar__takki');
  e.target.classList.toggle('takkar__takki--merkt');
  saekjaFyrirlestra();
}

// Fallið fá fyrirlestur fær allar upplýsingar um fyrirlestur sem smellt er á
function faFyrirlestur(e) {
  let slug = '';
  let a = e.target;
  let i = 0;
  while (i < 4) {
    if (a.id != slug) {
      slug = a.id;
      break;
    }
    a = a.parentNode;
    i++;
  }
  window.localStorage.setItem('fyrirlesturSlug', slug);
  return slug;
}

// finnur alla takka sem eru grænir
function allGreens() {
  var graenir = [];

  const { children } = document.querySelector('.takkar');
  Array.from(children).forEach((child) => {
    if (child.classList.contains('takkar__takki--merkt')) {
      graenir.push(child.textContent.toLowerCase());
    }
  });
  return graenir;
}

// fall til að sækja skrár
function saekjaFyrirlestra() {
  fetch('../lectures.json')
    .then((res) => res.json())
    .then((data) => {
      if (document.querySelector('body').classList.contains('lecture-page')){
        let hlutur = erFyrirlesturinn(window.localStorage.getItem('fyrirlesturSlug'));
        buaTilFyrirlestur(hlutur);
      }
      let item = erMerkt(data.lectures);
      setjaSaman(item);
    })
    .catch((error) => {console.error('Villa við að sækja gögn', error)});
}

// fall sem sækir bara merkta fyrirlestrana
function erMerkt(item) {
  let valdir = allGreens();
  if (valdir.length == 0) {
    return item;
  }
  let i=0;
  while (i < item.length){
    if (valdir.includes(item[i].category)==false) {
      item.splice(i, 1);
      i--;
    }
    i++;
  }
  return item;
}

// fall sem hendir út öllum fyrirlestum nema þeim eina sem á að birtast
function erFyrirlesturinn(item, slugid) {
  let i=0;
  while (i < item.length) {
    if (item[i].slug!=slugid) {
      item.splice(i, 1);
      i--;
    }
    i++;
  }
  return item;
}

// fall sem býr til nýtt element.
// mismunandi virkni eftir því hvort það sé að bæta við
// nýju elementi eða setja inn mynd eða textanóðu
function el(nafn, ...children) {
  const element = document.createElement(nafn);
  for (let child of children) {
    if (nafn == 'img') {
      // ef við erum að vinna í mynd
      if (child != null){
        element.src = child;
      }
      else{
        return element;
      }
    }
    else if (typeof child == 'string'){
      // ef við erum að vinna með börn sem eru textar
      element.appendChild(document.createTextNode(child));
    }
    else {
      // ef við erum að vinna með börn sem eru element
      element.appendChild(child);
    }
  }
  return element;
}

// Fall til að búa til boxin af fyrirlestrum
function setjaSaman(item) {
  var noda = document.querySelector('.boxes');
  while (noda.firstChild) {
    noda.removeChild(noda.firstChild);
  }
  let n=item.length; // fjöldi fyrirlestra sem við ítrum í gegnum
  let i=0;
  while (i < n){
    if (item[i].thumbnail==null){
      item[i].thumbnail='img/thumbnone.jpg';
    }
    // búum til boxið, köllum það result
    const result = el(
      'div', el(
        'a', el('img', item[i].thumbnail),
        el('div',
          el('h4', item[i].category),
          el('h3', item[i].title)
        )
      )
    );

    // setjum boxið inn í index.html
    document.querySelector('.boxes').appendChild(result);
    // bætum við klösum
    result.classList.add('boxes__box');
    result.classList.add('boxes__box__bg');
    result.setAttribute('id', item[i].slug);
    result.addEventListener('click', faFyrirlestur);
    result.querySelector('a').classList.add('boxes__a');
    result.querySelector('a').setAttribute('href', 'fyrirlestur.html');
    result.querySelector('img').classList.add('boxes__mynd');
    result.querySelector('div').classList.add('boxes__fyrirsogn');
    result.querySelector('h4').classList.add('boxes__fyrirsogn__flokkur');
    result.querySelector('h3').classList.add('boxes__fyrirsogn__titill');
    i++;
  }
}


// el fall fyrir fyrirlestrana
function el2(nafn, ...children) {
  const element = document.createElement(name);
  for (let child of children) {
    if (typeof child =='string') {
      element.appendChild(document.createTextNode(child));
    } else if (child) {
      element.appendChild(child);
    }
  }
}

// fall sem setur saman fyrirlestur
function buaTilFyrirlestur(item) {
    for (let i in item) {
      console.log('a');
    }
}
