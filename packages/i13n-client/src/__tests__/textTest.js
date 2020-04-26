import {expect} from 'chai';

import text from '../text';


describe('Test To Text', ()=>{
  it('test assign number', ()=>{
    const vInt = text(1);
    expect(vInt).to.equal("1");
    const vFloat = text(1.1);
    expect(vFloat).to.equal("1.1");
  });

  it('test assign object', ()=>{
    expect(text({})).to.equal("[object Object]")
  });

  it('test assign innerText', ()=>{
    expect(text({innerText: 'foo'})).to.equal("foo")
  });
});
