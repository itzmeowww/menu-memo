const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
require("dotenv").config();

const app = express();
const channel_id = process.env.channel_id;
const secret = process.env.secret;
const access_token = process.env.access_token;
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Working. . .");
  console.log("App started");
});

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.post("/webhook", (req, res) => {
  let reply_token = req.body.events[0].replyToken;
  let msg = req.body.events[0].message.text;
  reply(reply_token, msg);
  res.sendStatus(200);
});

function reply(reply_token) {
  let headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer {" + access_token + "}",
  };
  let body = JSON.stringify({
    replyToken: reply_token,
    messages: [
      {
        type: "text",
        text: "Hello",
      },
      {
        type: "text",
        text: "How are you?",
      },
    ],
  });
  request.post(
    {
      url: "https://api.line.me/v2/bot/message/reply",
      headers: headers,
      body: body,
    },
    (err, res, body) => {
      console.log("status = " + res.statusCode);
    }
  );
}
