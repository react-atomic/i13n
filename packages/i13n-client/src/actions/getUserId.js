import shopify from "../actions/shopify";
import { i13nStore } from "../stores/i13nStore";

const getUserId = () => i13nStore?.getState()?.get("uid") ?? shopify.getUid();

export default getUserId;
