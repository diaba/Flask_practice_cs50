function setup() {
  createCanvas(windowWidth, windowHeight);

}

function draw() {
  background(0, 128, 300);
  ellipse(250, 450, 250, 250);
  fill(255, 255, 255);
  // ellipse(250, 350, 160, 160);
  //ellipse(250, 250, 100);

  //right hand
  line(375, 450, 470, 490);
  //left hand
  line(125, 450, -470, 400);
  describe(
    "A black line on a gray canvas running from top-center to bottom-right."
  );
  strokeWeight(5);
}


