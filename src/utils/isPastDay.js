import { endOfDay, isPast } from "date-fns";

export default (date) => {
  return isPast(endOfDay(date));
};
