import text from './text';
const arraySearch = (arr, key, value) =>
  arr.filter(
    a =>
      -1 !==
      text(a[key])
        .toLowerCase()
        .indexOf(text(value).toLowerCase()),
  );

export default arraySearch;
