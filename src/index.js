import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className={"square " + props.nomeclasse} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        nomeclasse={this.props.classequadrato[i]}
        key={i}
      />
    );
  }

  renderRow(i,rows){
    let leg = "";
    if(i===0){
      leg = 'd';
    }
    if(i===3){
      leg = 'e';
    }
    if(i===6){
      leg = 'f';
    }
    return (
      <div className="board-row" key={i}>
        <div className="legenda">{leg}</div>
        {rows[i]}{rows[i+1]}{rows[i+2]}
      </div>
    );
  }

  render() {
    let rows = [];
    for (let i = 0; i < 9; i++) {
      rows[i] = this.renderSquare(i);
    }

    let element = [];
    for (let i = 0; i < 9; i=i+3) {
      element[i] = this.renderRow(i, rows);
    }

    return (
      <div>
        <div className="legenda"> </div>
        <div className="legenda">a</div>
        <div className="legenda">b</div>
        <div className="legenda">c</div>
        {element}
      </div>
    );
  }
}

class MyList extends React.Component {
  render() {
    return(
       <li key={this.props.k}>
        <button className={this.props.klass} onClick={() => this.props.onClick()}>{this.props.desc}</button> {this.props.mossa}
       </li>
    )
  }
}


class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          posizione: Array(9).fill(null),
          mossaAttiva: Array(9).fill(null),
          currentM: Array(9).fill(null),
          classequadrato: Array(9).fill().map((v, i) => "nero"),
        }
      ],
      stepNumber: 0,
      xIsNext: true,
  		ascendingOrder: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const posizione = current.posizione.slice();
    const mossaAttiva = current.mossaAttiva.slice();
    const currentM = current.currentM.slice();
    const classequadrato = current.classequadrato.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    posizione[i] = calcola_posizione(i);
    mossaAttiva[this.state.stepNumber] = i;
    resetMossa(currentM);
    currentM[i] = "bold";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          posizione: posizione,
          currentM: currentM,
          mossaAttiva: mossaAttiva,
          classequadrato: classequadrato
        }
      ]),
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

  toggleOrder() {
  	this.setState({
  		ascendingOrder: !this.state.ascendingOrder
  	});
  }


  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const posizione = current.posizione;
    const mossaAttiva = current.mossaAttiva;
    const currentM = current.currentM;
    const moves = history.map((step, move) => {
          const currentMossa = mossaAttiva[move-1];
          const mossa = posizione[currentMossa] ? 'Mossa '+ posizione[currentMossa] : '';
          const desc = move ?
            'Vai alla mossa #' + move :
            'Inizio gioco';
          return (
              <MyList klass={currentM[currentMossa]} key={move} k={move} desc={desc} onClick={() => this.jumpTo(move)} mossa={mossa} />
          );
    });

    let status;
    if (winner) {
      status = "Vincitore: " + winner;
      current.classequadrato = ritornaquadratirossi(current.squares, current.classequadrato);
    } else {
      if(this.state.stepNumber == 9){
        status = "Pareggio";
      }else{
        status = "Turno del giocatore: " + (this.state.xIsNext ? "X" : "O");
      }
    }

    //Add a toggle button that lets you sort the moves in either ascending or descending order.
  	if (!this.state.ascendingOrder) {
   		moves.sort(function(a,b) {
    			return b.key - a.key;
    		});
   	}

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            classequadrato={current.classequadrato}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
          <button onClick={() => this.toggleOrder()}>Cambia Ordine</button>
        </div>
      </div>
    );
  }
}

// ========================================
ReactDOM.render(<Game />, document.getElementById("root"));

function resetMossa(curM){
  for (let i = 0; i < curM.length; i++) {
    curM[i] = "";
  }
}

function calcola_posizione(indice){
  const caselle = [
    ['a','d'],
    ['b','d'],
    ['c','d'],
    ['a','e'],
    ['b','e'],
    ['c','e'],
    ['a','f'],
    ['b','f'],
    ['c','f'],
  ];
  for (let i = 0; i < caselle.length; i++) {
      if(i === indice){
        return "[" + caselle[i] + "]";
      }
  }
}

function ritornaquadratirossi(squares, classirosse){
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      for (let j = 0; j < [a, b, c].length; j++) {
        let num = [a, b, c][j];
        classirosse[num]= "rosso"
      }
      return classirosse;
    }
  }
  return null;
}



function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
