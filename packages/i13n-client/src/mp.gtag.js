import {removeEmpty} from 'array.merge';
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
      const d = oDataLayerToMp.getMp(this.props, config);
      // console.log([this.props, config, host, d]);
      if (!send) {
        send = beacon;
      }
      send(host+ '/collect', removeEmpty(d, true));
    } else {
      console.log('mp host not found');
    }
  }
}

export default MpGTag;
