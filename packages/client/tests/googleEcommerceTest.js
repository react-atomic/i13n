import {expect} from 'chai';
import sinon from 'sinon';
import {getViewEcommerce, getActionEcommerce} from '../cjs/src/google.ecommerce.js';

describe('Test Google Action Ecommerce', ()=>{
  it('simple test', ()=>{
    getActionEcommerce({});
  });
});

describe('Test Google View Ecommerce', ()=>{
  it('simple test', ()=>{
    getViewEcommerce({});
  });
});
