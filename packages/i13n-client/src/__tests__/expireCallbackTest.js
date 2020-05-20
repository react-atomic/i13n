import {expect} from 'chai';
import sinon from 'sinon';

import getTimestamp from "../getTimestamp";
import expireCallback from '../expireCallback';

describe("Test expireCallback", ()=>{
  let clock;
  beforeEach(() => {
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
  });

  it("test run", ()=>{
    const acture = expireCallback(0, 1, ()=>'foo', ()=>'bar');
    expect(acture).to.equal('foo');
  });

  it("test expire callback", ()=>{
    const acture = expireCallback(0, 0, ()=>'foo', ()=>'bar');
    expect(acture).to.equal('bar');
  });
});
