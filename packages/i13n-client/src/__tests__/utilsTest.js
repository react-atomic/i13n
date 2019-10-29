import {expect} from 'chai';

import utils from '../utils';
import {setDebugFlag} from '../logError';

describe('Test Parse Json', () => {
  it('simple test', ()=>{
    const a = '{"foo": "bar"}';
    expect(utils().parseJson(a)).to.deep.equal({foo:"bar"});
  });
  it('test illegal', ()=>{
    const a = '{"foo":}';
    setDebugFlag(true);
    const run = () => utils().parseJson(a)
    expect(run).to.throw();
  });
});
