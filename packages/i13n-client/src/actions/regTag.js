import { heeding } from "i13n";
import mpTag from "../actions/mp_tag";

const regTag =
  (store) =>
  ({ init, action, impression }) => {
    init && store.addListener(heeding(init, "init"));
    action && store.addListener(heeding(action, "action"));
    impression && store.addListener(heeding(impression, "impression"));
  };

export default regTag;
