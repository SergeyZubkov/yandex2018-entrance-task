import { useState } from 'react';
import { useModal } from 'react-modal-hook';
import EventSuccess from './EventSuccess';

export default function useModalService() {
    const [eventSuccProps, setEventSuccProps] = useState(null);
    const [showSuccessEvent, hideSuccessEvent] = useModal(
        ({in: open}) => <EventSuccess 
            open={open} 
            event={eventSuccProps.event}
            onAccept={eventSuccProps.onAccept}
            hide={hideSuccessEvent}
            action={eventSuccProps.action}
        />,
        [eventSuccProps]
    )

    const eventSucc = (action, event, onAccept) => {
        setEventSuccProps(p => ({...p, event, onAccept, action}))
        showSuccessEvent()
    }

    return {
        createdEventSuccess(event, onAccept) {
            eventSucc('create', event, onAccept)
        },
        updatedEventSuccess(event, onAccept) {
            eventSucc('update', event, onAccept)
        }
    }
}
