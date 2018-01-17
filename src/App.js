import React, { Component } from 'react';
import './App.css';
import Board from './components/Board/Board.js';
import ChooseSymbol from './components/ChooseSymbol/ChooseSymbol.js';
import Fade from './components/Fade.js';
import { newBoard, getNextBoard, otherSymbol, checkForWin } from './tic-tac-toe.js';

class App extends Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
    this.handleChooseSymbol = this.handleChooseSymbol.bind(this);
    this.renderGameOver = this.renderGameOver.bind(this);
    this.newGame = this.newGame.bind(this);
    this.state = {
      board: newBoard(),
      win: false,
      move: 'X'
    };
  }

  handleClick(tileIdx) {
    let nextBoard = this.state.board.split('');
    nextBoard[tileIdx] = this.state.player;
    nextBoard = nextBoard.join('');
    const winOnNextBoard = checkForWin(nextBoard);
    if(!winOnNextBoard && nextBoard.indexOf('-') > -1) {
      nextBoard = getNextBoard(otherSymbol(this.state.player), nextBoard);
    }
    this.setState({board: nextBoard, win: checkForWin(nextBoard)});
  }

  handleChooseSymbol(symbol) {
    return function(e) {
      this.setState({
        player: symbol,
        board: symbol === 'X' ? newBoard() : getNextBoard('X', newBoard())
      });
    }.bind(this);
  }

  renderGameOver() {
    const winningSymbol = this.state.win ? this.state.board[this.state.win[0]] : '';
    return (
      <div className="game-over">
        {this.state.win ? 
          <span>{this.state.player === winningSymbol ? 'You Win!' : winningSymbol + ' Wins!'}</span> : 
          <span>Draw!</span>
        }
        <button onClick={this.newGame}>Play Again?</button>
      </div>
    );
  }

  newGame() {
    this.setState({
      board: this.state.player === 'X' ? newBoard() : getNextBoard('X', newBoard()),
      win: false
    });
  }

  render() {
    return (
      <div className="App">
        <div className="Main">
          {!this.state.player ? 
            <ChooseSymbol onClick={this.handleChooseSymbol} /> : 
            <Board board={this.state.board} handleClick={this.handleClick} win={this.state.win} move={this.state.move} />
          }
        </div>
        <Fade in={this.state.win !== false || this.state.board.indexOf('-') === -1} duration={200} mountOnEnter unmountOnExit exit={false}>
          {this.renderGameOver()}
        </Fade>
      </div>
    );
  }
}

export default App;
