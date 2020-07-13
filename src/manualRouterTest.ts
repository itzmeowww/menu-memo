/**
 * THis is yet another testing tool, except this one uses console
 */

import * as mockdate from "mockdate";
import * as router from "./router";
import "./arrayRandom";
import { inspect } from "util";

function generateRandomFood(count: number = 4): Array<string> {
  const foods: Array<string> = [
    "ไข่ระเบิด", "ชานมไข่มุกพ่นไฟ", 'ตมสมปลาทบทม', 'ตมยำโปะแตก', 'แกงจดเตาหไขสาหราย', 'กระดกออนตนไชเทายาจน', 'แกงจดหมมวนสาหราย', 'ซโครงหมตนเยอไผ', 'ผกรวม', 'เกยมฉายซโครงหม', 'แกงสมชะอมทอดกง', 'แกงจดลกรอก', 'แกงจดแตงกวาสอดไส', 'มะระตนยาจนกระดกหม', 'ตมขาไก', 'เปดตนฟก', 'ตมโคลงปลาดกยาง', 'ตมเลอดหม', 'รวมมตร', 'แกงจดผกกาดขาวลกชนปลา', 'เหดหอม', 'แกงจดมะระยดไสหมสบ', 'ไกตนฟกมะนาวดอง', 'ตมจบฉาย', 'ปลาสลด', 'ขาหม', 'แกงเลยงกงสด', 'ตมยำกง', 'แกงจดไขนำ', 'ปลากรอบ', 'แกงจดวนเสนหมสบ', 'เกาเหลาลกชนหม', 'ตมแซบกระดกหมออน'
  ];

  let result = [];
  for (let i = 0; i < count; i++) {
    result.push(foods.pickRandom());
  }
  return result;
}

function generateRandomMeal(count: number = 4): any {
  return {"Breakfast": generateRandomFood(), "Lunch": generateRandomFood(), "Dinner": generateRandomFood()};
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
    "week": new router.LegacyWeekOverview(mockDatabase),
  },
  {
    "week": ["week", "wk", "summary", "sum", "overview"]
  },
  new router.LegacyPassthru(mockDatabase)
);

let rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', function (line: string) {
  const reply = messageRouter.reply(line);
  console.log(inspect(reply, {showHidden: false, depth: null}));
  console.log(JSON.stringify(reply).length);
})
