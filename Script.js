const startBtn = document.getElementById('startBtn');
const player1NameInput = document.getElementById('player1Name');
const player2NameInput = document.getElementById('player2Name');
const player1AvatarSelect = document.getElementById('player1Avatar');
const player2AvatarSelect = document.getElementById('player2Avatar');

const setupDiv = document.getElementById('setup');
const gameDiv = document.getElementById('game');
const quitMessageDiv = document.getElementById('quitMessage');

const boardDiv = document.getElementById('board');
const turnPlayerSpan = document.getElementById('turnPlayer');

const restartBtn = document.getElementById('restartBtn');
const quitBtn = document.getElementById('quitBtn');

const scorePlayer1Span = document.getElementById('scorePlayer1');
const scorePlayer2Span = document.getElementById('scorePlayer2');
const score1Span = document.getElementById('score1');
const score2Span = document.getElementById('score2');

const finalScorePlayer1Span = document.getElementById('finalScorePlayer1');
const finalScorePlayer2Span = document.getElementById('finalScorePlayer2');
const finalScore1Span = document.getElementById('finalScore1');
const finalScore2Span = document.getElementById('finalScore2');

const clickSound = document.getElementById('clickSound');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 1;
let players = {};
let gameActive = false;
let scores = { 1: 0, 2: 0 };

const winningCombos = [
  [0,1,2], [3,4,5], [6,7,8], // rows
  [0,3,6], [1,4,7], [2,5,8], // columns
  [0,4,8], [2,4,6]           // diagonals
];

// Load scores and players from localStorage if exist
function loadData() {
  const savedScores = localStorage.getItem('tttScores');
  const savedPlayers = localStorage.getItem('tttPlayers');
  if (savedScores) {
    scores = JSON.parse(savedScores);
  }
  if (savedPlayers) {
    players = JSON.parse(savedPlayers);
  }
}

function saveData() {
  localStorage.setItem('tttScores', JSON.stringify(scores));
  localStorage.setItem('tttPlayers', JSON.stringify(players));
}

function renderBoard() {
  boardDiv.innerHTML = '';
  board.forEach((cell, index) => {
    const cellDiv = document.createElement('div');
    cellDiv.classList.add('cell');
    cellDiv.dataset.index = index;
    cellDiv.textContent = cell;
    cellDiv.addEventListener('click', handleCellClick);
    boardDiv.appendChild(cellDiv);
  });
}

function handleCellClick(e) {
  const index = e.target.dataset.index;
  if (!gameActive || board[index] !== '') return;

  board[index] = players[currentPlayer].avatar;
  clickSound.play();
  renderBoard();

  if (checkWin(players[currentPlayer].avatar)) {
    scores[currentPlayer]++;
    updateScores();
    alert(`${players[currentPlayer].name} wins!`);
    resetBoard();
  } else if (board.every(cell => cell !== '')) {
    alert("It's a draw!");
    resetBoard();
  } else {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    updateTurnText();
  }
}

function checkWin(avatar) {
  return winningCombos.some(combo => combo.every(i => board[i] === avatar));
}

function updateTurnText() {
  turnPlayerSpan.textContent = `${players[currentPlayer].name} ${players[currentPlayer].avatar}`;
}

function updateScores() {
  score1Span.textContent = scores[1];
  score2Span.textContent = scores[2];
  scorePlayer1Span.textContent = players[1].name;
  scorePlayer2Span.textContent = players[2].name;
}

function resetBoard() {
  board = ['', '', '', '', '', '', '', '', ''];
  renderBoard();
  currentPlayer = 1;
  updateTurnText();
  saveData();
}

startBtn.addEventListener('click', () => {
  const p1Name = player1NameInput.value.trim() || "Player 1";
  const p2Name = player2NameInput.value.trim() || "Player 2";

  if (p1Name === p2Name) {
    alert("Please enter different names for the players.");
    return;
  }

  players = {
    1: {
      name: p1Name,
      avatar: player1AvatarSelect.value
    },
    2: {
      name: p2Name,
      avatar: player2AvatarSelect.value
    }
  };

  loadData();

  // If players changed, reset scores for fresh start
  if (players[1].name !== scorePlayer1Span.textContent || players[2].name !== scorePlayer2Span.textContent) {
    scores = {1:0, 2:0};
  }

  updateScores();
  setupDiv.classList.add('hidden');
  gameDiv.classList.remove('hidden');
  quitMessageDiv.classList.add('hidden');
  gameActive = true;
  resetBoard();
});

restartBtn.addEventListener('click', () => {
  if (!gameActive) return;
  resetBoard();
});

quitBtn.addEventListener('click', () => {
  gameActive = false;
  gameDiv.classList.add('hidden');
  quitMessageDiv.classList.remove('hidden');

  finalScorePlayer1Span.textContent = players[1].name;
  finalScorePlayer2Span.textContent = players[2].name;
  finalScore1Span.textContent = scores[1];
  finalScore2Span.textContent = scores[2];

  saveData();
});
