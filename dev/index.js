const line = require("@line/bot-sdk");
const express = require("express");
require("dotenv").config();
const replyMessage = require("./router");
const { query } = require("./sheet");

const app = express();
const port = process.env.PORT || 5000;
const channel_id = process.env.channel_id;
const secret = process.env.secret;
const access_token = process.env.access_token;

const config = {
  channelAccessToken: access_token,
  channelSecret: secret,
};

const lineClient = new line.Client(config);

function handleEvent(event) {
  if (event.type !== "message" || event.message.type !== "text") {
    return Promise.resolve(null);
  }
  let msg = event.message.text;

  let userId = event.source.userId;
  lineClient.getProfile(userId).then((profile) => {
    console.log(profile.displayName + " says " + msg);
  });

  return lineClient.replyMessage(event.replyToken, replyMessage(msg));
}

app.get("/", (req, res) => {
  res.send("Running. . .");
  console.log(req.msg);
});
app.post("/webhook", line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});
app.get("/test/:cmd", (req, res) => {
  let cmd = req.params.cmd;
  if (!cmd) res.status(500).end();
  res.json(replyMessage(cmd));
  res.status(200).end();
});
app.get("/api/:date", (req, res) => {
  let date = req.params.date.replace("-", "/").replace("-", "/");
  if (date === undefined) res.json({ status: "Notfound" });
  else res.json(query(date));
  res.status(200).end();
});

app.listen(port);
