import mpTag from "../actions/mp_tag";
import heeding from "../libs/heeding";

const regTag =
  (store) =>
  ({ init, action, impression }) => {
    init && store.addListener(heeding(init, "init"));
    action && store.addListener(heeding(action, "action"));
    impression && store.addListener(heeding(impression, "impression"));
  };

export default regTag;
