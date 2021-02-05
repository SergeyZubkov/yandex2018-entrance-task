import {useEffect, useState} from 'react'
import './FormEvent.css'

import Button from '../button/Button'
import InputDate from '../input-date/InputDate'
import ParticipantSelect from '../participant-select/ParticipantSelect'
import RoomSelect from '../room-select/RoomSelect'
import {FETCH_EVENTS_BY_DATE} from '../scedule/Scedule'

import {Modal} from 'react-responsive-modal'
import {useForm, Controller} from 'react-hook-form'

import {
    formatDate,
    formatTimeStartEnd,
    formatRoom
 } from '../utils/formatEventData'

import {useHistory, useLocation, Link} from 'react-router-dom'


import { useQuery, useMutation, gql } from '@apollo/client';
import qs from 'query-string'

const FETCH_DATA_FOR_EVENT_FORM = gql`
  query {
    users {
        id,
        login,
        avatarUrl
    },
    rooms {
        id,
        title,
        capacity,
        floor
    }
  }
`;

const CREATE_EVENT = gql`
  mutation createEvent($input: EventInput!, $usersIds: [ID], $roomId: ID!) {
      createEvent(
          input: $input,
          usersIds: $usersIds,
          roomId: $roomId
      ) {
          id,
          title,
          room {
              id,
              title,
              floor
          },
          users {
              id
          },
          dateStart,
          dateEnd
      }
  }
`

