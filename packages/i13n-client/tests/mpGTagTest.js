import {expect} from 'chai';
import jsdom from 'jsdom-global';
jsdom(null, {url: 'http://localhost'});

import MpGTag from '../cjs/src/mp.gtag';


describe('Test push', ()=>{
  it('simple test', ()=>{
    const mp = new MpGTag(); 
    mp.push();
  });
});
