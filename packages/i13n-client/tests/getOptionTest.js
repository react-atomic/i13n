import {expect} from 'chai';
import {create} from 'create-el';

import getOptionText from '../cjs/src/getOptionText';

describe('Test Get Option', ()=>{
  before(()=>{
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
