import {expect} from 'chai';
import {create} from 'create-el';
import jsdom from 'jsdom-global';

import getOptionText from '../getOptionText';

describe('Test Get Option', ()=>{
  let resetDom;

  beforeEach(()=>{
    resetDom = jsdom(null, {url: 'http://localhost'});
  });
  afterEach(()=>{
    resetDom();
  });
  it('simple test', ()=>{
    const innerHTML =`
      <select>
        <option value="1">foo</option>
        <option selected value="2">bar</option>
      </select>
    `;
    const d = create('div')()({
      innerHTML
    });
    const sel = d.querySelector('select');
    expect(getOptionText(sel)).to.equal('bar');
  });
});
