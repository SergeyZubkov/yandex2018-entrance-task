import Button from '../../button/Button'

import {
    percentOffsetToTime
} from '../utils'

import {
    addMilliseconds
} from 'date-fns'

import {history, useHistory, useLocation} from 'react-router-dom'

function ButtonToCreateEvent({left, roomId}) {
    const history = useHistory()

    const calculateLeft = (percentages) => {
        const left = percentages - 0.5
        
        return left < 0 ? 0 : left
    }

    const location = useLocation()
    const handleClick = () => {
        const {pickedStartDate} = location.state
        const ms = percentOffsetToTime(left)
        console.log(ms)
        history.push('/formEvent', {
            pickedStartDate: addMilliseconds(pickedStartDate, ms), 
            pickedRoomId: roomId
        })
    }

    return (
        <Button
            style={{
                position: 'absolute',
                left: calculateLeft(left) + "%"
            }}
            onClick={handleClick}
        >+</Button>
    )
}

export default ButtonToCreateEvent