import {
  differenceInMinutes,
  getHours,
  getMinutes,
  startOfDay,
  addMilliseconds,
  isPast,
} from "date-fns";
import { pickedDateStartVar } from "../..";

import workingHours from "../../utils/workingHours";

// на графике по краям имеются неактивные получасовые промежутки-отступы,
// которые прибавляет час к времянной дистанции, но не участвуют
// в определении времени
const DISABLED_HOURS = 60;
// получасовой отступ на графике с лева и права
const HALF_HOURS_PADDING = DISABLED_HOURS / 2;
function getPercentsDistanceOfMin() {
  const timeStart = workingHours.start;
  const timeEnd = workingHours.end;

  const diff = differenceInMinutes(timeEnd, timeStart);

  // плюс час, который складывается из
  // двух отступов по краям
  return 100 / (diff + DISABLED_HOURS);
}

function minutesToPcDistance(minutes) {
  return minutes * getPercentsDistanceOfMin();
}

function minutesToPcLeftOffset(minutes) {
  return minutesToPcDistance(minutes + HALF_HOURS_PADDING);
}

function getTimeInMins(date) {
  return getHours(date) * 60 + getMinutes(date);
}

function percentOffsetToTime(percentOffset) {
  const minToMs = (min) => (min - 30) * 60 * 1000;

  return (
    minToMs(Math.ceil(percentOffset / getPercentsDistanceOfMin())) +
    workingHours.start.getHours() * 60 * 60 * 1000 +
    workingHours.start.getMinutes() * 60 * 1000
  );
}

function isEventExistAtTime(time, events) {
  if (!events.length) return false;

  const date = events[0].dateStart;

  const hours = Math.floor(time / 1000 / 60 / 60);
  time -= hours * 60 * 60 * 1000;
  const minutes = Math.floor(time / 1000 / 60);

  const specifiedDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hours,
    minutes
  );

  return events
    .map((e) => {
      return {
        ...e,
      };
    })
    .some(
      (e) =>
        e.dateStart === specifiedDate ||
        e.dateEnd === specifiedDate ||
        (e.dateStart < specifiedDate && e.dateEnd > specifiedDate)
    );
}

function isPassedTime(timeMs) {
  return isPast(addMilliseconds(startOfDay(pickedDateStartVar()), timeMs));
}

export {
  minutesToPcLeftOffset,
  minutesToPcDistance,
  percentOffsetToTime,
  isEventExistAtTime,
  getTimeInMins,
  isPassedTime,
};
