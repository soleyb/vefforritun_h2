import List from './lib/list';


document.addEventListener('DOMContentLoaded', () => {
  const page = document.querySelector('body');
  const isLecturePage = page.classList.contains('lecture-page');

  if (isLecturePage) {

  } else {
    saekjaFyrirlestra();
    const list = new List();
    list.load();
  }
});

//EventListener fyrir að gera takkana græna
for(let t of document.querySelector('.takkar').children) {
  t.addEventListener('click', makeGreen);
}

//Fallið makeGreen gerir takka sem smellt var á grænan
//ef hann var grár og öfugt
function makeGreen(e) {
  e.target.classList.toggle('takkar__takki');
  e.target.classList.toggle('takkar__takki--merkt');
}

//finnur alla takka sem eru grænir
function allGreens() {
  var graenir = [];
  var i = 0;
  for(let t of document.querySelector('.takkar').children) {
    if(t.classList.contains("takkar__takki--merkt")){
      graenir[i] = t.textContent;
      i++;
    }
  }
  return graenir;

}

//fall til að sækja skrár
function saekjaFyrirlestra() {
  fetch('../lectures.json')
  .then(res => {
    return res.json();
  })
  .then(data => {
    console.log(data);
  })
  .catch((error) => {console.error('Villa við að sækja gögn', error)});
}

function el(nafn, ...children) {
  const element = document.createElement(name);
  for (let child of children) {
    element.appendChild(document.createTextNode(child));
  }
  return element;
}

//prufufall til að setja saman box
function setjaSaman(item) {
  const [{
    slug,
    title,
    category,
    image,
    thumbnail,
    content,
  }] = item;

  const result = el(
    'div',
    el('image', thumbnail),
    el('div',
      el('h4', category),
      el('h3', title)
    )
  );

  result.classList.add("boxes__box"); //og boxes__box__bg
  result.querySelector("image").classList.add("boxes__mynd");
  results.querySelector("div").classList.add("boxes__fyrirsogn");
  results.querySelector("h4").classList.add("boxes__fyrirsogn__flokkur");
  results.querySelector("h3").classList.add("boxes__fyrirsogn__titill");
}
