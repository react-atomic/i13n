const fixDigit = i => (i < 10) ? 0+''+i : i;

const getTime = s => {
  const date = s ? new Date(s) : new Date();
  const arr = [
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
  ].map(v => fixDigit(v));
  return {
    toArray: () => arr,
    toString: () =>
      [arr.slice(0, 3).join('-'), 'T', arr.slice(3).join(':'), 'Z'].join(''),
  };
};

export default getTime;
