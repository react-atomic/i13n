import { i13nStore } from "../stores/i13nStore";
import mpTag from "../actions/mp_tag";

const getTag = (tagConfig) => {
  tagConfig.store = i13nStore;
  switch (tagConfig.type) {
    default:
      mpTag(tagConfig);
      break;
  }
};

export default getTag;
