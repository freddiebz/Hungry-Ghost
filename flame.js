class Flame {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.emitter = new Emitter(x, y);
    this.startTime = frameCount;
    this.finished = false;
  }

  draw() {
    blendMode(ADD);

    let force = createVector(0, -0.1);
    this.emitter.applyForce(force);

    let dir = map(this.x, 0, width, -0.1, 0.1);
    let wind = createVector(dir, 0);
    this.emitter.applyForce(wind);

    if ((frameCount - this.startTime) / (FPS * 2) < 1) {
      this.emitter.emit(
        1,
        sin(0.5 + (frameCount - this.startTime) / FPS) * 255
      );
    }

    if (this.emitter.particles.length > 0) {
      this.emitter.show();
      this.emitter.update();
    } else {
      this.finished = true;
    }
  }
}
