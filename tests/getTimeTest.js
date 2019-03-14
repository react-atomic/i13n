import {expect} from 'chai';
import {getTime} from '../cjs/src/index';

describe('Test getTime', () => {
  it('simple test', ()=>{
    const s = getTime('2019-03-14T21:33:06Z').toString();
    expect(new Date(s).toUTCString()).to.equal(
      'Thu, 14 Mar 2019 21:33:06 GMT'
    );
  });
});
