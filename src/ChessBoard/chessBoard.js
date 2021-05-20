/* eslint-disable */
import React, { Component } from "react";
import './chessBoard.css';
import ChessSquare from "./Square";
import { getOriginalBoardColor, getInitialBoard } from "./getOriginalBoardProperties";
import { noPreSelection, withPreSelection, amIInCheck, canOpponentGetOutOfCheck } from "./moveSimulation.js";
import Popup from  "./popup";
import { getImageType } from "./Images/getImageType.js"
import { getKingRowCol } from "./lookForCheck";
import { getBoardFromStateBoard } from "./getStateBoard";
import { getAllLegalMoves } from "./legalMoves/getLegalMoves";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import Identicon from 'react-identicons';

//const client = new W3CWebSocket('wss://127.0.0.1:8000');
const client = new W3CWebSocket('wss://chess-two-player-backend.herokuapp.com/');

class ChessBoard extends Component{
    /*
    * Whenever user logs in - we will take him/her to a completely new game
    * We will create a room for her and "text" reecha that someone is waiting to for you in the room. 
    */S
    /* Log In User */
    logInUser = () => {       
        
        const username = this.username.value;
        const playername = this.playername.value;

        if ((username.trim()) && (playername.trim())){
            const data = {
              username,
              playername
            };
            this.setState({
              ...data
            }, () => {
                client.send(JSON.stringify({
                    ...data,
                    type: "userevent"
                }));
            });
        }
    }

    /* When content of the board changes, we send the current content of the editor to the server. */
    onBoardStateChange = (text) => {
       
        client.send(JSON.stringify({
            type: "contentchange",
            currentUsers: this.state.currentUsers,
            userActivity: this.state.userActivity,
            username: this.state.username,
            playername: this.playername,
            stateBoard: this.state.stateBoard,
            selectedPiece: this.state.selectedPiece,
            turn: this.state.turn,
            takenWhitePieces: this.state.takenWhitePieces,
            takenBlackPieces: this.state.takenBlackPieces,
            win: this.state.win,
            check: this.state.check,
            whiteHasMoved: this.state.whiteHasMoved,
            blackHasMoved: this.state.blackHasMoved
        }));
    };

    componentWillMount(){
        
        client.onopen = () => {
            console.log('Websocket Client Connected');
        };
        client.onmessage = (message) => {
            const dataFromServer = JSON.parse(message.data);
            const stateToChange = {};
            
            if (dataFromServer.data === "e"){
                stateToChange.username = null;
            }else{
                // This is probably the place where we get the state from the server back
                if (dataFromServer.type === "userevent"){
                    stateToChange.currentUsers = Object.values(dataFromServer.data.users)
                    stateToChange.userActivity = dataFromServer.data.userActivity;
                    stateToChange.myColor = this.state.myColor;

                    var tempColor = this.state.myColor;
                    if (tempColor === null){
                        stateToChange.myColor = dataFromServer.data.color;
                    }

                } else if (dataFromServer.type === "contentchange") {
                    stateToChange.currentUsers = dataFromServer.data.boardState.currentUsers;
                    stateToChange.userActivity = dataFromServer.data.boardState.userActivity;
                    stateToChange.username = dataFromServer.data.boardState.username;
                    stateToChange.playername = dataFromServer.data.boardState.playername;
                    stateToChange.stateBoard = dataFromServer.data.boardState.stateBoard;
                    stateToChange.selectedPiece = dataFromServer.data.boardState.selectedPiece;
                    stateToChange.turn = dataFromServer.data.boardState.turn;
                    stateToChange.takenWhitePieces = dataFromServer.data.boardState.takenWhitePieces;
                    stateToChange.takenBlackPieces = dataFromServer.data.boardState.takenBlackPieces;
                    stateToChange.win = dataFromServer.data.boardState.win;
                    stateToChange.check = dataFromServer.data.boardState.check;
                    stateToChange.whiteHasMoved = dataFromServer.data.boardState.whiteHasMoved;
                    stateToChange.blackHasMoved = dataFromServer.data.boardState.blackHasMoved;
                }
            }
            //stateToChange.userActivity = dataFromServer.data.userActivity;
            this.setState({
                ...stateToChange
            });
        };
    } // end function componentWillMount

