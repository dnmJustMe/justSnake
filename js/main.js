const board = document.getElementById("board");
const game = document.getElementById("game");
const page = document.getElementById("page");
const conteo = document.getElementById("conteo");
const scoreBoard = document.getElementById("scoreBoard");
const startButton = document.getElementById("startButton");
const startWelcome = document.getElementById("startWelcome");
const gameOverSign = document.getElementById("gameOver");
const scoreOpinion = document.getElementById("scoreOpinion");
const scoreSign = document.getElementById("score");
const highScore = document.getElementById("highScore");
const highScoreBoard = document.getElementById("highScoreBoard");
const playAgainButton = document.getElementById("playAgainButton");
const controlsLeft = document.getElementById("controlsLeft");
const controlsRight = document.getElementById("controlsRight");

const boardSize = 10;
var gameSpeed = 200;
const squareTypes = {
  emptySquare: 0,
  snakeSquare: 1,
  foodSquare: 2,
};
const directions = {
  ArrowUp: -10,
  ArrowDown: 10,
  ArrowRight: 1,
  ArrowLeft: -1,
};

let snake;
let score;
let direction;
let boardSquares;
let emptySquares;
let moveInterval;

const drawSnake = () => {
  const cabeza = String(
    Number(snake[snake.length - 1])).padStart(2, "0");
  const [rowCabeza, columnCabeza] = cabeza.split("");

  const delanteCabeza = String(
    Number(snake[snake.length - 1]) + directions[direction]
  ).padStart(2, "0");
  const [rowDelanteCabeza, columnDelanteCabeza] = delanteCabeza.split("");

  var head
 

  if(delanteCabeza > 0){
    if (boardSquares[rowDelanteCabeza][columnDelanteCabeza] === squareTypes.foodSquare && delanteCabeza > 0 || boardSquares[rowCabeza][columnCabeza] === squareTypes.foodSquare) {
      head = "snakeSquareHeadOpen";
    } else {
      head = "snakeSquareHead";
    }
  }else{
    if (boardSquares[rowCabeza][columnCabeza] === squareTypes.foodSquare) {
      head = "snakeSquareHeadOpen";
    } else {
      head = "snakeSquareHead";
    }
  }

  snake.forEach(function (square) {
    drawSquare(square, "snakeSquare");
    var ultimo0 = snake[0][0];
    var ultimo1 = snake[0][1];
    var penultimo0 = snake[1][0];
    var penultimo1 = snake[1][1];

    switch (direction) {
      case "ArrowRight":
        drawSquare(snake[snake.length - 1], head + " movementHeadRight");
        break;
      case "ArrowLeft":
        drawSquare(snake[snake.length - 1], head + " movementHeadLeft");
        break;
      case "ArrowDown":
        drawSquare(snake[snake.length - 1], head + " movementHeadDown");
        break;
      case "ArrowUp":
        drawSquare(snake[snake.length - 1], head + " movementHeadUp");
        break;
    }

    if (ultimo0 == penultimo0 && ultimo1 < penultimo1) {
      drawSquare(snake[0], "snakeSquareTail movementTailRight");
    } else if (ultimo0 == penultimo0 && ultimo1 > penultimo1) {
      drawSquare(snake[0], "snakeSquareTail movementTailLeft");
    } else if (ultimo1 == penultimo1 && ultimo0 > penultimo0) {
      drawSquare(snake[0], "snakeSquareTail movementTailUp");
    } else if (ultimo1 == penultimo1 && ultimo0 < penultimo0) {
      drawSquare(snake[0], "snakeSquareTail movementTailDown");
    }
  });
  for (let index = 1; index < snake.length - 1; index++) {
    const element = snake[index];
    var anterior = snake[index - 1];
    var proximo = snake[index + 1];

    if (
      anterior[0] == element[0] &&
      anterior[1] < element[1] &&
      element[0] > proximo[0]
    ) {
      drawSquare(snake[index], "snakeSquare movementSquareRightUp");
    } else if (
      anterior[0] == element[0] &&
      anterior[1] < element[1] &&
      element[0] < proximo[0]
    ) {
      drawSquare(snake[index], "snakeSquare movementSquareRightDown");
    } else if (
      anterior[0] == element[0] &&
      anterior[1] > element[1] &&
      element[0] > proximo[0]
    ) {
      drawSquare(snake[index], "snakeSquare movementSquareLeftUp");
    } else if (
      anterior[0] == element[0] &&
      anterior[1] > element[1] &&
      element[0] < proximo[0]
    ) {
      drawSquare(snake[index], "snakeSquare movementSquareLeftDown");
    } else if (
      anterior[1] == element[1] &&
      anterior[0] > element[0] &&
      element[1] < proximo[1]
    ) {
      drawSquare(snake[index], "snakeSquare movementSquareUpRight");
    } else if (
      anterior[1] == element[1] &&
      anterior[0] > element[0] &&
      element[1] > proximo[1]
    ) {
      drawSquare(snake[index], "snakeSquare movementSquareUpLeft");
    } else if (
      anterior[1] == element[1] &&
      anterior[0] < element[0] &&
      element[1] < proximo[1]
    ) {
      drawSquare(snake[index], "snakeSquare movementSquareDownRight");
    } else if (
      anterior[1] == element[1] &&
      anterior[0] < element[0] &&
      element[1] > proximo[1]
    ) {
      drawSquare(snake[index], "snakeSquare movementSquareDownLeft");
    }
  }
};

