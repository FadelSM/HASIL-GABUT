const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 200;

let tRex = {
  x: 50,
  y: 160,
  width: 40,
  height: 40,
  jump: false,
  velocityY: 0,
  gravity: 1.2,
  jumpStrength: -15,
  color: 'yellow',
};

let obstacles = [];
let score = 0;
let gameSpeed = 5;
let isGameOver = false;
let lastObstacleX = 0;

function drawTRex() {
  ctx.fillStyle = tRex.color;
  ctx.fillRect(tRex.x, tRex.y, tRex.width, tRex.height);
  ctx.fillStyle = '#000';
  ctx.fillRect(tRex.x + 10, tRex.y + 10, 5, 5); // Eye
}

function drawObstacle(obstacle) {
  ctx.fillStyle = 'red';
  ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
}

function spawnObstacle() {
  const minGap = 200; // Minimum distance between obstacles
  const maxGap = 400; // Maximum distance between obstacles
  const obstacleWidth = Math.random() * 20 + 20; // Random obstacle width
  const obstacleHeight = Math.random() * 20 + 20; // Random obstacle height

  if (canvas.width - lastObstacleX > minGap + Math.random() * (maxGap - minGap)) {
    obstacles.push({
      x: canvas.width,
      y: 160 - obstacleHeight, // Same ground level as T-Rex
      width: obstacleWidth,
      height: obstacleHeight,
    });
    lastObstacleX = canvas.width;
  }
}

function updateObstacles() {
  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].x -= gameSpeed;

    // Remove obstacle if it goes out of bounds
    if (obstacles[i].x + obstacles[i].width < 0) {
      obstacles.splice(i, 1);
      score += 10; // Increment score for cleared obstacle
    }

    drawObstacle(obstacles[i]);

    // Collision detection
    if (
      tRex.x < obstacles[i].x + obstacles[i].width &&
      tRex.x + tRex.width > obstacles[i].x &&
      tRex.y < obstacles[i].y + obstacles[i].height &&
      tRex.y + tRex.height > obstacles[i].y
    ) {
      isGameOver = true;
      document.getElementById('restartButton').style.display = 'block';
      return;
    }
  }
}

function jump() {
  if (!tRex.jump) {
    tRex.jump = true;
    tRex.velocityY = tRex.jumpStrength;
  }
}

function update() {
  if (isGameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawTRex();
  updateObstacles();

  if (tRex.jump) {
    tRex.y += tRex.velocityY;
    tRex.velocityY += tRex.gravity;

    if (tRex.y >= 160) {
      tRex.y = 160;
      tRex.jump = false;
    }
  }

  // Gradual increase in game speed
  gameSpeed = 5 + score / 200; // Increase speed as score increases
  document.getElementById('score').innerText = `Score: ${score}`;

  // Spawn obstacles at intervals
  spawnObstacle();

  // Win condition
  if (score >= 1000) {
    isGameOver = true;
    document.getElementById('restartButton').innerText = 'You Win! Play Again';
    document.getElementById('restartButton').style.display = 'block';
    return;
  }

  requestAnimationFrame(update);
}

function resetGame() {
  tRex.y = 160;
  tRex.jump = false;
  obstacles = [];
  score = 0;
  gameSpeed = 5;
  lastObstacleX = 0;
  isGameOver = false;
  document.getElementById('restartButton').style.display = 'none';
  update();
}

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !isGameOver) jump();
});

canvas.addEventListener('touchstart', () => {
  if (!isGameOver) jump();
});

document.getElementById('restartButton').addEventListener('click', resetGame);

// Start the game loop
update();
