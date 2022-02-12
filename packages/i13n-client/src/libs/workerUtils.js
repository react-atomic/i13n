import { i13nDispatch } from "../stores/i13nStore";

const workerUtils = () => ({
  dispatch: i13nDispatch,
});

export default workerUtils;
