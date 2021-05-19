/* eslint-disable */ 
export function getLegalMovesRook(board, currentPosition, pieceColor){

    // row and column the Rook is currently located at
    var row = currentPosition[0]
    var col = currentPosition[1]

    // output array that holds all possible moves for a Rook
    var legalMoves = [];
    legalMoves = getValidMoves(board, row, col+1, 0, 1, legalMoves, pieceColor)
    legalMoves = getValidMoves(board, row, col-1, 0, -1, legalMoves, pieceColor)
    legalMoves = getValidMoves(board, row+1, col, 1, 0, legalMoves, pieceColor)
    legalMoves = getValidMoves(board, row-1, col, -1, 0, legalMoves, pieceColor)

    return legalMoves
}

function getValidMoves(board, r, c, row_increment, col_increment, legalMoves, pieceColor){
    
    while (((r > 0) && (r < 9)) && ((c > 0) && (c < 9))){    
        
        var currentColor = "black";
        if (board[r][c] > 0){
            currentColor = "white";
        }
        if (board[r][c] === 0){
            legalMoves.push([r, c])
        }
        else if ((board[r][c] != null) && (pieceColor !== currentColor)){
            legalMoves.push([r, c])
            break;
        }else{
            break;
        }
        r = r + row_increment
        c = c + col_increment
    }
    return legalMoves
}