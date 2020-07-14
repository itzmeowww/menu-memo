/**
 * This is yet another testing tool, except this one uses console
 */

import * as mockdate from "mockdate";
import * as router from "./router";
import * as oldCmd from "./oldCmd";
import "./arrayRandom";
import { inspect } from "util";

function generateRandomFood(count: number = 4): Array<string> {
  const foods: Array<string> = [
    "ไข่ระเบิด",
    "ชานมไข่มุกพ่นไฟ",
    "ตมสมปลาทบทม",
    "ตมยำโปะแตก",
    "แกงจดเตาหไขสาหราย",
    "กระดกออนตนไชเทายาจน",
    "แกงจดหมมวนสาหราย",
    "ซโครงหมตนเยอไผ",
    "ผกรวม",
    "เกยมฉายซโครงหม",
    "แกงสมชะอมทอดกง",
    "แกงจดลกรอก",
    "แกงจดแตงกวาสอดไส",
    "มะระตนยาจนกระดกหม",
    "ตมขาไก",
    "เปดตนฟก",
    "ตมโคลงปลาดกยาง",
    "ตมเลอดหม",
    "รวมมตร",
    "แกงจดผกกาดขาวลกชนปลา",
    "เหดหอม",
    "แกงจดมะระยดไสหมสบ",
    "ไกตนฟกมะนาวดอง",
    "ตมจบฉาย",
    "ปลาสลด",
    "ขาหม",
    "แกงเลยงกงสด",
    "ตมยำกง",
    "แกงจดไขนำ",
    "ปลากรอบ",
    "แกงจดวนเสนหมสบ",
    "เกาเหลาลกชนหม",
    "ตมแซบกระดกหมออน",
  ];

  let result = [];
  for (let i = 0; i < count; i++) {
    result.push(foods.pickRandom());
  }
  return result;
}

function generateRandomMeal(count: number = 4): any {
  return {
    Breakfast: generateRandomFood(),
    Lunch: generateRandomFood(),
    Dinner: generateRandomFood(),
  };
}

const mockDatabase = {
  "7/1/2020": generateRandomMeal(),
  "7/2/2020": generateRandomMeal(),
  "7/3/2020": generateRandomMeal(),
  "7/4/2020": generateRandomMeal(),
  "7/5/2020": generateRandomMeal(),
  "7/6/2020": generateRandomMeal(),
  "7/7/2020": generateRandomMeal(),
  "7/8/2020": generateRandomMeal(),
};

mockdate.set(new Date(2020, 6, 1));

const messageRouter = new router.MessageRouter(
  {
    week: new router.LegacyWeekOverview(mockDatabase),
    menu: new oldCmd.menu(mockDatabase),
    breakfast: new oldCmd.breakfast(mockDatabase),
    lunch: new oldCmd.lunch(mockDatabase),
    dinner: new oldCmd.dinner(mockDatabase),
    nextMeal: new oldCmd.nextMeal(mockDatabase),
    help: new oldCmd.help(mockDatabase),
    tomorrow: new oldCmd.tomorrow(mockDatabase),
    bug: new oldCmd.bug(mockDatabase),
  },
  {
    week: ["week", "wk", "summary", "sum", "overview"],
    menu: ["food", "menu", "เมนู", "meal", "มื้อ", "today", "วันนี้"],
    breakfast: ["breakfast", "bf", "morning", "เช้า"],
    lunch: ["lunch", "midday", "เที่ยง"],
    dinner: ["dinner", "เย็น"],
    nextMeal: ["หิว", "hungry", "ข้าว", "ต่อไป"],
    help: ["help", "cmd", "ช่วย", "ใช้", "ยังไง", "how", "use"],
    tomorrow: ["tomorrow", "tmr", "พรุ่งนี้"],
    bug: ["bug", "comment", "แนะนำ", "บัค"],
  },
  new router.LegacyPassthru(mockDatabase)
);

let rl = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

rl.on("line", function (line: string) {
  const reply = messageRouter.reply(line);
  console.log(inspect(reply, { showHidden: false, depth: null }));
  console.log(JSON.stringify(reply).length);
});
