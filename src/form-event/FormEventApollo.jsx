import { useHistory, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import {
  CREATE_EVENT,
  FETCH_DATA_FOR_EVENT_FORM,
  FETCH_EVENTS_BY_DATE,
  GET_EVENT,
  UPDATE_EVENT,
} from "../queries.js";

import { set, parseISO, endOfDay } from "date-fns";

import FormEventContainer from "./FormEventContainer";

import useModalService from '../hooks/useModalSevice';



function FormEventApollo() {
  const ModalService = useModalService();
  const {
    data: optionsData,
    error: errorFetchData,
    loading: loadingFetchData,
  } = useQuery(FETCH_DATA_FOR_EVENT_FORM);

  const history = useHistory()

  const [
    createEventMutation,
    {
      loading: pendingCreateEvent,
      error: errorCreateEvent,
      data: createEventSuccess,
    },
  ] = useMutation(CREATE_EVENT, {
    onCompleted: ({createEvent: createdEvent}) => ModalService.createdEventSuccess(createdEvent, () => history.push('/'))
  });

  const [
    updateEventMutation,
    {
      loading: pendingUpdateEvent,
      error: errorUpdateEvent,
      data: updateEventSuccess,
    },
  ] = useMutation(UPDATE_EVENT, {
    onCompleted: ({updateEvent: updatedEvent}) => ModalService.updatedEventSuccess(updatedEvent, () => history.push('/'))
  });

  const { id } = useParams();
  const isCreateMode = !id;

  const {
    data: eventData,
    error: errorGetExistedEvent,
    loading: loadingExistedEvent,
  } = useQuery(GET_EVENT, {
    skip: isCreateMode,
    variables: {
      id,
    }
  });

  if (
    loadingFetchData ||
    pendingCreateEvent ||
    loadingExistedEvent ||
    pendingUpdateEvent
  )
    return "Loading...";

  if (
    errorFetchData ||
    errorCreateEvent ||
    errorGetExistedEvent ||
    errorUpdateEvent
  )
    return "Прозошла ошибка";

  const createEvent = (variables) => {
    createEventMutation({
      variables,
      update: (cache, { data: { createEvent: createdEvent } }) => {
        console.log(createdEvent);
        try {
          const date = endOfDay(parseISO(createdEvent.dateStart));
          console.log(
            "date, которая должна быть такой же, как аргумент последнего запроса",
            date
          );
          const data = cache.readQuery({
            query: FETCH_EVENTS_BY_DATE,
            variables: {
              date,
            },
          });

          if (data === null) return;

          cache.writeQuery({
            query: FETCH_EVENTS_BY_DATE,
            variables: {
              date,
            },
            data: {
              eventsOnDate: [...data.eventsOnDate, createdEvent],
            },
          });
          console.log(cache);
        } catch (e) {
          console.error(e);
        }
      }
    });
  };

  const updateEvent = (variables) => {
    updateEventMutation({
      variables,
      update: (cache, { updateEvent: updatedEvent }) => {
        try {
          const date = set(parseISO(updatedEvent.dateStart), {
            hours: 0,
            minutes: 0,
          });

          let data = cache.readQuery({
            query: FETCH_EVENTS_BY_DATE,
            variables: { date },
          });

          if (data === null) return;

          cache.writeQuery({
            query: FETCH_EVENTS_BY_DATE,
            variables: { date },
            data: {
              eventsOnDate: [...data.eventsOnDate, updatedEvent],
            },
          });
        } catch (e) {
          console.error(e);
        }
      },
    });
  };

  const handleSubmit = (variables) => {
    console.log(variables);
    isCreateMode ? createEvent(variables) : updateEvent(variables);
  };

  const { users, rooms } = optionsData;

  return (
    <FormEventContainer
      initialData={eventData?.event}
      participantSelectOptions={users}
      roomSelectOptions={rooms}
      onSubmit={handleSubmit}
      isCreateMode={isCreateMode}
    />
  );
}

export { FormEventApollo };
