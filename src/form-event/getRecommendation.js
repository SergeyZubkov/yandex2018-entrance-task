const users = [
  { id: "uid1", homeFloor: 1 },
  { id: "uid2", homeFloor: 1 },
  { id: "uid3", homeFloor: 1 },
  { id: "uid4", homeFloor: 1 },
  { id: "uid5", homeFloor: 2 },
  { id: "uid6", homeFloor: 2 },
  { id: "uid7", homeFloor: 2 },
  { id: "uid8", homeFloor: 2 },
  { id: "uid9", homeFloor: 3 },
  { id: "uid10", homeFloor: 3 },
  { id: "uid11", homeFloor: 3 },
  { id: "uid12", homeFloor: 3 },
  { id: "uid13", homeFloor: 3 },
];

const rooms = [
  { id: "rid1", title: "home", capacity: 8, floor: 1 },
  { id: "rid2", title: "garden", capacity: 8, floor: 2 },
  { id: "rid3", title: "sea", capacity: 8, floor: 3 },
  { id: "rid4", title: "hell", capacity: 8, floor: 4 },
];

const events = [
  {
    id: 1,
    title: "Обсуждение книг",
    dateStart: new Date(2020, 1, 17, 8),
    dateEnd: new Date(2020, 1, 17, 9),
    roomId: "rid1",
    users: ["uid1", "uid2", "uid3", "uid4"],
  },
  {
    id: 1,
    title: "Обсуждение кино",
    dateStart: new Date(2020, 1, 17, 9),
    dateEnd: new Date(2020, 1, 17, 9, 30),
    roomId: "rid1",
  },
  {
    id: 1,
    title: "Выбираем алкоголь на корпоратив",
    dateStart: new Date(2020, 1, 17, 10),
    dateEnd: new Date(2020, 1, 17, 11),
    roomId: "rid1",
  },
  {
    id: 1,
    title: "Фича-243",
    dateStart: new Date(2020, 1, 17, 11),
    dateEnd: new Date(2020, 1, 17, 12),
    roomId: "rid1",
  },
];

const db = { users, rooms, events };
const members = ["uid1", "uid11", "uid12", "uid13"];

//getRecommendation(date, members, db)
function getRecommendation(members, db) {
  //количество участников встречи
  const membersCount = members.length;
  //подходящие комнаты для указанного количества участников
  const matchedRoomsByCapacity = db.rooms.filter(
    (r) => r.capacity >= membersCount
  );
  console.log("matchedRoomsByCapacity", matchedRoomsByCapacity);

  //получаем все встречи, проводимые в указанной комнате
  const getEventsInRoom = (roomId) =>
    db.events.filter((e) => e.roomId === roomId);
  const eventsInRoom = getEventsInRoom(matchedRoomsByCapacity[0].id);
  console.log("eventsInRoom", eventsInRoom);

  //получаем втречи в комнате на указанную дату
  const getEventsInRoomOnDate = (eventsInRoom, date) =>
    eventsInRoom.filter((e) => e.dateStart >= date);
  const eventsInRoomOnDay = getEventsInRoomOnDate(
    eventsInRoom,
    new Date(2020, 1, 17)
  );
  console.log("eventsInRoomOnDate", eventsInRoomOnDay);

  //проверям, является ли указанный временной отрезок свободным в данной комнате
  const isFreeTimeSpan = (eventsInRoomOnDay, dateStart, dateEnd) =>
    eventsInRoomOnDay.every(
      (e) =>
        (e.dateStart <= dateStart && e.dateEnd <= dateStart) ||
        e.dateStart >= dateEnd
    );
  console.log(
    "isFreeTimeSpan",
    isFreeTimeSpan(
      eventsInRoomOnDay,
      new Date(2020, 1, 17, 9, 30),
      new Date(2020, 1, 17, 10)
    )
  );

  const getEventsForPeriodOfTime = (eventsOnDay, dateStart, dateEnd) => {};
  //этажи участников встречи
  const membersFloors = members.map(
    (uid) => users.find((u) => u.id === uid).homeFloor
  );
  console.log("membersFloors", membersFloors);
  //вычисляем индек этажной удаленности для комнаты
  const getFloorRemotenessIdx = (roomFloor, peopleFloors) => {
    return peopleFloors
      .map((personFloor) => Math.abs(personFloor - roomFloor))
      .reduce((acc, v) => (acc += v));
  };

  //сортируем комнаты по индексу этажной удаленности, наименее удаленные комнаты идут первыми
  return matchedRoomsByCapacity.sort(
    (r1, r2) =>
      getFloorRemotenessIdx(r1.floor, membersFloors) -
      getFloorRemotenessIdx(r2.floor, membersFloors)
  );
}

const getRoomsByCapacity = (rooms, capacity = 0) =>
  rooms.filter((r) => r.capacity >= capacity);

const getEventsForPeriodOfTime = (events, dateStart, dateEnd) => {
  return events.filter((e) => {
    return (
      (e.dateStart <= dateStart && e.dateEnd > dateStart) ||
      (e.dateStart >= dateStart && e.dateStart < dateEnd)
    );
  });
};

export { getRoomsByCapacity, getEventsForPeriodOfTime };
