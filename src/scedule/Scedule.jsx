import {useState} from 'react'
import Calendar from '../calendar/Calendar'
import Timeline from '../timeline/Timeline'
import './Scedule.css'

function Scedule() {
    const [timeFrom, setTimeFrom] = useState("8:30")
    const [timeTo, setTimeTo] = useState("23:00")

    const timeDiff = (start, end) => {
        start = start.split(":");
        end = end.split(":");
        var startDate = new Date(0, 0, 0, start[0], start[1], 0);
        var endDate = new Date(0, 0, 0, end[0], end[1], 0);
        var diff = endDate.getTime() - startDate.getTime();
        
        return diff 
    }

    const getHours = (ms) => Math.ceil(ms / 1000 / 60 / 60);

    const getTimeLabels = () => {
        
        const tRange = getHours( timeDiff(timeFrom, timeTo) )

        return Array.from({length: tRange}, (_, i) => (parseInt(timeTo) - i).toString()).concat(`${parseInt(timeFrom)}:00`).reverse()
    }
    const timeLabels = getTimeLabels()
    const step = 100 / timeLabels.length 
    const offset = step / (60/parseInt(timeFrom.slice(-2)))
    console.log(timeLabels)
    return (
        <div className="scedule">
            <div className="scedule__header">
                <Calendar />
                <div className="timeline" style={{left: offset + '%'}}>
                    {timeLabels.map(
                    (l, i) => <div key={l} className="timeline__mark" style={{left: step * i + "%"}}>{l}</div>
            )}
                 <div className="timeline__mark timeline__mark--current-time">22:12</div>
        </div>
            </div>
            <div className="scedule__items">
                <div className="scedule__stage">6 этаж</div>
                <div className="room">
                    <div className="room__title">Желтый дом</div>
                    <div className="room__events">
                        <div className="room__event"></div>
                        <div className="room__event"></div>
                    </div> 
                </div>
                <div className="room">
                    <div className="room__title">Прачечная</div>
                    <div className="room__events">
                        <div className="room__event"></div>
                        <div className="room__event" onClick={e => console.log(e)}></div>
                    </div>
                </div>
            </div>
            <div className="scedule__timestamps" style={{left: offset + '%'}}>
            {timeLabels
                .map(
                    (l, i) => <div key={l} className="scedule__timestamp" style={{left: step * i + "%"}}></div>
            )}
            </div>
        </div>
    )
}

export default Scedule