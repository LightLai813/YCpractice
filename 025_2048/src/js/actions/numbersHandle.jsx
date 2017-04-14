export const getDefaultNumbers = () => ({
    type: 'GET_DEFAULT_NUMBERS'
})

export const moveItems = (direction) =>({
    type: 'MOVE_ITEMS',
    direction: direction
})
