import { Modal } from 'react-responsive-modal';
import Button from '../../button/Button';
import {
  formatDate,
  formatTimeStartEnd,
  formatRoom,
} from "../../utils/formatEventData";

export default function EventSuccess({
    open, 
    event,
    hide,
    onAccept,
    action
}) {
    const getFormattedEventDate = (event) => {
        const { dateStart: dateStartISO, dateEnd: dateEndISO } = event;
        
        const dateStart = new Date(dateStartISO);
        const dateEnd = new Date(dateEndISO);

        return `${formatDate(dateStart)}, ${formatTimeStartEnd(
            dateStart,
            dateEnd
        )}`;
    };
    
    const getFormattedEventRoom = (event) => {
        const { room } = event;
        return `${formatRoom(room)} ${"\u00B7"} ${room.floor} этаж`;
    }

    return (
        <Modal
            open={open}
            animationDuration={150}
            center
            showCloseIcon={false}  
            classNames={{
                overlay: 'custom-modal-overlay',
                modal: 'custom-modal',
            }}
        >   <div className="custom-modal-container">
                <div className="form-event__modal-emoji" role="img" aria-label="party popper">
                    🎉
                </div>
                <h2 className="form-event__modal-title">
                   {action === 'create' ? 'Встреча создана!' : 'Встреча обновлена!'}
                </h2>
                <div className="form-event__modal-datatime">
                    {event&&getFormattedEventDate(event)}
                </div>
                <div className="form-event__modal-room">
                    {event&&getFormattedEventRoom(event)}
                </div>
                <Button onClick={() => {
                    hide()
                    onAccept()
                }}>ОК</Button>
            </div>
      </Modal>
    )
}