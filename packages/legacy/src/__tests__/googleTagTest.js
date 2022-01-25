import { expect } from "chai";
import GoogleTag from "../google.tag";
import { i13nStore, i13nDispatch } from "i13n-store";

describe("Test Google Tag", () => {
  beforeEach(() => {
    i13nStore.reset();
    i13nDispatch("reset");
  });

  it("Test UA Action", (done) => {
    const gTag = new GoogleTag();
    const fakeStream = () => {
      return {
        push: (d) => {
          expect(d.event).to.equal("lucencyEventAction");
          done();
        },
      };
    };
    gTag.register(i13nStore, "gtag");
    i13nDispatch({
      tag: {
        gtag: {
          gaId: "UA-xxx",
        },
      },
    });
    gTag.downstreams.push(fakeStream());
    gTag.push({
      trigger: "action",
    });
  });

  it("Test GA4 Action", (done) => {
    const gTag = new GoogleTag();
    const fakeStream = () => {
      return {
        push: (d) => {
          expect(d.event).to.equal("lucency4Action");
          done();
        },
      };
    };
    gTag.register(i13nStore, "gtag");
    i13nDispatch({
      tag: {
        gtag: {
          gaId: "G-xxx",
        },
      },
    });
    gTag.downstreams.push(fakeStream());
    gTag.push({
      trigger: "action",
    });
  });

  it("Test mergeLabel when is string", () => {
    const gTag = new GoogleTag();
    const uLabel = "sss";
    const acture = gTag.mergeLabel(uLabel);
    expect(acture).to.equal(uLabel);
  });

  it("Test mergeLabel when is object", () => {
    const gTag = new GoogleTag();
    const uLabel = { foo: "bar" };
    const acture = gTag.mergeLabel(uLabel);
    expect(acture).to.equal('{"foo":"bar"}');
  });

  it("Test mergeLabel when is string with more", () => {
    const gTag = new GoogleTag();
    const uLabel = "sss";
    const acture = gTag.mergeLabel(uLabel, { more: "more" });
    expect(acture).to.equal('{"label":"sss","more":"more"}');
  });

  it("Test mergeLabel when is object with more", () => {
    const gTag = new GoogleTag();
    const uLabel = { foo: "bar" };
    const acture = gTag.mergeLabel(uLabel, { more: "more" });
    expect(acture).to.equal('{"foo":"bar","more":"more"}');
  });

  it("Test mergeLabel when is sameKey with more", () => {
    const gTag = new GoogleTag();
    const uLabel = { foo: "bar", more: "more" };
    const acture = gTag.mergeLabel(uLabel, { more: "new-more" });
    expect(acture).to.equal('{"foo":"bar","more":"new-more"}');
  });
});
