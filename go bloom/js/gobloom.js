let score = 0;
let lives = 3;
let round = 1;
let sunX = 0;
let gameOver = false;
let roundStarted = false;

let seeds = [];
let plants = [];
let bugs = [];

let numSeeds = 5;
const ROUND_TIME = 10000;
let roundStart = 0;
let bugSpawnTimes = [];

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

  if (round > 4) {
    // check if any scheduled bugs are ready to spawn
    for (let i = bugSpawnTimes.length - 1; i >= 0; i--) {
      if (millis() >= bugSpawnTimes[i]) {
        spawnBug();
        bugSpawnTimes.splice(i, 1);
      }
    }
    moveBugs();
    drawBugs();
  }

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
  let t = constrain(elapsed / ROUND_TIME, 0, 1);
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
    if (p.eaten) continue;
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

// ── BUGS ────────────────────────────────────────────────────────────────

function spawnBug() {
  let fromLeft = random() > 0.5;
  let startX = fromLeft ? -20 : width + 20;
  bugs.push({
    x: startX,
    y: height * 0.65 - 10,
    fromLeft: fromLeft,
    targetPlant: null,
  });
}

function moveBugs() {
  let bugSpeed = 1.8;

  for (let i = bugs.length - 1; i >= 0; i--) {
    let b = bugs[i];

    // find an uneaten plant to target
    if (!b.targetPlant || b.targetPlant.eaten) {
      b.targetPlant = null;
      for (let p of plants) {
        if (!p.eaten) {
          b.targetPlant = p;
          break;
        }
      }
    }

    if (b.targetPlant) {
      let dx = b.targetPlant.x - b.x;
      if (dx > 0) {
        b.x += bugSpeed;
      } else {
        b.x -= bugSpeed;
      }

      // close enough — eat the plant
      if (abs(dx) < 6) {
        b.targetPlant.eaten = true;
        score -= 15;
        bugs.splice(i, 1);
      }
    } else {
      // no plants left, wander off screen
      b.x += b.fromLeft ? bugSpeed : -bugSpeed;
      if (b.x < -30 || b.x > width + 30) {
        bugs.splice(i, 1);
      }
    }
  }
}

function drawBugs() {
  for (let b of bugs) {
    fill(50, 30, 10);
    noStroke();
    ellipse(b.x, b.y, 22, 14);

    fill(80, 140, 40);
    ellipse(b.x, b.y - 2, 18, 11);
    fill(20, 60, 10);
    ellipse(b.x - 3, b.y - 3, 5, 5);
    ellipse(b.x + 3, b.y - 3, 5, 5);

    stroke(50, 30, 10);
    strokeWeight(1);
    line(b.x - 4, b.y - 6, b.x - 8, b.y - 13);
    line(b.x + 4, b.y - 6, b.x + 8, b.y - 13);

    for (let j = -1; j <= 1; j++) {
      line(b.x + j * 5 - 3, b.y + 2, b.x + j * 5 - 8, b.y + 8);
      line(b.x + j * 5 + 3, b.y + 2, b.x + j * 5 + 8, b.y + 8);
    }
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
  text("Seeds: " + numSeeds + "   Time: " + (ROUND_TIME / 1000) + "s", width / 2, height * 0.59);
  if (round > 4) {
    fill(180, 60, 60, 200);
    textSize(14);
    text("Watch out for bugs! Click them to squish!", width / 2, height * 0.63);
  }
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
    let barWidth = map(elapsed, 0, ROUND_TIME, width * 0.4, 0);
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

  // squish a bug if clicked
  for (let i = bugs.length - 1; i >= 0; i--) {
    let d = dist(mouseX, mouseY, bugs[i].x, bugs[i].y);
    if (d < 16) {
      bugs.splice(i, 1);
      score += 5;
      return;
    }
  }

  // click a seed
  for (let s of seeds) {
    if (!s.clicked) {
      let d = dist(mouseX, mouseY, s.x, height * 0.65);
      if (d < 20) {
        s.clicked = true;
        if (random() > 0.5) {
          plants.push({ x: s.x, type: "flower", eaten: false });
          score += 25;
        } else {
          plants.push({ x: s.x, type: "weed", eaten: false });
          score -= 10;
        }
        return;
      }
    }
  }
}

function keyPressed() {
  // restart game
  if (gameOver && key === " ") {
    score = 0;
    lives = 3;
    round = 1;
    numSeeds = 5;
    gameOver = false;
    resetRound();
    return;
  }

  // start the round
  if (!roundStarted && !gameOver) {
    roundStarted = true;
    roundStart = millis();

    // schedule bugs after round 4, +1 bug every 2 rounds
    if (round > 4) {
      let numBugs = 1 + floor((round - 5) / 2);
      for (let i = 0; i < numBugs; i++) {
        // stagger spawns between 35% and 75% of the round
        let t = map(i, 0, numBugs, 0.35, 0.75);
        bugSpawnTimes.push(millis() + ROUND_TIME * t);
      }
    }
  }
}

// ── ROUND END ────────────────────────────────────────────────────────────

function endRound() {
  // any unclicked seeds = lose a life
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

  // +1 seed every 2 rounds
  if (round % 2 === 1) {
    numSeeds++;
  }

  resetRound();
}

function resetRound() {
  plants = [];
  seeds = [];
  bugs = [];
  bugSpawnTimes = [];
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
