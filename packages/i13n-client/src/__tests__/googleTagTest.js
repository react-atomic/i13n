import { expect } from "chai";
import GoogleTag from "../google.tag";
import i13nStore from "i13n-store";
import { i13nDispatch } from "i13n";

describe("Test Google Tag", () => {
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
});
