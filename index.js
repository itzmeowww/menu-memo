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

require("dotenv").config();

const { gsrun, client } = require("./sheet");

const { flexMessage, textMessage, flexHelp } = require("./style");
const { randList } = require("./utils");
const { text } = require("body-parser");

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

// ! ISSUE : db is not valid at this point, but should be

//TODO : ... :give user random cmd

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
//TODO : Move some declaration from the function
//TODO : connect to db
function replyMessage(msg) {
  let now = moment().add(7, "hours");
  let hours = now.hour();
  let dateOpt = "";
  let cmd = {
    menu: ["food", "menu", "เมนู", "อาหาร", "meal", "มื้อ", "today", "วันนี้"],
    breakfast: ["breakfast", "bf", "morning", "เช้า"],
    lunch: ["lunch", "midday", "เที่ยง"],
    dinner: ["dinner", "เย็น"],
    nextMeal: ["หิว", "hungry", "ข้าว", "ต่อไป"],
    help: ["help", "cmd", "ช่วย"],
    tomorrow: ["tomorrow", "tmr", "พรุ่งนี้"],
    bug: ["bug", "comment", "แนะนำ", "บัค"],
  };

  let fullCmdList = [];
  for (key in cmd) {
    if (cmd.hasOwnProperty(key)) {
      cmd[key].forEach((x) => {
        fullCmdList.push(x);
      });
    }
  }
  // console.log(fullCmdList);

  let cmdList = [
    "food",
    "menu",
    "breakfast",
    "lunch",
    "dinner",
    "tomorrow",
    "หิว",
    "M/D/YYYY",
    "bug",
    "แนะนำ",
    "Try to guess ><",
  ];

  let noCmdList = [
    "🙄",
    "Ask me help :)",
    "🤨",
    "😪",
    "จริงป่าววว",
    "🍉",
    "🥺",
  ];

  if (isInStr(msg, cmd["bug"])) {
    return textMessage(
      "Report bugs or Comments : https://forms.gle/xG1S6Xn28J5onKfG6"
    );
  }

  if (isInStr(msg, cmd["nextMeal"])) {
    if (hours >= 19) {
      msg = "breakfast";
      now = now.add(1, "days");
      dateOpt = " (Tomorrow)";
    } else if (hours >= 13) {
      msg = "dinner";
    } else if (hours >= 8) {
      msg = "lunch";
    } else {
      msg = "breakfast";
    }
  } else if (isInStr(msg, cmd["breakfast"])) {
    if (hours >= 9) {
      now = now.add(1, "days");
      dateOpt = " (Tomorrow)";
    }
  } else if (isInStr(msg, cmd["lunch"])) {
    if (hours >= 13) {
      now = now.add(1, "days");
      dateOpt = " (Tomorrow)";
    }
  } else if (isInStr(msg, cmd["dinner"])) {
    if (hours >= 19) {
      now = now.add(1, "days");
      dateOpt = " (Tomorrow)";
    }
  } else if (isInStr(msg, cmd["menu"])) {
    if (hours >= 19) {
      now = now.add(1, "days");
      dateOpt = " (Tomorrow)";
    }
  }
  if (isInStr(msg, cmd["tomorrow"])) {
    now = now.add(1, "days");
    dateOpt = " (Tomorrow)";
    msg = "menu";
  }

  let date, date2;

  if (msg in db) {
    date = msg;
    date2 = moment(date, "MM/DD/YYYY").format("D MMM YYYY");
    msg = "menu";
  } else {
    date = now.format("M/D/YYYY");
    date2 = now.format("D MMM YYYY");
  }

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
      return flexHelp(cmdList);
    } else {
      let chance = Math.random() * 10;
      if (chance > 5) return textMessage(randList(noCmdList));
      else return textMessage("Try : " + randList(fullCmdList));
    }
    return flexMessage(date2 + dateOpt, meals);
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
app.get("/test/:cmd", (req, res) => {
  let cmd = req.params.cmd;
  if (!cmd) res.status(500).end();
  console.dir(replyMessage(cmd));
  res.json(replyMessage(cmd));
  res.status(200).end();
});
app.get("/api/:date", (req, res) => {
  let date = req.params.date.replace("-", "/").replace("-", "/");
  if (db[date] === undefined) res.json({ status: "Notfound" });
  else res.json(db[date]);
  res.status(200).end();
});

app.listen(port);
