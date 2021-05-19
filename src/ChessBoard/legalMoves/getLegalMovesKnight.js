/* eslint-disable */ 
export function getLegalMovesKnight(board, currentPosition, pieceColor){
    
    // row and column the Bishop is currently located at
    var row = currentPosition[0]
    var col = currentPosition[1]

    var legalMoves = getValidMoves(board, row + 2, col + 1, [], pieceColor);
    legalMoves = getValidMoves(board, row - 2, col + 1, legalMoves, pieceColor);
    legalMoves = getValidMoves(board, row + 2, col - 1, legalMoves, pieceColor);
    legalMoves = getValidMoves(board, row - 2, col - 1, legalMoves, pieceColor);

    legalMoves = getValidMoves(board, row + 1, col + 2, legalMoves, pieceColor);
    legalMoves = getValidMoves(board, row + 1, col - 2, legalMoves, pieceColor);
    legalMoves = getValidMoves(board, row - 1, col + 2, legalMoves, pieceColor);
    legalMoves = getValidMoves(board, row - 1, col - 2, legalMoves, pieceColor);

    return legalMoves;
}
function getValidMoves(board, r, c, legalMoves, pieceColor){
       
    if ((r>0 && r <9) && (c >0 && c < 9)){

        var currentColor = "black";
        if (board[r][c] > 0){
            currentColor = "white";
        }
        if (board[r][c] === 0){
            legalMoves.push([r, c])
        }
        else if ((board[r][c] != null) && (currentColor !== pieceColor)){
            legalMoves.push([r, c])
        }
    }
    return legalMoves
}
