// 設置初始數字
function defaultNumbers(numbers){
    const defaultCount = 3;
    for(var i=0;i<defaultCount;i++){
        setRndItem.apply(numbers);
    }

    return numbers;
}

// 處理數字
function handleNumbers(numbers, direction){


    return {
        numbers: numbers,
        gameover: false
    };
}

// 設置隨機數字
function setRndItem(){
    let numbers = this;
    // check 目前空格
    let emptyItems = [];
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            if(numbers[i][j] == ''){
                emptyItems.push({i:i, j:j});
            }
        }
    }

    const targetItem = rndInt(0, emptyItems.length-1);
    numbers[emptyItems[targetItem].i][emptyItems[targetItem].j] = rndInt(1, 2)*2;

    function rndInt(min, max) { return Math.floor(Math.random() * (max - min + 1) + min); };
}



export default function reducer(state = {
    numbers: [['','','',''],['','','',''],['','','',''],['','','','']],
    gameover: false
}, action) {
    switch (action.type) {
        case 'GET_DEFAULT_NUMBERS':
            return {
                ...state,
                numbers: defaultNumbers(state.numbers)
            };

        case 'MOVE_ITEMS':
            return handleNumbers(state.numbers, action.direction);

        default:
            return state
    }
}