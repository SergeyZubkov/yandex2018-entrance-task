import {parse} from 'date-fns'

const start = parse("8:00", "H:mm", new Date())
const end = parse("23:00", "H:mm", new Date())

export default {
    start,
    end
}