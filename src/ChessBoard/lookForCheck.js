/* eslint-disable */ 
import { getAllLegalMoves } from "./legalMoves/getLegalMoves";


export function lookForCheck(color, board){
    
    var opponentColor = "white";
    if (color === "white"){
        opponentColor = "black";
    }
    // get the King's position
    var kingPosition = getKingRowCol(board, color)
    var kingRow = kingPosition[0];
    var kingCol = kingPosition[1];

    // legalMoves we are looking for should be opposite of the King we looked for and vice versa
    var legalMoves =  getAllLegalMoves(board, opponentColor)
    
    for (var i=0; i< legalMoves.length; i++){
        var r = legalMoves[i][0]
        var c = legalMoves[i][1]
        // if the king Falls in Position of opponent's legal Moves
        if((r === kingRow) && (c === kingCol)){
            return true
        }
    }
    return false

} // end function look for check

export function getKingRowCol(board, kingColor){
    var kingValue = 8;
    if(kingColor === "black"){
        kingValue = -8
    }
    for (var i =0; i <board.length; i++){
        var row = board[i];
        for (var j=0; j<row.length; j++){
            
            if (row[j] === kingValue){
                return [i, j]
            }// end if
        } // end inner for loop
    } // end outer for loop 
    return [-1, -1]
} // end getKignRowCol Function