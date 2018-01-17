// Board Functions

export const newBoard = () => {
	return '---------';
}

const flipY = (board) => {
	return getRows(board).map(row => row.split('').reverse().join('')).join('');
}

const getRowLength = (board) => {
	return Math.sqrt(board.length);
}

const getCorners = (board) => {
	let size = getRowLength(board);
	return [board[0], board[0 + size - 1], board[board.length - size], board[board.length - 1]];
}

const getCenter = (board) => {
	return board[(board.length - 1) / 2];
}

const getSides = (board) => {
	let firstSide = Math.floor(getRowLength(board) / 2);
	let secondSide = firstSide + firstSide + 1;
	let thirdSide = secondSide + firstSide + 1;
	let fourthSide = thirdSide + firstSide + 1;
	return [board[firstSide], board[secondSide], board[thirdSide], board[fourthSide]];
}

const getDiagonal = (board) => {
	let diagonal = '';
	let offset = getRowLength(board) + 1;
	for(let i = 0; i < board.length; i += offset) {
		diagonal += board[i];
	}
	return diagonal;
}

const getIndexes = (board) => {
	return board.split('').map((cell, index) => index).join('');
}

const getRowPossibilities = (board) => {
	let rotatedBoard = rotateBoard(board);
	return (
		[].concat(getRows(board))
		  .concat(getRows(rotatedBoard))
		  .concat([getDiagonal(board)])
		  .concat([getDiagonal(rotatedBoard)])
	);
}

export const getRows = (board) => {
	let cells = board.split('');
	let rows = [];
	let size = getRowLength(board);
	while(cells.length > 0) {
		rows.push(cells.splice(0, size).join(''));
	}
	return rows;
}

const rotateBoard = (board) => {
	let rotated = '', size = getRowLength(board);
	for(let j = 0; j < size; j++) {
		for(let i = j; i < board.length; i += size) {
			rotated += board[i];
		}
	}
	return flipY(rotated);
}

// Symbol Related

export const otherSymbol = (symbol) => {
	return symbol === 'X' ? 'O' : 'X';
}

const findBlocks = (rows, map, symbol) => {
	return findWins(rows, map, otherSymbol(symbol));
}

const findNonBlock = (symbol, row) => {
	return [`${symbol}--`, `--${symbol}`, `-${symbol}-`].indexOf(row);
}

const findForks = (rows, map, symbol, board) => {
	let nonBlocks = rows.map(row => findNonBlock(symbol, row));
	let nonBlocksIndexes = map.filter((row, index) => nonBlocks[index] !== -1).map(row => row.split(''));
	let forks = [];
	if(nonBlocksIndexes.length > 1) {
		for(let i = 0; i < nonBlocksIndexes.length - 1; i++) {
			for(let j = i + 1; j < nonBlocksIndexes.length; j++) {
				let overlaps = nonBlocksIndexes[i].filter(
					index => 
						nonBlocksIndexes[j].join('').indexOf(index) > -1
				);
				let available = overlaps.filter(
					overlap => board[parseInt(overlap, 10)] === '-'
				);
				if(available.length > 0) {
					forks.push(available.join(''));
				}
			}
		}
	}
	return forks;
}

const findFork = (rows, map, symbol, board) => {
	let forks = findForks(rows, map, symbol, board);
	return forks.length > 0 ? parseInt(forks[0], 10) : -1;
}

const findTwo = (rows, map, symbol, board) => {
	let nonBlocks = rows.map(row => findNonBlock(symbol, row));
	let nonBlocksIndexes = map.filter((row, index) => nonBlocks[index] !== -1).map(row => row.split('').filter(index => board[index] === '-').join('')).join('');
	for(let i = 0; i < nonBlocksIndexes.length; i++) {
		let potentialNextBoard = makeMove(board, parseInt(nonBlocksIndexes[i], 10), symbol);
		let potentialRows = getRowPossibilities(potentialNextBoard);
		let potentialKeys = getRowPossibilities(getIndexes(potentialNextBoard));
		let forcedPosition = findWins(potentialRows, potentialKeys, symbol) + '';
		if(findForks(potentialRows, potentialKeys, otherSymbol(symbol), board).indexOf(forcedPosition) === -1) {
			return parseInt(nonBlocksIndexes[i], 10);
		}
	}
	return -1;
}