    showLoginSection = () => (
        <div className="login_section">
            <h2 className="login_head"> Welcome to Reecha's Chess Board</h2>
            <form class="form-inline" action="/action_page.php">
                <label for="room_name">Room Name:</label>
                <input name="username" placeholder="Create or Join a Room" ref={(input) => { this.username = input; }} className="form-control" />
            </form>
            <form class="form-inline" action="/action_page.php">
                <label for="playername">Player Name:</label>
                <input name="playername" placeholder="Enter Your Name" ref={(input1) => { this.playername = input1; }} className="form-control" /> 
            </form>
            <div className="play_chess_button_div">
                <button type="button" onClick={() => this.logInUser()} className="play_chess_button">Play Chess</button>
            </div>
        </div>
    )

    /*<div className="account__wrapper">
            <div className="account__card">
              <div className="account__profile">
                <p className="account__name"> Enter a new or existing room name: </p>
                <input name="username" ref={(input) => { this.username = input; }} className="form-control" />
                <p className="account__name">Your Name:</p>
                <input name="playername" ref={(input1) => { this.playername = input1; }} className="form-control" /> 
              </div>
            </div>
        </div>
    */

    /* We will see if we need a showBoardSection later in here. For now we are assuming we can fit it in the render function*/

    /*
        Here we define all the state variables we need to maintain a proper flow in the game
            1. 'stateboard' is the initial setup of the board
            2. 'selectedPiece' holds the piece, just before it has been moved
            3. 'turn' variable keeps track of whose turn is it to play
            4. 'takenBlackPieces' and 'takenWhitePieces' hold the pieces that has been taken till a certain point in the game
                these arrays are used to display a list of taken pieces during the game.
            5. 'win' variable is set when a player wins - this disables any more movements once someone wins
            6. 'check' variable is set when a king is in check to notify the players
            7. 'whiteHasMoved' and 'blackHasMoved' - help keep track of the King and Rook positions during castling.
    */
    
    constructor(props) {
        super(props);
        this.state = {
            currentUsers: [],
            userActivity: [],
            username: null,
            playername: null,
            stateBoard: getInitialBoard(),
            selectedPiece: [], turn: true,
            takenBlackPieces: [], takenWhitePieces: [],
            win: null, check: null,
            whiteHasMoved: [false, false, false], blackHasMoved: [false, false, false],
            myColor: null
        };
    }

    /*
        * Helps in rendering individual square in the chess board
        * calls the class "Square.js" that does the actual rendering
        * If a square has been clicked, we call the handleClick Function
    */
    renderSquare(type, color, row, col){
        return(
            <ChessSquare
                value = {type}
                color = {color}
                source = {getImageType(type)}
                onClick={()=>this.handleClick(type, row, col)}
            />
        )
    }

    /*
        * setOriginalBoardColor() Function:
        * Our chess board highlights the squares a piece is allowed to move in
        * This function brings back the highlighted squares to its original color
    */
    setOriginalBoardColor(){
        var tempStateBoard = this.state.stateBoard.slice();
        tempStateBoard = getOriginalBoardColor(tempStateBoard);
        this.setState({stateBoard: tempStateBoard});
    };

