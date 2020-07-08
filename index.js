const winston = require("winston");
const line = require("@line/bot-sdk");
const moment = require("moment"); // require

const logger = winston.createLogger({
  level: "info",
  format: winston.format.simple(),
  transports: [
    new winston.transports.File({ filename: "log.log" }),
    new winston.transports.Console(),
  ],
});
logger.info(moment.locale());
const express = require("express");
// const request = require("request");
// const { google } = require("googleapis");
// const { relativeTimeRounding } = require("moment");
// const { content } = require("googleapis/build/src/apis/content");

require("dotenv").config();

const { gsrun, client } = require("./sheet");

const { flexMessage, textMessage } = require("./style");

const app = express();
const port = process.env.PORT || 5000;
const channel_id = process.env.channel_id;
const secret = process.env.secret;
const access_token = process.env.access_token;

const config = {
  channelAccessToken: access_token,
  channelSecret: secret,
};

let db = {};
client.authorize(async (err, res) => {
  if (err) {
    console.log(err);
    // logger.error(err);
  } else {
    // logger.info("Authorized !");
    db = await gsrun(client);
    console.log("db listed");
  }
});

console.log("Database test", db["7/31/2020"]);
// ! ISSUE : db is not valid at this point, but should be

//TODO help : show commands
//TODO time : if the meal end show next meal
//TODO tmr : tomorrow's meal

function isInStr(msg, msgList) {
  let have = false;
  msgList.forEach((x) => {
    // console.log(msg.toLowerCase() + " " + x);
    if (msg.toLowerCase().includes(x)) {
      have = true;
    }
  });
  return have;
}

function replyMessage(msg) {
  let now = moment().add(7, "hours");
  let hours = now.hour();

  let cmd = {
    menu: ["food", "menu", "เมนู", "อาหาร"],
    breakfast: ["breakfast", "bf", "morning", "เช้า"],
    lunch: ["lunch", "midday", "เที่ยง"],
    dinner: ["dinner", "เย็น"],
    nextMeal: ["หิว", "hungry", "ข้าว", "ต่อไป"],
    help: ["help", "cmd", "ช่วย"],
  };
  if (isInStr(msg, cmd["nextMeal"])) {
    if (hours > 19) {
      msg = "breakfast";
      now = now.add(1, "days");
    } else if (hours > 13) {
      msg = "dinner";
    } else if (hours > 8) {
      msg = "lunch";
    } else {
      msg = "breakfast";
    }
  }
  let date = now.format("M/D/YYYY");
  let date2 = now.format("D MMM YYYY");
  let menu = db[date];
  let meals = {};

  let breakfast = [...menu.Breakfast];
  let lunch = [...menu.Lunch];
  let dinner = [...menu.Dinner];

  if (date in db) {
    if (isInStr(msg, cmd["menu"])) {
      meals = {
        breakfast,
        lunch,
        dinner,
      };
    } else if (isInStr(msg, cmd["breakfast"])) {
      meals["breakfast"] = breakfast;
    } else if (isInStr(msg, cmd["lunch"])) {
      meals["lunch"] = lunch;
    } else if (isInStr(msg, cmd["dinner"])) {
      meals["dinner"] = dinner;
    } else if (isInStr(msg, cmd["help"])) {
      return textMessage("help : help");
    } else {
      return textMessage("🙄");
    }
    return flexMessage(date2, meals);
  } else {
    return textMessage("Try again later~");
  }
}

const lineClient = new line.Client(config);

function handleEvent(event) {
  if (event.type !== "message" || event.message.type !== "text") {
    return Promise.resolve(null);
  }
  let msg = event.message.text;
  // let replymsg = replyText(msg);
  let userId = event.source.userId;
  lineClient.getProfile(userId).then((profile) => {
    logger.info(profile.displayName + " says " + msg);
  });

  return lineClient.replyMessage(event.replyToken, replyMessage(msg));
}

app.get("/", (req, res) => {
  res.send("HI");
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
app.post("/test", (req, res) => {
  let cmd = req.params;
  // console.dir(replyMessage(cmd));
  res.status(200).end();
});

app.listen(port);

// setTimeout(() => {
//   let cmd = {
//     menu: ["food", "menu", "เมนู", "อาหาร"],
//     breakfast: ["breakfast", "bf", "morning", "เช้า"],
//     lunch: ["lunch", "midday", "เที่ยง"],
//     dinner: ["dinner", "เย็น"],
//     nextMeal: ["หิว", "hungry", "ข้าว", "ต่อไป"],
//     help: ["help", "cmd", "ช่วย"],
//   };
//   console.log(isInStr("หิว", cmd["nextMeal"]));
// }, 4000);
