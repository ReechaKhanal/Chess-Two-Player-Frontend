/* eslint-disable */ 
export function getOriginalBoardColor(tempStateBoard){
    var white = "#eeeed2";
    var black = "#769656";
       
    for (var i=0; i< tempStateBoard.length; i++){
                
        var row = tempStateBoard[i];
        var color = white;
                
        for (var j=0; j<row.length; j++){
            
            if ((i+1)%2 !== 0){
                color = white;
                if ((j+1)%2 === 0){
                    color = black;
                }
            }else{
                color = black;
                if ((j+1)%2 === 0){
                    color = white;
                }
            }
            var current = tempStateBoard[i][j]
            tempStateBoard[i][j] = [current[0], color, current[2], current[3]]
        }
    }
        
}

export function invertStateBoard(tempBoard){
    for (var i=0; i < 4; i++){
        for (var j=0; j < 8; j++){
            
            let one = tempBoard[i][j];
            let two = tempBoard[7-i][j];

            tempBoard[i][j] = [two[0], one[1], one[2], one[3]];
            tempBoard[7-i][j] = [one[0], two[1], two[2], two[3]];
        }
    }
    return(tempBoard)
}

export function getInitialBoard(){
    var white = "#eeeed2";
    var black = "#769656";

    var stateBoard = [[0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0]];
                    
    var tempBoard = [[null, null, null, null, null, null, null, null, null, null],
                    [null, 6, 5, 4, 8, 7, 4, 5, 6, null],
                    [null, 1, 1, 1, 1, 1, 1, 1, 1, null],
                    [null, 0, 0, 0, 0, 0, 0, 0, 0, null],
                    [null, 0, 0, 0, 0, 0, 0, 0, 0, null],
                    [null, 0, 0, 0, 0, 0, 0, 0, 0, null],
                    [null, 0, 0, 0, 0, 0, 0, 0, 0, null],
                    [null,-1,-1,-1,-1,-1,-1,-1,-1, null],
                    [null,-6,-5,-4,-8,-7,-4,-5,-6, null],
                    [null, null, null, null, null, null, null, null, null, null]];

    for (var i=0; i< tempBoard.length; i++){

        var row = tempBoard[i];
        var value = 0;
        var piece = "";
        var color = white;                
            
        for (var j=0; j<row.length; j++){

            value = tempBoard[i][j];
            if (value == null){
                // do nothing
            }else{
                // only if the value is not null
                piece = value;

                if (i%2 !== 0){
                    color = white;
                    if (j%2 === 0){
                        color = black;
                    }
                }else{
                    color = black;
                    if (j%2 === 0){
                        color = white;
                    }
                }
                stateBoard[i-1][j-1] = [piece, color, i-1, j-1]
            }
        }
    }
    return(stateBoard);
}