/* eslint-disable */ 
export function getBoardFromStateBoard(stateBoard){
    var board = [[null, null, null, null, null, null, null, null, null, null],
                [null, 6, 5, 4, 8, 7, 4, 5, 6, null],
                [null, 1, 1, 1, 1, 1, 1, 1, 1, null],
                [null, 0, 0, 0, 0, 0, 0, 0, 0, null],
                [null, 0, 0, 0, 0, 0, 0, 0, 0, null],
                [null, 0, 0, 0, 0, 0, 0, 0, 0, null],
                [null, 0, 0, 0, 0, 0, 0, 0, 0, null],
                [null,-1,-1,-1,-1,-1,-1,-1,-1, null],
                [null,-6,-5,-4,-8,-7,-4,-5,-6, null],
                [null, null, null, null, null, null, null, null, null, null]]
    
    for (var i = 0; i< stateBoard.length; i++){

        var row = stateBoard[i];
        for (var j = 0; j<row.length; j++){
            board[i+1][j+1] = stateBoard[i][j][0]
        } // end second for loop
    } // end first for loop
    return board
}