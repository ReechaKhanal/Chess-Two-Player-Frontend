/* eslint-disable */ 
export function getLegalMovesKing(board, currentPosition, pieceColor){
    // row and column the King is currently located at
    var row = currentPosition[0]
    var col = currentPosition[1]

    // output array that holds all possible moves for the King
    var legalMoves = [];

    legalMoves = checkIfValid(board, row + 1, col, legalMoves, pieceColor)
    legalMoves = checkIfValid(board, row - 1, col, legalMoves, pieceColor)
    legalMoves = checkIfValid(board, row, col+1, legalMoves, pieceColor)
    legalMoves = checkIfValid(board, row, col-1, legalMoves, pieceColor)
    
    legalMoves = checkIfValid(board, row+1, col+1, legalMoves, pieceColor)
    legalMoves = checkIfValid(board, row+1, col-1, legalMoves, pieceColor)
    legalMoves = checkIfValid(board, row-1, col+1, legalMoves, pieceColor)
    legalMoves = checkIfValid(board, row-1, col-1, legalMoves, pieceColor)

    // check for castling
    return legalMoves
}

function checkIfValid(board, r, c, legalMoves, pieceColor){
    
    if ((r>0 && r <9) && (c >0 && c < 9)){

        var currentColor = "black";
        if (board[r][c] > 0){
            currentColor = "white";
        }

        if (board[r][c] === 0){
            legalMoves.push([r, c])
        }
        else if ((board[r][c] != null)  && (currentColor !== pieceColor)){
            // will need a way to see if the king will be in Check with this move.
            legalMoves.push([r, c])
        }
    }
    return legalMoves
}