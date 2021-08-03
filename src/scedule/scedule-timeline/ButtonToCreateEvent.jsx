import Button from "../../button/Button";

import { percentOffsetToTime } from "../utils";

import { addMilliseconds } from "date-fns";

import { useHistory } from "react-router-dom";
import { pickedDateStartVar, pickedRoomVar } from "../../index";
import getDateWithResetTime from "../../utils/getDateWithResetTime";

function ButtonToCreateEvent({ left, room }) {
  const history = useHistory();

  const calculateLeft = (percentages) => {
    const left = percentages;

    return left < 0 ? 0 : left;
  };

  const handleClick = () => {
    const ms = percentOffsetToTime(left);
    const dateWithResetTime = getDateWithResetTime(pickedDateStartVar());

    pickedDateStartVar(addMilliseconds(dateWithResetTime, ms));

    pickedRoomVar(room);

    history.push("/event/add");
  };

  return (
    <Button
      style={{
        height: "100%",
        zIndex: 10,
        position: "absolute",
        left: calculateLeft(left) + "%",
      }}
      onClick={handleClick}
    >
      +
    </Button>
  );
}

export default ButtonToCreateEvent;
