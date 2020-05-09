import BaseGTag from './BaseGTag';
import {beacon} from './req';
import DataLayerToMp from './DataLayerToMp';

const oDataLayerToMp = new DataLayerToMp();

class MpGTag extends BaseGTag {
  getHost() {
    const {mpHost, defaultMpHost} = this.props;
    return mpHost || defaultMpHost;
  }

  push(config, send) {
    const host = this.getHost();
    if (host) {
      if (!send) {
        send = beacon;
      }
      const d = oDataLayerToMp.getMp(this.props, config);
      // console.log([this.props, config, host, d]);
      if (d) {
        send(host+ '/collect', d);
      }
    } else {
      console.log('mp host not found');
    }
  }
}

export default MpGTag;
