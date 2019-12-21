const fetch = require("node-fetch");
const MorseCode = require("morsecode");

const m = new MorseCode();

const randomBoolean = () => Math.random() > 0.5;

const setBackgroundState = (state = randomBoolean()) => JSON.stringify({
  topic: "IoTree/Relay1",
  message: state ? "on" : "off",
})

const setColor = (r, g, b) => JSON.stringify({
  topic: "IoTree/Leds",
  message: `${r}, ${g}, ${b}`,
})

const setOff = () => JSON.stringify({
  topic: "IoTree/Leds",
  message: `color-wipe`,
})

const setStarColor = (r, g, b) => JSON.stringify({
  topic: "IoTree/Star/Light",
  message: `${r}, ${g}, ${b}`,
})


const setStarOff = () => JSON.stringify({
  topic: "IoTree/Star/Light",
  message: `color-wipe`,
})

const setRandomColor = () =>
  randomBoolean()
    ? setColor(Math.random() * 255, Math.random() * 255, Math.random() * 255)
    : setOff();

const setRandomStarColor = () =>
  randomBoolean()
    ? setStarColor(Math.random() * 255, Math.random() * 255, Math.random() * 255)
    : setStarOff();

const randomFromArray = arr => arr[Math.floor(Math.random() * arr.length)];

const funcs = [
  setRandomColor,
  setRandomStarColor,
  setBackgroundState,
]

async function changeLight(body) {
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

  changeLight(setStarColor(255, 0, 0));

  const time = arr.shift();

  setTimeout(() => {
    changeLight(setStarOff())
    setTimeout(() => {
      nextMorse(arr);
    }, time)
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

  console.log(duration, times);

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