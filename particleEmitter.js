// code is lightly adjusted from:
// Particle Systems with Image Textures (Image Texture)
// The Nature of Code
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/learning/nature-of-code/4.4-image-textures.html

class Particle {
  constructor(x, y, t = 50) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.vel.mult(random(0.5, 2));
    this.acc = createVector(0, 0);
    this.r = 50;
    this.lifetime = t;
  }

  finished() {
    return this.lifetime < 0;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0);

    this.lifetime -= 7;
  }

  show() {
    tint(250, this.lifetime);
    imageMode(CENTER);
    image(fimg, this.pos.x, this.pos.y, this.r, this.r);
    // ellipse(this.pos.x, this.pos.y, this.r * 2);
  }
}

class Emitter {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.particles = [];
  }

  emit(num, t) {
    for (let i = 0; i < num; i++) {
      this.particles.push(new Particle(this.position.x, this.position.y, t));
    }
  }

  applyForce(force) {
    for (let particle of this.particles) {
      particle.applyForce(force);
    }
  }

  update() {
    for (let particle of this.particles) {
      particle.update();
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      if (this.particles[i].finished()) {
        this.particles.splice(i, 1);
      }
    }
  }

  show() {
    for (let particle of this.particles) {
      particle.show();
    }
  }
}
