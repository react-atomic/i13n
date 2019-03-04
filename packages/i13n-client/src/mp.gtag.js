import {removeEmpty} from 'array.merge';
import BaseGTag from './BaseGTag';
import {beacon} from './req';
import DataLayerToMp from './DataLayerToMp';

const oDataLayerToMp = new DataLayerToMp();

class MpGTag extends BaseGTag {
  getHost() {
    const {mpHost, defaultMpHost} = this.props;
    let host = mpHost || defaultMpHost;
    host += '/collect';
    return host;
  }

  push(config, send) {
    const host = this.getHost();
    const d = oDataLayerToMp.getMp(this.props, config);
    // console.log([this.props, config, host, d]);
    if (!send) {
      send = beacon;
    }
    send(host, removeEmpty(d, true));
  }
}

export default MpGTag;
