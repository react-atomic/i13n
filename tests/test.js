import {expect} from 'chai';
import sinon from 'sinon'
import jsdom from 'jsdom-global'
jsdom(null, {url: 'http://localhost'});

import {i13nDispatch} from '../cjs/src/index';
import i13nStore from '../cjs/src/stores/i13nStore';
import {localStorage, Storage} from 'get-storage';

describe('Test I13N', ()=>{
  afterEach( () => {
    i13nDispatch('config/reset')
  })

  it('test dispatch set', ()=>{
    i13nDispatch('config/set', {foo:'bar'})
    const state = i13nStore.getState()
    expect(state.get('foo')).to.equal('bar')
  })

  it('test dispatch action', ()=>{
    const actionHandler = sinon.spy(state => state)
    i13nDispatch(
      'config/set',
      {actionHandler}
    )
    expect(actionHandler.called).to.be.false
    i13nDispatch('action')
    expect(actionHandler.called).to.be.true
  })

  it('test dispatch view', () => {
    const impressionHandler = sinon.spy(state => state)
    i13nDispatch(
      'config/set',
      {impressionHandler}
    )
    expect(impressionHandler.called).to.be.false
    i13nDispatch('view')
    expect(impressionHandler.called).to.be.true
    const state = i13nStore.getState()
    expect(state.get('lastUrl')).to.equal('http://localhost/')
  })

  it('test init', ()=>{
    const impressionHandler = sinon.spy(state => state)
    const initHandler = sinon.spy((state, action, done)=>done(state))
    i13nDispatch(
      'config/set',
      {impressionHandler, initHandler}
    )
    expect(!!i13nStore.getState().get('init')).to.be.false
    i13nDispatch('view')
    expect(initHandler.called).to.be.true
    expect(i13nStore.getState().get('init')).to.be.true
    expect(initHandler.callCount).to.equal(1)
    i13nDispatch('view')
    expect(initHandler.callCount).to.equal(1)
    expect(impressionHandler.callCount).to.equal(2)
  })

  it('test getWithLazy - simple', ()=>{
     i13nStore.pushLazyAction(
      {params: {foo:'bar'}},
      'foo'
     ); 
     let fakeAction = {params: {abc: 'def'}};
     fakeAction = i13nStore.mergeWithLazy(fakeAction, 'foo'); 
     expect(fakeAction).to.deep.include(
      {params: {
        foo: 'bar',
        abc: 'def'
      }}
     );
  });

  it('test getWithLazy - complex', ()=>{
     i13nStore.pushLazyAction(
      {params: {foo: {abc: 'def', bar: 'def'}}},
      'foo'
     ); 
     let fakeAction = {params: {foo: {abc: 'bar'}}};
     fakeAction = i13nStore.mergeWithLazy(fakeAction, 'foo'); 
     expect(fakeAction).to.deep.include(
      {params: {
        foo: {abc: 'bar', bar: 'def'}
      }}
     );
  });
})
