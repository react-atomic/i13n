import {expect} from 'chai';
import sinon from 'sinon';
import Usergram from '../cjs/src/usergram.tag';
import i13nStore from 'i13n-store';
import {i13nDispatch} from 'i13n';

describe('Test Usergram', () => {
  Usergram.register(i13nStore, 'usergram');
  beforeEach(()=> {
    window.usergram = [];
    i13nDispatch('config/reset');
  });

  it('test with cv', () => {
      i13nDispatch({
        tag: { usergram: {
          cv: ['Purchase'], 
          attr: {
            name: 'prop03'
          }
        }},
        I13N: {
          action: 'Purchase',
          products: [
            {name: 'foo'}  
          ]
        }
      });
      Usergram.action();
      const last = window.usergram.pop();
      expect(last).to.deep.equal(
        [ 'send', undefined, 'cv', 'Purchase', { prop03: [ 'foo' ] } ]
      );
  });

  it('test without cv', () => {
      i13nDispatch({
        tag: { usergram: {}},
        I13N: {
          stepNo: 1,
          stepOption: "pay"
        }
      });
      Usergram.action();
      const last = window.usergram.pop();
      expect(last[4]).to.deep.include({label: {stepNo:1, stepOption: "pay"}});
  });
});
