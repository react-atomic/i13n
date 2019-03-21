import set from 'set-object-value';

const mergeConfig = (conf, merges) =>
  merges &&
  merges.forEach(({path, value, append}) => set(conf, path, value, append));

export default mergeConfig;
