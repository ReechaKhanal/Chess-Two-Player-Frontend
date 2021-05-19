/* eslint-disable */ 
import { getLegalMovesBishop } from "./getLegalMovesBishop.js"
import { getLegalMovesRook } from "./getLegalMovesRook.js"

export function getLegalMovesQueen(board, currentPosition, pieceColor){
    
    var output1 = getLegalMovesBishop(board, currentPosition, pieceColor);
    var output2 = getLegalMovesRook(board, currentPosition, pieceColor);
    
    for (var i = 0; i<output2.length; i++){
        output1.push(output2[i])
    }
    return output1
}