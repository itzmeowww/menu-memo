// const moment = require("moment");
// const { flexMessage, textMessage, flexHelp } = require("./style");
// const { randList, isInStr } = require("./utils");

// function replyMessage(msg, db) {
//   let now = moment().add(7, "hours");
//   now.subtract(now.hours(), "hours");
//   let hours = now.hour();
//   let dateOpt = "";
//   let cmd = {
//     menu: ["food", "menu", "เมนู", "อาหาร", "meal", "มื้อ", "today", "วันนี้"],
//     breakfast: ["breakfast", "bf", "morning", "เช้า"],
//     lunch: ["lunch", "midday", "เที่ยง"],
//     dinner: ["dinner", "เย็น"],
//     nextMeal: ["หิว", "hungry", "ข้าว", "ต่อไป"],
//     help: ["help", "cmd", "ช่วย", "ใช้", "ยังไง", "how", "use"],
//     tomorrow: ["tomorrow", "tmr", "พรุ่งนี้"],
//     bug: ["bug", "comment", "แนะนำ", "บัค"],
//   };

//   let fullCmdList = [];
//   for (key in cmd) {
//     if (cmd.hasOwnProperty(key)) {
//       cmd[key].forEach((x) => {
//         fullCmdList.push(x);
//       });
//     }
//   }
//   // console.log(fullCmdList);

//   let cmdList = [
//     "food",
//     "menu",
//     "breakfast",
//     "lunch",
//     "dinner",
//     "tomorrow",
//     "หิว",
//     "M/D/YYYY",
//     "bug",
//     "แนะนำ",
//     "((Some Easter Eggs))",
//   ];

//   let noCmdList = [
//     "🙄",
//     "Ask me help :)",
//     "🤨",
//     "😪",
//     "จริงป่าววว",
//     "🍉",
//     "🥺",
//     "เปนงง",
//     "ม่ายเข้าจายย",
//   ];

//   if (isInStr(msg, cmd["bug"])) {
//     return textMessage(
//       "Report bugs or Comments : https://forms.gle/xG1S6Xn28J5onKfG6"
//     );
//   }

//   if (isInStr(msg, cmd["nextMeal"])) {
//     if (hours >= 19) {
//       msg = "breakfast";
//       now = now.add(1, "days");
//       dateOpt = " (Tomorrow)";
//     } else if (hours >= 13) {
//       msg = "dinner";
//     } else if (hours >= 8) {
//       msg = "lunch";
//     } else {
//       msg = "breakfast";
//     }
//   } else if (isInStr(msg, cmd["breakfast"])) {
//     if (hours >= 9) {
//       now = now.add(1, "days");
//       dateOpt = " (Tomorrow)";
//     }
//   } else if (isInStr(msg, cmd["lunch"])) {
//     if (hours >= 13) {
//       now = now.add(1, "days");
//       dateOpt = " (Tomorrow)";
//     }
//   } else if (isInStr(msg, cmd["dinner"])) {
//     if (hours >= 19) {
//       now = now.add(1, "days");
//       dateOpt = " (Tomorrow)";
//     }
//   } else if (isInStr(msg, cmd["menu"])) {
//     if (hours >= 19) {
//       now = now.add(1, "days");
//       dateOpt = " (Tomorrow)";
//     }
//   }

//   if (isInStr(msg, cmd["tomorrow"])) {
//     now = now.add(1, "days");
//     dateOpt = " (Tomorrow)";
//     msg = "menu";
//   }

//   let date, date2;

//   if (msg in db) {
//     date = msg;
//     now = moment(date, "MM/DD/YYYY");
//     date2 = now.format("D MMM YYYY");
//     msg = "menu";
//   } else {
//     date = now.format("M/D/YYYY");
//     date2 = now.format("D MMM YYYY");
//   }

//   let menu = db[date];
//   let meals = {};
//   let breakfast = [...menu.Breakfast];
//   let lunch = [...menu.Lunch];
//   let dinner = [...menu.Dinner];

//   if (date in db) {
//     if (isInStr(msg, cmd["menu"])) {
//       meals = {
//         breakfast,
//         lunch,
//         dinner,
//       };
//       let theDay = now.format("ddd");
//       return flexMessage("[" + theDay + "] " + date2 + dateOpt, meals);
//     }
//     if (isInStr(msg, cmd["breakfast"])) {
//       meals["breakfast"] = breakfast;
//       let theDay = now.format("ddd");
//       return flexMessage("[" + theDay + "] " + date2 + dateOpt, meals);
//     }
//     if (isInStr(msg, cmd["lunch"])) {
//       meals["lunch"] = lunch;
//       let theDay = now.format("ddd");
//       return flexMessage("[" + theDay + "] " + date2 + dateOpt, meals);
//     }
//     if (isInStr(msg, cmd["dinner"])) {
//       meals["dinner"] = dinner;
//       let theDay = now.format("ddd");
//       return flexMessage("[" + theDay + "] " + date2 + dateOpt, meals);
//     }
//     if (isInStr(msg, cmd["help"])) {
//       return flexHelp(cmdList);
//     }
//     let chance = Math.random() * 10;
//     if (chance > 3) return textMessage(randList(noCmdList));
//     else return textMessage("Try : " + randList(fullCmdList));
//   }
//   return textMessage("Try again later~");
// }

// module.exports = {
//   replyMessage,
// };
