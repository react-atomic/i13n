import {expect} from 'chai';

import arraySearch from '../arraySearch';

describe('Test arraySearch', ()=>{
  it('basic test', ()=>{
    const arr = [
      {},
      {a: ['xxx']},
      {
        a: 'foo',
      },
      {
        a: 'bar',
      }
    ];
    const acture = arraySearch(arr, 'a', 'BAR');
    expect(acture).to.deep.equal([{a: 'bar'}]);
  });

  it('test without key', ()=>{
    const arr = ['FOO', 'BAR'];
    const acture = arraySearch(arr, null, 'b');
    expect(acture).to.deep.equal(['BAR']);
  });

});
