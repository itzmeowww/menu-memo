const { google } = require("googleapis");
require("dotenv").config();
const moment = require("moment");
const keys = {
  type: "service_account",
  project_id: "food-fetcher-282419",
  private_key_id: process.env.private_key_id,
  private_key: process.env.private_key.replace(/\\n/gm, "\n"),
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

async function gsrun(cl) {
  console.log("Now in GSrun");
  let database = {};
  const gsapi = google.sheets({
    version: "v4",
    auth: cl,
  });

  let sp = await gsapi.spreadsheets.get({
    spreadsheetId: "1GBVRpE7PFA-rDCZlnV0pyBZfdIbFRFVdLO8EwTMFPpw",
  });
  console.log("sp");
  console.log(sp.data.sheets);
  console.log(sp.data.sheets.length);
  for (let ii = 0; ii < sp.data.sheets.length; ii++) {
    // console.log(ii);
    let xx = sp.data.sheets[ii];
    let date = "";
    // console.log(xx.properties.title);
    if (!xx.properties.title.endsWith("19") && !xx.properties.hidden) {
      let data = await gsapi.spreadsheets.values.get({
        spreadsheetId: "1GBVRpE7PFA-rDCZlnV0pyBZfdIbFRFVdLO8EwTMFPpw",
        range: xx.properties.title,
      });
      if (data.data.values) {
        console.log("Listed " + xx.properties.title);
        data.data.values.forEach((x) => {
          if (x.length != 0 && x[0] != "" && x[0] != date) {
            date = moment(x[0], "DD/MM/YYYY").format("M/D/YYYY");
            console.log(date);
          }
          if (date != "") {
            //   console.log(database);
            //   console.log(x);
            if (!(date in database))
              database[date] = {
                Breakfast: [],
                Lunch: [],
                Dinner: [],
              };

            if (x[1]) database[date]["Breakfast"].push(x[1]);
            if (x[2]) database[date]["Lunch"].push(x[2]);
            if (x[3]) database[date]["Dinner"].push(x[3]);
          }
        });
      }
    }
  }

  // console.log("DB : ", database);
  return database;
}

module.exports = { gsrun, client };
