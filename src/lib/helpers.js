export function empty(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

// fall sem býr til nýtt element.
// mismunandi virkni eftir því hvort það sé að bæta við
// nýju elementi eða setja inn mynd eða textanóðu
export function el(nafn, ...children) {
  const element = document.createElement(nafn);
  Array.from(children).forEach((child) => {
    if (nafn === 'img') {
      // ef við erum að vinna í mynd
      if (child !== null) {
        element.src = child;
      }
    } else if (typeof child === 'string') {
      // ef við erum að vinna með börn sem eru textar
      element.appendChild(document.createTextNode(child));
    } else {
      // ef við erum að vinna með börn sem eru element
      element.appendChild(child);
    }
  });
  return element;
}