const findWin = (symbol, row) => {
	let wins = [
		`${symbol}${symbol}-`,
		`${symbol}-${symbol}`,
		`-${symbol}${symbol}`
	];

	let isWin = wins.indexOf(row);

	if(isWin > -1) {
		return row.indexOf('-');
	}

	return isWin;
}

const findWins = (rows, map, symbol) => {
	let wins = rows.map(row => findWin(symbol, row));
	let winsIndexes = map.map((row, index) => wins[index] > -1 ? row[wins[index]] : -1).filter(row => row !== -1);
	if(winsIndexes.length > 0) {
		return parseInt(winsIndexes[0], 10);
	} else {
		return -1;
	}
}

export const getNextBoard = (symbol, board) => {
	let rows = getRowPossibilities(board);
	let map = getRowPossibilities(getIndexes(board));

	// Find a win if possible
	let win = findWins(rows, map, symbol);
	if(win !== -1) {
		return makeMove(board, win, symbol);
	}

	// Find a block if possible
	let block = findBlocks(rows, map, symbol);
	if(block !== -1) {
		return makeMove(board, block, symbol);
	}

	// Find a fork if possible
	let fork = findFork(rows, map, symbol, board);
	if(fork !== -1) {
		return makeMove(board, fork, symbol);
	}

	// Make two in a row (not resulting in fork for opponent)
	let twoInARow = findTwo(rows, map, symbol, board);
	if(twoInARow !== -1) {
		return makeMove(board, twoInARow, symbol);
	}

	// Block a fork
	let blockFork = findFork(rows, map, otherSymbol(symbol), board);
	if(blockFork !== -1) {
		return makeMove(board, blockFork, symbol);
	}

	// Move center
	let centerIndex = parseInt(getCenter(getIndexes(board)), 10);
	if(board[centerIndex] === '-') {
		return makeMove(board, centerIndex, symbol);
	}

	// Move opposite corner (did someone say code smell?)
	let corners = getCorners(getIndexes(board));
	if(board[corners[0]] === otherSymbol(symbol) && board[corners[3]] === '-') {
		return makeMove(board, parseInt(corners[3], 10), symbol);
	}
	if(board[corners[3]] === otherSymbol(symbol) && board[corners[0]] === '-') {
		return makeMove(board, parseInt(corners[0], 10), symbol);
	}
	if(board[corners[1]] === otherSymbol(symbol) && board[corners[2]] === '-') {
		return makeMove(board, parseInt(corners[2], 10), symbol);
	}
	if(board[corners[2]] === otherSymbol(symbol) && board[corners[1]] === '-') {
		return makeMove(board, parseInt(corners[1], 10), symbol);
	}

	// Move corner
	corners = corners.filter(corner => board[parseInt(corner, 10)] === '-');
	if(corners.length > 0) {
		return makeMove(board, parseInt(corners[0], 10), symbol);
	}

	// Move side
	let sides = getSides(getIndexes(board)).filter(idx => board[parseInt(idx, 10)] === '-');
	if(sides.length > 0) {
		return makeMove(board, parseInt(sides[0], 10), symbol);
	}

	// Return a new board
	return newBoard();
}

// const isNonBlock = (symbol, row) => {
// 	return [`--${symbol}`, `${symbol}--`].indexOf(row) > -1;
// }

export const makeMove = (board, index, symbol) => {
	if(index >= 0 && index <= board.length) {
		let newBoard = board.slice(0, index) + symbol + board.slice(index + 1);
		if(newBoard.length === board.length) {
			return newBoard;
		} else {
			throw new Error('The move must not change the size of the board.');
		}
	} else {
		throw new Error('You may only move within the bounds of the board.');
	}
}

export const checkForWin = (board) => {
	let rows = getRowPossibilities(board);
	let win = getRowPossibilities(getIndexes(board)).filter(
		(row, index) => 
			rows[index] === 'XXX' || rows[index] === 'OOO'
	);
	if(win.length > 0) {
		return win[0];
	}
	return false;
}