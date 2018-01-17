import React from 'react';
import './ChooseSymbol.css';
import O from '../../assets/O.svg';
import X from '../../assets/X.svg';

function ChooseSymbol({onClick}) {
	return (
		<div className="ChooseSymbol">
			<button onClick={onClick('X')}><img src={X} alt="X" /></button>
			<button onClick={onClick('O')}><img src={O} alt="O" /></button>
		</div>
	);
}

export default ChooseSymbol;