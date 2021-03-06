const express = require('express');
const ms = require('pretty-ms');
const cors = require('cors');
const app = express();
const fs = require("fs");
const { PORT = 8080 } = process.env;

const lights = require("./lights");

app.use(cors());

function round(ms) {
  return Math.round(ms * 100) / 100 + "s";
}

app.get('/beemovie', function (req, res) {
  fs.readFile(__dirname + "/beemovie.txt", 'utf8', (err, data) => {
    if (err) {
      res.send(err);
    } else {
      const time = lights.morse(data)
      console.log(time);
      res.send(ms(time));
    }
  })
});

app.get('/random', function (req, res) {
  lights.random();
  res.end();
});

app.get('/message/:message', function (req, res) {
  const time = lights.morse(req.params.message);
  res.send(ms(time));
});

app.get('/star', function (req, res) {
  const { r = 0, g = 0, b = 0 } = req.query;
  lights.setStarColor(r, g, b);
});

app.get('/light', function (req, res) {
  const { r = 0, g = 0, b = 0 } = req.query;
  lights.setStarColor(r, g, b);
});

app.get('/bg/:state', function (req, res) {
  lights.setBackgroundOff(!!req.params.state);
});

app.use("/", express.static(__dirname + "/static"));

//Start the server by listening on a port
app.listen(PORT, () => {
  console.log("+---------------------------------------+");
  console.log("|                                       |");
  console.log(`|  [\x1b[34mSERVER\x1b[37m] Listening on port: \x1b[36m${PORT} 🤖  \x1b[37m |`);
  console.log("|                                       |");
  console.log("\x1b[37m+---------------------------------------+");
});