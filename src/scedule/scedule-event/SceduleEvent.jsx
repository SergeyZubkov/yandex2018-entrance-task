import {useState} from 'react'
import './SceduleEvent.css'
import {
    getOffset,
    getTimeInMin
} from '../utils'
import workingHours from '../utils/workingHours'
import {
   formatDate,
   formatTimeStartEnd,
   formatRoom 
} from '../../utils/formatEventData'

import {
    format,
    getMinutes,
    parse,
    parseISO,
    getHours
} from 'date-fns'
import ru from 'date-fns/locale/ru'

import ReactTooltip from 'react-tooltip'
import { useHistory } from 'react-router-dom'
import qs from 'query-string'

function SceduleEvent({
    id,
    title,
    dateStartISO,
    dateEndISO,
    users = [],
    room
}) {
    let dateStart = parseISO(dateStartISO)
    let dateEnd = parseISO(dateEndISO)

    const getTimeStartEventInMin = () => { 
        return getTimeInMin(dateStart)
    }

    const calculateWidth = () => {
        return (getTimeInMin(dateEnd) - getTimeInMin(dateStart)) * getOffset().ofMinutes
    }

    const getWorkingHoursStartInMin = () => {
        return getHours(workingHours.start) * 60 + getMinutes(workingHours.start)
    }

    const calculateLeft = () => {
        return  (
            getTimeStartEventInMin() - getWorkingHoursStartInMin()
        ) * getOffset().ofMinutes
    }

    const history = useHistory()

    const edit = () => {

        const eventString = qs.stringify({
            id,
            title,
            dateStart: dateStartISO,
            dateEnd: dateEndISO,
            roomId: room.id,
            users: users.map(u => u.id)
        })

        history.push({pathname: "/formEvent", search: eventString})
    }

    const firstUser = users[0]
    return (
        <div 
            className="scedule-event"
            style={{
                left: calculateLeft() + '%',
                width: calculateWidth() + '%'
            }}

            onClick={edit}

            data-tip 
            data-for={"scedule-event__info" + id}
            data-place="bottom"
        >
            <ReactTooltip 
                id={"scedule-event__info" + id} 
                className="scedule-event__info"
                effect='solid'
                backgroundColor="white"
            >
                <h4 className="scedule-event__info-title">
                    {title}
                </h4>
                <div className="scedule-event__info-details">
                    {`${formatDate(dateStart)}, ${formatTimeStartEnd(dateStart, dateEnd)} ${"\u00B7"} ${formatRoom(room)}`}
                </div>
               {
                   firstUser
                   &&   <div className="scedule-event__info-footer">
                            <img 
                                className="avatar-icon"
                                src={firstUser.avatarUrl.trim()} 
                                alt="participant"
                            />
                            <div className="participants">{firstUser.login} из {users.length} участников</div>
                        </div>
               }
                
            </ReactTooltip>   
        </div>
    )
}

export default SceduleEvent