const drawSquare = (square, type) => {
  const [row, column] = square.split("");
  boardSquares[row][column] = squareTypes[type];
  const squareElement = document.getElementById(square);
  squareElement.setAttribute("class", `square ${type}`);

  if (type === "emptySquare") {
    emptySquares.push(square);
  } else {
    if (emptySquares.indexOf(square) !== -1) {
      emptySquares.splice(emptySquares.indexOf(square), 1);
    }
  }
};

const moveSnake = () => {
  const newSquare = String(
    Number(snake[snake.length - 1]) + directions[direction]
  ).padStart(2, "0");
  const [row, column] = newSquare.split("");

  if (
    newSquare < 0 ||
    newSquare > boardSize * boardSize ||
    (direction === "ArrowRight" && column == 0) ||
    (direction === "ArrowLeft" && column == 9) ||
    boardSquares[row][column] === squareTypes.snakeSquare
  ) {
    gameOver();
  } else {
    snake.push(newSquare);
    if (boardSquares[row][column] === squareTypes.foodSquare) {
      addFood();
    } else {
      const emptySquare = snake.shift();
      drawSquare(emptySquare, "emptySquare");
    }
    drawSnake();
  }
};

const addFood = () => {
  score++;
  updateScore();
  createRandomFood();
};

const gameOver = () => {
  var touchDevice = "ontouchstart" in document.documentElement;
  if (touchDevice) {
    controlsLeft.style.display = "none";
    controlsRight.style.display = "none";
    page.style.flexDirection = "column";
  }

  if (localStorage.highScore) {
    if (localStorage.highScore < score) {
      localStorage.highScore = score;
      scoreOpinion.innerText =
        "Felicidades, has logrado una nueva mejor puntuación!!!";
    } else {
      scoreOpinion.innerText = "Puedes hacerlo mejor...";
    }
  } else {
    localStorage.highScore = score;
  }

  game.style.display = "none";
  gameOverSign.style.display = "flex";
  scoreSign.innerText = score;
  clearInterval(moveInterval);

  highScore.innerText = localStorage.highScore;
};

const setDirection = (newDirection) => {
  direction = newDirection;
};

const directionEvent = (key) => {
  switch (key.code) {
    case "ArrowUp":
      direction != "ArrowDown" && setDirection(key.code);
      break;
    case "ArrowDown":
      direction != "ArrowUp" && setDirection(key.code);
      break;
    case "ArrowLeft":
      direction != "ArrowRight" && setDirection(key.code);
      break;
    case "ArrowRight":
      direction != "ArrowLeft" && setDirection(key.code);
      break;
  }
};

$("#down").click(function () {
  setDirection("ArrowDown");
});
$("#up").click(function () {
  setDirection("ArrowUp");
});
$("#right").click(function () {
  setDirection("ArrowRight");
});
$("#left").click(function () {
  setDirection("ArrowLeft");
});

const createRandomFood = () => {
  const randomEmptySquare =
    emptySquares[Math.floor(Math.random() * emptySquares.length)];
  drawSquare(randomEmptySquare, "foodSquare");
};

const updateScore = () => {
  scoreBoard.innerText = score;
  if (score != 0 && score < 20) {
    gameSpeed = gameSpeed - 10;
  }
};

const createBoard = () => {
  boardSquares.forEach((row, rowIndex) => {
    row.forEach((column, columnndex) => {
      const squareValue = `${rowIndex}${columnndex}`;
      const squareElement = document.createElement("div");
      squareElement.setAttribute("class", "square emptySquare");
      squareElement.setAttribute("id", squareValue);
      board.appendChild(squareElement);
      emptySquares.push(squareValue);
    });
  });
};

const setGame = () => {
  gameSpeed = 200;
  snake = ["00", "01", "02", "03"];
  score = snake.length - 4;
  direction = "ArrowRight";
  boardSquares = Array.from(Array(boardSize), () =>
    new Array(boardSize).fill(squareTypes.emptySquare)
  );
  board.innerHTML = "";
  emptySquares = [];
  createBoard();
};

const startGame = () => {
  var touchDevice = "ontouchstart" in document.documentElement;
  if (touchDevice) {
    controlsLeft.style.display = "block";
    controlsRight.style.display = "block";
    page.style.flexDirection = "row";
  }
  let game = document.getElementById("game");
  game.style.display = "block";
  setGame();
  gameOverSign.style.display = "none";
  startWelcome.style.display = "none";
  startButton.style.display = "none";
  drawSnake();
  if (localStorage.highScore) {
    highScoreBoard.innerText = localStorage.highScore;
  }
  updateScore();
  createRandomFood();
  document.addEventListener("keydown", directionEvent);
  conteo.style.display = "flex";
  setTimeout(() => {
    conteo.innerHTML = "3";
  }, 1000);
  setTimeout(() => {
    conteo.innerHTML = "2";
  }, 2000);
  setTimeout(() => {
    conteo.innerHTML = "1";
  }, 3000);

  setTimeout(() => {
    conteo.style.display = "none";
    conteo.innerHTML = "El juego empezará en...";
    moveInterval = setInterval(() => moveSnake(), gameSpeed);
  }, 4000);
};

startButton.addEventListener("click", startGame);
playAgainButton.addEventListener("click", startGame);
