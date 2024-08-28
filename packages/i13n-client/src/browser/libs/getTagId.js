import { doc } from "win-doc";

const getScriptTagId = () => {
  const script = doc().currentScript;
  if (script) {
    const id = new URLSearchParams(script.src).get("id");
    return id;
  }
};

export { getScriptTagId };
