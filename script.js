const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');
const modeRadios = document.querySelectorAll('input[name="mode"]');

let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameActive = true;
let mode = 'pvp'; // default mode

function renderBoard() {
  boardEl.innerHTML = '';
  board.forEach((cell, idx) => {
    const cellEl = document.createElement('div');
    cellEl.className = 'cell';
    cellEl.textContent = cell || '';
    cellEl.addEventListener('click', () => handleCellClick(idx));
    boardEl.appendChild(cellEl);
  });
}

function handleCellClick(index) {
  if (!gameActive || board[index]) return;

  board[index] = currentPlayer;
  renderBoard();
  if (checkWin(currentPlayer)) {
    statusEl.textContent = `Player ${currentPlayer} wins!`;
    gameActive = false;
  } else if (board.every(cell => cell)) {
    statusEl.textContent = `It's a draw!`;
    gameActive = false;
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusEl.textContent = `Player ${currentPlayer}'s turn`;

    if (mode === 'cpu' && currentPlayer === 'O') {
      setTimeout(cpuMove, 500); // delay for realism
    }
  }
}

function cpuMove() {
  const emptyIndexes = board.map((val, idx) => val ? null : idx).filter(val => val !== null);
  const randomIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
  handleCellClick(randomIndex);
}

function checkWin(player) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];
  return winPatterns.some(pattern => 
    pattern.every(idx => board[idx] === player)
  );
}

function resetGame() {
  board = Array(9).fill(null);
  currentPlayer = 'X';
  gameActive = true;
  statusEl.textContent = `Player X's turn`;
  renderBoard();
}

modeRadios.forEach(radio => {
  radio.addEventListener('change', e => {
    mode = e.target.value;
    resetGame();
  });
});

resetBtn.addEventListener('click', resetGame);

renderBoard();
