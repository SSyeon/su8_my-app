import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) { //same class Square
  return (
    <button className={props.extraClass} onClick={props.onClick}>
      { props.value }
    </button>
  );
}

// class Square extends React.Component {
//   render() {
//     return (
//       <button className="square" onClick={() => this.props.onClick()}> {/*function()*/}
//         {this.props.value}
//       </button>
//     );
//   }
// }

class Board extends React.Component {
  renderSquare(i) {

    let extraClassName = 'square';                                           
    if (this.props.winnerCells && this.props.winnerCells.indexOf(i) > -1 )  
        extraClassName = 'square highlighted';                               

    return (<Square
      extraClass = {extraClassName}      
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
    />);
  }
 

    render() {
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }

class Game extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      history: [{squares : Array(9).fill(null),}],
      stepNumber:0,
      xIsNext : true,
    };
  }
  handleClick(i) {
    const history = this.state.history.slice(0,this.state.stepNumber+1);
    const current = this.state.history[history.length-1];
    const squares = current.squares.slice();
    if(squares[i] || calculateWinner(squares))
    return;
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        history: history.concat([{
          squares:squares,
        }]),
        stepNumber : history.length,
        xIsNext: !this.state.xIsNext,
      });
  }
  jumpTo(step){
    this.setState({
      stepNumber : step,
      xIsNext: (step%2)===0,
    })
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];              
    const winnerInfo = calculateWinner(current.squares); 
    console.log(winnerInfo);
    const winner = winnerInfo ? winnerInfo[0] : winnerInfo;
    console.log(winner);
    const winnerCells = winnerInfo ? winnerInfo.slice(1) : winnerInfo;  
    console.log(winnerCells);


    const moves = history.map((step, move) => {
      const desc = move ?
      'Go to move #' + move:
      'Go to game start';
      
      return(
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
         </li>
      );
    });
    let status;
    if (winner){
      status = 'Winner: ' + winner;
    }else {
      status = 'Next player: ' + (this.state.xIsNext? 'X':'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares = {current.squares}
            winnerCells={winnerCells}              
            onClick = {(i)=>this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for(let i=0; i<lines.length; i++) {
    const [a, b, c] = lines[i];
    if( squares[a] && squares[a]===squares[b] && squares[a]===squares[c] )
    return [ squares[a], a, b, c ];
}

return null;
}
