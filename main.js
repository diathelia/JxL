// audio visualiser variables
const canvas = document.getElementById("webAudioCtx"),
  ctx = canvas.getContext("2d"),
  gradient = ctx.createLinearGradient(0, 0, 0, 300);
(audio = document.getElementById("webAudio")),
  (p1080 = document.querySelector("#p1080"));

var analyser,
  drawID,
  random = Math.random,
  circles = [],
  audioContext = new AudioContext(),
  source = audioContext.createMediaElementSource(audio);

// utilty to irrespectively clear the active-zone
function clearZone() {
  // hide all content
  // document.querySelector("#letters").innerHTML = "";
  // document.querySelector("#letters").style.display = "none";
  document.querySelector("#mini-bio").style.display = "none";
  document.querySelector("#bg-crop").style.display = "none";
  document.querySelector("#duo").style.display = "none";
  document.querySelector("#erins").style.display = "none";
  document.querySelector("#webAudioCtx").style.display = "none";
  p1080.style.display = "none";
  // cancel + reset resources
  window.cancelAnimationFrame(drawID);
  audio.pause();
  audio.currentTime = 0;
  p1080.pause();
  p1080.currentTime = 0;
}

// runs transition between content-switches
function transition(toPause) {
  // either transition id (default) or transition-reverse id
  let id = "#ts";
  // pause dynamic content (if needed)
  if (toPause) {
    console.log(toPause);
    triggerPauses(toPause);
    if (toPause === "video") {
      // set reverse transition clip id
      id = "#tsr";
    }
  }

  // apply transition
  document.querySelector(id).style.display = "block";
  document.querySelector("body").style.pointerEvents = "none";
  document
    .querySelector(id)
    .play()
    .catch(e => {
      console.log(e);
    });
  setTimeout(() => {
    document.querySelector("body").style.pointerEvents = "auto";
    // resume dynamic content (if needed)
    if (toPause) {
      triggerPauses(toPause);
    }
    document.querySelector(id).style.display = "none";
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
    audio.play().catch(e => {
      console.log(e);
    });
  } else if (audio.paused === false) {
    audio.pause();
  } else {
    console.log("shits broke");
  }
}

// toggles video play/pause
function videoToggle() {
  if (p1080.paused === true) {
    p1080.play().catch(e => {
      console.log(e);
    });
  } else if (p1080.paused === false) {
    p1080.pause();
  } else {
    console.log("shits broke");
  }
}

// canvas play/pause listener
document.querySelector("#webAudioCtx").addEventListener("click", audioToggle);

// video play/pause listener
p1080.addEventListener("click", videoToggle);

// alias nav button classes
const home = document.querySelectorAll(".home");
const music = document.querySelectorAll(".music");
const video = document.querySelectorAll(".video");
const press = document.querySelectorAll(".press");
const shop = document.querySelectorAll(".shop");
const gigs = document.querySelectorAll(".gigs");

// home button listener
Array.from(home).forEach(button => {
  button.addEventListener("click", e => {
    e.preventDefault();
    clearZone();
    document.querySelector("#bg-crop").style.display = "block";
    document.querySelector("#mini-bio").style.display = "block";
  });
});

// music button listener
Array.from(music).forEach(button => {
  button.addEventListener("click", e => {
    e.preventDefault();
    clearZone();
    document.querySelector("#webAudioCtx").style.display = "block";
    audio.play().catch(e => {
      console.log(e);
    });
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
    p1080.play().catch(e => {
      console.log(e);
    });
    transition("video");
  });
});

// press button listener
Array.from(press).forEach(button => {
  button.addEventListener("click", e => {
    e.preventDefault();
    clearZone();
    document.querySelector("#erins").style.display = "block";
  });
});

// shop button listener

// Array.from(shop).forEach(button => {
//   button.addEventListener("click", e => {
//     e.preventDefault();
//     clearZone();
//     document.querySelector("#letters").style.display = "block";
//     document.querySelector("#letters").innerHTML =
//       '<iframe style="width: auto; height: 100vh; border: 0;" src="https://bandcamp.com/EmbeddedPlayer/album=476175735/size=large/bgcol=333333/linkcol=ffffff/transparent=true' +
//       '/"seamless><a href="http://jaggersxlines.bandcamp.com/album/letters">Letters by Jaggers x Lines</a></iframe>';
//   });
// });

// gigs button listener
Array.from(gigs).forEach(button => {
  button.addEventListener("click", e => {
    e.preventDefault();
    clearZone();
    document.querySelector("#duo").style.display = "block";
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
  this.color = gradient % 2;
}

// iterate circle prototype
Circle.prototype.draw = function() {
  let that = this;
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
  for (var i = 0; i < 100; i++) {
    circles[i] = new Circle();
    circles[i].draw();
  }

  // config some static canvas props
  if (ctx) {
    // set colors here instead of inside draw() callback to avoid flickering
    ctx.fillStyle = "rgb(" + 10 + "," + 211 + "," + (256 >> 0) + ")";
    gradient.addColorStop(0, "white");
    gradient.addColorStop(1, "red");
    ctx.strokeStyle = gradient % 2;
  } else {
    alert(
      "canvas context unsupported, please try updating or switching browsers to see visualisations"
    );
  }
}

/** canvas visualisation function *************************************************************************************/

// self-executing callback
function draw() {
  drawID = window.requestAnimationFrame(draw);
  let freqByteData = new Uint8Array(analyser.frequencyBinCount);

  analyser.getByteFrequencyData(freqByteData);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (var i = 1; i < circles.length; i++) {
    circles[i].radius = freqByteData[i] / 80;
    // circles[i].y = circles[i].y > canvas.height ? 0 : circles[i].y * 2;
    circles[i].draw();
  }

  // create bouncing colored bars (idea: use diff vars for start of track to heavier thicker rest of songs)
  for (var i = 1; i < freqByteData.length; i++) {
    ctx.fillStyle = "rgb(" + i + "," + 211 + "," + (256 >> 0) + ")";
    // ctx.strokeRect(
    //   i,
    //   canvas.height - freqByteData[i * 15] / 0.00001,
    //   1,
    //   canvas.height
    // );
    ctx.fillRect(
      i,
      canvas.height - freqByteData[i * 5.25] / 0.018,
      1,
      canvas.height
    );
  }

  // more boring bottom bars
  for (var i = 1; i < freqByteData.length; i += 15) {
    ctx.fillStyle = gradient;
    ctx.fillRect(i, canvas.height - freqByteData[i], 1, canvas.height);
    ctx.strokeRect(i, canvas.height - freqByteData[i], 10, canvas.height);
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
