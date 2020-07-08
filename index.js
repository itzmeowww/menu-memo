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
const bodyParser = require("body-parser");
const request = require("request");
const { google } = require("googleapis");
const { relativeTimeRounding } = require("moment");
const { content } = require("googleapis/build/src/apis/content");

require("dotenv").config();

// const { init } = require("./sheet");
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
const keys = {
  type: "service_account",
  project_id: "food-fetcher-282419",
  private_key_id: process.env.private_key_id,
  private_key: process.env.private_key,
  client_email: "food-fetch@food-fetcher-282419.iam.gserviceaccount.com",
  client_id: "114268373868823534996",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/food-fetch%40food-fetcher-282419.iam.gserviceaccount.com",
};

const client = new google.auth.JWT(keys.client_email, null, keys.private_key, [
  "https://www.googleapis.com/auth/spreadsheets.readonly",
]);
// Google sheet Auth
client.authorize(async (err, res) => {
  if (err) {
    console.log(err);
    logger.error(err);
  } else {
    logger.info("Authorized !");
    gsrun(client);
  }
});
//Fetch menu from Google sheet
function gsrun(cl) {
  const gsapi = google.sheets({
    version: "v4",
    auth: cl,
  });

  return gsapi.spreadsheets
    .get({
      spreadsheetId: "1GBVRpE7PFA-rDCZlnV0pyBZfdIbFRFVdLO8EwTMFPpw",
    })
    .then((sp) => {
      for (let i = 0; i < sp.data.sheets.length; i++) {
        let x = sp.data.sheets[i];
        let date = "";
        if (!x.properties.title.endsWith("19") && !x.properties.hidden) {
          //   console.log(x.properties);
          gsapi.spreadsheets.values
            .get({
              spreadsheetId: "1GBVRpE7PFA-rDCZlnV0pyBZfdIbFRFVdLO8EwTMFPpw",
              range: x.properties.title,
            })
            .then((data) => {
              //   console.log(data.data.values);
              data.data.values.forEach((x) => {
                if (x.length != 0 && x[0] != "" && x[0] != date) {
                  date = x[0];
                  console.log(date);
                }
                if (date != "") {
                  //   console.log(db);
                  //   console.log(x);
                  if (!(date in db))
                    db[date] = {
                      Breakfast: [],
                      Lunch: [],
                      Dinner: [],
                    };

                  if (x[1]) db[date]["Breakfast"].push(x[1]);
                  if (x[2]) db[date]["Lunch"].push(x[2]);
                  if (x[3]) db[date]["Dinner"].push(x[3]);
                }
              });
            });
        }
      }
    });
}

//TODO help : show commands
//TODO time : if the meal end show next meal
//TODO tmr : tomorrow's meal
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

function isInStr(msg, msgList) {
  msgList.forEach((x) => {
    if (msg.toLowerCase().includes(x)) {
      return true;
    }
  });
  return false;
}

function flexHeader(txt) {
  let ret = {
    type: "box",
    layout: "vertical",
    contents: [
      {
        type: "text",
        text: txt,
        align: "center",
        weight: "bold",
        size: "lg",
      },
    ],
    backgroundColor: "#fecece",
  };
  return ret;
}
function flexMeal(meal) {
  return {
    type: "text",
    text: meal,
    align: "center",
    gravity: "center",
    margin: "md",
    weight: "bold",
    offsetTop: "0px",
    offsetBottom: "15px",
  };
}
function flexMenu(menu) {
  return {
    type: "text",
    text: menu,
    align: "center",
    gravity: "center",
    offsetTop: "5px",
  };
}
function flexSeparator() {
  let ret = {
    type: "separator",
    margin: "md",
    color: "#000000",
  };
  return ret;
}
function flexBody(meals) {
  let contents = [];
  let ret = {
    type: "box",
    layout: "vertical",
    backgroundColor: "#e5edff",
  };
  let mealName = ["Breakfast", "Lunch", "Dinner"];
  mealName.forEach((meal) => {
    if (meal.toLowerCase() in meals) {
      contents.push(flexMeal(meal));
      meals[meal.toLowerCase()].forEach((menu) => {
        contents.push(flexMenu(menu));
      });
      contents.push(flexSeparator());
    }
  });
  if (contents[contents.length - 1].type == "separator") {
    contents.pop();
  }

  ret["contents"] = contents;
  return ret;
}
function flexMessage(date, meals) {
  let ret = {
    type: "flex",
    altText: "Menu Memo sent you a menu!",
    contents: {
      type: "bubble",
      header: flexHeader(date),
      body: flexBody(meals),
    },
    size: "micro",
  };

  return ret;
}
function textMessage(msg) {
  let ret = {
    type: "text",
    text: msg,
  };
  return ret;
}
function replyMessage(msg) {
  let now = moment().add(7, "hours");
  let hours = moment().hour();

  let cmd = {
    menu: ["food", "menu", "เมนู", "อาหาร"],
    breakfast: ["breakfast", "bf", "morning", "เช้า"],
    lunch: ["lunch", "midday", "เที่ยง"],
    dinner: ["dinner", "เย็น"],
    nextMeal: ["หิว", "hungry", "ข้าว", "ต่อไป"],
    help: ["help", "cmd", "ช่วย"],
  };
  if (isInStr(msg, cmd["nextMeal"])) {
    if (hour > 19) {
      msg = "breakfast";
      now = now.add(1, "days");
    } else if (hour > 13) {
      msg = "dinner";
      now = now.add(1, "days");
    } else if (hour > 8) {
      msg = "lunch";
      now = now.add(1, "days");
    } else {
      msg = "breakfast";
      now = now.add(1, "days");
    }
  }
  let date = now.format("M/D/YYYY");
  let date2 = now.format("D MMM YYYY");
  let meals = {};
  let menu = db[date];

  let breakfast = [...menu.Breakfast];
  let lunch = [...menu.Lunch];
  let dinner = [...menu.Dinner];

  if (date in db) {
    if (isInStr(msg, cmd["menu"])) {
      meals["breakfast"] = breakfast;
      meals["lunch"] = lunch;
      meals["dinner"] = dinner;
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

app.listen(port);

// setTimeout(() => {
//   console.log(replyMessage("f"));
// }, 4000);
