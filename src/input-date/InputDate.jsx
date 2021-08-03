import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { add, addMinutes, getHours, getMinutes, isToday } from "date-fns";
import ru from "date-fns/locale/ru";
import "./InputDate.css";

import getDateWithResetTime from "../utils/getDateWithResetTime";
import workingHours from "../utils/workingHours";

function InputDate({
  onChange,
  //{dateStart, dateEnd}
  selectedDate,
}) {
  console.log("initial Date", selectedDate);
  const [date, setDate] = useState(selectedDate.dateStart);
  const [startTime, setStartTime] = useState(selectedDate.dateStart);
  const [endTime, setEndTime] = useState(selectedDate.dateEnd);

  const minDate = new Date();
  const minTime = isToday(date) ? date : workingHours.start;
  const maxTime = workingHours.end;

  const handleChangeDate = (date) => {
    let d;

    if (isToday(date)) {
      d = workingHours.getCorrectDate();
      setStartTime(d);
    } else {
      d = date;
      setStartTime(workingHours.start);
    }

    addMinutes(startTime, 30);

    setDate(d);
  };

  useEffect(() => {
    onChange(computeStartEndDate());
  }, [date, startTime, endTime]);

  useEffect(() => {
    setEndTime(addMinutes(startTime, 30));
  }, [startTime]);

  const computeStartEndDate = () => {
    const dateWithResetTime = getDateWithResetTime(date);
    return {
      dateStart: add(dateWithResetTime, {
        hours: getHours(startTime),
        minutes: getMinutes(startTime),
      }),
      dateEnd: add(dateWithResetTime, {
        hours: getHours(endTime),
        minutes: getMinutes(endTime),
      }),
    };
  };

  return (
    <div className="input-date">
      <div className="field">
        <label htmlFor="event-title">Дата</label>
        <DatePicker
          locale={ru}
          dateFormat="dd MMMM, yyyy"
          selected={date}
          onChange={(date) => handleChangeDate(date)}
          monthsShown={3}
          minDate={minDate}
        />
      </div>
      <div className="field">
        <label htmlFor="event-title">Начало</label>
        <DatePicker
          className="input-time"
          locale={ru}
          selected={startTime}
          onChange={(time) => setStartTime(time)}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeCaption="Время"
          dateFormat="H:mm"
          minTime={minTime}
          maxTime={maxTime}
        />
      </div>
      <i dangerouslySetInnerHTML={{ __html: "&#8212;" }}></i>
      <div className="field">
        <label htmlFor="event-title">Конец</label>
        <DatePicker
          className="input-time"
          locale={ru}
          selected={endTime}
          onChange={(time) => setEndTime(time)}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeCaption="Время"
          dateFormat="H:mm"
          minTime={addMinutes(startTime, 30)}
          maxTime={maxTime}
        />
      </div>
    </div>
  );
}

export default InputDate;
