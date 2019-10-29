import {expect} from 'chai';
import jsdom from 'jsdom-global';
import sinon from 'sinon';

import MpGTag from '../mp.gtag';


describe('Test push', ()=>{
  let resetDom;

  beforeEach(()=>{
    resetDom = jsdom(null, {url: 'http://localhost'});
  });
  afterEach(()=>{
    resetDom();
  });
  it('test host not found', ()=>{
    const mp = new MpGTag(); 
    const uBeacon = sinon.spy();
    mp.push(null, uBeacon);
    expect(uBeacon.getCall(0)).to.be.null;
  });
  it('simple test', ()=>{
    const mp = new MpGTag({mpHost: 'http://mphost'}); 
    const uBeacon = sinon.spy();
    mp.push(null, uBeacon);
    const args = uBeacon.getCall(0).args;
    expect(args[0]).to.equal('http://mphost/collect');
    expect(args[1]).to.include({dl: 'http://localhost/'});
  });
});
