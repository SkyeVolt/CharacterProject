let classifier; 
let img;

function setup() {
  createCanvas(400, 400);
  classifier.classify(img, gotResult);
  image(img, 0, 0);
}

function setup() {
  createCanvas(400, 400);
  classifier.classify(img, gotResult);
}

function draw() {
  background(220);
}

function gotResult(results) {
  console.log(results);
}