import {
    getRoomsByCapacity, 
    getEventsForPeriodOfTime
} from './getRecommendation'

const rooms = [
    {id: 'rid1', title: 'home', capacity: 6, floor: 1},
    {id: 'rid2', title: 'garden', capacity: 6, floor: 2},
    {id: 'rid3', title: 'sea', capacity: 8, floor: 3},
    {id: 'rid4', title: 'hell', capacity: 8, floor: 4}
  ]

describe('getRecommendation', () => {
    describe('getRoomsByCapacity', () => {
        it('если не находит комнаты нужной вместимости, возвращает пустой массив', () => {
            const matchedRooms = getRoomsByCapacity(rooms, 9)
            const expectedRooms = []

            expect(matchedRooms).toEqual(expectedRooms)
        })

        it('должна вернуть массив комнат указанной вместимости', () => {
            const matchedRooms = getRoomsByCapacity(rooms, 8)
            const expectedRooms = [rooms[2], rooms[3]]

            expect(matchedRooms).toEqual(expectedRooms)
        })

        it('если не указать требуемую вместимость, возвращает массив всех комнат', () => {
            const matchedRooms = getRoomsByCapacity(rooms, )
            const expectedRooms = rooms

            expect(matchedRooms).toEqual(expectedRooms)
        })
    })

    describe('getEventsForPeriodOfTime', () => {
        const events = [
            {id: 1, title: 'Обсуждение книг', dateStart: new Date(2020,1,17,8), dateEnd: new Date(2020,1,17,9), roomId: 'rid1', users: ['uid1', 'uid2', 'uid3', 'uid4']},
            {id: 2, title: 'Обсуждение кино', dateStart: new Date(2020,1,17,9), dateEnd: new Date(2020,1,17,9,30), roomId: 'rid1'},
            {id: 3, title: 'Выбираем алкоголь на корпоратив', dateStart: new Date(2020,2,17,10), dateEnd: new Date(2020,2,17,11), roomId: 'rid1'},
            {id: 4, title: 'Фича-243', dateStart: new Date(2020,1,17,11), dateEnd: new Date(2020,1,17,12), roomId: 'rid1'}
          ]
        
        const expectedEvents = events.filter(e => e.id !== 3)

        it('должна вернуть массив событий лежащих на указанном отрезке времени', () => {
            const findingEvents = getEventsForPeriodOfTime(events, new Date(2020, 1, 17, 8, 30), new Date(2020, 1, 17, 12))

            expect(findingEvents).toEqual(expectedEvents)
        })
    })
})
