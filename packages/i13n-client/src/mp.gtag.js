import BaseGTag from './BaseGTag';
import get from 'get-object-value';
import {beacon} from './req';

class MpGTag extends BaseGTag {

  getHost() {
    const {mpHost, defaultMpHost} = this.props;
    let host = mpHost || defaultMpHost;
    host += '/collect';
    return host;
  }

  push(config) {
    const host = this.getHost();
    const d = {};
    const {event:ev} = get(config, null, {});
    d.t = -1 !== ev.toLowerCase().indexOf('view') ?
      'pageview' : 'event';
    console.log([this.props, config, host, d]);
    beacon(host, d);
  }
}

export default MpGTag;
