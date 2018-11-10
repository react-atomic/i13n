import {expect} from 'chai';
import sinon from 'sinon';
import {i13nDispatch} from '../cjs/src/index';
import i13nStore from '../cjs/src/stores/i13nStore';


describe('Test getLazy', () => {

  afterEach(() => {
    i13nDispatch('reset');
  });

  it('get empty', () => {
      const actual = i13nStore.getLazy();
      expect({}).to.deep.equal(actual);
  });

  it('get map', () => {
      const fakeMap = {params: {foo: 'bar'}};
      i13nStore.pushLazyAction(fakeMap, 'foo');
      const actual = i13nStore.getLazy('foo');
      delete actual.params.lazeInfo;
      expect(actual).to.deep.include(fakeMap);
  });
});
