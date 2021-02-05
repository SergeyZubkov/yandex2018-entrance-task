import {useState, useEffect, useRef} from 'react'
import './SceduleHeader.css'
import Calendar from '../../calendar/Calendar'

import { 
    differenceInMinutes, 
    differenceInHours, 
    parse, 
    getHours, 
    format,
    addHours
} from 'date-fns'

import workingHours from '../utils/workingHours'
import getDateWithResetTime from '../../utils/getDateWithResetTime'
import { useLocation } from 'react-router-dom'


function SceduleHeader({
    timestampsHeight = 0,
    onChangeDate,
    calendarInitialDate
}) {
    const timeStart = workingHours.start
    const timeEnd = workingHours.end

    const hoursNmb = differenceInHours(
        timeEnd,
        timeStart
    )
    
    const getHourLabels = () => {
        const hourLabels = Array.from(
            {length: hoursNmb}, 
            (_, i) => ( getHours(timeStart) + i + 2 ).toString()
        )
    
        const firstLabel = format(
            addHours(timeStart, 1), 
            "H:mm"
        )
    
        hourLabels.unshift(firstLabel)

        hourLabels.pop()
    
        return hourLabels
    }
    
    const hourLabels = getHourLabels()
    const percentsOffsetOfHour = 100 / hoursNmb
    const percentsOffsetOfMin = percentsOffsetOfHour / 60
    //часы
    const getCurrentTime = () => {
        const d = new Date()
        return d.toLocaleTimeString().slice(0,5)
    }

    const timerId = useRef()
    const [currentTime, setCurrentTime] = useState(getCurrentTime())

    useEffect(
        () => {
            timerId.current = setInterval(() => setCurrentTime(getCurrentTime()), 1000)
            return () => clearInterval(timerId.current)
        }
    ,[])

    const x = differenceInMinutes(parse(currentTime, "H:mm", new Date()), timeStart)
    
    const location = useLocation()
    
    if (!location.state||!location.state.pickedStartDate) {
        !location.state&&(location.state = {})
        location.state.pickedStartDate = getDateWithResetTime(new Date)
    }

    const handleChangeCalendar = date => {
        location.state.pickedStartDate = getDateWithResetTime(
            date
        )
        onChangeDate(date)
    }
    return (    
        <div className="scedule__header">
            <Calendar onChange={handleChangeCalendar} initialDate={calendarInitialDate} />
            <div className="timeline">
                {hourLabels.map(
                    (l, i, arr) => (
                        <div 
                            key={l} 
                            className={
                                i === arr.length -1 
                                ? "timeline__mark last-child"
                                : "timeline__mark"
                            } 
                            style={{
                                left:  percentsOffsetOfHour * (i+1) + "%"
                            }}
                        >
                            {l}
                        </div>
                    )
                )}

                {timestampsHeight&&hourLabels.map(
                    (l, i, arr) => <div 
                        key={l} 
                        className={ i === arr.length -1 ? "scedule__timestamp last-child" : "scedule__timestamp"} 
                        style={{left: percentsOffsetOfHour * (i+1)+ "%", height: timestampsHeight}}
                    ></div>
                )}
                <div 
                    className="timeline__mark timeline__mark--current-time" 
                    style={{
                        left: percentsOffsetOfMin * x + "%"
                    }}
                >
                    {currentTime}
                    <i className="scedule__timestamp--current-time" style={{height: timestampsHeight + 30}}></i>   
                </div>
        </div>
        </div>
    )
}

export default SceduleHeader