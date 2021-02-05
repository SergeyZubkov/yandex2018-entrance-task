import {useState} from 'react'
import './SceduleRoom.css'

import SceduleEvent from '../scedule-event/SceduleEvent'
import ButtonToCreateEvent from './ButtonToCreateEvent'

import ReactCursorPosition from 'react-cursor-position'

import {
    percentOffsetToTime,
    isEventExistAtTime
} from '../utils'

function SceduleRoom({id, title, capacity, events}) {
    const [buttonProps, setButtonProps] = useState({
        show: false,
        left: null
    })

    const getPercentOffsetRelativeToParent = (cursorX, parent) => {
        return ( cursorX / (parent/100) ).toFixed(4)
    }

    const handleCursorPositionChange = props => {
        if (props.isPositionOutside) {
            setButtonProps({
                show: false
            })

            return 
        } 
        // ширина контейнра с событиями 
        // соотносится с временной шкалой
        const widthEl = props.elementDimensions.width
        const x = props.position.x

        const percentOffset = getPercentOffsetRelativeToParent(x, widthEl)

        const exist =  isEventExistAtTime(
                percentOffsetToTime(percentOffset),
                events
            )

        if (!exist) {
            setButtonProps({
                show: true,
                left: percentOffset
            })
        } else {
            setButtonProps({
                show: false
            })
        }
    }
    return (
        <div className="room">
            <div className="room__info">
                <div className="room__info-title">
                    {title}
                </div>
                <div className="room__info-capacity">
                    { `до ${capacity} человек` }
                </div>
            </div>
            <ReactCursorPosition
                className="room__events"
                onPositionChanged={handleCursorPositionChange}
                shouldDecorateChildren={false} 
            >
                    {events.map(({id, dateStart, dateEnd, ...otherProps}) => (
                        <SceduleEvent 
                            id={id}
                            key={id} 
                            dateStartISO={dateStart}
                            dateEndISO={dateEnd}
                            {...otherProps}
                        />
                    ))}
                    {buttonProps.show&&
                        <ButtonToCreateEvent left={buttonProps.left} roomId={id} />
                    }
            </ReactCursorPosition>
        </div>
    )
}

export default SceduleRoom