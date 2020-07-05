const express = require("express");
require("dotenv").config();

const app = express();
const channel_id = process.env.channel_id;
const secret = process.env.secret;
const access_token = process.env.access_token;
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => res.send("Working. . ."));

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);

app.post("/webhook", (req, res) => res.sendStatus(200));

app.get("/webhook", (req, res) => res.send("Working. . ." + secret));
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
