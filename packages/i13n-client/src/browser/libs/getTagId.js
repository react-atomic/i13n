// @ts-check

import { doc } from "win-doc";

export const getScriptTagId = () => {
  const script = /**@type {HTMLScriptElement}*/ (doc().currentScript);
  if (script) {
    const id = new URL(script.src).searchParams.get("id");
    return id;
  }
};
