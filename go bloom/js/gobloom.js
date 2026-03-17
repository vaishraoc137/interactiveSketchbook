let score = 0;
let lives = 3;
let round = 1;
let sunX = 0;
let gameOver = false;
let roundStarted = false;
 
let seeds = [];
let plants = [];
 
let numSeeds = 5;
let roundTime = 10000; // starts at 10s, reduces by 0.5s each round
let roundStart = 0;
 
// ── SETUP & DRAW ────────────────────────────────────────────────────────
 
function setup() {
  createCanvas(windowWidth, windowHeight);
  resetRound();
}
 
function draw() {
  if (gameOver) {
    drawGameOver();
    return;
  }
 
  drawSky();
  drawGround();
  drawSun();
  drawSeeds();
  drawPlants();
  drawHUD();
 
  if (roundStarted) {
    moveSun();
    checkAllSeedsClicked();
  } else {
    drawStartPrompt();
  }
}
 
// ── SCENE ───────────────────────────────────────────────────────────────
 
function drawSky() {
  background(173, 216, 230);
}
 
function drawGround() {
  fill(144, 238, 144);
  noStroke();
  rect(0, height * 0.65, width, height * 0.35);
}
 
function drawSun() {
  noStroke();
  fill(255, 220, 80, 40);
  ellipse(sunX, 120, 190, 190);
  fill(255, 220, 80, 60);
  ellipse(sunX, 120, 160, 160);
  fill(255, 204, 0);
  ellipse(sunX, 120, 130, 130);
}
 
function moveSun() {
  let elapsed = millis() - roundStart;
  let t = constrain(elapsed / roundTime, 0, 1);
  sunX = lerp(width - 120, 80, t);
  if (t >= 1) {
    endRound();
  }
}
 
// ── SEEDS & PLANTS ──────────────────────────────────────────────────────
 
function drawSeeds() {
  for (let s of seeds) {
    if (!s.clicked) {
      fill(101, 67, 33);
      noStroke();
      ellipse(s.x, height * 0.65, 20, 12);
      fill(255, 255, 255, 60);
      ellipse(s.x - 3, height * 0.65 - 2, 6, 4);
    }
  }
}
 
function drawPlants() {
  let groundY = height * 0.65;
  for (let p of plants) {
    if (p.type === "flower") {
      drawFlower(p.x, groundY);
    } else {
      drawWeed(p.x, groundY);
    }
  }
}
 
function drawFlower(x, groundY) {
  stroke(34, 139, 34);
  strokeWeight(4);
  line(x, groundY, x, groundY - 100);
 
  noStroke();
  fill(50, 160, 50);
  ellipse(x - 14, groundY - 45, 22, 10);
  ellipse(x + 14, groundY - 65, 22, 10);
 
  fill(255, 105, 180);
  for (let i = 0; i < 8; i++) {
    let angle = (i / 8) * TWO_PI;
    ellipse(x + cos(angle) * 18, groundY - 100 + sin(angle) * 18, 16, 16);
  }
 
  fill(255, 220, 50);
  ellipse(x, groundY - 100, 20, 20);
}
 
function drawWeed(x, groundY) {
  stroke(100, 120, 40);
  strokeWeight(3);
  line(x, groundY, x - 5, groundY - 40);
  line(x - 5, groundY - 40, x + 4, groundY - 70);
  line(x + 4, groundY - 70, x, groundY - 100);
 
  noStroke();
  fill(107, 142, 35);
  triangle(x - 5, groundY - 40, x - 22, groundY - 35, x - 8, groundY - 52);
  triangle(x + 4, groundY - 70, x + 20, groundY - 65, x + 6, groundY - 82);
 
  fill(85, 107, 47);
  ellipse(x, groundY - 105, 24, 20);
 
  fill(60, 90, 20);
  for (let i = 0; i < 5; i++) {
    let angle = map(i, 0, 4, -PI * 0.7, -PI * 0.3);
    triangle(
      x + cos(angle) * 10, groundY - 105 + sin(angle) * 10,
      x + cos(angle - 0.2) * 20, groundY - 105 + sin(angle - 0.2) * 20,
      x + cos(angle + 0.2) * 20, groundY - 105 + sin(angle + 0.2) * 20
    );
  }
}
 
