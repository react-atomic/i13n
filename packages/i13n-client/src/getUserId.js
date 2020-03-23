import i13nStore from "i13n-store";

const getUserId = () => i13nStore?.getState()?.get("uid");

export default getUserId;