function FormEvent() {
    // работа с серверными данными
    const {data, loading, error} = useQuery(FETCH_DATA_FOR_EVENT_FORM)
    const [createEvent, {loading: createEventLoading, error: createEventError, data: createEventSuccess}] = useMutation(CREATE_EVENT, {returnPartialData: true})

    const location = useLocation()
    const editedEvent = qs.parse(location.search)
    console.log("editedEvent", editedEvent)
    // поля формы
    const [title, setTitle] = useState(editedEvent.title||'')
    const [participantList, setParticipantList] = useState([])
    // поля, initialValue которых может выбрать пользователь
        // location.state может быть undifined
    const {pickedStartDate, pickedRoomId} = location.state||{}
    let existedStartDate, existedEndDate;
    if (editedEvent.dateStart) {
        existedStartDate = new Date(editedEvent.dateStart)
    }
    if (editedEvent.dateEnd) {
        existedEndDate = new Date(editedEvent.dateEnd)
    }
    const [startEndDate, setStartEndDate] = useState({
        startDate: existedStartDate||pickedStartDate,
        endDate: existedEndDate
    })

    const [room, setRoom] = useState()
    //чтобы список участников заполнялся только раз при редактировании
    const [participantListFilled, setParticipantListFilled] = useState(false)

    // показ сообщения об успешном создании встречи
    const [showModal, setShowModal] = useState(false)
    const history = useHistory()

    //react-hook-form
    const {control, handleSubmit, watch} = useForm()
    const watchParticipantList = watch('participantList')

    if (loading||createEventLoading) return "loading..."

    if (createEventError) console.error(createEventError)

    const {rooms, users} = data;
    // в режиме редактирования. заполнить поле участников
    if (editedEvent.users
        &&editedEvent.users.length
        &&!participantList.length
        &&!participantListFilled
        ) {
        setParticipantList(
            editedEvent.users.map(userId => users.find(user => user.id === userId))
        )
        setParticipantListFilled(true)
    }

    // нужно проверять pickedRoomId, который может быть undefined, чтобы не получить бесконечный цикл
    if (!room&&pickedRoomId){
        const room = rooms.find(r => r.id === pickedRoomId)
        setRoom(room)
    }

    if (!room&&editedEvent.roomId) {
        const room = rooms.find(r => r.id === editedEvent.roomId)
        setRoom(room)
    }

    const handleChangeTitle = e => {
        setTitle(e.target.value)
    }

    const handleStartEndDateChange = startEndDate => {
        setStartEndDate(startEndDate)
    }

    const handleSelectParticipant = participant => {
        setParticipantList([
            ...participantList, 
            participant
        ])
    }

    const handleSelectRoom = room => {
        if (room.capacity < participantList.length) return
        // setParticipantList([])
        setRoom(room)
    }

    const handleRemoveSelectedParticipants = id => {
        setParticipantList(
            participantList.filter(p => p.id !== id)
        )
    }

    const handleCreateEvent = () => {
        const input = {
            title,
            dateStart: startEndDate.startDate,
            dateEnd: startEndDate.endDate
        }

        const usersIds = participantList.map(p => p.id)

        const roomId = room.id

        createEvent({
            variables: {input, usersIds, roomId},
            update: (cache, {data: {createEvent: createdEvent}}) => {
                try {
                    let data = cache.readQuery({query: FETCH_EVENTS_BY_DATE})

                    if (data === null)  return 

                    data.events = [...data.events, createdEvent]
                    cache.writeQuery({query: FETCH_EVENTS_BY_DATE, data})
                } catch(e) {
                    console.error(e)
                }
            }
        })
    }

    if(
        createEventSuccess
        &&!showModal
    ) {
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setShowModal(false)
        history.push('/')
    }

    const getFormattedEventDate = event => {
        const {dateStart, dateEnd} = event
        
        return `${formatDate(dateStart)}, ${formatTimeStartEnd(dateStart, dateEnd)}`
    }

    const getFormattedEventRoom = event => {
        const {room} = event
        return `${formatRoom(room)} ${"\u00B7"} ${room.floor} этаж`
    }

    console.log('watch', watchParticipantList)
    
    return (
        <form 
            className="form-event"
            onSubmit={handleSubmit(
                (data) => console.log(data)
            )}
        >
            <div className="form-event__inner">
                <div className="form-event__header">
                    <h2 className="form-event__header-title">Новая встреча</h2>
                    <Link to="/">
                        <Button className="btn--circle">
                            <i>&#x02DF;</i>
                        </Button>
                    </Link>
                </div>
                <div className="form-event__col-left">
                    <div className="field">
                        <label htmlFor="event-title">Тема</label>
                        <input 
                            id="event-title" 
                            type="text" 
                            placeholder="О чем будете говорить?"
                            value={title}
                            onChange={handleChangeTitle}
                        />
                    </div>
                    <Controller
                        name='participantList'
                        control={control}
                        defaultValue={[]}
                        render={
                            ({value, onChange}) => (
                                <ParticipantSelect
                                    candidates={users}
                                    selectedPeople={value}
                                    limit={room ? room.capacity : 0}
                                    onSelectedItemsChange={({selectedItems}) => onChange(selectedItems)}
                                />
                            )
                        }
                    />
                    {/* <ParticipantSelect 
                        candidates={users} 
                        selectedPeople={participantList}
                        limit={room ? room.capacity : 0}
                        onSelect={handleSelectParticipant} 
                        onRemoveSelectedItem={handleRemoveSelectedParticipants}
                    /> */}
                </div>
                <div className="form-event__col-right">
                    <InputDate inititalStartDate={startEndDate.startDate} onChange={handleStartEndDateChange}/>
                    <RoomSelect initialRoom={room} rooms={rooms} onSelect={handleSelectRoom}/>
                </div>  
            </div>
            <div className="form-event__footer">
                <Link to='/'><Button className="btn--gray">Отмена</Button></Link>
                <Button onClick={handleCreateEvent}>Создать встречу</Button>
            </div>

            <Modal
                open={showModal}
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
                        Встреча создана!
                    </h2>
                    <div className="form-event__modal-datatime">
                        {createEventSuccess&&getFormattedEventDate(createEventSuccess.createEvent)}
                    </div>
                    <div className="form-event__modal-room">
                        {createEventSuccess&&getFormattedEventRoom(createEventSuccess.createEvent)}
                    </div>
                    <Button onClick={handleCloseModal}>ОК</Button>
                </div>
            </Modal>
        </form>
    )
}

export default FormEvent