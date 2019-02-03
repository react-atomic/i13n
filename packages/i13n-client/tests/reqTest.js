import jsdom from 'jsdom-global';
import {expect} from 'chai';
import sinon from 'sinon';
import req, {beacon} from '../cjs/src/req';

const genString = len => {
  let x = '1234567890';
  for (let i = 0; i < len; i++) {
    x += x;
  }
  return x;
};

describe('Test Request', () => {
  let uGlobal;
  beforeEach(() => {
    uGlobal = jsdom();
  });
  afterEach(() => uGlobal());
  it('test beacon api', () => {
    window.navigator.sendBeacon = () => {};
    const uBeacon = sinon.spy(window.navigator, 'sendBeacon');
    beacon('http://localhost', {foo: 'bar', a: 'b'});
    expect(uBeacon.getCall(0).args).to.deep.equal([
      'http://localhost',
      'foo=bar&a=b',
    ]);
  });
  it('test xhr with get', () => {
    const uReq = sinon.spy(() => {});
    beacon('http://localhost', {foo: 'bar', a: 'b'}, uReq);
    expect(uReq.getCall(0).args).to.deep.equal([
      'http://localhost?foo=bar&a=b',
      null,
      'GET',
      undefined
    ]);
  });

  it('test xhr with post', () => {
    const uReq = sinon.spy(() => {});
    beacon('http://localhost', {foo: 'bar', a: genString(10)}, uReq);
    expect(uReq.getCall(0).args[2]).to.equal('POST');
  });
});
