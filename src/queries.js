import { gql } from "@apollo/client";

const USER_FIELDS = gql`
  fragment userFields on User {
    id
    login
    avatarUrl
    homeFloor
  }
`;
const ROOM_FIELDS = gql`
  fragment roomFields on Room {
    id
    title
    capacity
    floor
  }
`;

const EVENT_FIELDS = gql`
  fragment eventFields on Event {
    id
    title
    dateStart
    dateEnd
    room {
      ...roomFields
    }
    users {
      ...userFields
    }
  }
  ${ROOM_FIELDS}
  ${USER_FIELDS}
`;

export const FETCH_DATA_FOR_EVENT_FORM = gql`
  query {
    users {
      ...userFields
    }
    rooms {
      ...roomFields
    }
  }
  ${USER_FIELDS}
  ${ROOM_FIELDS}
`;

export const GET_EVENT = gql`
  query event($id: ID!) {
    event(id: $id) {
      ...eventFields
    }
  }
  ${EVENT_FIELDS}
`;

export const CREATE_EVENT = gql`
  mutation createEvent($input: EventInput!, $usersIds: [ID], $roomId: ID!) {
    createEvent(input: $input, usersIds: $usersIds, roomId: $roomId) {
      ...eventFields
    }
  }
  ${EVENT_FIELDS}
`;
export const UPDATE_EVENT = gql`
  mutation updateEvent($id: ID!, $input: EventInput!) {
    updateEvent(id: $id, input: $input) {
      ...eventFields
    }
  }
  ${EVENT_FIELDS}
`;

export const FETCH_EVENTS_BY_DATE = gql`
  query eventsOnDate($date: Date!) {
    eventsOnDate(date: $date) {
      ...eventFields
    }
  }
  ${EVENT_FIELDS}
`;

export const FETCH_ALL_ROOMS = gql`
  query {
    rooms {
      ...roomFields
    }
  }
  ${ROOM_FIELDS}
`;
