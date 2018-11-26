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

function el(nafn, ...children) {
  const element = document.createElement(nafn);
  console.log(nafn);
  for (let child of children) {
    if(nafn == 'img') {
      element.src = child;
    }
    else if(typeof child == 'string'){
      element.appendChild(document.createTextNode(child));
    }
    else {
      element.appendChild(child);
    }
    console.log(child);
  }
  return element;
}

//prufufall til að setja saman box
function setjaSaman(item) {
  console.log(item);
/*  const [{
    slug,
    title,
    category,
    image,
    thumbnail,
    content,
  }] = item;
*/

  // itemm
  // itemm[0]

  let n=item.length;

  console.log(item[0].slug);

  console.log("hæ aftur");

  let i=0;

  while(i<n){

    const result = el(
      'div',
      el('img', item[i].thumbnail),
      el('div',
        el('h4', item[i].category),
        el('h3', item[i].title)
      )
    );

    document.querySelector(".boxes").appendChild(result);
    console.log(result);
    console.log("0");
    result.classList.add("boxes__box"); //og boxes__box__bg
    console.log("1");
    result.querySelector("img").classList.add("boxes__mynd");
    console.log("2");
    result.querySelector("div").classList.add("boxes__fyrirsogn");
    result.querySelector("h4").classList.add("boxes__fyrirsogn__flokkur");
    result.querySelector("h3").classList.add("boxes__fyrirsogn__titill");

    document.querySelector(".boxes").appendChild(result);
    i++;
  }
}
