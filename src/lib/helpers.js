export default function empty(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}
