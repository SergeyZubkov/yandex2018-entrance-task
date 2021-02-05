import {
    format,
    parseISO
} from 'date-fns'
import ru from 'date-fns/locale/ru'

const toDate = date => typeof date === 'string'
? parseISO(date)
: date

export const formatDate = date => {
    return format(
        toDate(date), 
        "d MMMM", 
        {locale: ru}
    )
}

export const formatTimeStartEnd = (dateStart, dateEnd) => {

    const formatedDateStart = format(
        toDate(dateStart), 
        "H:mm"
    )

    const formatedDateEnd = format(
        toDate(dateEnd), 
        "H:mm"
    )

    return `${formatedDateStart} ${"\u2014"} ${formatedDateEnd}`
}

export const getRoomTitle = room => room.title

export const formatRoom = room => {
    const roomTitle = getRoomTitle(room)

    return roomTitle[0].toUpperCase() + roomTitle.slice(1)
}