function flexHeader(txt) {
  let ret = {
    type: "box",
    layout: "vertical",
    contents: [
      {
        type: "text",
        text: txt,
        align: "center",
        weight: "bold",
        size: "lg",
      },
    ],
    backgroundColor: "#fecece",
  };
  return ret;
}

function flexMeal(meal) {
  return {
    type: "text",
    text: meal,
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
    color: "#000000",
  };
  return ret;
}

function flexBody(meals) {
  let contents = [];
  let ret = {
    type: "box",
    layout: "vertical",
    backgroundColor: "#e5edff",
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
  if (contents[contents.length - 1].type == "separator") {
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
    backgroundColor: "#e5edff",
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
