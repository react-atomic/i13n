import simple from "./simple";
import { win } from "win-doc";
import { getScriptTagId } from "../libs/getTagId";

const tid = getScriptTagId();

simple(tid, { global: win() });
