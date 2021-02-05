import {useState, forwardRef, useEffect} from 'react'
import './Calendar.css'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import {parse, addDays, subDays, isToday} from 'date-fns'
import ru from 'date-fns/locale/ru'

function CustomInput({
    value, 
    onClick, 
    onNextDay, 
    onPrevDay
}, 
    _ref) {
    const format = value => {
        // value = MMMM/dd/yyyy
        const [month, day, year] = value.split('/')

        const today = isToday(
            parse(value, "MMMM/dd/yyyy", new Date(), {locale: ru})
        )

        const formatMonth = month => month.slice(0, 1).toUpperCase() + month.slice(1, 3)
        
        return (
            <span>
               { parseInt(day) + " " + formatMonth(month)} 
               {"\u00A0"}
               <i dangerouslySetInnerHTML={{__html: "&#183;"}}></i>
               {"\u00A0"}
               {today ? 'Сегодня' : year}
            </span>
        )
    }
    return (
        <div className='calendar'>
            <button 
                className="calendar__btn-arrow calendar__btn-arrow--left"
                onClick={() => onPrevDay()}
            >
                <img src="icons/arrow-left.svg" alt="arrow-left" />
            </button>
            <button className="calendar__btn-dropdown" onClick={onClick}>
                {format(value)} 
            </button>
            <button 
                className="calendar__btn-arrow calendar__btn-arrow--right"
                onClick={() => onNextDay()}
            >
                <img src="icons/arrow-right.svg" alt="arrow-left"/>
            </button>
        </div>
    )
}

const CustomInputWithRef = forwardRef(CustomInput)

function Calendar({
    onChange,
    initialDate = new Date()
}) {
    const [date, setDate] = useState(initialDate)

    useEffect(
        () => onChange(date)
    , [date])
    
    return (
            <DatePicker 
                locale={ru}
                dateFormat="MMMM/dd/yyyy"
                selected={date} 
                onChange={setDate} 
                monthsShown={3}
                customInput={
                    <CustomInputWithRef 
                        onNextDay={
                            () => setDate( addDays(date, 1) )
                        }
                        onPrevDay={
                            () => setDate( subDays(date, 1) )
                        }
                    />
                }
            />
    )
}

export default Calendar