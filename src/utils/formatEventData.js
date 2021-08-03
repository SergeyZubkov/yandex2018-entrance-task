import { format } from "date-fns";
import ru from "date-fns/locale/ru";

export const formatDate = (date) => {
  return format(date, "d MMMM", { locale: ru });
};

export const formatTimeStartEnd = (dateStart, dateEnd) => {
  const formatedDateStart = format(dateStart, "H:mm");

  const formatedDateEnd = format(dateEnd, "H:mm");

  return `${formatedDateStart} ${"\u2014"} ${formatedDateEnd}`;
};

export const getRoomTitle = (room) => room.title;

export const formatRoom = (room) => {
  const roomTitle = getRoomTitle(room);

  return roomTitle[0].toUpperCase() + roomTitle.slice(1);
};
