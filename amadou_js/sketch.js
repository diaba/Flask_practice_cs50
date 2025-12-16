/*
 * Create a simple caterpillar race using p5.js
 * Implemented using OOP concepts:
 * - Caterpillar class to encapsulate caterpillar behavior
 * - Race class to manage the race state
 * Features:
 *   - Click to start the race
 *   - Set the number of caterpillars racing
 *   - Random speeds for each caterpillar
 *   - Different colors for each caterpillar
 *   - Display a message when a caterpillar wins
 */

// ==================== Caterpillar Class ====================
class Caterpillar {
  constructor(id, startX, y, speed, color, isPlayerControlled = false) {
    this.id = id;
    this.x = startX;
    this.y = y;
    this.speed = speed;
    this.color = color;
    this.spacing = 20;
    this.eyeSize = 15;
    this.segments = 5;
    this.isWinner = false;
    this.pulseTime = 0;
    this.isPlayerControlled = isPlayerControlled;
    this.playerVelocity = 0;
    this.playerAcceleration = 0;
  }

  // Update caterpillar position
  move() {
    if (this.isPlayerControlled) {
      // Player-controlled movement with keyboard and acceleration
      this.x += this.playerVelocity;
    } else {
      // Automatic movement with random speed
      this.x += this.speed;
    }
  }

  // Draw the caterpillar
  display() {
    // Add animation effects for winner
    if (this.isWinner) {
      this.displayWinnerAnimation();
    } else {
      this.displayNormal();
    }
  }

  // Display normal caterpillar
  displayNormal() {
    // Draw body segments
    for (let i = 0; i < this.segments; i++) {
      fill(this.color.r, this.color.g, this.color.b);
      stroke(0);
      strokeWeight(1);
      circle(this.x + i * this.spacing, this.y, 50);
    }

    // Draw eyes
    let eyeX = this.x + this.segments * this.spacing;
    fill(0);
    stroke(255);
    strokeWeight(3);
    circle(eyeX, this.y - this.eyeSize, this.eyeSize);
    circle(eyeX - this.eyeSize, this.y - this.eyeSize, this.eyeSize);
  }

  // Display winner with animation effects
  displayWinnerAnimation() {
    // Calculate pulse scale
    const scale = 1 + 0.3 * sin(this.pulseTime);

    // Draw rotating halo
    noFill();
    stroke(255, 215, 0, 150);
    strokeWeight(3);
    const haloRadius = 60 * scale + 20 * sin(this.pulseTime * 0.5);
    for (let i = 0; i < this.segments; i++) {
      const x = this.x + i * this.spacing;
      arc(x, this.y, haloRadius, haloRadius, 0, TWO_PI);
    }

    // Draw glow effect
    for (let i = 0; i < this.segments; i++) {
      const x = this.x + i * this.spacing;
      // Outer glow
      fill(this.color.r, this.color.g, this.color.b, 80);
      noStroke();
      circle(x, this.y, 50 + 20 * sin(this.pulseTime));
      // Main body
      fill(this.color.r, this.color.g, this.color.b);
      stroke(255, 215, 0);
      strokeWeight(3);
      circle(x, this.y, 50 * scale);
    }

    // Draw animated eyes
    let eyeX = this.x + this.segments * this.spacing;
    fill(255, 215, 0);
    stroke(255);
    strokeWeight(3);
    const eyeGlow = 5 * sin(this.pulseTime);
    circle(eyeX, this.y - this.eyeSize, this.eyeSize + eyeGlow);
    circle(eyeX - this.eyeSize, this.y - this.eyeSize, this.eyeSize + eyeGlow);

    // Increment pulse time
    this.pulseTime += 0.1;
  }

  // Check if caterpillar has finished
  hasFinished(finishLine) {
    return this.x >= finishLine;
  }
}

// ==================== Race Class ====================
class Race {
  constructor(numCaterpillars) {
    this.startLine = 30;
    this.finishLine = width * 0.8; // 20% before the end of width
    this.numCaterpillars = numCaterpillars;
    this.caterpillars = [];
    this.isRacing = false;
    this.winner = null;
    this.animationTime = 0;

    this.initializeCaterpillars();
  }

  // Initialize all caterpillars
  initializeCaterpillars() {
    const padding = height / this.numCaterpillars;
    for (let i = 0; i < this.numCaterpillars; i++) {
      const speed = round(random(5, 30));
      const color = {
        r: random(50, 255),
        g: random(50, 255),
        b: random(50, 255),
      };
      const y = (i + 0.5) * padding;
      const isPlayer = i === 0; // First caterpillar is player-controlled
      const caterpillar = new Caterpillar(
        i + 1,
        this.startLine,
        y,
        speed,
        color,
        isPlayer
      );
      this.caterpillars.push(caterpillar);
    }
  }

  // Start the race
  start() {
    this.isRacing = true;
    this.playStartSound();
  }

  // Reset the race for retry
  reset() {
    this.isRacing = false;
    this.winner = null;
    this.caterpillars = [];
    this.animationTime = 0;
    this.initializeCaterpillars();
  }

