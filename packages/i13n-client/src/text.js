const text = el =>
  el != null
    ? (null != el.textContent || null != el.innerText
        ? el.textContent ?? el.innerText ?? ""
        : el.trim
        ? el
        : el + "" + ""
      ).trim()
    : "";

export default text;
