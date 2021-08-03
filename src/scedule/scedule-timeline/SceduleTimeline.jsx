import { useState } from "react";
import "./SceduleTimeline.css";
import SceduleEvent from "./scedule-event/SceduleEvent";
import ButtonToCreateEvent from "./ButtonToCreateEvent";

import ReactCursorPosition from "react-cursor-position";

import {
  percentOffsetToTime,
  isEventExistAtTime,
  isPassedTime,
} from "../utils";

function SceduleTimeline({ forRoom = null, events = [] }) {
  // кнопка "создать встречу", которая будет появляться
  // при наведении на свободное время
  const [btnProps, setBtnProps] = useState({
    show: false,
    left: 0,
  });

  const getPercentOffsetRelativeToParent = (cursorX, parent) => {
    return (cursorX / (parent / 100)).toFixed(4);
  };

  const handleCursorPositionChange = (props) => {
    // ширина контейнера с событиями
    // соотносится с временной шкалой
    const widthEl = props?.elementDimensions?.width;

    if (props.isPositionOutside || !widthEl) {
      setBtnProps({
        show: false,
      });

      return;
    }

    const x = props.position.x;

    const percentOffset = getPercentOffsetRelativeToParent(x, widthEl);

    const eventExistOnThisPoint = isEventExistAtTime(
      percentOffsetToTime(percentOffset),
      events
    );

    const pointOnPassedTime = isPassedTime(percentOffsetToTime(percentOffset));

    if (!eventExistOnThisPoint && !pointOnPassedTime) {
      setBtnProps({
        show: true,
        left: percentOffset,
      });
    } else {
      setBtnProps({
        show: false,
      });
    }
  };

  return (
    <ReactCursorPosition
      className="scedule__timeline"
      onPositionChanged={handleCursorPositionChange}
      shouldDecorateChildren={false}
    >
      {events.map(({ id, dateStart, dateEnd, ...otherProps }) => (
        <SceduleEvent
          id={id}
          key={id}
          dateStart={dateStart}
          dateEnd={dateEnd}
          {...otherProps}
        />
      ))}

      {btnProps.show && (
        <ButtonToCreateEvent left={btnProps.left} room={forRoom} />
      )}
    </ReactCursorPosition>
  );
}

export default SceduleTimeline;
