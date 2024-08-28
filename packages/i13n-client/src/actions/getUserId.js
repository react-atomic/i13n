import { i13nStore } from "../stores/i13nStore";

const getUserId = () => i13nStore?.getState()?.get("uid");

export default getUserId;
