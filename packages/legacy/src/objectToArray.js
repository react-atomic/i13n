const keys = Object.keys;

const objectToArray = (obj) => keys(obj || {}).map((key) => obj[key]);

export default objectToArray;
