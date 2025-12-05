function setup() {
  createCanvas(100, 100, WEBGL);

  describe("A black line connecting two spheres. The scene spins slowly.");
}

function draw() {
  background(200);

  // Rotate around the y-axis.
  rotateY(frameCount * 0.01);

  // Draw a line.
  line(0, 0, 0, 30, 20, -10);

  // Draw the center sphere.
  sphere(10);

  // Translate to the second point.
  translate(30, 20, -10);

  // Draw the bottom-right sphere.
  sphere(10);
}
