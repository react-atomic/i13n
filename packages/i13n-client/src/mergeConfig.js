import set from 'set-object-value';

const mergeConfig = (conf, merges) => {
  if (!merges) {
    return conf;
  }
  merges.forEach(({path, value, append}) => set(conf, path, value, append));
  return conf;
};

export default mergeConfig;
