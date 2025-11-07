let img;
let audioloop; 

function preload() {
    img = loadImage("rwr.gif");
    audioLoop = loadSound('srcRWR.mp3');
}


function setup() {
    let canvasWidth = min(windowWidth, windowHeight);
    let canvasHeight = canvasWidth; 
    
    
    if (canvasHeight > windowHeight) {
        canvasHeight = windowHeight;
        canvasWidth = canvasHeight;
    }
    createCanvas(canvasWidth, canvasHeight);

    showDebug();

    lockGestures();

    audioLoop.loop(); 

    enableSoundTap();

    audioLoop.setVolume(0.7); 
}

function draw() {
    background(0);
    let scaleX = width / img.width;
    let scaleY = height / img.height;
    let scale = max(scaleX, scaleY);
        
       
    let scaledWidth = img.width * scale;
    let scaledHeight = img.height * scale;
    let x = (width - scaledWidth) / 2;
    let y = (height - scaledHeight) / 2;    
    image(img, x, y, scaledWidth, scaledHeight);
}

function touchStarted() {
    return false; 
}

function touchEnded() {
  return false;
}
