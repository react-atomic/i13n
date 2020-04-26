const text = el =>
  el != null ? 
    (el.innerText ?
      el.innerText : 
      el.trim ? 
        el:
        el + "" + "" 
    ).trim() :
    "";
export default text;
