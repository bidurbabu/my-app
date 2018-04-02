import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function HistoryDisplay(props) {
  const list = props.isReversed? props.moves.slice().reverse():props.moves;
  return props.isReversed? (<ol reversed>{list}</ol>): ( <ol>{list}</ol>);
}

function Square(props) {
  let sClass = "square " + props.highlight;
  return (
    <button className={sClass} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    let highlightClass = this.props.winner&&this.props.winner.winnerList.includes(i)?'highlight':'normal';
    return (
      <Square
        key = {i}
        highlight= {highlightClass}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
   return (
     <div>
       { [0, 1, 2].map((i) => (
           <div key={i} className="board-row">
              { [0, 1, 2].map((j) => ( this.renderSquare(3 * i + j))) }
           </div>
         ))
       }
     </div>
   );
 }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [ {
        squares: Array(9).fill(null),
        moveLocation: {
          col: null,
          row: null,
        },
      }],
      xIsNext: true,
      stepNumber: 0,
      isReversed: false,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const location = {
      col: i % 3,
      row: Math.floor(i/3),
    };
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X': 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        moveLocation: location,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }
  toggle() {
    this.setState({
      isReversed: !this.state.isReversed,
    });
  }


  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {

    let highlightClass = this.state.stepNumber === move ? "highlight": "normal";
    const desc = move ?
       'Go to move #' + move + ' Col=' + step.moveLocation.col + ' Row= ' + step.moveLocation.row:
       'Go to game start';
     return (
       <li key={move}>
         <button className={highlightClass} onClick={() => this.jumpTo(move)}>{desc}</button>
       </li>
     );
   });

  let status;
    if(winner) {
      status = 'Winner: ' + winner.winnerName;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' :'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            winner={winner}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            />
        </div>
        <div className="game-info">
          <div>{status}</div>
           <button onClick={() => this.toggle()}>Toggle</button>
           <HistoryDisplay
             isReversed={this.state.isReversed}
             moves={moves}
             />
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winnerName: squares[a],
        winnerList: lines[i]
      }
    }
  }
  return null;
}
