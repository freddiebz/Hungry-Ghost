// parameters
let p = {};
let jossBuffer;
let video;

let width;
let height;
let papers = [];
let joss1, joss2, joss3, joss4;

// FIRE
let emitter;
let fimg;
let fires = [];

// lots of image prcoessing mats
let videoMat;
let progMat;
let destinationMat;
let prevMat;
let diffMat;
let threshMat;

let blurSmall;
let blurLarge;

let FPS = 30;

function preload() {
  joss1 = loadImage("Assets/jossMoney.png"); 
  joss2 = loadImage("Assets/jossHouse.png"); 
  joss3 = loadImage("Assets/jossTech.png"); 
  joss4 = loadImage("Assets/jossCar.png"); 

  fimg = loadImage("Assets/fireTexture.png");
}

function setup() {
  createCanvas(800, 400).style("display", "block");
  setupWindow();

  videoMat = allocateMat(width, height);
  progMat = allocateMat(width, height);
  destinationMat = allocateMat(width, height);
  prevMat = allocateMat(width, height);
  diffMat = allocateMat(width, height);
  threshMat = allocateMat(width, height);

  blurSmall = new cv.Size(3, 3);
  blurLarge = new cv.Size(20, 20);

  jossBuffer = createGraphics(width, height, WEBGL);
  jossBuffer.setAttributes("alpha", true);

  video = createCapture(VIDEO);
  video.size(width, height);
  video.elt.setAttribute("playsinline", "");
  video.hide();

  setBg();

  frameRate(FPS); // set framerate

  // start with 6 joss opjects
  for (let i = 0; i < 6; i++) {
    papers.push(new Paper(width, height, 50, 100));
  }
}

function setupWindow() {
  // setup the canvas
  width = windowWidth;
  height = windowHeight;
  resizeCanvas(width, height);
}

function draw() {
  // convert video to frame differenced image over 3 frames
  if (frameCount % 3 == 0) {
    let videoImg = video.get();
    imageToMat(videoImg, videoMat);
    cv.cvtColor(videoMat, destinationMat, cv.COLOR_RGBA2GRAY);

    // progressive bg image -----------------
    destinationMat.convertTo(destinationMat, cv.CV_8U, 1 - 0.93);
    prevMat.convertTo(prevMat, cv.CV_8U, 0.93);
    cv.add(destinationMat, prevMat, progMat);

    prevMat = progMat;
  } else if (frameCount % 3 == 1) {
    //difference image ------------------
    cv.cvtColor(videoMat, destinationMat, cv.COLOR_RGBA2GRAY);
    cv.absdiff(prevMat, destinationMat, diffMat);

    //threshold image -------------------
    threshMat = diffMat;
    cv.blur(threshMat, threshMat, blurSmall);
    cv.threshold(threshMat, threshMat, 35, 255, cv.THRESH_BINARY);
    cv.blur(threshMat, threshMat, blurLarge);
  } else if (frameCount % 3 == 2) {
    let hierarchy = new cv.Mat();
    let contours = new cv.MatVector();

    // find contours
    cv.findContours(
      diffMat,
      contours,
      hierarchy,
      cv.RETR_EXTERNAL,
      cv.CHAIN_APPROX_SIMPLE
    );

    for (let i = 0; i < contours.size(); i++) {
      let c = contours.get(i);
      let r = cv.boundingRect(c);
      // drawBoundBox(c);

      //remove the fudge
      if (r.width < 20 || r.height < 20) continue;

      //intersection testing
      papers.forEach((p) => {
        let px = p.x + p.xMax / 2;
        let py = p.y + p.yMax / 2;

        if (
          !p.fade &&
          py >= r.y &&
          py + p.h <= r.y + r.height &&
          px >= r.x && px + p.w <= r.x + r.width
        ) {
          p.fade = true;
          p.fadeStart = frameCount;
          fires.push(new Flame(px + p.w / 2, py + p.h + 5));

          // console.log("py = " + py + ", ry = " + r.y + ", pyph = " + (py+p.h) + ", ryrh = " + (r.y+r.height))
        }
      });
    }

    hierarchy.delete();
    contours.delete();
  }

  push();
  // show processed image
  let outputImg = matToNewImage(threshMat);
  image(outputImg, 0, 0);
  pop();

  // draw joss objects
  push();
  jossBuffer.clear();
  for (let p = papers.length - 1; p >= 0; p -= 1) {
    papers[p].draw();

    // remove any papers off screen or faded away
    if (papers[p].finished || papers[p].y >= height - papers[p].h) {
      papers.splice(p, 1);
    }
  }
  image(jossBuffer, 0, 0, width, height);
  pop();

  // FIRE!!!!
  push();
  for (let f = fires.length - 1; f >= 0; f -= 1) {
    fires[f].draw();
    if (fires[f].finished) fires.splice(f, 1);
  }
  pop();

  // at most 8 joss objects on the screen at a time, in random succession
  if (papers.length < 8 && random() > 0.5) {
    let dim = random(20, 60);
    papers.push(new Paper(width, height, dim, dim * 2));
  }
}

function setBg() {
  let videoImg = video.get();

  imageToMat(videoImg, videoMat);
  cv.cvtColor(videoMat, prevMat, cv.COLOR_RGBA2GRAY);
}

function drawBoundBox(c) {
  stroke(0, 0, 255);

  // Get the bounding rect of the contour and draw it
  let r = cv.boundingRect(c);
  rect(r.x, r.y, r.width, r.height);
}

function keyPressed() {
  if (key == "b") {
    setBg();
  }
}
