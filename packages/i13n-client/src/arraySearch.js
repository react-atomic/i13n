import text from "./text";

const keywordMatch = (haystack, needle) => -1 !== text(haystack).toLowerCase().indexOf(text(needle).toLowerCase());

const exactMatch = (haystack, needle) => text(haystack) === text(needle);

const getHaystack = (haystack, key) => null == key ? haystack : haystack[key]

const arraySearch = (arr, key, value, exact) =>
  arr.filter(
    a =>
      exact ? exactMatch(getHaystack(a, key), value) : keywordMatch(getHaystack(a, key), value)
  );

export default arraySearch;