// ── CHECKS & FLOW ───────────────────────────────────────────────────────
 
function checkAllSeedsClicked() {
  for (let s of seeds) {
    if (!s.clicked) return;
  }
  endRound();
}
 
function drawStartPrompt() {
  noStroke();
  fill(60, 30, 90, 200);
  textAlign(CENTER);
  textSize(18);
  text("Press any key to start round " + round + "!", width / 2, height * 0.55);
  textSize(14);
  text("Seeds: " + numSeeds + "   Time: " + (roundTime / 1000) + "s", width / 2, height * 0.59);
}
 
// ── HUD ─────────────────────────────────────────────────────────────────
 
function drawHUD() {
  noStroke();
  fill(60, 30, 90);
  textSize(20);
  textAlign(LEFT);
  text("Score: " + score, 20, 40);
  text("Lives: " + lives, 20, 70);
  text("Round: " + round, 20, 100);
 
  if (roundStarted) {
    let elapsed = millis() - roundStart;
    let barWidth = map(elapsed, 0, roundTime, width * 0.4, 0);
    barWidth = constrain(barWidth, 0, width * 0.4);
 
    fill(100, 200, 100);
    rect(width / 2 - width * 0.2, 20, barWidth, 16, 8);
    noFill();
    stroke(60, 30, 90);
    strokeWeight(2);
    rect(width / 2 - width * 0.2, 20, width * 0.4, 16, 8);
  }
}
 
function drawGameOver() {
  background(30, 10, 50);
  fill(255, 150, 200);
  textAlign(CENTER);
  textSize(48);
  text("Game Over", width / 2, height / 2 - 40);
  fill(255, 230, 150);
  textSize(24);
  text("Final Score: " + score, width / 2, height / 2 + 10);
  textSize(18);
  fill(200, 200, 200);
  text("Press SPACE to restart", width / 2, height / 2 + 60);
}
 
// ── INPUT ───────────────────────────────────────────────────────────────
 
function mousePressed() {
  if (gameOver) return;
  if (!roundStarted) return;
 
  for (let s of seeds) {
    if (!s.clicked) {
      let d = dist(mouseX, mouseY, s.x, height * 0.65);
      if (d < 20) {
        s.clicked = true;
        if (random() > 0.5) {
          plants.push({ x: s.x, type: "flower" });
          score += 25;
        } else {
          plants.push({ x: s.x, type: "weed" });
          score -= 10;
        }
        return;
      }
    }
  }
}
 
function keyPressed() {
  if (gameOver && key === " ") {
    score = 0;
    lives = 3;
    round = 1;
    numSeeds = 5;
    roundTime = 10000;
    gameOver = false;
    resetRound();
    return;
  }
 
  if (!roundStarted && !gameOver) {
    roundStarted = true;
    roundStart = millis();
  }
}
 
// ── ROUND END ────────────────────────────────────────────────────────────
 
function endRound() {
  let unclicked = 0;
  for (let s of seeds) {
    if (!s.clicked) unclicked++;
  }
 
  if (unclicked > 0) {
    lives--;
    if (lives <= 0) {
      gameOver = true;
      return;
    }
  }
 
  round++;
 
  // -0.5s every round, minimum 5 seconds
  roundTime = max(5000, roundTime - 500);
 
  // +1 seed every 2 rounds
  if (round % 2 === 1) {
    numSeeds++;
  }
 
  resetRound();
}
 
function resetRound() {
  plants = [];
  seeds = [];
  roundStarted = false;
  sunX = width - 120;
 
  for (let i = 0; i < numSeeds; i++) {
    let x = map(i, 0, numSeeds - 1, width * 0.15, width * 0.85);
    seeds.push({ x: x, clicked: false });
  }
}
 
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
 