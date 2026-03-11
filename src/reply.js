const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(utc);
dayjs.extend(customParseFormat);
const { flexMessage, textMessage, flexHelp } = require("./style");
const { randList, isInStr } = require("./utils");

function replyMessage(msg, db) {
  let ret = {};
  let now = dayjs().utcOffset(7);

  let hours = now.hour();
  let dateOpt = "";
  let cmd = {
    menu: [
      "food",
      "menu",
      "เมนู",
      "อาหาร",
      "meal",
      "มื้อ",
      "today",
      "วันนี้",
      "kow",
      "hew",
    ],
    breakfast: ["breakfast", "bf", "morning", "เช้า", "morn"],
    lunch: ["lunch", "midday", "เที่ยง"],
    dinner: ["dinner", "เย็น"],
    nextMeal: ["หิว", "hungry", "ต่อไป"],
    help: ["help", "cmd", "ช่วย", "ใช้", "ยังไง", "how", "use"],
    tomorrow: ["tomorrow", "tmr", "พรุ่งนี้", "พน", "พ.น."],
    bug: ["bug", "comment", "แนะนำ", "บัค"],
    yesterday: ["เมื่อวาน", "yesterday", "ytd"],
    link: ["link", "ลิ้งก์", "ลิ้งค์"],
    feedback: [
      "ประเมิน",
      "evaluate",
      "menu evaluation",
      "eval",
      "ให้คะแนน",
      "feedback",
    ],
    suggest: ["suggest", "เสนอ", "menu suggestion"],
    kvisMart: ["mart", "ขนม", "ไอติม"],
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
    "Menu",
    "Breakfast",
    "Lunch",
    "Dinner",
    "Tmr",
    "M/D/YYYY",
    "Bug",
    "Suggest",
    "Week",
    "✨Some Easter Eggs✨",
  ];

  let noCmdList = [
    "🙄",
    "🤨",
    "😪",
    "จริงป่าววว",
    "🍉",
    "🥺",
    "เปนงง",
    "ม่ายเข้าจายย",
    "เค้าไม่รักก็ควรพอ",
    "ทุกคนรู้",
    "ไปนอนกันเถอะ",
    "เมี๊ยว",
    "โฮ่ง ๆ",
    "https://docs.google.com/spreadsheets/d/1GBVRpE7PFA-rDCZlnV0pyBZfdIbFRFVdLO8EwTMFPpw/edit#gid=1095799098",
  ];

  if (isInStr(msg, cmd["bug"])) {
    return {
      desc: "Report bugs or Comments : https://forms.gle/xG1S6Xn28J5onKfG6",
      reply: textMessage(
        "Report bugs or Comments : https://forms.gle/xG1S6Xn28J5onKfG6"
      ),
    };
  }

  if (isInStr(msg, cmd["nextMeal"])) {
    if (hours >= 19) {
      msg = "breakfast";
      now = now.add(1, "days");
      dateOpt = " (Tomorrow)";
    } else if (hours >= 13) {
      msg = "dinner";
    } else if (hours >= 9) {
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
  } else if (isInStr(msg, cmd["kvisMart"])) {
    return {
      desc: "KVIS Mart",
      reply: textMessage(
        "KVIS MART OPENING TIME:\n\nLunch\n12.00-12.20\nTUE,THU,FRI\n\nDinner\n17.15-17.35, 17.40-18.00\nMON,TUE,WED,THU"
      ),
    };
  }

  if (isInStr(msg, cmd["tomorrow"])) {
    now = now.add(1, "days");
    dateOpt = " (Tomorrow)";
    msg = "menu";
  }
  if (isInStr(msg, cmd["yesterday"])) {
    return {
      desc: "yesterday",
      reply: textMessage("ไม่บอกกกก อดีตมันผ่านไปแร้ว"),
    };
  }

  let date, date2;

  if (msg in db) {
    date = msg;
    now = dayjs(date, "M/D/YYYY");
    date2 = now.format("D MMM");
    msg = "menu";
  } else {
    date = now.format("M/D/YYYY");
    date2 = now.format("D MMM");
  }

  if (date in db) {
    let menu = db[date];
    let meals = {};

    let breakfast = [...menu.Breakfast];
    let lunch = [...menu.Lunch];
    let dinner = [...menu.Dinner];

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
      return {
        desc: "flexHelp",
        reply: flexHelp(cmdList),
      };
    } else if (isInStr(msg, ["วินน่ารัก"])) {
      return {
        desc: "easter egg",
        reply: textMessage("อันนี้จริงที่สุด"),
      };
    } else if (isInStr(msg, ["itzmeowww"])) {
      return {
        desc: "easter egg",
        reply: textMessage("ว้าวๆๆๆๆๆๆๆ"),
      };
    } else if (isInStr(msg, ["วิน", "win", "thanasan", "ธนาสรรค์"])) {
      let retList = ["วินหรือป่าว ใช่วินหรือป่าว"];
      return {
        desc: "easter egg",
        reply: textMessage(randList(retList)),
      };
    } else if (isInStr(msg, ["mimiemie"])) {
      return {
        desc: "easter egg",
        reply: textMessage("คนนี้วาดรูปโปรไฟล์ให้ครับ สวยสุด"),
      };
    } else if (isInStr(msg, ["พี่รหัสเป็นใครเอ่ย"])) {
      return {
        desc: "easter egg",
        reply: textMessage("พีี่แชมป์เองแหละจ้าา"),
      };
    } else if (isInStr(msg, cmd["link"])) {
      return {
        desc: "link",
        reply: textMessage(
          "https://docs.google.com/spreadsheets/d/1GBVRpE7PFA-rDCZlnV0pyBZfdIbFRFVdLO8EwTMFPpw/edit#gid=1095799098"
        ),
      };
    } else if (isInStr(msg, cmd["feedback"])) {
      return {
        desc: "feedback",
        reply: textMessage("https://forms.office.com/r/snawiSUY8H"),
      };
    } else {
      let chance = Math.random() * 10;
      if (true)
        return {
          desc: "noCmdList",
          reply: textMessage(randList(noCmdList)),
        };
      else
        return {
          desc: "fullCmdList",
          reply: textMessage("Try : " + randList(fullCmdList)),
        };
    }

    let theDay = now.format("ddd");
    let msgTitle = theDay + " " + date2 + dateOpt;
    let showMenu = "";
    showMenu += Object.keys(meals).join(",");

    return {
      desc: msgTitle + " " + showMenu,
      reply: flexMessage(msgTitle, meals),
    };
  } else {
    return {
      desc: "Service is not available",
      reply: textMessage(
        "Menu is not found, please use this link instead: https://docs.google.com/spreadsheets/d/1GBVRpE7PFA-rDCZlnV0pyBZfdIbFRFVdLO8EwTMFPpw/edit#gid=1095799098"
      ),
    };
  }
}

module.exports = {
  replyMessage,
};