  // Handle keyboard input for player-controlled caterpillar
  handleKeyboard() {
    if (this.caterpillars.length > 0) {
      const playerCat = this.caterpillars[0];
      const maxVelocity = 30; // Maximum speed limit
      const acceleration = 1.8; // Acceleration rate per frame
      const friction = 0.9; // Friction to slow down when no key pressed
      let keyPressed = false;

      // Check arrow key presses and apply acceleration
      if (keyIsDown(LEFT_ARROW)) {
        playerCat.playerAcceleration = max(
          playerCat.playerAcceleration - acceleration,
          -maxVelocity
        );
        keyPressed = true;
      } else if (keyIsDown(RIGHT_ARROW)) {
        playerCat.playerAcceleration = min(
          playerCat.playerAcceleration + acceleration,
          maxVelocity
        );
        keyPressed = true;
      } else {
        // Apply friction when no key is pressed
        playerCat.playerAcceleration *= friction;
      }

      // Update velocity based on acceleration
      playerCat.playerVelocity = playerCat.playerAcceleration;

      // Play movement sound randomly when moving
      if (keyPressed && random() < 0.3) {
        this.playMoveSound();
      }
    }
  }

  // Update race state
  update() {
    if (this.isRacing && !this.winner) {
      // Handle keyboard input for player-controlled caterpillar
      this.handleKeyboard();

      for (let caterpillar of this.caterpillars) {
        caterpillar.move();
        if (caterpillar.hasFinished(this.finishLine)) {
          this.winner = caterpillar;
          this.winner.isWinner = true;
        }
      }
    }
  }

  // Display all caterpillars
  displayCaterpillars() {
    for (let caterpillar of this.caterpillars) {
      caterpillar.display();
    }
  }

  // Display the race track
  displayTrack() {
    background(121, 96, 76);
    noStroke();

    // Increment animation time
    this.animationTime += 0.05;

    // Animated Start line (Black with pulsing effect)
    const startPulse = 1 + 0.4 * sin(this.animationTime);
    fill(0);
    rect(this.startLine, 0, 5 * startPulse, height + 400);

    // Start line glow
    fill(100, 200, 255, 100);
    rect(
      this.startLine,
      0,
      15 * sin(this.animationTime * 0.5 + TWO_PI / 4),
      height + 400
    );

    // Animated Finish line (Green with striped pattern)
    const stripeWidth = 10;
    const numStripes = ceil((height + 400) / stripeWidth) + 2;
    const offset = (this.animationTime * 8) % stripeWidth;

    for (let i = 0; i < numStripes; i++) {
      if (i % 2 === 0) {
        fill(0, 255, 0);
      } else {
        fill(0, 200, 0);
      }
      rect(this.finishLine, -offset + i * stripeWidth, 50, stripeWidth);
    }

    // Finish line glow
    fill(0, 255, 100, 80);
    const finishGlow = 30 * sin(this.animationTime) + 50;
    rect(this.finishLine, 0, finishGlow, height + 400);
  }

  // Display start message
  displayStartMessage() {
    textSize(24);
    textAlign(CENTER);
    fill(255);
    noStroke();
    text("🏁 Click to start!", width / 2, height / 2);

    textSize(16);
    fill(200, 255, 200);
    text(
      "Use LEFT/RIGHT arrow keys to control Caterpillar 1",
      width / 2,
      height / 2 + 40
    );
  }

  // Display winner message
  displayWinner() {
    // Play win sound
    this.playWinSound();

    textSize(32);
    textAlign(CENTER);
    fill(255, 215, 0);
    noStroke();
    text(
      `🏆 Caterpillar ${this.winner.id} wins! 🏆`,
      width / 2,
      height / 2 - 50
    );
    textSize(20);
    fill(255);
    text(`Speed: ${this.winner.speed}`, width / 2, height / 2);

    // Display retry instructions
    textSize(18);
    fill(200, 255, 200);
    text("Click to retry!", width / 2, height / 2 + 50);
  }

  // Play start race sound
  playStartSound() {
    // Create a beep sound using oscillator
    const osc = new p5.Oscillator();
    osc.setType("sine");
    osc.freq(800);
    osc.amp(0.1);
    osc.start();
    osc.stop(0.2);
  }

  // Play win celebration sound
  playWinSound() {
    // Play a series of ascending notes
    const notes = [523, 659, 784]; // C5, E5, G5
    notes.forEach((freq, index) => {
      setTimeout(() => {
        const osc = new p5.Oscillator();
        osc.setType("sine");
        osc.freq(freq);
        osc.amp(0.15);
        osc.start();
        osc.stop(0.3);
      }, index * 150);
    });
  }

  // Play movement sound for player
  playMoveSound() {
    const osc = new p5.Oscillator();
    osc.setType("sine");
    osc.freq(400 + random(-50, 50));
    osc.amp(0.05);
    osc.start();
    osc.stop(0.1);
  }
}

// ==================== Global Variables ====================
let race;

// ==================== p5.js Functions ====================
function setup() {
  createCanvas(windowWidth, windowHeight / 2);
  rectMode(CENTER);

  // Set a moderate frame rate
  frameRate(3);

  // Initialize the race with 3 caterpillars
  race = new Race(3);
}

function draw() {
  // Display the race track
  race.displayTrack();

  // Update race state
  race.update();

  // Display caterpillars
  race.displayCaterpillars();

  // Display messages
  if (!race.isRacing) {
    race.displayStartMessage();
  } else if (race.winner) {
    race.displayWinner();
    noLoop();
  }
}

// Handle mouse click to start race or retry
function mousePressed() {
  if (race.winner) {
    // Retry: reset the race
    race.reset();
    loop();
  } else if (!race.isRacing) {
    // Start: begin the race
    race.start();
  }
}
