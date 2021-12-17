import { theme } from "./theme";

function flexHeader(txt) {
  let ret = {
    type: "box",
    layout: "vertical",
    contents: [
      {
        type: "text",
        text: txt,
        color: theme.header.color,
        align: "center",
        weight: "bold",
        size: "lg",
      },
    ],
    backgroundColor: theme.header.backgroundColor,
  };
  return ret;
}

function flexMeal(meal) {
  return {
    type: "text",
    text: meal,
    color: "#AB0000",
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
    color: theme.body.separatorColor,
  };
  return ret;
}

function flexBody(meals) {
  let contents = [];
  let ret = {
    type: "box",
    layout: "vertical",
    backgroundColor: "#F1E2CB",
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
  if (
    contents.length > 0 &&
    contents[contents.length - 1].type == "separator"
  ) {
    contents.pop();
  }

  ret["contents"] = contents;
  return ret;
}

function flexHelpText(text) {
  return {
    type: "text",
    text: text,
    align: "center",
    gravity: "center",
    margin: "md",
  };
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

function flexHelpBody(cmdList) {
  let contents = [];
  let ret = {
    type: "box",
    layout: "vertical",
    backgroundColor: "#F7F2E7",
  };
  cmdList.forEach((x) => {
    contents.push(flexHelpText(x));
  });
  ret["contents"] = contents;
  return ret;
}

function flexHelp(cmdList) {
  let ret = {
    type: "flex",
    altText: "Menu Memo sent you help!",
    contents: {
      type: "bubble",
      header: flexHeader("Commands"),
      body: flexHelpBody(cmdList),
    },
    size: "nano",
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

module.exports = {
  flexHeader,
  flexMeal,
  flexMenu,
  flexSeparator,
  flexBody,
  flexMessage,
  textMessage,
  flexHelpBody,
  flexHelp,
};
