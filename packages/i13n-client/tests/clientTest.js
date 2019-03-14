import {expect} from 'chai';
import i13nStore from 'i13n-store';
import jsdom from 'jsdom-global';
import client, {mergeConfig} from '../cjs/src/client';

jsdom(null, {url: 'http://localhost'});

describe('Test I13N', ()=>{
  it('simple test', done =>{
    client(null, ()=>done());
  });
  it('assign object', done =>{
    client({foo: 'bar'}, (o, process)=>{
      expect(o).to.deep.equal({foo: 'bar'});
      process(o);
      i13nStore.addListener(()=>{
        done();
      }, 'init');
    });
  });
});

describe('Test merge', ()=>{
  it('test replace', ()=>{
    const a = {
      foo: {
        a: 1,
        b: 2
      }
    };  
    mergeConfig(a, [
      {
        path: ['foo', 'b'],
        value: 3 
      }
    ]);
    expect(a.foo.b).to.equal(3);
  });

  it('test append', ()=>{
    const a = {
      foo: {bar: ['a', 'b']} 
    };  
    mergeConfig(a, [
      {
        path: ['foo', 'bar'],
        value: 'c',
        append: true
      }
    ]);
    expect(a.foo.bar).to.deep.equal(['a', 'b', 'c']);
  });
});
