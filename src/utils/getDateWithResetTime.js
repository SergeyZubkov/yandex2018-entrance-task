import { set } from "date-fns";

function getDateWithResetTime(date) {
  return set(date, { hours: 0, minutes: 0 });
}

export default getDateWithResetTime;
