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
let DRIFT_SPEED = 0.002;

let SHOW_DRIFT = true;

let currentValue = DEFAULT_VALUE;
let targetValue = 100;
let totalTouches = 0;
let chaffAmount = 90; 

let touchFeedback = 0;

let srcThreshold = 180;
let trkThreshold = 70;
let lockThreshold = 30;
let explodeThreshold = 15;

var delayInMilliseconds1 = 2000; // 2 seconds
var delayInMilliseconds2 = 800; // 0.8 seconds

var body = document.getElementsByTagName('body')[0];

let playerDead = false;

function preload() {
    img = loadImage("rwr.gif");
    vwrFlare = loadSound('vwrFlare.mp3');
    vwrLock = loadSound('vwrLock.mp3');
    vwrMissile = loadSound('vwrMissile.mp3');
    audioSrc = loadSound('srcRWR.mp3');
    audioSrcExt = loadSound('srcRWRext.mp3');
    audioTrk = loadSound('trkRWR.mp3');
    audioLock = loadSound('lockRWR.mp3');
    audioFlare = loadSound('flare.mp3');
    audioExplode = loadSound('explodeSound.mp3');
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

    audioSrc.pause(); 
    audioSrcExt.pause(); 
    audioTrk.pause(); 
    audioLock.pause(); 
    
    textAlign(CENTER, CENTER);
}

function audioCheck() {
    if (targetValue >= srcThreshold) {
        if (window.soundEnabled && !audioSrc.isPlaying()) {
            audioSrc.play();

            audioSrcExt.pause(); 
            audioTrk.pause(); 
            audioLock.pause(); 
        }
    } else if (targetValue <= srcThreshold && targetValue >= trkThreshold) {
       if (window.soundEnabled && !audioSrcExt.isPlaying()) {
            audioSrcExt.play();

            audioSrc.pause(); 
            audioTrk.pause(); 
            audioLock.pause(); 
        }
    } else if (targetValue <= trkThreshold && targetValue >= lockThreshold) {     
        if (window.soundEnabled && !audioTrk.isPlaying()) {
            audioTrk.play();

            audioSrc.pause(); 
            audioSrcExt.pause(); 
            audioLock.pause(); 
        }
    } else if (targetValue <= lockThreshold) {
        if (window.soundEnabled && !vwrLock.isPlaying() && !audioLock.isPlaying()) {
                vwrLock.play();

                setTimeout(function() {
                if (!vwrFlare.isPlaying() && playerDead == false) {
                vwrFlare.play();
                }
            }, delayInMilliseconds2); 
            }

        if (window.soundEnabled && !audioLock.isPlaying()) {
            audioLock.play();
            
            setTimeout(function() {
                if (!vwrMissile.isPlaying() && playerDead == false) {
                vwrMissile.play();
                }
            }, delayInMilliseconds1); 

            audioSrc.pause(); 
            audioSrcExt.pause(); 
            audioTrk.pause(); 
        }
        
        if (targetValue <= explodeThreshold) {
            body.style.backgroundImage = 'url(explode.gif)';
            if (!audioExplode.isPlaying() && playerDead == false) {
                audioExplode.play();

                playerDead = true;
            }
        }
    }
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
    if (playerDead == false) {
        if (chaffAmount > 0) { 
            audioFlare.play(); 

            let touchCount = touches.length > 0 ? touches.length : 1;
    
            totalTouches += touchCount;
            chaffAmount--; 
            touchFeedback = 1.0;
    
            let increment = INCREMENT_PER_TOUCH * touchCount * DEFAULT_COUNT_DIRECTION;
        
            if (!TOUCH_IS_POSITIVE) {
                increment = -increment;
            }
        
            targetValue += increment;

            targetValue = constrain(targetValue, -2000, 2000);
        }
    } return false; 
}

function touchEnded() {
    return false;
}

function drawInfo() {
    
    colorMode(HSB, 360, 100, 100);
  
    // Title
    if (playerDead == true) {
        fill(0, 0, 90);
        noStroke();
        textSize(24);
        textAlign(CENTER, CENTER);
        text("Aircraft Shot Down!", width / 2, 50);
    } else {
        fill(0, 0, 90);
        noStroke();
        textSize(24);
        textAlign(CENTER, CENTER);
        text("Radar Warning Reciever", width / 2, 50);
    } 
    // Instructions
    if (playerDead == true) {
        textSize(16);
        fill(0, 0, 80);
        text("Refresh the page to restart!", width / 2, 85);
    } else {
        textSize(16);
        fill(0, 0, 80);
        text("Tap to deploy counter-measures!", width / 2, 85);
    } 
  
    // Display parameters and stats
    textAlign(LEFT, CENTER);
    textSize(12);
    fill(0, 0, 70);
  
    let x = 20;
    let y = height - 74;
  
    text("STATS:", x, y);
    y += 18;
    text("Chaff: " + (chaffAmount), x, y);
    y += 16;
    text("Notch: " + floor(currentValue), x, y);
    y += 16;
    text("Stay above 130!", x, y);
  
    textAlign(RIGHT, CENTER);
    let x2 = width - 20;
    let y2 = height - 90;
  
    let increment = INCREMENT_PER_TOUCH * (TOUCH_IS_POSITIVE ? 1 : -1) * DEFAULT_COUNT_DIRECTION;
  
    /*text("DEBUG:", x2, y2);
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
    fill(0, 0, 60);*/ 
}

