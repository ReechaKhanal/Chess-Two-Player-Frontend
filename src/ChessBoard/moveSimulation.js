/* eslint-disable */ 
import { getLegalMoves, getAllLegalMoves } from "./legalMoves/getLegalMoves.js";
import { getBoardFromStateBoard } from "./getStateBoard.js";
import { getKingRowCol } from "./lookForCheck.js";

export function noPreSelection(selectedPiece, tempStateBoard, piece, row, col){
    // store current piece info for next time
    selectedPiece = [[piece, row, col]]
    var brown = "#964B00";
    // if the selected square has a piece in it, highlight the available moves
    var board = getBoardFromStateBoard(tempStateBoard);
    
    var color = "black";
    if(piece > 0){
        color = "white";
    }

    var legalMoves = getLegalMoves(board, [row+1, col+1], color);
    selectedPiece.push(legalMoves);
    
    // highlight legalMoves
    for (var k = 0; k<legalMoves.length; k++){
        var r = legalMoves[k][0] - 1;
        var c = legalMoves[k][1] - 1;
        tempStateBoard[r][c] = [tempStateBoard[r][c][0], brown, tempStateBoard[r][c][2], tempStateBoard[r][c][3]];
    }
    return [tempStateBoard, selectedPiece]
}

export function amIInCheck(tempStateBoard, piece){

    var allLegalMovesBlack = [];
    var allLegalMovesWhite = [];
    var blackKing = [];
    var whiteKing = [];
    var board = getBoardFromStateBoard(tempStateBoard);

    var j = 0, r=0, c=0;
    if (piece > 0){
        // piece - white
        whiteKing = getKingRowCol(board,"white");
        allLegalMovesBlack = getAllLegalMoves(board, "black");

        // Check if the White King is in a check
        for (j=0; j< allLegalMovesBlack.length; j++){
            r = allLegalMovesBlack[j][0]
            c = allLegalMovesBlack[j][1]
            // if the king Falls in Position of opponent's legal Moves
            if((r === whiteKing[0]) && (c === whiteKing[1])){
                return true;
            }
        }
    }else{
        // piece - black
        blackKing = getKingRowCol(board, "black");
        allLegalMovesWhite = getAllLegalMoves(board, "white");

        // Check if the Black King is in a check
        for (j=0; j< allLegalMovesWhite.length; j++){
            r = allLegalMovesWhite[j][0]
            c = allLegalMovesWhite[j][1]
            // if the king Falls in Position of opponent's legal Moves
            if((r === blackKing[0]) && (c === blackKing[1])){
                return true;
            }
        }
    }
    return false;
}

export function withPreSelection(selectedPiece, tempStateBoard, piece, row, col, turn, blackHasMoved, whiteHasMoved){ // start function
    
    // selectedPiece - [[piece, row, col], [legalMoves]]
    //var originalBoard = tempStateBoard.copy();

    var originalBoard = tempStateBoard.map(function(arr) {
        return arr.slice();
    });

    var legalMoves = selectedPiece[1]; 
    var selectedRow = selectedPiece[0][1], selectedCol = selectedPiece[0][2];
    var takenPiece = null, check = null;
    
    var inCheck = amIInCheck(tempStateBoard, selectedPiece[0][0]);
    var win = null;
    
    // we check if the new piece falls under the legalMoves of the piece pre-selected
    // If yes - We move, If No - we do nothing
    for (var i=0; i< legalMoves.length; i++){ // Start Outer-most For Loop
        
        var r1 = (legalMoves[i][0] - 1), c1 = (legalMoves[i][1] - 1);
        
        if ((r1 === row) && (c1 === col)){ // Only If  the new selected place is among the legal moves

            tempStateBoard[row][col] = [selectedPiece[0][0], tempStateBoard[row][col][1], tempStateBoard[row][col][2], tempStateBoard[row][col][3]];
            tempStateBoard[selectedRow][selectedCol] = [0, tempStateBoard[selectedRow][selectedCol][1], tempStateBoard[selectedRow][selectedCol][2], tempStateBoard[selectedRow][selectedCol][3]];
            
            if(piece !== 0){
                takenPiece = piece
            }
            if (inCheck){
                alert('I am in check')
                // check if I am still in check
                var stillInCheck = amIInCheck(tempStateBoard, selectedPiece[0][0]);
                if (stillInCheck){
                    return [originalBoard, turn, null, check, whiteHasMoved, blackHasMoved]
                }
            }

            // will I be in check after making this move:
            var willBeInCheck = amIInCheck(tempStateBoard, selectedPiece[0][0]);
            if (willBeInCheck){
                alert('I will be in a check if I move this')
                return [originalBoard, turn, null, check, whiteHasMoved, blackHasMoved]
            }

            // IsOpponentInCheck?
            var opponentInCheck = amIInCheck(tempStateBoard, 0-selectedPiece[0][0])
            var gameNotOver = true
            if (opponentInCheck){
                gameNotOver = canOpponentGetOutOfCheck(tempStateBoard, 0-selectedPiece[0][0])
                if (!gameNotOver){
                    //gameNotOver = false
                    win = selectedPiece[0][0];
                }
            }

            turn = !turn;
            
            if ((selectedPiece[0][0] === 8) || (selectedPiece === 6)){

                whiteHasMoved = updateHasMoved(whiteHasMoved, selectedPiece[0][0], row)
            }
            else if ((selectedPiece[0][0] === -8) || (selectedPiece === -6)){

                blackHasMoved = updateHasMoved(blackHasMoved, selectedPiece[0][0], row)

            }

            break;
        } // end If Statement where  the new selected place is among the legal moves
    } // end Outer-most For Loop
    return [tempStateBoard, turn, takenPiece, win, whiteHasMoved, blackHasMoved];
} // end function