    checkIfCastlingIsPossible(tempBoard, color, rookRow, rookCol){
        
        var board = getBoardFromStateBoard(tempBoard);
        var kingLocation = getKingRowCol(board, color);
        var KingRow = kingLocation[0];
        var kingCol = kingLocation[1];

        // castling is not possible if the king is in check
        var check = amIInCheck(tempBoard, board[KingRow][kingCol]);
        if (check === true){
            //castling not possible when king is in check
            return false
        }
        
        // we confirm here if the rook provided is the short Rook or the long rook
        var isShortRook = false;
        if (Math.abs(kingCol - rookCol) === 3 ){
            isShortRook = true;
        }

        // At this Point we know that we have a King and a rook selected
        // We know if it is a short Rook or a long Rook

        // select the appropriate hasMoved state variable based on your color
        var hasMoved = this.state.blackHasMoved;
        var opponentColor = "white";
        if (color === "white"){
            opponentColor = "black";
            hasMoved = this.state.whiteHasMoved;
        }

        var shortRookMovement = hasMoved[1];
        var longRookMovement = hasMoved[2];
        
        // return False if the King has already been moved
        if (hasMoved[0] === true){
            return false;
        }
        // return False if both the rooks have already been moved
        else if ((shortRookMovement === true) && (longRookMovement === true)){
            return false;
        }
        // return False if we are looking at shortRook and shortRook has been moved
        else if ( (isShortRook === true) && (shortRookMovement === true)){
            return false
        }
        // return False if we are looking ar a long Rook and longRook has been moved
        else if ( (isShortRook === false) && (longRookMovement === true) ){
            return false
        }

        // Return false if there is anything between the king and the rook
        var start = kingCol, end = rookCol;
        if (rookCol < kingCol){
            start = rookRow;
            end = kingCol;
        }
        var spaceInBetween = [], i = 0;
        for (i = start+1; i < end; i++){
            if (board[rookRow][i] !== 0){
                return false
            }
            spaceInBetween.push([rookRow, i])
        }

        // check if any of the spaceInBetween fall within opponent's legal Moves

        var opponentLegalMoves = getAllLegalMoves(board, opponentColor)
        var r1 = null, c1 = null, r2 = null, c2 = null;
        for (i=0; i<opponentLegalMoves.length; i++){

            r1 = opponentLegalMoves[i][0];
            c1 = opponentLegalMoves[i][1];
            var j = 0;
            for (j=0; j<spaceInBetween.length; j++){

                r2 = spaceInBetween[j][0];
                c2 = spaceInBetween[j][1];

                if ((r1 === r2) && (c1 === c2)){
                    return false
                }

            } // end inner for loop
        } // end outer for loop
        return true
    }
    
