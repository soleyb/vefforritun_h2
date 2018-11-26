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
    setjaSaman(data.lectures);
  })
  .catch((error) => {console.error('Villa við að sækja gögn', error)});
}

//fall sem býr til nýtt element.
//mismunandi virkni eftir því hvort það sé að bæta við
//nýju elementi eða setja inn mynd eða textanóðu
function el(nafn, ...children) {
  const element = document.createElement(nafn);
  console.log(nafn);
  for (let child of children) {
    if(nafn == 'img') {
      //ef við erum að vinna í mynd
      element.src = child;
    }
    else if(typeof child == 'string'){
      //ef við erum að vinna með börn sem eru textar
      element.appendChild(document.createTextNode(child));
    }
    else {
      //ef við erum að vinna með börn sem eru element
      element.appendChild(child);
    }
    console.log(child);
  }
  return element;
}

//Fall til að búa til boxin af fyrirlestrum
function setjaSaman(item) {
  let n=item.length; //fjöldi fyrirlestra sem við ítrum í gegnum
  let i=0;
  while(i<n){
    //búum til boxið, köllum það result
    const result = el(
      'div',
      el('img', item[i].thumbnail),
      el('div',
        el('h4', item[i].category),
        el('h3', item[i].title)
      )
    );

    //setjum boxið inn í index.html
    document.querySelector(".boxes").appendChild(result);
    //bætum við klösum
    result.classList.add("boxes__box");
    result.classList.add("boxes__box__bg");
    result.querySelector("img").classList.add("boxes__mynd");
    result.querySelector("div").classList.add("boxes__fyrirsogn");
    result.querySelector("h4").classList.add("boxes__fyrirsogn__flokkur");
    result.querySelector("h3").classList.add("boxes__fyrirsogn__titill");
    i++;
  }
}
