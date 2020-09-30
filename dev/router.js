const { cmdMap, cmdOption, query, menu, fullCmdList } = require("./reply");
const { textMessage } = require("./style");
const { isInStr, randList } = require("./utils");

const randomReply = () => {
  let chance = Math.random() * 10;
  if (chance > 3)
    return textMessage(
      randList([
        "🙄",
        "Ask me help :)",
        "🤨",
        "😪",
        "จริงป่าววว",
        "🍉",
        "🥺",
        "เปนงง",
        "ม่ายเข้าจายย",
      ])
    );
  return textMessage("Try : " + randList(fullCmdList));
};

const main = (msg) => {
  for (command in cmdMap) {
    if (isInStr(msg, cmdOption[command])) {
      console.log(command);
      return cmdMap[command]();
    }
  }
  if (query(msg) != undefined) {
    return menu(moment(date, "DD/MM/YYYY"));
  }
  return randomReply();
};

module.export = main;
