class Paper {
  constructor(xMax, yMax, w, h) {
    this.x = random(-xMax / 2, xMax / 2);
    this.y = -yMax / 2 - h;
    this.w = w;
    this.h = h;
    this.startingFrame = frameCount;

    this.yMax = yMax;
    this.xMax = xMax;

    // rotation ang falling
    this.xRot = random(360 * 2);
    this.yRot = random(360 * 1.5);
    this.zRot = random(360);
    this.fallRate = random(5, 20);

    this.fade = false;
    this.fadeStart = 0;
    this.finished = false;

    // chose a random texture
    let imChance = random() * 100 + fires.length * 5;
    if (imChance < 75) { //traditional money
      this.im = joss1;
      this.imID = 1;
    } else if (imChance < 88) { //house
      this.im = joss2;
      this.imID = 2;
    } else if (imChance < 94) { //ipad/iphone
      this.im = joss3;
      this.imID = 3;
    } else { // red lambo... cause thats a thing
      this.im = joss4;
      this.imID = 4;
    }
  }

  draw() {
    jossBuffer.push();

    if (this.fade) {
      // fade into the flame by decreasing size, opacity, and fall rate
      this.w = this.w * 0.98;
      this.h = this.h * 0.98;
      jossBuffer.tint(255, 255 - (frameCount - this.fadeStart) * 5);
      if (this.w <= 8) this.finished = true;

      this.y += (1 / (FPS * 20)) * this.yMax;
    } else {
      this.y += (1 / (FPS * this.fallRate)) * this.yMax;
    }
    jossBuffer.translate(this.x, this.y);
    jossBuffer.noFill();
    jossBuffer.texture(this.im);
    jossBuffer.noStroke();

    //set rotations
    let angle = (frameCount / (FPS * this.fallRate)) * 0.05;
    jossBuffer.rotateY(angle * this.yRot);
    jossBuffer.rotateZ(angle * this.zRot);

    // draw shapes
    if (this.imID == 1) {
      jossBuffer.rotateX(angle * this.xRot);
      jossBuffer.cylinder(this.w, this.h, 24, 1, false, false);
    } else if (this.imID == 4) {
      jossBuffer.plane(this.h, this.h);
    } else {
      jossBuffer.box(this.h, this.h, 10);
    }

    jossBuffer.pop();
  }
}
