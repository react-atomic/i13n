import {expect} from 'chai';
import jsdom from 'jsdom-global';
import sinon from 'sinon';
jsdom(null, {url: 'http://localhost'});

import MpGTag from '../cjs/src/mp.gtag';


describe('Test push', ()=>{
  it('simple test', ()=>{
    const mp = new MpGTag(); 
    const uBeacon = sinon.spy();
    mp.push(null, uBeacon);
    const args = uBeacon.getCall(0).args;
    expect(args[0]).to.equal('undefined/collect');
    expect(args[1]).to.include({dl: 'http://localhost/'});
  });
});
