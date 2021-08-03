import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import FormEventView from "./FormEventView";
import { addMinutes, set, isToday, isPast } from "date-fns";

import { pickedDateStartVar, pickedRoomVar } from "../index";
import workingHours from "../utils/workingHours";

function FormEventContainer({
  initialData,
  participantSelectOptions,
  roomSelectOptions,
  onSubmit,
  isCreateMode,
}) {
  console.log("initialData", initialData);
  console.log("participantSelectOptions", participantSelectOptions);
  console.log("roomSelectOptions", roomSelectOptions);
  console.log("onSubmit", onSubmit);
  console.log("pickedDateStartVar", pickedDateStartVar());

  const getInitialStartEndDate = () => {
    const dateObj = initialData
      ? {
          dateStart: new Date(initialData.dateStart),
          dateEnd: new Date(initialData.dateEnd),
        }
      : {
          dateStart: pickedDateStartVar(),
          dateEnd: addMinutes(pickedDateStartVar(), 30),
        };

    if (isPast(dateObj.dateStart)) {
      dateObj.dateStart = workingHours.getCorrectDate();
    }

    return dateObj;
  };

  const defaultValues = {
    title: initialData?.title ?? "",
    participantList: initialData?.users ?? [],
    room: initialData?.room || pickedRoomVar() || null,
    startEndDate: getInitialStartEndDate(),
  };

  //очистить выбранные дату и комнату после ухода из формы
  useEffect(() => {
    return () => {
      pickedRoomVar(null);
      pickedDateStartVar(
        set(pickedDateStartVar(), {
          hours: workingHours.start.getHours(),
          minutes: workingHours.end.getMinutes(),
        })
      );
      console.log("reset form", pickedDateStartVar());
    };
  }, []);

  const [participantsLimit, setParticipantsLimit] = useState(0);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Укажите название встречи"),
    participantList: Yup.array()
      .min(1, "Выберите участников")
      .max(participantsLimit, "Превышена вместимость комнаты"),
    room: Yup.mixed().required("Выберите комнату"),
  });

  const { control, register, errors, handleSubmit, watch, reset } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [initialData]);

  const watchParticipantList = watch("participantList");
  const watchRoom = watch("room");

  useEffect(() => {
    watchRoom && setParticipantsLimit(watchRoom.capacity);
  }, [watchRoom]);

  const prepareData = ({ title, startEndDate, participantList, room }) => {
    const input = {
      title,
      dateStart: startEndDate.dateStart,
      dateEnd: startEndDate.dateEnd,
    };

    const variables = {
      input,
    };

    if (isCreateMode) {
      variables.usersIds = participantList.map((p) => p.id);
      variables.roomId = room.id;
    } else {
      variables.id = initialData.id;
    }

    onSubmit(variables);
  };

  return (
    <FormEventView
      participantSelectOptions={participantSelectOptions}
      roomSelectOptions={roomSelectOptions}
      participantsLimit={participantsLimit}
      onSubmit={prepareData}
      isCreateMode={isCreateMode}
      reactHookFormProps={{
        controller: Controller,
        control,
        register,
        handleSubmit,
        errors,
        watchParticipantList,
      }}
    />
  );
}

export default FormEventContainer;
