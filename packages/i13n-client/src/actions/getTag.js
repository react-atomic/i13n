import { i13nStore } from "../stores/i13nStore";
import mpTag from "../actions/mp.tag";

const getTag = (config) => {
  config.store = i13nStore;
  switch (config.type) {
    default:
      mpTag(config);
      break;
  }
};

export default getTag;
