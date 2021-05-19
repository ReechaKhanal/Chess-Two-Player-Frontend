/* eslint-disable */ 
import React from 'react';
import ReactDOM from 'react-dom';
import { router } from 'websocket';

import * as serviceWorker from './serviceWorker';

import { BrowserRouter as Router, Route } from "react-router-dom";
import ChessBoard from "./ChessBoard/chessBoard";

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
    <Router>
      <Route path = "/" exact component={ChessBoard}/>
    </Router>
  );
}

export default App;