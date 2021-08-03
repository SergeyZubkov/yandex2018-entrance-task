import "./Scedule.css";

import SceduleHeader from "./scedule-header/SceduleHeader";
import SceduleLabel from "./scedule-aside/scedule-label/SceduleLabel";
import SceduleTimeline from "./scedule-timeline/SceduleTimeline";
import SceduleAside from "./scedule-aside/SceduleAside";

import { uniq } from "lodash";
import { useQuery, useReactiveVar } from "@apollo/client";

import { FETCH_EVENTS_BY_DATE, FETCH_ALL_ROOMS } from "../queries.js";

import { endOfDay } from "date-fns";

import { pickedDateStartVar } from "..";

function Scedule() {
  const date = endOfDay(useReactiveVar(pickedDateStartVar));
  console.log("pickedDateStartVar", date);
  const { data: dataEvents, loading, error } = useQuery(FETCH_EVENTS_BY_DATE, {
    variables: { date },
  });

  const {
    data: dataRooms,
    loading: loadingRooms,
    error: errorRooms,
  } = useQuery(FETCH_ALL_ROOMS);

  if (loading || loadingRooms) return "Loading...";

  if (error || errorRooms) {
    console.error(error);
    return "Error";
  }

  const { eventsOnDate: events } = dataEvents;
  const { rooms } = dataRooms;

  const getStageNmbs = () => {
    const floorNmbs = rooms.map((r) => r.floor);

    return uniq(floorNmbs);
  };
  const stageNmbs = getStageNmbs().sort((a, b) => a - b);

  const getRoomsOnFloor = (floor) =>
    rooms.filter((room) => room.floor === floor);

  const renderColumnsContent = () => {
    const roomNames = [];
    const timelines = [];

    stageNmbs.forEach((stageNmb) => {
      // const sceduleGroupLabel =
      //     <SceduleGroupLabel {...stageNmb} />

      const roomsOnFloor = getRoomsOnFloor(stageNmb);

      const roomNamesChunk = roomsOnFloor.map((room) => (
        <SceduleLabel
          key={room.id}
          title={room.title}
          subtitle={room.capacity}
        />
      ));

      const timelinesChunk = roomsOnFloor.map((room) => {
        const roomEvents = events.filter((e) => e.room.id === room.id);

        return (
          <SceduleTimeline key={room.id} forRoom={room} events={roomEvents} />
        );
      });

      roomNames.push(
        // sceduleGroupLabel,
        ...roomNamesChunk
      );

      timelines.push(...timelinesChunk);
    });

    return [roomNames, timelines];
  };

  const [roomNames, timelines] = renderColumnsContent();

  return (
    <div className="scedule">
      <SceduleHeader />
      <div className="scedule__content">
        <SceduleAside>{roomNames}</SceduleAside>
        <div className="scedule__timelines">{timelines}</div>
      </div>
    </div>
  );
}

export default Scedule;
