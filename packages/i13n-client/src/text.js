const text = el =>
  el ? (el.innerText ? el.innerText : el.trim ? el : '').trim() : '';

export default text;
