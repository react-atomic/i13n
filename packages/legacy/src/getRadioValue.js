import query from "css-query-selector";

const getRadioValue = (selector) => {
  const sels =
    "string" === typeof selector ? query.all(selector) : [...selector];
  let value;
  sels.some((sel) => {
    if (sel.checked) {
      value = sel.value;
      return true;
    } else {
      return false;
    }
  });
  return value;
};

export default getRadioValue;
