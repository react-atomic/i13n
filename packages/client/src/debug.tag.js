import BaseTag, {toJS} from './BaseTag';

class DebugTag extends BaseTag {
  init() {
    const state = this.getState();
    console.log('init', state.toJS());
  }

  action() {
    var i13n = toJS(
      this.getState().get('I13N')
    );
    console.log('action', i13n);
  }

  impression() {
    var i13n = toJS(
      this.getState().get('i13nPage')
    );
    console.log('impression', i13n);
  }
}

const instance = new DebugTag();
export default instance;
