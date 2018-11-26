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
  saekjaFyrirlestra();
}

//finnur alla takka sem eru grænir
function allGreens() {
  var graenir = [];
  var i = 0;
  for(let t of document.querySelector('.takkar').children) {
    if(t.classList.contains("takkar__takki--merkt")){
      graenir[i] = t.textContent.toLowerCase();
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
    let item = erMerkt(data.lectures);
    setjaSaman(item);
  })
  .catch((error) => {console.error('Villa við að sækja gögn', error)});
}

//fall sem sækir bara merkta fyrirlestrana
function erMerkt(item) {
  let valdir = allGreens();
  if (valdir.length == 0) {
    return item;
  }
  let i=0;
  while(i<item.length){
    if(valdir.includes(item[i].category)==false) {
      item.splice(i,1);
      i--;
    }
    i++;
  }
  return item;
}

//fall sem býr til nýtt element.
//mismunandi virkni eftir því hvort það sé að bæta við
//nýju elementi eða setja inn mynd eða textanóðu
function el(nafn, ...children) {
  const element = document.createElement(nafn);
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
  }
  return element;
}

//Fall til að búa til boxin af fyrirlestrum
function setjaSaman(item) {
  var noda = document.querySelector(".boxes");
  while(noda.firstChild) {
    noda.removeChild(noda.firstChild);
  }
  let n=item.length; //fjöldi fyrirlestra sem við ítrum í gegnum
  let i=0;
  while(i<n){

    if(item[i].thumbnail==null){
      item[i].thumbnail='img/thumbnone.jpg';
    }
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
