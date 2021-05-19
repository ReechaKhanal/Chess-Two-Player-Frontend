/* eslint-disable */ 
import React from 'react';
import ReactDOM from 'react-dom';
import ChessBoard from "./ChessBoard/chessBoard";
import * as serviceWorker from './serviceWorker';

/*
ReactDOM.render(
    <App />, document.getElementById('root')
);
*/
/*
ReactDOM.render(
  
    <div class = "chess">
      <h1>Reecha's Chess Board</h1>
      <ChessBoard/>
    </div>,
    document.getElementById('root')
  
    <div class = "chess">
      <h1>Reecha's Chess Board</h1>
      
    </div>
  );

  export default App;
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
*/

const App = () => {
  return (
    <div class = "chess">
      <h1>Reecha's Chess Board</h1>
    </div>
  );
}

export default App;