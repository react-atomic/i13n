import {expect} from 'chai';
import jsdom from 'jsdom-global';

import DataLayerToMp from '../cjs/src/DataLayerToMp';

describe('Test DataLayerToMp', () => {
  const oDlToMp = new DataLayerToMp();
  let resetDom;

  beforeEach(() => {
    resetDom = jsdom(null, {url: 'http://localhost'});
  });
  afterEach(() => {
    resetDom();
  });

  it('Test getClientId', () => {
    const id = oDlToMp.getClientId();
    expect(oDlToMp.getClientIdCookie()).to.equal(id);
  });

  it('Test isSameHost', () => {
    const isSame = oDlToMp.isSameHost('localhost');
    const same = isSame('http://localhost');
    expect(same).to.be.true;
    const diff = isSame('http://google.com');
    expect(diff).to.be.false;
  });

  it('Test getReferrer', () => {
    const data = oDlToMp.getReferrer({
      referrer: 'https://fake.com',
    });
    expect(data).to.deep.equal({dr: 'https://fake.com'});
  });

  it('Test getReferrer (empty)', () => {
    const data = oDlToMp.getReferrer();
    expect(data).to.be.undefined;
  });

  it('Test getReferrer (same host)', () => {
    const data = oDlToMp.getReferrer({
      location: {hostname: 'localhost'},
      referrer: 'http://localhost/shopping',
    });
    expect(data).to.be.undefined;
  });

  it('Test getActionData', () => {
    const data = oDlToMp.getActionData();
    expect(data).to.deep.equal({
      ec: undefined,
      ea: undefined,
      el: undefined,
      ev: undefined,
    });
  });

  it('Test getItemsData', () => {
    const data = oDlToMp.getItemsData([1]);
    expect(data).to.deep.equal({});
  });

  it('Test getEcPromotionData', () => {
    const data = oDlToMp.getEcPromotionData({});
    expect(data).to.deep.equal({promoa: 'view'});
  });

  it('Test setOnePromotion', () => {
    const item = {};
    const data = {};
    oDlToMp.setOneProduct('pr1', data, item);
    expect(data).to.deep.equal({
      pr1id: undefined,
      pr1nm: undefined,
      pr1ca: undefined,
      pr1cc: undefined,
      pr1br: undefined,
      pr1va: undefined,
      pr1ps: undefined,
      pr1pr: undefined,
    });
  });

  it('Test setOneProduct', () => {
    const item = {
      dimension2: 'abc',
      metric3: 100,
    };
    const data = {};
    oDlToMp.setOneProduct('foo', data, item);
    expect(data).to.include({foocd2: 'abc', foocm3: 100});
  });

  it('Test getEcPurchaseData', () => {
    const purchase = oDlToMp.getEcPurchaseData({});
    expect(purchase).to.deep.equal({
      pa: 'purchase',
      ti: undefined,
      ta: undefined,
      tr: undefined,
      tt: undefined,
      ts: undefined,
      tcc: undefined,
    });
  });

  it('Test getEcPurchaseData (refund)', () => {
    const refund = oDlToMp.getEcPurchaseData(null, {});
    expect(refund).to.deep.equal({
      pa: 'refund',
      ti: undefined,
    });
  });

  it('Test getEcStepData (checkout)', () => {
    const data = oDlToMp.getEcStepData({});
    expect(data).to.deep.equal({
      cos: undefined,
      col: undefined,
      pa: 'checkout',
    });
  });

  it('Test getEcStepData (checkout_option)', () => {
    const data = oDlToMp.getEcStepData(null, {});
    expect(data).to.deep.equal({
      cos: undefined,
      col: undefined,
      pa: 'checkout_option',
    });
  });

  it('Test getEcActionData', () => {
    const data = oDlToMp.getEcActionData({});
    expect(data).to.deep.equal({});
  });

  it('Test getEcActionData (detail)', () => {
    const data = oDlToMp.getEcActionData(
      {
        products: [
          {
            category: 'uCategory',
            list: 'uList',
          },
        ],
      },
      'detail',
    );
    expect(data).to.deep.equal({pr1ca: 'uCategory', pa: 'detail'});
  });

  it('Test getEcImpressionsData', () => {
    const empty = oDlToMp.getEcImpressionsData([{}]);
    expect(empty).to.deep.equal({
      il1nm: undefined,
      il1pi1id: undefined,
      il1pi1nm: undefined,
      il1pi1ca: undefined,
      il1pi1br: undefined,
      il1pi1va: undefined,
      il1pi1ps: undefined,
      il1pi1pr: undefined,
    });
    const data = oDlToMp.getEcImpressionsData([
      {
        name: 'Triblend Android T-Shirt', // Name or ID is required.
        id: '12345',
        price: '15.25',
        brand: 'Google',
        category: 'Apparel',
        variant: 'Gray',
        list: 'Search Results',
        position: 1,
      },
    ]);
    expect(data).to.deep.equal({
      il1nm: 'Search Results',
      il1pi1id: '12345',
      il1pi1nm: 'Triblend Android T-Shirt',
      il1pi1ca: 'Apparel',
      il1pi1br: 'Google',
      il1pi1va: 'Gray',
      il1pi1ps: 1,
      il1pi1pr: '15.25',
    });
  });

  it('Test getEcData', () => {
    const data = oDlToMp.getEcData({
      ecommerce: {},
    });
    expect(data).to.deep.equal({cu: undefined});
  });

  it('Test getMp', () => {
    const data = oDlToMp.getMp(null, {
      lazeInfoIndex: 1,
      lazeInfo: '{"from":"http://localhost","time":"2019-03-18T04:39:19Z"}'
    });
    expect(data).to.include({
      _s: 1,
      dl: 'http://localhost/',
      ul: 'en-us',
      de: 'UTF-8',
      dt: '',
      sd: '24-bit',
      sr: '0x0',
      vp: '1024x768',
      je: 0,
      v: 1,
      t: 'event',
    });
    expect(data.qt+'').to.not.empty;
  });

  it('Test worng lazeInfo time format with getmp', ()=>{
    const data = oDlToMp.getMp(null, {
      lazeInfoIndex: 0,
      lazeInfo: '{"from":"http://localhost","time":"0000-00-00 00:00:00"}'
    });
    expect(data.qt).to.be.undefined;
  });
});
