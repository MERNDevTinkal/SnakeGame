document.addEventListener("DOMContentLoaded", () => {
  const eatSound = new Audio(
    "https://www.soundjay.com/button/sounds/beep-09.mp3"
  );
  const gameOverSound = new Audio(
    "https://www.soundjay.com/button/sounds/beep-07.mp3"
  );

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const guideText = document.getElementById("guide");
  const scoreText = document.getElementById("score");
  const highScoreText = document.getElementById("highScoreValue");
  const playerNameText = document.getElementById("playerName");
  const highScorePlayerText = document.getElementById("highScorePlayer");
  const highScorePlayerScoreText = document.getElementById(
    "highScorePlayerScore"
  );
  const gameOverContainer = document.getElementById("gameOverContainer");
  const gameOverText = document.getElementById("gameOverText");
  const highScoreDetails = document.getElementById("highScoreDetails");
  const restartButton = document.getElementById("restartButton");
  const finalScoreText = document.getElementById("finalScore");

  const boxSize = 20;
  let snake = [{ x: 10, y: 10 }];
  let food = { x: 15, y: 15 };
  let direction = "right";
  let score = 0;
  let highScore = parseInt(localStorage.getItem("highScore")) || 0;
  let playerName = localStorage.getItem("playerName") || "-";
  let isGameOver = false;

  function playEatSound() {
    eatSound.currentTime = 0; // Reset the sound to the beginning
    eatSound.play();
  }

  function playGameOverSound() {
    gameOverSound.currentTime = 0; // Reset the sound to the beginning
    gameOverSound.play();
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#444";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    snake.forEach((segment) => {
      ctx.fillStyle = "#33cc33"; // Green
      ctx.fillRect(segment.x * boxSize, segment.y * boxSize, boxSize, boxSize);
    });

    ctx.fillStyle = "#ff4d4d"; // Red
    ctx.fillRect(food.x * boxSize, food.y * boxSize, boxSize, boxSize);

    ctx.fillStyle = "#fff";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 25);
  }

  function update() {
    if (isGameOver) {
      return;
    }

    const head = { ...snake[0] };

    switch (direction) {
      case "up":
        head.y--;
        break;
      case "down":
        head.y++;
        break;
      case "left":
        head.x--;
        break;
      case "right":
        head.x++;
        break;
    }

    if (
      head.x < 0 ||
      head.y < 0 ||
      head.x * boxSize >= canvas.width ||
      head.y * boxSize >= canvas.height ||
      collisionWithItself(head)
    ) {
      clearInterval(gameInterval);
      playGameOverSound();
      showGameOver();
      return;
    }

    if (head.x === food.x && head.y === food.y) {
      playEatSound();
      score += 10;
      snake.unshift(food);
      food = generateFood();
    } else {
      snake.pop();
      snake.unshift(head);
    }

    draw();
  }

  function collisionWithItself(head) {
    return snake
      .slice(1)
      .some((segment) => segment.x === head.x && segment.y === head.y);
  }

  function generateFood() {
    const newFood = {
      x: Math.floor(Math.random() * (canvas.width / boxSize)),
      y: Math.floor(Math.random() * (canvas.height / boxSize)),
    };

    if (
      snake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      )
    ) {
      return generateFood();
    }

    return newFood;
  }

  function changeDirection(e) {
    switch (e.key) {
      case "ArrowUp":
        direction = "up";
        break;
      case "ArrowDown":
        direction = "down";
        break;
      case "ArrowLeft":
        direction = "left";
        break;
      case "ArrowRight":
        direction = "right";
        break;
    }
  }

  function showGameOver() {
    isGameOver = true;
    guideText.style.display = "none";
    scoreText.style.display = "none";

    if (score > highScore) {
      highScore = score;
      playerName =
        prompt("Congratulations! You set a new high score. Enter your name:") ||
        "-";
      localStorage.setItem("highScore", highScore);
      localStorage.setItem("playerName", playerName);
    }

    highScoreText.textContent = highScore;
    playerNameText.textContent = playerName;
    highScorePlayerText.textContent = playerName;
    highScorePlayerScoreText.textContent = score;

    gameOverContainer.style.display = "block";
    finalScoreText.textContent = score;
  }

  function restartGame() {
    snake = [{ x: 10, y: 10 }];
    food = { x: 15, y: 15 };
    direction = "right";
    score = 0;
    isGameOver = false;
    gameOverContainer.style.display = "none";
    guideText.style.display = "block";
    scoreText.style.display = "block";
    gameInterval = setInterval(update, 150);
  }

  document.addEventListener("keydown", changeDirection);
  restartButton.addEventListener("click", restartGame);

  // Initial draw
  draw();

  // Start the game loop
  let gameInterval = setInterval(update, 150);
});
