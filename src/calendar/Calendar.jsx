import './Calendar.css'

function Calendar() {
    return (
        <div className="calendar">
            <button className="calendar__btn-arrow calendar__btn-arrow--left">
                <img src="icons/arrow-left.svg" alt="arrow-left" />
            </button>
            <button className="calendar__btn-dropdown">
                14 Дек <i dangerouslySetInnerHTML={{__html: "&#183;"}}></i> Сегодня
            </button>
            <button className="calendar__btn-arrow calendar__btn-arrow--right">
                <img src="icons/arrow-right.svg" alt="arrow-left"/>
            </button>
        </div>
    )
}

export default Calendar