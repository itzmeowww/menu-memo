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
  // console.log("sp");
  // console.log(sp.data.sheets);
  // console.log(sp.data.sheets.length);
  for (let ii = 0; ii < sp.data.sheets.length; ii++) {
    // console.log(ii);
    let xx = sp.data.sheets[ii];
    let date = "";
    // console.log(xx.properties.title);
    const badTitle = [
      "16-30Sep 20",
      "1-15 Sep 20",
      "1-15 Aug 20",
      " 16-31 Aug 20",
      "16-31July 20",
      "1-15July 20",
      "13-30 June 20",
      "1-9 Mar20",
      "Form Responses 1",
      "1-15 may",
      "16-31May",
      "1-15Jun",
      "16-30Jun",
      "1-15Jul",
      "16-31Ju",
      "1-15Aug",
      "16-22Aug",
      "23-31Aug",
      "1-15 Sep",
      "16-30Sep",
      "1-6 Oct",
      "13-31 Oct",
      "1-30 NOV",
      "1-27Dec",
      "6-31Jan19",
      "1-15Feb19",
      "16-28Feb19",
      "1-9 Mar 19",
      "27-15Apr",
      "21Apr-15May19",
      "16May-8Jun19",
      "6-30Jun19",
      "1-13Jul19",
      "20-31July19",
      "1-15Aug19",
      "16-30 Sep19",
      "20-31Oct.19",
      "1-30NOV19",
      "1-31Jan63",
      "1-30Dec19",
      "1-15/2/20",
      "16-29 Feb 20",
      "1-9 Mar20",
      "13-30 June 20",
      "1-15July 20",
      "16-31July 20",
      "1-15 Aug 20",
      " 16-31 Aug 20",
      "1-15 Sep 20",
      "16-30Sep 20",
      "1-15 Oct 20",
      "16-31 Oct 20",
      "1-15 Nov 20",
      "16-30 Nov 20",
      "1-15 Dec 20",
      "16-30 Dec 20",
      "1-15 Jan 21",
      "31 Jan-15 Feb",
      "16-28 Feb 21",
      "1-15 Mar 21",
    ];
    // console.log(xx.properties.title);
    if (
      !xx.properties.title.endsWith("19") &&
      !xx.properties.title.endsWith("20") &&
      !xx.properties.title.endsWith("21") &&
      !xx.properties.hidden &&
      !badTitle.includes(xx.properties.title)
    ) {
      console.log(xx.properties.title);
      let data = await gsapi.spreadsheets.values.get({
        spreadsheetId: "1GBVRpE7PFA-rDCZlnV0pyBZfdIbFRFVdLO8EwTMFPpw",
        range: xx.properties.title,
      });
      // year = "2021";
      if (data.data.values) {
        data.data.values.forEach((x) => {
          if (x.length != 0 && x[0] != "" && x[0] != " " && x[0] != date) {
            date = moment(x[0], "D-MMM-YYYY").format("M/D/YYYY");
          }
          if (date != "" && date != "Invalid date") {
            //   console.log(database);
            //   console.log(x);
            if (!(date in database))
              database[date] = {
                Breakfast: [],
                Lunch: [],
                Dinner: [],
              };

            if (xx.properties.title == "16-31 Oct 20") {
              if (x[1]) database[date]["Breakfast"].push(x[1]);
              if (x[2] && x[2] != "อาหารเจ")
                database[date]["Breakfast"].push("เจ : " + x[2]);
              if (x[3]) database[date]["Lunch"].push(x[3]);
              if (x[4] && x[4] != "อาหารเจ")
                database[date]["Lunch"].push("เจ : " + x[4]);
              if (x[5]) database[date]["Dinner"].push(x[5]);
              if (x[6] && x[6] != "อาหารเจ")
                database[date]["Dinner"].push("เจ : " + x[6]);
            } else {
              if (x[1]) database[date]["Breakfast"].push(x[1]);
              if (x[2]) database[date]["Lunch"].push(x[2]);
              if (x[3]) database[date]["Dinner"].push(x[3]);
            }
          }
        });
      }
    }
  }

  // console.log("DB : ", database);
  return database;
}

module.exports = { gsrun, client };
