import {useEffect, useState, useRef, Fragment} from 'react'
import './Scedule.css'

import SceduleHeader from './scedule-header/SceduleHeader'
import SceduleRoom from './scedule-room/SceduleRoom'

import {parseISO} from 'date-fns'
import {uniq} from 'lodash'
import {useQuery, gql} from '@apollo/client' 

export const FETCH_EVENTS_BY_DATE = gql`
    query eventsOnDate($date: Date!) {
        eventsOnDate(date: $date) {
            id,
            title,
            dateStart,
            dateEnd,
            users {
                id,
                login,
                homeFloor,
                avatarUrl
            },
            room {
                id,
                title
            }
        }
    }
`

export const FETCH_ALL_ROOMS = gql`
    query {
        rooms {
            id,
            title,
            capacity,
            floor
        }
    }
`


function Scedule() {
    const [date, setDate] = useState(new Date())

    const {data: dataEvents, loading, error} = useQuery(FETCH_EVENTS_BY_DATE, {
        variables: {date}
    })
    const {data: dataRooms, loading: loadingRooms, error: errorRooms} = useQuery(FETCH_ALL_ROOMS)
    // устанавливает часовые отметки
    // узнаем их высоту
    const [timestampsHeight, setTimestampsHeight] = useState(null)
    const sceduleItemsEl = useRef()

    useEffect(
        () => {
            if (sceduleItemsEl.current) {
                setTimestampsHeight(sceduleItemsEl.current.offsetHeight)
            }
        }
    ,[dataEvents, dataRooms])

    if (loading||loadingRooms) return 'Loading...'

    if (error||errorRooms) {
        console.error(error)
        return 'Error'
    }
    console.log('dataEvents', dataEvents)
    const {eventsOnDate: events} = dataEvents
    const {rooms} = dataRooms

    const handleRoomMouseOver = e => {
        console.log(e)
        console.log('hover on room', e.pageX)
    }

    const handleChangeDate = date => setDate(date)

    const getStageNmbs = () => {
        const floorNmbs = rooms.map(r => r.floor)

        return uniq(floorNmbs)
    }
    const stageNmbs = getStageNmbs()

    return (
        <div className="scedule">
            <SceduleHeader 
                timestampsHeight={timestampsHeight}
                onChangeDate={handleChangeDate}
                calendarInitialDate={date}
            />
            <div className="scedule__items" ref={sceduleItemsEl}>
                {stageNmbs.sort((a, b) => a - b).map(
                    stageNmb => {
                        const floorRooms = rooms.filter(room => room.floor === stageNmb)
                        return (
                            <Fragment key={stageNmb}>
                            <div className="scedule__stage">{stageNmb} этаж</div>
                            {floorRooms.map(({id, title, capacity}) => {
                                const roomEvents = events.filter(event => event.room.id === id)
                                
                                return <SceduleRoom 
                                    key={id}
                                    id={id}
                                    title={title}
                                    capacity={capacity}
                                    events={roomEvents}
                                    onMouseOver={handleRoomMouseOver}
                                />
                            })}
                            </Fragment>
                        )
                    }
                )}
            </div>
        </div>
    )
}

export default Scedule