// board
let board;
let boardWidth = window.innerWidth;
let boardHeight = window.innerHeight;
let ctx;

// bird
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;
let bird = {
  x: birdX,
  y: birdY,
  width: birdWidth,
  height: birdHeight,
};

// pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;
let topPipeImg;
let bottomPipeImg;

let velocityX = -2;
let velocityY = 0;
let gravity = 0.23;

let gameOver = false;
let score = 0;
let gameStarted = false;

window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  ctx = board.getContext("2d");

  // load images
  birdImg = new Image();
  birdImg.src = "assets/flappybird.png";
  birdImg.onload = function () {
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  };

  topPipeImg = new Image();
  topPipeImg.src = "assets/toppipe.png";

  bottomPipeImg = new Image();
  bottomPipeImg.src = "assets/bottompipe.png";

  requestAnimationFrame(update);
  setInterval(placePipe, 1500);
  addEventListener("keydown", handleKeyPress);
  addEventListener("touchstart", handleTouch);
};

// Main game loop
function update() {
  requestAnimationFrame(update);

  if (gameOver) {
    return;
  }

  ctx.clearRect(0, 0, boardWidth, boardHeight);

  if (!gameStarted) {
    displayStartMessage();
    return;
  }

  // bird
  velocityY += gravity;
  bird.y = Math.max(bird.y + velocityY, 0);
  ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

  if (bird.y > board.height) {
    gameOver = true;
  }

  // pipes
  for (let i = 0; i < pipeArray.length; i++) {
    let pipe = pipeArray[i];
    pipe.x += velocityX;
    ctx.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      score += 0.5;
      pipe.passed = true;
    }

    if (detectCollision(bird, pipe)) {
      gameOver = true;
    }
  }

  // clear pipes
  while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
    pipeArray.shift();
  }

  // score
  ctx.fillStyle = "white";
  ctx.font = "45px sans-serif";
  ctx.fillText(score, 10, 45);

  if (gameOver) {
    ctx.fillText("GAME OVER!", 10, boardHeight / 7);
    ctx.font = "20px sans-serif";
    ctx.fillText("Press 'ESC' or tap to restart!", 15, boardHeight / 5);
  }
}

function displayStartMessage() {
  ctx.fillStyle = "white";
  ctx.font = "30px sans-serif";
  ctx.fillText("Press 'SPACE' or tap to start", 10, 45);
}

function placePipe() {
  if (gameOver || !gameStarted) return;

  let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
  let openingSpace = boardHeight / 4;

  let topPipe = {
    img: topPipeImg,
    x: pipeX,
    y: randomPipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };

  pipeArray.push(topPipe);

  let bottomPipe = {
    img: bottomPipeImg,
    x: pipeX,
    y: randomPipeY + pipeHeight + openingSpace,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };

  pipeArray.push(bottomPipe);
}

function handleKeyPress(e) {
  if (e.code === "Escape") {
    resetGame();
  } else if (e.code === "Space") {
    if (!gameStarted) {
      gameStarted = true;
    } else if (!gameOver) {
      velocityY = -6;
    }
  }
}

function handleTouch(e) {
  if (gameOver) {
    resetGame();
  } else if (!gameStarted) {
    gameStarted = true;
  } else {
    velocityY = -6;
  }
}

function resetGame() {
  bird.y = birdY;
  pipeArray = [];
  score = 0;
  gameOver = false;
  gameStarted = false;
  velocityY = 0;
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
