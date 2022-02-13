import { doc } from "win-doc";
import callfunc from "call-func";
import { getUrl } from "seturl";

const getScriptTagId = () => {
  const script = doc().currentScript;
  if (script) {
    const id = getUrl("id", script.src);
    return id;
  }
};

export { getScriptTagId };
