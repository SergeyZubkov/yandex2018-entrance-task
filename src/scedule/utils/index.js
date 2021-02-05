import {
    differenceInHours, 
    parseISO,
    getHours,
    getMinutes
} from 'date-fns'

import workingHours from './workingHours'

function getOffset() {
    const timeStart = workingHours.start
    const timeEnd = workingHours.end


    const hoursNmb = differenceInHours(
        timeEnd,
        timeStart
    )
    const percentsOffsetOfHour = 100 / hoursNmb
    const percentsOffsetOfMin = percentsOffsetOfHour / 60
    
    return {
        ofHour: percentsOffsetOfHour,
        ofMinutes: percentsOffsetOfMin
    }
}

function getTimeInMin(date) {
    return getHours(date) * 60 + getMinutes(date)
}

function percentOffsetToTime(percentOffset) {
    const minToMs = min => min * 60 * 1000

    return minToMs(
        Math.ceil(percentOffset / getOffset().ofMinutes)
    ) + (workingHours.start.getHours() * 60 * 60 * 1000)
    + (workingHours.start.getMinutes() * 60 * 1000)
}

function isEventExistAtTime(time, events) {
    if (!events.length) return false
    
    const date = parseISO(events[0].dateStart)
    const hours = Math.floor(time / 1000 / 60 / 60)
    time -= hours * 60 * 60 * 1000
    const minutes =  Math.floor(time / 1000 / 60)

    const specifiedDate = new Date(
        date.getFullYear(),
        date.getMonth(), 
        date.getDate(), 
        hours, 
        minutes
    )

    return events
        .map(e => {
            return {
                ...e,
                dateStart: parseISO(e.dateStart),
                dateEnd: parseISO(e.dateEnd)
            }
        })
        .some(
        e => (
           (
                e.dateStart === specifiedDate
                || e.dateEnd === specifiedDate
            )
            || (
                e.dateStart < specifiedDate
                && e.dateEnd > specifiedDate
            )
        )
    )
}

export {
    getOffset,
    percentOffsetToTime,
    isEventExistAtTime,
    getTimeInMin
}