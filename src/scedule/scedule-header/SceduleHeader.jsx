import { useState, useEffect, useRef } from "react";
import "./SceduleHeader.css";
import Calendar from "../../calendar/Calendar";

import {
  differenceInMinutes,
  differenceInHours,
  parse,
  getHours,
  format,
  addMinutes,
  set,
  isToday,
} from "date-fns";

import workingHours from "../../utils/workingHours";
import { pickedDateStartVar } from "../../index";
import isPastDay from "../../utils/isPastDay";
import { useReactiveVar } from "@apollo/client";
import { minutesToPcLeftOffset } from "../utils";

function SceduleHeader() {
  const timeStart = workingHours.start;
  const timeEnd = workingHours.end;

  const pickedDateStart = useReactiveVar(pickedDateStartVar);

  const setPickedDateStartVar = (date) => {
    if (!isToday(date)) {
      date = set(date, {
        hours: workingHours.start.getHours(),
        minutes: workingHours.start.getMinutes(),
      });
    }

    pickedDateStartVar(date);
  };

  const numberOfHours = differenceInHours(timeEnd, timeStart);

  const getHourLabels = () => {
    const hourLabels = Array.from({ length: numberOfHours }, (_, i) =>
      (getHours(timeStart) + i + 1).toString()
    );

    const firstLabel = format(timeStart, "H:mm");

    hourLabels.unshift(firstLabel);

    return hourLabels;
  };

  const hourLabels = getHourLabels();

  //часы
  const getCurrentTime = () => {
    const d = new Date();
    return d.toLocaleTimeString().slice(0, 5);
  };

  const timerId = useRef();
  const [currentTime, setCurrentTime] = useState(getCurrentTime());

  useEffect(() => {
    timerId.current = setInterval(() => setCurrentTime(getCurrentTime()), 1000);
    return () => clearInterval(timerId.current);
  }, []);

  const minutesAgo = differenceInMinutes(
    parse(currentTime, "H:mm", new Date()),
    timeStart
  );

  const handleChangeCalendar = (date) => {
    setPickedDateStartVar(date);
  };

  const showCurrentTime = !isPastDay(pickedDateStart);
  return (
    <div className="scedule__header">
      <Calendar onChange={handleChangeCalendar} initialDate={pickedDateStart} />
      <div className="timeline">
        {hourLabels.map((h) => (
          <div key={h} className="timeline-label">
            {h}
          </div>
        ))}

        {showCurrentTime && (
          <div
            className="timeline__mark timeline__mark--current-time"
            style={{
              left: minutesToPcLeftOffset(minutesAgo) + "%",
            }}
          >
            {currentTime}
          </div>
        )}
      </div>
    </div>
  );
}

export default SceduleHeader;
