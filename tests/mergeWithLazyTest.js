import {expect} from 'chai';
import sinon from 'sinon';

import {i13nDispatch} from '../cjs/src/index';
import i13nStore from '../cjs/src/stores/i13nStore';

describe('Test mergeWithLazy', () => {
  let spy;
  beforeEach(() => {
    spy = sinon.spy(i13nStore, 'mergeWithLazy');
  });
  afterEach(() => {
    spy.restore() 
    i13nDispatch('reset');
  });
  it('simple', () => {
    i13nStore.pushLazyAction({params: {foo: 'bar'}}, 'foo');
    let fakeAction = {params: {abc: 'def'}};
    fakeAction = i13nStore.mergeWithLazy(fakeAction, 'foo');
    expect(fakeAction).to.deep.include({
      params: {
        foo: 'bar',
        abc: 'def',
      },
    });
  });

  it('complex', () => {
    i13nStore.pushLazyAction({params: {foo: {abc: 'def', bar: 'def'}}}, 'foo');
    let fakeAction = {params: {foo: {abc: 'bar'}}};
    fakeAction = i13nStore.mergeWithLazy(fakeAction, 'foo');
    expect(fakeAction).to.deep.include({
      params: {
        foo: {abc: 'bar', bar: 'def'},
      },
    });
  });

  it('with handle action', () => {
    i13nStore.pushLazyAction({params: {foo: 'bar'}}, 'foo');
    i13nDispatch('action', {withLazy: 'foo'});
    const spyArg = spy.lastCall.lastArg;
    expect(spyArg).to.equal('foo');
  });

  it('with handle stop', () => {
    i13nStore.pushLazyAction({params: {wait: 999, stop: true, a: 'b'}}, 'foo');
    i13nDispatch('action', {withLazy: 'foo', wait: 777, stop: false});
    const lastReturnValue = spy.lastCall.returnValue;
    expect(lastReturnValue).to.deep.equal({params: {a: 'b', wait: 777, stop: false}, type: 'action'});
  });
});

describe('Test remove lazy', () => {
  afterEach(() => {
    i13nDispatch('reset');
  });

  it('should not exists after merge', ()=>{
    i13nStore.pushLazyAction({params: {wait: 999, stop: true, a: 'b', lazyKey: 'foo'}}, 'foo');
    const laze = i13nStore.getLazy('foo');
    expect(Object.keys(laze)).to.have.lengthOf(1);
    i13nDispatch('action', {withLazy: 'foo'});
    const afterWithLazy = i13nStore.getLazy('foo');
    expect(afterWithLazy).to.be.undefined;
  });
});
