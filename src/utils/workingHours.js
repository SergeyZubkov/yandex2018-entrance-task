import { parse } from "date-fns";
import { set, startOfTomorrow } from "date-fns";

const start = parse("8:00", "H:mm", new Date());
const end = parse("23:00", "H:mm", new Date());

const getCorrectDate = () => {
  const date = new Date();

  if (
    date < set(date, { hours: start.getHours(), minutes: start.getMinutes() })
  ) {
    return set(date, { hours: start.getHours(), minutes: start.getMinutes() });
  }

  if (date > set(date, { hours: end.getHours(), minutes: end.getMinutes() })) {
    return startOfTomorrow();
  }
  return date;
};

export default {
  start,
  end,
  getCorrectDate,
};
