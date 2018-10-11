const getOptionText = sel => {
  if (!sel) {
    return;
  }
  const val = sel.value;
  if (!val) {
    return;
  }
  const option = sel.querySelector("option[value='" + val + "']");
  let text;
  if (option) {
    text = option.text;
  }
  return text;
};

export default getOptionText;