function updateHasMoved(hasMoved, piece, row){

    if ( (hasMoved[0] === true) || ((hasMoved[1] === true) && (hasMoved[2] === true)) ){ 
        // do nothing                    
    }
    else{ // only if the king or the rooks have not been moved

        // if we just moved a White King or a White Rook
        if ((piece === 8) || (piece === 8)){ // We moved a King
            hasMoved = [true, hasMoved[1], hasMoved[2]]
        }
        else{ // We moved a Rook

            // check if it is a short rook or a long rook
            if(row === 0){ // Is Short Rook
                hasMoved = [hasMoved[0], true, hasMoved[2]]
            }
            if (row === 7){ // Is Long Rook
                hasMoved = [hasMoved[0], hasMoved[1], true]
            }
        } // End Else Statement
    } // End Only if the King has not moved
    return hasMoved
}

export function canOpponentGetOutOfCheck(tempStateBoard, piece){
    
    var color = "white";
    if (piece < 0){
        color = "black";
    }

    var allOpponentPieces = [];
    var board = getBoardFromStateBoard(tempStateBoard);
    
    // get all Opponent Pieces and location
    var i = 0, j = 0;
    for (i=0; i<board.length; i++){
        for (j=0; j< board[i].length; j++){

            if (board[i][j] != null){

                if ((color === "black") && (board[i][j] < 0)){
                    allOpponentPieces.push([board[i][j], i, j])
                }else if ((color === "white") && (board[i][j] > 0)){
                    allOpponentPieces.push([board[i][j], i, j])
                }
            }
        }
    }

    // for every single Opponent piece
    var legalMoves = [];
    var tempBoard = [];
    var currentPiece = null;
    var currentCol = null;
    var currentRow = null;
    var stillInCheck = false;

    for(i=0; i<allOpponentPieces.length; i++){
        
        currentPiece = allOpponentPieces[i][0];
        currentRow = allOpponentPieces[i][1] -1;
        currentCol = allOpponentPieces[i][2] -1;
        // get all the legal moves for the current piece
        legalMoves = getLegalMoves(board, [allOpponentPieces[i][1], allOpponentPieces[i][2]], color)
        
        // for all the legal moves the current piece can make
        for(j=0; j< legalMoves.length; j++){

            // make a copy of the originalBoard
            tempBoard = tempStateBoard.map(function(arr) {
                return arr.slice();
            });

            // assume that the move is made
            var r1 = legalMoves[j][0]-1, c1 = legalMoves[j][1]-1;
            tempBoard[r1][c1] = [currentPiece, tempBoard[r1][c1][1], tempBoard[r1][c1][2], tempBoard[r1][c1][3]];
            tempBoard[currentRow][currentCol] = [0, tempBoard[currentRow][currentCol][1], tempBoard[currentRow][currentCol][2], tempBoard[currentRow][currentCol][3]];

            // check if the opponent is still in check
            stillInCheck = amIInCheck(tempBoard, currentPiece);

            if (stillInCheck){
                // do nothing
            }else{
                return true
            }
        }// end for legal moves loop
    } // end opponent pieces loop

    // if the code reaches at this point there is no other move that can be made
    return false
}