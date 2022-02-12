import mpTag from "../actions/mp.tag";
import heeding from "../libs/heeding";

const regTag =
  (store) =>
  ({ init, action, impression }) => {
    store.addListener(heeding(init, "init"));
    store.addListener(heeding(action, "action"));
    store.addListener(heeding(impression, "impression"));
  };

export default regTag;