    /*
        * handleClick Function does the actual job of a Chesss Engine
        * It checks if a move is allowed
        * It checks if the game has already been won
        * It maintains the turns in the game
        * It updates and calls various other variables and functions that continue the game play
        * This is a very important function
    */
    handleClick(piece, row, col){

        // If the game has not been WON yet - we look further into the game
        // Else If the game has already been WON - we dont do anything - disabling any sort of movements in the chess board
        // If it is not current player's turn we dont allow them to move at all
        if ((this.state.win == null) && ( ((this.state.myColor === "black") && this.state.turn === false) || ((this.state.myColor === "white") && (this.state.turn === true))) ){

            var selectedPiece = this.state.selectedPiece.slice();
            var tempStateBoard = this.state.stateBoard.slice();
            var turn = this.state.turn;
            
            // No Preselection - If the selectedPiece state variable is empty - OR no piece has been clicked on before
            if (selectedPiece.length === 0){
                
                // Move further Only If the piece trying to move is the piece that is supposed to move
                if ( ((turn === true) && (piece>0)) || ((turn === false) && (piece<0))){
                    var output = noPreSelection(selectedPiece, tempStateBoard, piece, row, col);
                    this.setState({stateBoard: output[0],
                        selectedPiece: output[1]});
                } // end inner if
            }
            // With Preselection - If the selectedPiece state variable is not empty - OR a piece has been clicked on before
            else{
                var takenBlackPieces = this.state.takenBlackPieces.slice();
                var takenWhitePieces = this.state.takenWhitePieces.slice();

                var blackHasMoved = this.state.blackHasMoved.slice()
                var whiteHasMoved = this.state.whiteHasMoved.slice()
                
                // Verify Turn
                if ( ((turn === true) && (selectedPiece[0][0]>0)) || ((turn === false) && (selectedPiece[0][0]<0))){

                    var color = "black";
                    if (selectedPiece[0][0] > 0){
                        color = "white";
                    }
                    if ( ( ((selectedPiece[0][0] === 8)  && (piece === 6)) || ((selectedPiece[0][0] === -8)  && (piece === -6)) ) && this.checkIfCastlingIsPossible(tempStateBoard, color, row+1, col+1) ){
                        this.setOriginalBoardColor();
                        tempStateBoard = this.state.stateBoard.slice();
                        // Castling is possible - Castle

                        var KingRow = selectedPiece[0][1], kingCol = selectedPiece[0][2];

                        var rookRow = row, rookCol = col;

                        var shortCastle = false;
                        if (Math.abs(rookCol-kingCol) === 3){
                            shortCastle = true;
                        }

                        // If we are looking at short castle
                        if (shortCastle === true){
                                                        
                            tempStateBoard[KingRow][kingCol] = [0, tempStateBoard[KingRow][kingCol][1], tempStateBoard[KingRow][kingCol][2], tempStateBoard[KingRow][kingCol][3]];
                            tempStateBoard[rookRow][rookCol] = [0, tempStateBoard[rookRow][rookCol][1], tempStateBoard[rookRow][rookCol][2], tempStateBoard[rookRow][rookCol][3]];

                            // King Moves two columns to the left 
                            // Rook Moves two columns to the right
                            kingCol = kingCol - 2;
                            rookCol = rookCol + 2;

                            tempStateBoard[KingRow][kingCol] = [selectedPiece[0][0], tempStateBoard[KingRow][kingCol][1], tempStateBoard[KingRow][kingCol][2], tempStateBoard[KingRow][kingCol][3]];
                            tempStateBoard[rookRow][rookCol] = [piece, tempStateBoard[rookRow][rookCol][1], tempStateBoard[rookRow][rookCol][2], tempStateBoard[rookRow][rookCol][3]];
                            
                        } // Else If we are looking at long castle
                        else{

                            tempStateBoard[KingRow][kingCol] = [0, tempStateBoard[KingRow][kingCol][1], tempStateBoard[KingRow][kingCol][2], tempStateBoard[KingRow][kingCol][3]];
                            tempStateBoard[rookRow][rookCol] = [0, tempStateBoard[rookRow][rookCol][1], tempStateBoard[rookRow][rookCol][2], tempStateBoard[rookRow][rookCol][3]];

                            // King moves two columns to the right
                            // Rook Moves three columns to the left

                            kingCol = kingCol + 2;
                            rookCol = rookCol - 3;

                            tempStateBoard[KingRow][kingCol] = [selectedPiece[0][0], tempStateBoard[KingRow][kingCol][1], tempStateBoard[KingRow][kingCol][2], tempStateBoard[KingRow][kingCol][3]];
                            tempStateBoard[rookRow][rookCol] = [piece, tempStateBoard[rookRow][rookCol][1], tempStateBoard[rookRow][rookCol][2], tempStateBoard[rookRow][rookCol][3]];
                            
                        }

                        if (shortCastle === true){
                            if (selectedPiece[0][0] >0){
                                whiteHasMoved = [true, true, whiteHasMoved[2]]
                            }
                            else{
                                blackHasMoved = [true, true, blackHasMoved[2]]
                            }
                        }else{ // Long Castle
                            if (selectedPiece[0][0] >0){
                                whiteHasMoved = [true, whiteHasMoved[1], true]
                            }
                            else{
                                blackHasMoved = [true, blackHasMoved[1], true]
                            }
                        }

                        // IsOpponentInCheck?
                        var opponentInCheck = amIInCheck(tempStateBoard, 0-selectedPiece[0][0])
                        var gameNotOver = true;
                        var win = null
                        if (opponentInCheck){
                            gameNotOver = canOpponentGetOutOfCheck(tempStateBoard, 0-selectedPiece[0][0])
                            if (gameNotOver === false){
                                //gameNotOver = false
                                win = selectedPiece[0][0];
                            }else{
                                // game Not Over = True
                                win = null;
                            }
                        }
                        turn = !turn;
                        this.setState({ stateBoard: tempStateBoard, selectedPiece: [], turn: turn, win: win, blackHasMoved: blackHasMoved, whiteHasMoved: whiteHasMoved});
                        
                    }else{

                        // Castling is not possible
                        var output1 = withPreSelection(selectedPiece, tempStateBoard, piece, row, col, turn, blackHasMoved, whiteHasMoved)
                        this.setOriginalBoardColor()
                    
                        // If a piece has been taken
                        if(output1[2] != null){
                    
                            if (output1[2] < 0){
                                takenBlackPieces.push(output1[2])
                            } else if (output1[2] > 0){
                                takenWhitePieces.push(output1[2])
                            }
                        }
                        this.setState({stateBoard: output1[0],
                            selectedPiece: [], turn: output1[1],
                            takenBlackPieces: takenBlackPieces, takenWhitePieces: takenWhitePieces,
                            win: output1[3],
                            whiteHasMoved: output1[4],
                            blackHasMoved: output1[5]
                        });
                    } // end else
                } // end inner if
            } // end else
        } //  end if
    } // end handleClick Function

