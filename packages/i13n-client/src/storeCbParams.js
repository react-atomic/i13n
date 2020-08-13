import get from "get-object-value";
const store = [{}, []];

const storeCbParams = (params, e) => {
  store[0] = params || {};
  store[1] = e ? [e, get(e, ["currentTarget"])] : []; 
};

const getCbParams = () => store;

export default storeCbParams;
export { getCbParams };
