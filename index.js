// Echo reply

const winston = require("winston");
var moment = require("moment"); // require
moment.locale("th");

moment.updateLocale("th", {
  months: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
});
const logger = winston.createLogger({
  level: "info",
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
});
logger.info(moment.locale());
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const { google } = require("googleapis");

require("dotenv").config();
// const { init } = require("./sheet");
const app = express();
const port = process.env.PORT || 5000;
const channel_id = process.env.channel_id;
const secret = process.env.secret;
const access_token = process.env.access_token;

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
  logger.info(err);
  logger.info(res);
  if (err) {
    console.log(err);
    logger.error(err);
  } else {
    console.log("Succeed!");
    logger.info("Auth");
    gsrun(client).then(() => {});
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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send({});
});
app.post("/webhook", (req, res) => {
  let reply_token = req.body.events[0].replyToken;
  let msg = req.body.events[0].message.text;

  let now = new Date();
  logger.info(now);
  logger.info(moment().add(7, "hours").format("l"));
  logger.info(moment().add(7, "hours").format("LL"));
  logger.info(moment().add(7, "hours").format("LLL"));
  logger.info(moment().add(7, "hours").local().format("LLL"));
  let date = moment().format("l");

  let replymsg = moment().format("LL") + "\n\n";
  logger.info("MESSAGE : " + msg);

  if (date in db) {
    let menu = db[date];

    let breakfast = "";
    menu.Breakfast.forEach((x) => {
      breakfast += x;
      breakfast += "\n";
    });
    let lunch = "";
    menu.Lunch.forEach((x) => {
      lunch += x;
      lunch += "\n";
    });
    let dinner = "";
    menu.Dinner.forEach((x) => {
      dinner += x;
      dinner += "\n";
    });

    if (
      msg.toLowerCase().includes("food") ||
      msg.includes("อาหาร") ||
      msg.toLowerCase().includes("menu") ||
      msg.includes("เมนู")
    ) {
      replymsg += "Breakfast\n" + breakfast + "\n";
      replymsg += "Lunch\n" + lunch + "\n";
      replymsg += "Dinner\n" + dinner;
    } else if (msg.toLowerCase().includes("breakfast")) {
      replymsg += "Breakfast\n" + breakfast;
    } else if (msg.toLowerCase().includes("lunch")) {
      replymsg += "Lunch\n" + lunch;
    } else if (msg.toLowerCase().includes("lunch")) {
      replymsg += "Dinner\n" + dinner;
    }
  } else {
    replymsg = "Try again later~";
  }

  reply(reply_token, replymsg);

  res.sendStatus(200);
});
app.listen(port);

function reply(reply_token, msg) {
  let headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer {" + access_token + "}",
  };
  let body = JSON.stringify({
    replyToken: reply_token,
    messages: [
      {
        type: "text",
        text: msg,
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
