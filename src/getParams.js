const PARAMS = "params";
import get from "get-object-value";

const getParams = (action) => get(action, [PARAMS], {});

export default getParams;
