let img;
let audioloop; 
let audioSrc;
let audioTrk; 
let audioLock; 
let audioFlare;
let DEFAULT_COUNT_DIRECTION = 1;
let INCREMENT_PER_TOUCH = 20;   
let TOUCH_IS_POSITIVE = true;   

let DEFAULT_VALUE = 10;
let DRIFT_SPEED = 0.005;

let SHOW_DRIFT = true;

let currentValue = DEFAULT_VALUE;
let targetValue = DEFAULT_VALUE;
let totalTouches = 0;

let touchFeedback = 0;

let srcThreshold = 130;
let trkThreshold = 70;
let lockThreshold = 30;

function preload() {
    img = loadImage("rwr.gif");
    audioLoop = loadSound('srcRWR.mp3');
    audioSrc = loadSound('srcRWRext.mp3');
    audioTrk = loadSound('trkRWR.mp3');
    audioLock = loadSound('lockRWR.mp3');
    audioFlare = loadSound('flare.mp3');
}


function setup() {
    let canvasWidth = min(windowWidth, windowHeight);
    let canvasHeight = canvasWidth; 
    
    
    if (canvasHeight > windowHeight) {
        canvasHeight = windowHeight;
        canvasWidth = canvasHeight;
    }
    createCanvas(canvasWidth / 2.5, canvasHeight / 2.5);

    showDebug();

    lockGestures();

    audioLoop.loop(); 

    audioSrc.pause(); 
    audioTrk.pause(); 
    audioLock.pause(); 

    enableSoundTap();

    audioLoop.setVolume(0.7); 

    textAlign(CENTER, CENTER);
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


    if (DRIFT_SPEED > 0) {
        targetValue = lerp(targetValue, DEFAULT_VALUE, DRIFT_SPEED);
    } 
  
    currentValue = lerp(currentValue, targetValue, 0.1);
  

    if (touchFeedback > 0) {
        touchFeedback -= 0.05;
    }

    image(img, x, y, scaledWidth, scaledHeight);
}

function touchStarted() {

    audioFlare.play(); 
    
    let touchCount = touches.length > 0 ? touches.length : 1;
  
    totalTouches += touchCount;
    touchFeedback = 1.0;
  
    let increment = INCREMENT_PER_TOUCH * touchCount * DEFAULT_COUNT_DIRECTION;
  
    if (!TOUCH_IS_POSITIVE) {
        increment = -increment;
    }
  
    targetValue += increment;

    if (targetValue <= srcThreshold) {
        audioSrc.play();
    }
    else if (targetValue <= trkThreshold) {
        audioTrk.play();
    }
    else if (targetValue <= lockThreshold) {
        audioLock.play();
    } else { 
        audioSrc.pause();
        audioTrk.pause();
        audioLock.pause();
        
    }

    targetValue = constrain(targetValue, -200, 200);
    return false; 
}

function touchEnded() {
  return false;
}
