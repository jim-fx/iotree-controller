const fetch = require("node-fetch");
const MorseCode = require("morsecode");

const m = new MorseCode();

const randomBoolean = () => Math.random() > 0.5;

const randomInt = () => Math.floor(Math.random() * 255);

const setBackgroundState = (state = randomBoolean()) => JSON.stringify({
  topic: "IoTree/Relay1",
  message: state ? "on" : "off",
})

const setColor = (r = randomInt(), g = randomInt(), b = randomInt()) => JSON.stringify({
  topic: "IoTree/Leds",
  message: `${r}, ${g}, ${b}`,
})

const setOff = () => JSON.stringify({
  topic: "IoTree/Leds",
  message: `color-wipe`,
})

const setStarColor = (r = Math.random() * 255, g = Math.random() * 255, b = Math.random() * 255) => JSON.stringify({
  topic: "IoTree/Star/Light",
  message: `${r}, ${g}, ${b}`,
})


const setStarOff = () => JSON.stringify({
  topic: "IoTree/Star/Light",
  message: `color-wipe`,
})

const setRandomColor = () =>
  randomBoolean()
    ? setColor()
    : setOff();

const setRandomStarColor = () =>
  randomBoolean()
    ? setStarColor()
    : setStarOff();

const randomFromArray = arr => arr[Math.floor(Math.random() * arr.length)];

const funcs = [
  setColor,
  //setRandomStarColor,
  //setBackgroundState,
]

async function changeLight(body) {
  console.log(body);
  fetch('https://lwivs39.gm.fh-koeln.de/mqtt', {
    method: 'POST',
    headers: {
      'mode': 'no-cors',
      'origin': 'http://moxd.io/',
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    body: body,
  }).catch(err => {
    console.error(err);
  })
}

function nextMorse(arr) {

  if (!arr.length) return;

  changeLight(setStarColor());

  const time = arr.shift();

  setTimeout(() => {
    changeLight(setStarOff());
    setTimeout(() => {
      nextMorse(arr);
    }, 400)
  }, time);

}

function morse(s) {
  const message = m.translate(s);

  const lib = {
    ".": 500,
    "_": 2000,
  }

  const times = message.split(" ").map(t => lib[t]).filter(s => !!s);

  const duration = times.reduce((a, b) => a + b);

  nextMorse(times)

  return duration;

}


exports.morse = morse;

exports.random = function () {
  for (let i = 0; i < 100; i++) {
    changeLight(randomFromArray(funcs)());
  }
}

exports.setBackgroundOff = setBackgroundState;

exports.setColor = setColor;
exports.setOff = setOff;
exports.setRandomColor = setRandomColor;

exports.setStarOff = setStarOff;
exports.setStarColor = setStarColor;
exports.setRandomStarColor = setRandomStarColor;