//
// variables
//

// board
let board;
let boardWidth = 1300; // originally : boardWidth = 360
let boardHeight = 640;
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

//game physics
let velocityX = -2; // speed of the pipes moving towards left
let velocityY = 0; // bird jump
let gravity = 0.23; // bringing the bird downwards

//
let gameOver = false;
let score = 0;

//
// functions
//

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
  addEventListener("keydown", moveBird);
  addEventListener("keydown", resetGame);
};

// Main game loop

function update() {
  requestAnimationFrame(update);

  if (gameOver) {
    return;
  }

  ctx.clearRect(0, 0, boardWidth, boardHeight);

  // bird
  velocityY += gravity;
  // bird.y += velocityY;
  bird.y = Math.max(bird.y + velocityY, 0); // bird doesn't move out of the top of the canvas
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
      score += 0.5; // 0.5 bcz there are 2 pipes so, 0.5 * 2 = 1
      pipe.passed = true;
    }

    if (detectCollision(bird, pipe)) {
      gameOver = true;
    }
  }

  // clear pipes
  while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
    pipeArray.shift(); // removes the first element of the array
  }

  // score
  ctx.fillStyle = "white";
  ctx.font = "45px sans-serif";
  ctx.fillText(score, 10, 45);

  if (gameOver) {
    ctx.fillText("GAME OVER!", 500, 120); // originally : 35, 120

    ctx.font = "20px sans-serif";
    ctx.fillText("Press 'ESC' to restart!", 545, 160); // originally : 80, 160
  }
}

function placePipe() {
  if (gameOver) {
    return;
  }

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

// move the bird
function moveBird(e) {
  if (e.code == "Space" || e.code == "ArrowUp") {
    velocityY = -6;
  }
}

// reset the game
function resetGame(e) {
  if (e.code == "Escape") {
    bird.y = birdY;
    pipeArray = [];
    score = 0;
    gameOver = false;
  }
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
