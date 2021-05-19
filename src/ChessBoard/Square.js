/* eslint-disable */ 
import React from "react";
import './Square.css';

/* ChessSquare  - defines the property of an individual square in the Chess Board
    *  All the squares are created using this class and hence maintaining a uniform look across the chess board
    * This Class defines, shape, size, and images used in the squares
    * The input here is provide by the renderSquare Function in the chessBoard.js Function.
*/
class ChessSquare extends React.Component{
    render(){
        const styles = {
          buttonStyle: {
              backgroundColor: this.props.color,
          }
        };
        return(
            <button className = "SquareBox" style = {styles.buttonStyle} onClick={() => this.props.onClick()}>
                <img className = "image" alt="" src =  {this.props.source}/>
            </button>
        );
    }
}
export default ChessSquare;