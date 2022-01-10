import { i13nStore } from "i13n-store";
import shopify from "./shopify";

const getUserId = () => i13nStore?.getState()?.get("uid") ?? shopify.getUid();

export default getUserId;
