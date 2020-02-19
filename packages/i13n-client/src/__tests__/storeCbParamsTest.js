import {expect} from 'chai';
import i13nStore from 'i13n-store';

import storeCbParams, {_LAST_EVENT, _I13N_CB_PARAMS} from '../storeCbParams';

describe('Test storeCbParams', () => {
  it('basic test', ()=>{
    storeCbParams();
  });
  it('test get event', ()=>{
    const evn = {currentTarget: 'foo'};
    storeCbParams(null, {currentTarget: 'foo'});
    const thisEventArr = i13nStore.getState().get(_LAST_EVENT).toJS();
    expect(thisEventArr).to.deep.equal([evn, evn.currentTarget]); 
  });
  it('test get params', ()=>{
    const params = {foo: 'bar'};
    storeCbParams(params);
    const thisParamArr = i13nStore.getState().get(_I13N_CB_PARAMS).toJS();
    expect(thisParamArr).to.deep.equal(params); 
  });
});
