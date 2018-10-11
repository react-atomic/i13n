const getOptionText = sel => {
  const val = sel.value;
  const option = sel.querySelector("option[value='" + val + "']");
  let text;
  if (option) {
    text = option.text;
  }
  return text;
};

export default getOptionText;
