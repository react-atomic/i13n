const text = el =>
  el != null
    ? (el.textContent || el.innerText
        ? el.textContent || el.innerText
        : el.trim
        ? el
        : el + "" + ""
      ).trim()
    : "";
export default text;
