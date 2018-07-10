// audio visualiser variables
var analyser,
  canvas = document.getElementById("webAudioCtx"),
  ctx = canvas.getContext("2d"),
  drawID,
  random = Math.random,
  circles = [],
  audio = document.getElementById("webAudio"),
  audioContext = new AudioContext(),
  source = audioContext.createMediaElementSource(audio),
  p1080 = document.querySelector("#p1080");

// default image
var activeImage = document.querySelector("#activeImg");

// utilty to irrespectively clear the active-zone
function clearZone() {
  document.querySelector("#webAudioCtx").style.display = "none";
  window.cancelAnimationFrame(drawID);
  audio.pause();
  audio.currentTime = 0;
  p1080.pause();
  p1080.currentTime = 0;
  p1080.style.display = "none";
  activeImage.src = "img/duo.jpg";
  activeImage.style.display = "none";
  document.querySelector("#letters").innerHTML = "";
  document.querySelector("#letters").style.display = "none";
}

// runs transition between content-switches
function transition(toPause) {
  // pause dynamic content (if needed)
  if (toPause) {
    console.log(toPause);
    triggerPauses(toPause);
  }

  // apply transition
  document.querySelector("#ts").style.display = "block";
  document.querySelector("body").style.pointerEvents = "none";
  document.querySelector("#ts").play();
  setTimeout(() => {
    document.querySelector("body").style.pointerEvents = "auto";
    // resume dynamic content (if needed)
    if (toPause) {
      triggerPauses(toPause);
    }
    document.querySelector("#ts").style.display = "none";
  }, 1300);
}

// called if content-switch requires toggling
function triggerPauses(toPause) {
  if (toPause === "audio") {
    audioToggle();
  }
  if (toPause === "video") {
    videoToggle();
  }
}

// toggles audio play/pause
function audioToggle() {
  if (audio.paused === true) {
    audio.play();
  } else if (audio.paused === false) {
    audio.pause();
  } else {
    console.log("shits broke");
  }
}

// toggles video play/pause
function videoToggle() {
  if (p1080.paused === true) {
    p1080.play();
  } else if (p1080.paused === false) {
    p1080.pause();
  } else {
    console.log("shits broke");
  }
}

// canvas play/pause listener
document.querySelector("#webAudioCtx").addEventListener("click", () => {
  audioToggle();
});

// video play/pause listener
p1080.addEventListener("click", () => {
  videoToggle();
});

// alias nav button classes
const home = document.querySelectorAll(".home");
const music = document.querySelectorAll(".music");
const video = document.querySelectorAll(".video");
const press = document.querySelectorAll(".press");
const shop = document.querySelectorAll(".shop");
const gigs = document.querySelectorAll(".gigs");

// home button listeners
Array.from(home).forEach(button => {
  button.addEventListener("click", e => {
    e.preventDefault();
    clearZone();
    activeImage.src = "img/bg-still.png";
    activeImage.style.display = "block";
  });
});

Array.from(music).forEach(button => {
  button.addEventListener("click", e => {
    e.preventDefault();
    clearZone();
    document.querySelector("#webAudioCtx").style.display = "block";
    audio.play();
    transition("audio");
    draw();
  });
});

// video button listener
Array.from(video).forEach(button => {
  button.addEventListener("click", e => {
    e.preventDefault();
    clearZone();
    p1080.style.display = "block";
    p1080.play();
    transition("video");
  });
});

// press button listener
Array.from(press).forEach(button => {
  button.addEventListener("click", e => {
    e.preventDefault();
    clearZone();
    activeImage.src = "img/jaggers-x-lines-for-jonoblack.png"; // filler
    activeImage.style.display = "block";
  });
});

// shop button listener
Array.from(shop).forEach(button => {
  button.addEventListener("click", e => {
    e.preventDefault();
    clearZone();
    document.querySelector("#letters").style.display = "block";
    document.querySelector("#letters").innerHTML =
      '<iframe style="width: auto; height: 100vh; border: 0;" src="https://bandcamp.com/EmbeddedPlayer/album=476175735/size=large/bgcol=333333/linkcol=ffffff/transparent=true' +
      '/"seamless><a href="http://jaggersxlines.bandcamp.com/album/letters">Letters by Jaggers x Lines</a></iframe>';
  });
});

// gigs button listener
Array.from(gigs).forEach(button => {
  button.addEventListener("click", e => {
    e.preventDefault();
    clearZone();
    activeImage.src = "img/duo.jpg"; // filler
    activeImage.style.display = "block";
  });
});

// bit-secured color randomising utility
function getRandomColor() {
  return ((random() * 255) >> 0) / 0.8;
}

// circle constructor
function Circle() {
  this.x = random() * canvas.width;
  this.y = random() * canvas.height;
  this.radius = random() * random();
  this.color =
    "rgb(" +
    getRandomColor() +
    "," +
    getRandomColor() +
    "," +
    getRandomColor() +
    ")";
}

// iterate circle prototype
Circle.prototype.draw = function() {
  var that = this;
  ctx.save();
  ctx.beginPath();
  ctx.globalAlpha = random() * random();
  ctx.arc(that.x, that.y, that.radius, 0, Math.PI * 2);
  ctx.fillStyle = this.color;
  ctx.fill();
  ctx.restore();
};

// init audio vizualiser
function vizualise() {
  analyser = audioContext.createAnalyser();
  source.connect(analyser);
  analyser.connect(audioContext.destination);

  // create 1000 iterative circle prototypes
  for (var i = 0; i < 1000; i++) {
    circles[i] = new Circle();
    circles[i].draw();
  }
}

// self-executing callback
function draw() {
  drawID = window.requestAnimationFrame(draw);
  var freqByteData = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(freqByteData);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (var i = 1; i < circles.length; i++) {
    circles[i].radius = freqByteData[i] / 2;
    circles[i].y = circles[i].y > canvas.height ? 0 : circles[i].y * 2;
    circles[i].draw();
  }

  for (var i = 1; i < freqByteData.length; i += 15) {
    ctx.fillStyle =
      "rgb(" +
      getRandomColor() +
      "," +
      getRandomColor() +
      "," +
      getRandomColor() +
      ")";
    ctx.fillRect(i, canvas.height - freqByteData[i] * 0.2, 10, canvas.height);
    ctx.strokeRect(
      i,
      canvas.height - freqByteData[i] * 0.0001,
      10,
      canvas.height
    );
  }
}

// run visualisation resources once, not on click
vizualise();

window.addEventListener("beforeunload", function() {
  if (audioContext) {
    audioContext
      .close()
      .then(console.log("context closed"))
      .catch(function() {
        console.log("context not closed");
      });
    // setting this to any string will create the 'are you sure you want to leave' prompt
    // event.returnValue = '';
  }
});
