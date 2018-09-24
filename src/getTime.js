const getTime = () => {
  const date = new Date();
  const arr = [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
  ];
  return {
    toArray: () => arr,
    toString: () =>
      [arr.slice(0, 3).join('-'), arr.slice(3).join(':')].join(' '),
  };
};

export default getTime;