    startOver(){
        window.location.reload();
    }

    getTurnText(){
        var turn = this.state.turn;
        var turnText = "White's Turn";
        if (turn === false){
            turnText = "Black's Turn";
        }
        return turnText
    }

    componentDidUpdate(prevProps, prevState){
        if (prevState.turn !== this.state.turn){
            this.onBoardStateChange()
        }
        // else do nothing
    }

    render(){
        // alert("I am " +  this.state.playername + " and I am in room "+ this.state.username);
        var stateBoard1 = this.state.stateBoard.slice();
        var takenBlackPieces = this.state.takenBlackPieces, takenWhitePieces = this.state.takenWhitePieces;
        var win = this.state.win, check = this.state.check;

        var takenBlack = takenBlackPieces.map((piece, idx) => {
            return <><img className = "takenPiecePic" alt="" src = {getImageType(piece)}/></> 
        });
        
        var takenWhite = takenWhitePieces.map((piece, idx) => {
            return <><img className = "takenPiecePic" alt="" src = {getImageType(piece)}/></>
        });

        return(
            <React.Fragment>
                {this.state.username ? <>
                <div className = "test">
                    <div className = "card">
                        <h2 className = "playerText"> Player 1 : White Pieces </h2>
                        {this.getTurnText()}
                        <div className = "pieceTaken">
                            <h3 className = "takenText"> Pieces Taken </h3>
                            {takenWhite}
                        </div>
                        { (win > 0) && <Popup
                            content={<>
                            <h2>Player 1 Wins. </h2>
                            <button onClick={() => window.location.reload()}>Start Over </button>
                            </>}
                        />}
                    </div>
                    <div>
                        {stateBoard1.map((rows, index) => {
                            return(
                                <div>
                                {rows.map((value, vIndex) => {
                                    return <>{this.renderSquare(value[0], value[1], value[2], value[3])}</>
                                })}
                                </div>
                            );
                        })}
                        <br></br>
                    </div>
                    <div className = "card">
                        <h2 className = "playerText"> Player 2 : Black Pieces </h2>
                        {this.getTurnText()}
                        <div className = "pieceTaken">
                            <h3 className = "takenText"> Pieces Taken </h3>
                            {takenBlack}
                        </div>
                        { (win < 0) && <Popup
                            content={<>
                            <h2>Player 2 Wins. </h2>
                            <button onClick={() => window.location.reload()}>Start Over </button>
                            </>}
                        />}
                    </div>
                </div>
                </> : this.showLoginSection()}
            </React.Fragment>
        );
    }
}
export default ChessBoard;