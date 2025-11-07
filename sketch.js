let img;
let audioloop; 

function preload() {
  audioloop = loadSound("srcRWR.mp3");
  img = loadImage("rwr.gif");
}

function setup() {
  let canvasWidth = min(windowWidth, windowHeight);
  let canvasHeight = canvasWidth; 
    
    
  if (canvasHeight > windowHeight) {
        canvasHeight = windowHeight;
        canvasWidth = canvasHeight;
  }
  createCanvas(canvasWidth, canvasHeight);

  audioLoop.loop(); 
  audioLoop.setVolume(0.7); 
}

function draw() {
  background(220);
  let scaleX = width / img.width;
  let scaleY = height / img.height;
  let scale = max(scaleX, scaleY);
        
       
  let scaledWidth = img.width * scale;
  let scaledHeight = img.height * scale;
  let x = (width - scaledWidth) / 2;
  let y = (height - scaledHeight) / 2;    
  image(img, x, y, scaledWidth, scaledHeight);
}
