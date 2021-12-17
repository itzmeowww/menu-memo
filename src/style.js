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

function flexMeal(meal, idx) {
  return {
    type: "text",
    text: meal,
    color: "#AB0000",
    align: "center",
    gravity: "center",
    margin: idx === 0 ? "none" : "md",
    weight: "bold",
  };
}

function flexMenu(menu) {
  return {
    type: "text",
    text: menu,
    align: "center",
    gravity: "center",
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
    backgroundColor: theme.body.backgroundColor,
  };
  let mealName = ["Breakfast", "Lunch", "Dinner"];
  let idx = 0;
  mealName.forEach((meal) => {
    if (meal.toLowerCase() in meals) {
      contents.push(flexMeal(meal, idx));
      meals[meal.toLowerCase()].forEach((menu) => {
        contents.push(flexMenu(menu));
      });
      contents.push(flexSeparator());
      idx++;
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

function flexBackgroundImage(flexBody) {
  return {
    type: "box",
    layout: "vertical",
    backgroundColor: theme.body.backgroundColor,
    contents: [
      {
        type: "image",
        url: theme.body.imageURL,
        position: "absolute",
        size: "full",
        align: "center",
        gravity: "center",
        aspectMode: "cover",
      },
      {
        type: "box",
        layout: "vertical",
        contents: flexBody.contents,
      },
    ],
    justifyContent: "center",
    alignItems: "center",
  };
}

function flexMessage(date, meals) {
  let ret = {
    type: "flex",
    altText: "Menu Memo sent you a menu!",
    contents: {
      type: "bubble",
      header: flexHeader(date),
      body: flexBackgroundImage(flexBody(meals)),
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
    backgroundColor: theme.body.backgroundColor,
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
