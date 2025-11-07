let classifier; 
let img;

function preload() {
  classifier = ml5.imageClassifier("MobileNet");
  img = loadImage("rwr.gif");
}

function setup() {
  createCanvas(400, 400);
  classifier.classify(img, gotResult);
  image(img, 0, 0);
}

function draw() {
  background(220);
}

function gotResult(results) {
  console.log(results);
}