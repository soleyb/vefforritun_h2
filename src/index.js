import List from './lib/list';

document.addEventListener('DOMContentLoaded', () => {
  const page = document.querySelector('body');
  const isLecturePage = page.classList.contains('lecture-page');

  if (isLecturePage) {

  } else {
//    const list = new List();
//    list.load();
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
function allGreens(){
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
