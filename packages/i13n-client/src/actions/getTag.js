import { i13nStore } from "../stores/i13nStore";
import callfunc from "call-func";

const getTag = (tagItem, tagOptions = {}, utils) => {
  tagOptions.store = i13nStore;
  tagOptions.utils = { ...utils, ...tagOptions.utils };
  callfunc(tagItem, [tagOptions]);
};

export default getTag;
