import { FlexBubble, FlexComponent, FlexMessage, Message } from "@line/bot-sdk";

export const textMessage = (text: string): Message => {
  return {
    type: "text",
    text,
  };
};

const flexHeader = (text: string): any => {
  let ret = {
    type: "box",
    layout: "vertical",
    contents: [
      {
        type: "text",
        text,
        align: "center",
        weight: "bold",
        size: "lg",
      },
    ],
    backgroundColor: "#fecece",
  };
  return ret;
};

const flexMeal = (meal: string): any => {
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
};

const flexMenu = (menu: string): any => ({
  type: "text",
  text: menu,
  align: "center",
  gravity: "center",
  offsetTop: "5px",
});

const flexSeparator = (): any => ({
  type: "separator",
  margin: "md",
  color: "#000000",
});

const flexBody = (meals: any): any => {
  let contents: any[] = [];
  let mealName = ["Breakfast", "Lunch", "Dinner"];
  mealName.forEach((meal) => {
    if (meal.toLowerCase() in meals) {
      contents.push(flexMeal(meal));
      meals[meal.toLowerCase()].forEach((menu: any) => {
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

  return {
    type: "box",
    layout: "vertical",
    backgroundColor: "#e5edff",
    contents,
  };
};

export const flexMessage = (date: any, meals: any): any => ({
  type: "flex",
  altText: "Menu Memo sent you a menu!",
  contents: {
    type: "bubble",
    header: flexHeader(date),
    body: flexBody(meals),
  },
  size: "micro",
});

const flexHelpBody = (cmdList: any) => ({
  type: "box",
  layout: "vertical",
  backgroundColor: "#e5edff",
  contents: cmdList.map((val: any) => ({
    type: "text",
    text: val,
    align: "center",
    gravity: "center",
    margin: "md",
  })),
});

export const flexHelp = (cmdList: any): any => ({
  type: "flex",
  altText: "Menu Memo sent you help!",
  contents: {
    type: "bubble",
    header: flexHeader("Commands"),
    body: flexHelpBody(cmdList),
  },
  size: "nano",
});
