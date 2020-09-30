const { flexMessage, textMessage } = require("./style");
const { query } = require("./sheet");
const moment = require("moment");

const getDate = () => moment().utcOffset(7);
const getTime = () => moment().utcOffset(7).hour();

const timeToEat = {
  breakfast: 8,
  lunch: 12,
  dinner: 19,
};

const meal = (periods) => {
  return (date = undefined) => {
    let dateOpt = "";
    if (date == undefined) {
      date = getDate();
      let mealUntil = timeToEat[periods[periods.length - 1]];
      if (getTime() > mealUntil) {
        date = date.add(1, "d");
        dateOpt = " (tomorrow)";
      }
    }
    let menu = query(date.format("D/M/YYYY"));
    let meals = {};
    for (period of periods) {
      meals[period.toLowerCase()] = [...menu[period]];
    }
    return flexMessage(
      "[" + date.format("ddd") + "] " + date.format("D MMM YYYY") + dateOpt,
      meals
    );
  };
};

const menu = meal(["Breakfast", "Lunch", "Dinner"]);
const breakfast = meal(["Breakfast"]);
const lunch = meal(["Lunch"]);
const dinner = meal(["Dinner"]);
const tomorrow = () => {
  let tmr = getDate().add(1, "d");
  return menu(tmr);
};

const nextMeal = () => {
  if (getTime() < timeToEat["breakfast"]) return breakfast();
  if (getTime() < timeToEat["lunch"]) return lunch();
  if (getTime() < timeToEat["dinner"]) return dinner();
  return breakfast();
};

const bug = () => {
  return textMessage(
    "Report bugs or Comments : https://forms.gle/xG1S6Xn28J5onKfG6"
  );
};

const help = () =>
  flexHelp([
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
    "((Some Easter Eggs))",
  ]);

let cmdOption = {
  menu: ["food", "menu", "เมนู", "อาหาร", "meal", "มื้อ", "today", "วันนี้"],
  breakfast: ["breakfast", "bf", "morning", "เช้า"],
  lunch: ["lunch", "midday", "เที่ยง"],
  dinner: ["dinner", "เย็น"],
  nextMeal: ["หิว", "hungry", "ข้าว", "ต่อไป"],
  help: ["help", "cmd", "ช่วย", "ใช้", "ยังไง", "how", "use"],
  tomorrow: ["tomorrow", "tmr", "พรุ่งนี้"],
  bug: ["bug", "comment", "แนะนำ", "บัค"],
};

let cmdMap = {
  bug,
  menu,
  tomorrow,
  breakfast,
  lunch,
  dinner,
  help,
  nextMeal,
};

let fullCmdList = [];
for (key in cmdOption) {
  if (cmdOption.hasOwnProperty(key)) {
    cmdOption[key].forEach((x) => {
      fullCmdList.push(x);
    });
  }
}

module.exports = { cmdMap, cmdOption, query, menu, fullCmdList };
