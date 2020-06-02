import {expect} from 'chai';
import jsdom from "jsdom-global";
import text from '../text';
import {create} from 'create-el';


describe('Test To Text', ()=>{
  let resetDom;

  beforeEach(() => {
    resetDom = jsdom();
  });

  afterEach(() => {
    resetDom();
  });
  it('test assign number', ()=>{
    const vInt = text(1);
    expect(vInt).to.equal("1");
    const vFloat = text(1.1);
    expect(vFloat).to.equal("1.1");
    const vZero = text(0);
    expect(vZero).to.equal("0");
    const vZeroFlot = text(0.0);
    expect(vZeroFlot).to.equal("0");
  });

  it('test assign object', ()=>{
    expect(text({})).to.equal("[object Object]")
  });

  it('test assign innerText', ()=>{
    expect(text({innerText: 'foo'})).to.equal("foo")
  });

  it('test empty innerText', ()=>{
    const span = create('span')()({id: 'unit-span'});
    expect(text(span)).to.equal("")
  });
});
