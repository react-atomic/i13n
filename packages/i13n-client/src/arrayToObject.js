const arrayToObject = (arr, key) => {
  const map = {};
  if (arr && arr.forEach) {
    arr.forEach(a => {
      if (a.hasOwnProperty(key)) {
        map[a[key]] = a;
      }
    });
  }
  return map;
};

export default arrayToObject;
