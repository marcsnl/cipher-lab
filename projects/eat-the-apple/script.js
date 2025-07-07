//-----------Panel Objects------------
const mainMenu = document.getElementById("mainMenu");
const difficultyMenu = document.getElementById("difficultyMenu");
const gameContent = document.getElementById("gameContent");

//-----------Button Objects------------
const playBtn = document.getElementById("playBtn");
const diffToMainBackBtn = document.getElementById("diffToMainBackBtn");
const gameToDiffBackBtn = document.getElementById("gameToDiffBackBtn");
const easyDifBtn = document.getElementById("easyDifBtn");
const normalDifBtn = document.getElementById("normalDifBtn");
const hardDifBtn = document.getElementById("hardDifBtn");

//-----------------Game Objects----------------
const canvas = document.getElementById("gameBoard");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const resetBtn = document.getElementById("resetBtn");

let snake = [];
let direction = "RIGHT";
let apple = {};
let score = 0;
let gameInterval;
let gameSpeed = 200;

const box = 15;
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const rows = canvasHeight / box;
const cols = canvasWidth / box;

//-------------- Panel Logics --------------
playBtn.addEventListener("click", () => {
  mainMenu.classList.add("hidden");
  difficultyMenu.classList.remove("hidden");
});

diffToMainBackBtn.addEventListener("click", () => {
  difficultyMenu.classList.add("hidden");
  mainMenu.classList.remove("hidden");
});

gameToDiffBackBtn.addEventListener("click", () => {
  gameContent.classList.add("hidden");
  difficultyMenu.classList.remove("hidden");
  clearInterval(gameInterval);
});

easyDifBtn.addEventListener("click", () => {
  difficultyMenu.classList.add("hidden");
  gameContent.classList.remove("hidden");
  initGame(200);
});

normalDifBtn.addEventListener("click", () => {
  difficultyMenu.classList.add("hidden");
  gameContent.classList.remove("hidden");
  initGame(125);
});

hardDifBtn.addEventListener("click", () => {
  difficultyMenu.classList.add("hidden");
  gameContent.classList.remove("hidden");
  initGame(75);
});

//-----------------Game Logic----------------
//-------- Game logic made purely by AI -----

function initGame(speed) {
  clearInterval(gameInterval);
  gameSpeed = speed;
  score = 0;
  direction = "RIGHT";
  snake = [{ x: box * 5, y: box * 5 }];
  generateApple();
  gameInterval = setInterval(updateGame, gameSpeed);
  scoreDisplay.textContent = score;
}

function generateApple() {
  apple = {
    x: Math.floor(Math.random() * cols) * box,
    y: Math.floor(Math.random() * rows) * box,
  };
}

function drawGame() {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "#4CAF50" : "#8BC34A";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // Draw apple
  ctx.fillStyle = "#e91e63";
  ctx.fillRect(apple.x, apple.y, box, box);
}

function updateGame() {
  let head = { ...snake[0] };

  switch (direction) {
    case "LEFT":
      head.x -= box;
      break;
    case "UP":
      head.y -= box;
      break;
    case "RIGHT":
      head.x += box;
      break;
    case "DOWN":
      head.y += box;
      break;
  }

  // Collision with wall or self
  if (
    head.x < 0 || head.y < 0 ||
    head.x >= canvasWidth || head.y >= canvasHeight ||
    snake.some((segment) => segment.x === head.x && segment.y === head.y)
  ) {
    clearInterval(gameInterval);
    alert("Game Over! Your Score: " + score);
    return;
  }

  // Eat apple
  if (head.x === apple.x && head.y === apple.y) {
    score += 10;
    scoreDisplay.textContent = score;
    generateApple();
  } else {
    snake.pop();
  }

  snake.unshift(head);
  drawGame();
}

document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  if (key === "a" && direction !== "RIGHT") direction = "LEFT";
  if (key === "w" && direction !== "DOWN") direction = "UP";
  if (key === "d" && direction !== "LEFT") direction = "RIGHT";
  if (key === "s" && direction !== "UP") direction = "DOWN";
});

resetBtn.addEventListener("click", () => {
  initGame(gameSpeed);
});
