import logError from './logError';
const parseJson = strJson => {
  try {
    return JSON.parse(strJson);
  } catch (e) {
    logError(e, 'I13nScriptErr');
  }
};
export default parseJson;
