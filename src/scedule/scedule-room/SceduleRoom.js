import { useState } from "react";
import "./SceduleRoom.css";

import ButtonToCreateEvent from "./ButtonToCreateEvent";

import ReactCursorPosition from "react-cursor-position";

import {
  percentOffsetToTime,
  isEventExistAtTime,
  isPassedTime,
} from "../utils";

function SceduleRoom({ id, title, capacity, events, floor }) {
  const [buttonProps, setButtonProps] = useState({
    show: false,
    left: null,
  });

  const getPercentOffsetRelativeToParent = (cursorX, parent) => {
    return (cursorX / (parent / 100)).toFixed(4);
  };

  const handleCursorPositionChange = (props) => {
    // / ширина контейнра с событиями
    // соотносится с временной шкалой
    const widthEl = props?.elementDimensions?.width;

    if (props.isPositionOutside || !widthEl) {
      setButtonProps({
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
      setButtonProps({
        show: true,
        left: percentOffset,
      });
    } else {
      setButtonProps({
        show: false,
      });
    }
  };
  return (
    <div className="room">
      <div className="room__info">
        <div className="room__info-title">{title}</div>
        <div className="room__info-capacity">{`до ${capacity} человек`}</div>
      </div>
      <ReactCursorPosition
        className="room__events"
        onPositionChanged={handleCursorPositionChange}
        shouldDecorateChildren={false}
      >
        {buttonProps.show && (
          <ButtonToCreateEvent
            left={buttonProps.left}
            room={{ id, title, capacity, events, floor }}
          />
        )}
      </ReactCursorPosition>
    </div>
  );
}

export default SceduleRoom;
