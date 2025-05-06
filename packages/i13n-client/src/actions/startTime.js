import { getTimestamp } from "get-random-id";

const startTime = getTimestamp();

export default function () {
  return startTime;
}
