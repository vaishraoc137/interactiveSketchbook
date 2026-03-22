let score = 0;
let lives = 3;
let round = 1;
let sunX = 0;
let gameOver = false;
let roundStarted = false;
 
// New state flags
let showInstructions = true;   // show instructions before round 1
let showNextLevel = false;     // show "Next Level" screen between rounds
let nextLevelStart = 0;        // timestamp when next-level screen appeared
const NEXT_LEVEL_DURATION = 1000; // 1 second
 
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
  // Instructions screen (shown only before round 1 starts)
  if (showInstructions) {
    drawInstructions();
    return;
  }
 
  if (gameOver) {
    drawGameOver();
    return;
  }
 
  // Next-level transition screen
  if (showNextLevel) {
    drawNextLevel();
    if (millis() - nextLevelStart >= NEXT_LEVEL_DURATION) {
      showNextLevel = false;
    }
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
 
// ── INSTRUCTIONS SCREEN ──────────────────────────────────────────────────
 
function drawInstructions() {
  // Sky & ground backdrop
  background(173, 216, 230);
  fill(144, 238, 144);
  noStroke();
  rect(0, height * 0.65, width, height * 0.35);
 
  // Decorative sun in corner
  noStroke();
  fill(255, 220, 80, 40);
  ellipse(width - 100, 100, 190, 190);
  fill(255, 220, 80, 60);
  ellipse(width - 100, 100, 160, 160);
  fill(255, 204, 0);
  ellipse(width - 100, 100, 130, 130);
 
  // Panel background
  let panelW = min(560, width * 0.85);
  let panelH = 420;
  let panelX = width / 2 - panelW / 2;
  let panelY = height / 2 - panelH / 2;
 
  fill(255, 255, 255, 220);
  stroke(60, 30, 90);
  strokeWeight(3);
  rect(panelX, panelY, panelW, panelH, 20);
 
  noStroke();
  textAlign(CENTER);
 
  // Title
  fill(60, 30, 90);
  textStyle(BOLD);
  textSize(32);
  text("🌱 Seed Clicker", width / 2, panelY + 52);
 
  // Divider
  stroke(60, 30, 90, 60);
  strokeWeight(1);
  line(panelX + 30, panelY + 66, panelX + panelW - 30, panelY + 66);
  noStroke();
 
  textStyle(NORMAL);
  textSize(16);
  fill(50, 30, 70);
 
  let lineH = 34;
  let startY = panelY + 105;
 
  let lines = [
    "Seeds appear on the ground at the start of each round.",
    "🌱 Click every seed before the sun crosses the sky!",
    "Each seed grows into a 🌸 flower (+25 pts) or a 🌿 weed (−10 pts).",
    "Miss any seeds and you lose a life. You have 3 lives.",
    "Rounds get faster and add more seeds as you progress.",
    "Clear all seeds without missing any to keep your lives!"
  ];
 
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], width / 2, startY + i * lineH);
  }
 
  // CTA button
  let btnW = 240;
  let btnH = 46;
  let btnX = width / 2 - btnW / 2;
  let btnY = panelY + panelH - 72;
 
  fill(60, 30, 90);
  rect(btnX, btnY, btnW, btnH, 12);
  fill(255, 230, 150);
  textSize(18);
  textStyle(BOLD);
  text("Press any key to play!", width / 2, btnY + 30);
  textStyle(NORMAL);
}
 
// ── NEXT LEVEL SCREEN ───────────────────────────────────────────────────
 
function drawNextLevel() {
  // Keep the scene visible underneath for context
  drawSky();
  drawGround();
  drawPlants();
 
  // Overlay
  noStroke();
  fill(0, 0, 0, 120);
  rect(0, 0, width, height);
 
  // Badge
  let bw = 360, bh = 160;
  let bx = width / 2 - bw / 2;
  let by = height / 2 - bh / 2;
 
  fill(60, 30, 90, 230);
  stroke(255, 220, 80);
  strokeWeight(3);
  rect(bx, by, bw, bh, 20);
 
  noStroke();
  textAlign(CENTER);
 
  fill(255, 220, 80);
  textStyle(BOLD);
  textSize(36);
  text("🌟 Round " + round + "!", width / 2, by + 68);
 
  fill(200, 230, 255);
  textStyle(NORMAL);
  textSize(18);
  text("Seeds: " + numSeeds + "   Time: " + (roundTime / 1000).toFixed(1) + "s", width / 2, by + 108);
 
  fill(180, 255, 180);
  textSize(15);
  text("Get ready…", width / 2, by + 138);
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
  textStyle(NORMAL);
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
  textStyle(BOLD);
  text("Game Over", width / 2, height / 2 - 40);
  textStyle(NORMAL);
  fill(255, 230, 150);
  textSize(24);
  text("Final Score: " + score, width / 2, height / 2 + 10);
  textSize(18);
  fill(200, 200, 200);
  text("Press SPACE to restart", width / 2, height / 2 + 60);
}
 
// ── INPUT ───────────────────────────────────────────────────────────────
 
function mousePressed() {
  if (showInstructions || showNextLevel || gameOver) return;
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
  // Dismiss instructions screen
  if (showInstructions) {
    showInstructions = false;
    return;
  }
 
  // Restart after game over
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
 
  // Don't accept input during next-level screen
  if (showNextLevel) return;
 
  // Start the round
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
 
  // Show the next-level screen for 1 second before the start prompt appears
  showNextLevel = true;
  nextLevelStart = millis();
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
 