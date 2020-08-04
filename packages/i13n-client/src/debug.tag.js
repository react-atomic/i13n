import BaseTag from "./BaseTag";

const c = console;

class DebugTag extends BaseTag {
  init() {
    const state = this.getState().toJS();
    c.log("init", state, JSON.stringify(state));
  }

  action() {
    const i13n = this.getClone("I13N");
    c.log("action", i13n, JSON.stringify(i13n));
  }

  impression() {
    const i13n = this.getClone("i13nPage");
    c.log("impression", i13n, JSON.stringify(i13n));
  }
}

export default DebugTag;
