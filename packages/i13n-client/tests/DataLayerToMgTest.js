import {expect} from 'chai';
import jsdom from 'jsdom-global';
jsdom(null, {url: 'http://localhost'});

import DataLayerToMp from '../cjs/src/DataLayerToMp';

describe('Test setOneProduct', ()=>{
  const oDlToMp = new DataLayerToMp();
  it('test setOneProduct', ()=>{
    const item = {
      dimension2: 'abc',
      metric3: 100
    };
    const data = {};
    oDlToMp.setOneProduct('foo', data, item); 
    expect(data).to.include({foocd2: 'abc', foocm3: 100});
  });

  it('Test get client id', ()=>{
    const id = oDlToMp.getClientId(); 
    expect(oDlToMp.getClientIdCookie()).to.equal('GA1.2.'+id);
  });
});
