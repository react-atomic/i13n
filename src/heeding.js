import callfunc from "call-func";
const heeding = (func, pool) => (state, action) => {
  if (state.get("nextEmit") === pool) {
    callfunc(func, [state, action]);
  }
};

export default heeding;
