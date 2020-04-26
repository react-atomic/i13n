const text = el =>
  el ? 
    (el.innerText ?
      el.innerText : 
      el.trim ? 
        el:
        el + "" + "" 
    ).trim() :
    "";
export default text;
