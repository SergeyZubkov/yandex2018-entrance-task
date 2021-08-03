import "./FormEvent.css";
import { Link } from "react-router-dom";
import Button from "../button/Button";
import ParticipantSelect from "../participant-select/ParticipantSelect";
import RoomSelect from "../room-select/RoomSelect";
import InputDate from "../input-date/InputDate";

import { ReactComponent as CrossIcon } from "../icons/cross.svg";

function FormEventView({
  participantSelectOptions,
  roomSelectOptions,
  participantsLimit,
  reactHookFormProps,
  onSubmit,
  isCreateMode,
}) {
  const {
    control,
    register,
    handleSubmit,
    errors,
    controller: Controller,
    watchParticipantList,
  } = reactHookFormProps;

  console.log("view render");

  return (
    <form className="form-event" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-event__inner">
        <div className="form-event__header">
          <h2 className="form-event__header-title">Новая встреча</h2>
          <Link to="/">
            <Button className="btn--circle">
              <CrossIcon className="btn__icon" />
            </Button>
          </Link>
        </div>
        <div className="form-event__col-left">
          <div className="field">
            <div className="field-info">
              <label htmlFor="title">Тема</label>
              <div className="invalid-feedback">{errors?.title?.message}</div>
            </div>
            <input
              className={errors?.title && "is-invalid"}
              id="title"
              name="title"
              type="text"
              placeholder="О чем будете говорить?"
              ref={register}
            />
          </div>
          <div className="field">
            <div className="field-info">
              <label htmlFor="participant-list">
                Участники ({watchParticipantList?.length || 0}/
                {participantsLimit})
              </label>
              <div className="invalid-feedback">
                {errors?.participantList?.message}
              </div>
            </div>
            <Controller
              name="participantList"
              control={control}
              render={({ value, onChange }) => (
                <ParticipantSelect
                  className={errors?.participantList && "is-invalid"}
                  id="participant-list"
                  candidates={participantSelectOptions}
                  selectedPeople={value}
                  limit={participantsLimit}
                  onSelectedItemsChange={({ selectedItems }) =>
                    onChange(selectedItems)
                  }
                />
              )}
            />
          </div>
        </div>
        <div className="form-event__col-right">
          <Controller
            name="startEndDate"
            control={control}
            render={({ value, onChange }) => (
              <InputDate selectedDate={value} onChange={onChange} />
            )}
          />
          <div className="field">
            <div className="field-info">
              <label htmlFor="room">Комната</label>
              <div className="invalid-feedback">{errors?.room?.message}</div>
            </div>
            <Controller
              name="room"
              control={control}
              render={({ value, onChange }) => (
                <RoomSelect
                  className={errors?.room && "is-invalid"}
                  selectedRoom={value}
                  rooms={roomSelectOptions}
                  onSelect={onChange}
                />
              )}
            />
          </div>
        </div>
      </div>
      <div className="form-event__footer">
        <Link to="/">
          <Button className="btn--gray">Отмена</Button>
        </Link>
        <Button type="submitt">
          {isCreateMode ? "Создать встречу" : "Изменить встречу"}
        </Button>
      </div>
    </form>
  );
}

export default FormEventView;
