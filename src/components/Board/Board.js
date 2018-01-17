import React, {Component} from 'react';
import './Board.css';
import Fade from '../Fade.js';
import O from '../../assets/O.svg';
import X from '../../assets/X.svg';
import ORed from '../../assets/O-red.svg';
import XRed from '../../assets/X-red.svg';

class Board extends Component {
  constructor() {
    super();
    this.setSmallestSide = this.setSmallestSide.bind(this);
    this.renderImage = this.renderImage.bind(this);
    this.getTileProps = this.getTileProps.bind(this);
    this.state = {
      smallestSide: 'height'
    };
  }

  componentWillMount() {
      this.setSmallestSide();
  }

  componentDidMount() {
      window.addEventListener("resize", this.setSmallestSide);
  }

  componentWillUnmount() {
      window.removeEventListener("resize", this.setSmallestSide);
  }

  setSmallestSide() {
    const smallestSide = window.innerWidth >= window.innerHeight ? 'height' : 'width';
    if(smallestSide !== this.state.smallestSide) {
      this.setState({smallestSide});
    }
  }

  getTileProps(char, charIdx) {
    const props = {
      className: 'Tile', 
      key: 'char' + charIdx, 
    };
    if(char === '-' && !this.props.win) {
      props.className = "Tile clickable";
      props.role = 'button';
      props.tabIndex = charIdx + 1;
      props.onClick = (e) => this.props.handleClick(charIdx);
      props.onKeyPress = (e) => {
        if(e.key === "Enter" || e.key === " ") {
          this.props.handleClick(charIdx);
        }
      };
    }
    return props;
  }

  renderImage(char, charIdx) {
    const winningIdx = this.props.win && this.props.win.split('').indexOf(charIdx + '') > -1;
    if(char === '-') {
      return '';
    } else if(char === 'X' && winningIdx) {
      return <img src={XRed} alt="X" />;
    } else if(char === 'O' && winningIdx) {
      return <img src={ORed} alt="O" />;
    } else if(char === 'X') {
      return <img src={X} alt="X" />;
    } else {
      return <img src={O} alt="O" />;
    }
  }

  render() {
    return (
      <div className={['Board', this.state.smallestSide === 'height' ? 'use-view-height' : 'use-view-width'].join(' ')}>
        {this.props.board.split('').map(
          (char, charIdx) => 
            <span {...this.getTileProps(char, charIdx)}>
              <span><Fade in={char !== '-'} duration={200}>{this.renderImage(char, charIdx)}</Fade></span>
            </span>
        )}
      </div>
    );
  }
}

Board.defaultProps = {
  board: '---------'
};

export default Board;