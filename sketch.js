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
    vwrFlare = loadsound('vwrFlare.mp3')
    audioSrc = loadSound('srcRWR.mp3');
    audioSrcExt = loadSound('srcRWRext.mp3');
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

    enableSoundTap();

    audioSrc.setVolume(0.7); 
    audioSrcExt.setVolume(0.7); 
    audioTrk.setVolume(0.7); 
    audioLock.setVolume(0.7); 

    textAlign(CENTER, CENTER);
}

function audioCheck() {

    audioSrc.pause(); 
    audioSrcExt.pause(); 
    audioTrk.pause(); 
    audioLock.pause(); 

    if (targetValue >= srcThreshold) {
        audioSrc.loop();
    } else if (targetValue <= srcThreshold && targetValue >= trkThreshold) {
        audioSrcExt.loop();
    } else if (targetValue <= trkThreshold && targetValue >= lockThreshold) {
        audioTrk.loop();
    } else if (targetValue <= lockThreshold) {
        audioLock.loop();
    }
}

function draw() {
    frameRate(24);
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



    if (DRIFT_SPEED > 0) {
        targetValue = lerp(targetValue, DEFAULT_VALUE, DRIFT_SPEED);
    } 
  
    currentValue = lerp(currentValue, targetValue, 0.1);
  

    if (touchFeedback > 0) {
        touchFeedback -= 0.05;
    }

    image(img, x, y, scaledWidth, scaledHeight);

    drawInfo();
    audioCheck();
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

    targetValue = constrain(targetValue, -200, 2000);
    return false; 
}

function touchEnded() {
    return false;
}

function drawInfo() {
    colorMode(HSB, 360, 100, 100);
  
    // Title
    fill(0, 0, 90);
    noStroke();
    textSize(24);
    textAlign(CENTER, CENTER);
    text("Radar Warning Reciever", width / 2, 50);
  
    // Instructions
    textSize(16);
    fill(0, 0, 80);
    text("Tap to Deploy Counter-measures!", width / 2, 85);
  
    // Display parameters and stats
    textAlign(LEFT, CENTER);
    textSize(12);
    fill(0, 0, 70);
  
    let x = 20;
    let y = height - 90;
  
    text("STATS:", x, y);
    y += 18;
    text("Total Chaff Deployed: " + totalTouches, x, y);
    y += 16;
    text("Current: " + floor(currentValue), x, y);
    y += 16;
    text("Target: " + floor(targetValue), x, y);
    y += 16;
    text("Default: " + DEFAULT_VALUE, x, y);
  
    textAlign(RIGHT, CENTER);
    let x2 = width - 20;
    let y2 = height - 90;
  
    let increment = INCREMENT_PER_TOUCH * (TOUCH_IS_POSITIVE ? 1 : -1) * DEFAULT_COUNT_DIRECTION;
  
    text("DEBUG:", x2, y2);
    y2 += 18;
    text("Increment: " + increment, x2, y2);
    y2 += 16;
    text("Direction: " + (DEFAULT_COUNT_DIRECTION > 0 ? "UP" : "DOWN"), x2, y2);
    y2 += 16;
    text("Touch: " + (TOUCH_IS_POSITIVE ? "POSITIVE" : "NEGATIVE"), x2, y2);
    y2 += 16;
    text("Drift: " + DRIFT_SPEED.toFixed(2), x2, y2);

    textAlign(CENTER, CENTER);
    textSize(11);
    fill(0, 0, 60);
}
