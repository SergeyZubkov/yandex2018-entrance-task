import {useEffect, useState} from 'react'
import DatePicker from "react-datepicker"
import {add, addHours, getHours, getMinutes, set, parse} from 'date-fns'
import ru from 'date-fns/locale/ru'
import './InputDate.css'

import getDateWithResetTime from '../utils/getDateWithResetTime'

function InputDate({
    onChange,
    inititalStartDate = new Date(),
}) {
    console.log(inititalStartDate)
    const [date, setDate] = useState(inititalStartDate)
    const [startTime, setStartTime] = useState(
        set(date, {
            hours: getHours(date), 
            minutes: getMinutes(date)
        })
    )
    const [endTime, setEndTime] = useState(addHours(date, 1))

    useEffect(
        () => {
            onChange(
                computeStartEndDate()
            )
        }
    , [date, startTime, endTime])

    const computeStartEndDate = () => {
        const dateWithResetTime = getDateWithResetTime(date)
        return {
            startDate: add(
                dateWithResetTime, 
                {
                    hours: getHours(startTime), 
                    minutes: getMinutes(startTime)
                }
            ),
            endDate: add(
                dateWithResetTime, 
                {
                    hours: getHours(endTime),
                    minutes: getMinutes(endTime)
                }
            )
        }
    }

    return (
        <div className="input-date">
            <div className="field">
                <label htmlFor="event-title">Дата</label>
                <DatePicker
                    locale={ru}
                    dateFormat="dd MMMM, yyyy"
                    selected={date} 
                    onChange={date => setDate(date)} 
                    monthsShown={3}
                />
            </div>
            <div className="field">
                <label htmlFor="event-title">Начало</label>
                <DatePicker
                    className="input-time"
                    locale={ru}
                    selected={startTime}
                    onChange={time => setStartTime(time)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Время"
                    dateFormat="H:mm"
                />
            </div>
            <i dangerouslySetInnerHTML={{__html: "&#8212;"}}></i>
            <div className="field">
                <label htmlFor="event-title">Конец</label>
                <DatePicker
                    className="input-time"
                    locale={ru}
                    selected={endTime}
                    onChange={time => setEndTime(time)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Время"
                    dateFormat="H:mm"
                />
            </div>
        </div>
    )
}

export default InputDate