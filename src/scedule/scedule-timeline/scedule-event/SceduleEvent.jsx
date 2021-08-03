import "./SceduleEvent.css";
import { minutesToPcDistance, minutesToPcLeftOffset } from "../../utils";
import workingHours from "../../../utils/workingHours";
import {
  formatDate,
  formatTimeStartEnd,
  formatRoom,
} from "../../../utils/formatEventData";

import { isPast, differenceInMinutes, set } from "date-fns";

import ReactTooltip from "react-tooltip";
import { useHistory } from "react-router-dom";

function SceduleEvent({ id, title, dateStart, dateEnd, users = [], room }) {
  const calculateWidth = () => {
    const duration = differenceInMinutes(dateEnd, dateStart);
    return minutesToPcDistance(duration);
  };

  const calculateLeft = () => {
    const mins = differenceInMinutes(
      set(new Date, {
        hours: dateStart.getHours(),
        minutes: dateStart.getMinutes()
      }), 
      workingHours.start
    );

    return minutesToPcLeftOffset(mins);
  };

  const history = useHistory();

  const edit = () => {
    history.push(`/event/edit/${id}`);
  };

  const firstUser = users[0];
  return (
    <div
      className="scedule-event"
      style={{
        left: calculateLeft() + "%",
        width: calculateWidth() + "%",
      }}
      onClick={() => !isPast(dateStart) && edit()}
      data-tip
      data-for={"scedule-event__info" + id}
      data-place="bottom"
    >
      <ReactTooltip
        id={"scedule-event__info" + id}
        className="scedule-event__info"
        effect="solid"
        backgroundColor="white"
      >
        <h4 className="scedule-event__info-title">{title}</h4>
        <div className="scedule-event__info-details">
          {`${formatDate(dateStart)}, ${formatTimeStartEnd(
            dateStart,
            dateEnd
          )} ${"\u00B7"} ${formatRoom(room)}`}
        </div>
        {firstUser && (
          <div className="scedule-event__info-footer">
            <img
              className="avatar-icon"
              src={firstUser.avatarUrl.trim()}
              alt="participant"
            />
            <div className="participants">
              {firstUser.login} из {users.length} участников
            </div>
          </div>
        )}
      </ReactTooltip>
    </div>
  );
}

export default SceduleEvent;
