import { flexMessage, textMessage, flexHelp } from "./style";
import * as moment from "moment";
import { IMessageHandler } from "./router";
import { Message } from "@line/bot-sdk";

type DateTime = moment.Moment | undefined;

const getDate = () => moment().utcOffset(7);
const getTime = () => moment().utcOffset(7).hour();

const timeToEat: any = {
  breakfast: 8,
  lunch: 12,
  dinner: 19,
};

type LegacyMealFormat = {
  Breakfast: Array<string>;
  Lunch: Array<string>;
  Dinner: Array<string>;
};

const meal = (periods: string[], db: any) => {
  return (date: DateTime = undefined): Message => {
    let dateOpt = "";
    if (date == undefined) {
      date = getDate();
      let mealUntil = timeToEat[periods[periods.length - 1]];
      if (getTime() > mealUntil) {
        date = date.add(1, "d");
        dateOpt = " (tomorrow)";
      }
    }
    let menu = db[date.format("M/D/YYYY")];
    let meals: any = {};
    for (let period of periods) {
      meals[period.toLowerCase()] = [...menu[period]];
    }
    return flexMessage(
      "[" + date.format("ddd") + "] " + date.format("D MMM YYYY") + dateOpt,
      meals
    );
  };
};

export class menu implements IMessageHandler {
  private db: Record<string, LegacyMealFormat>;

  constructor(forwardDatabase: any) {
    this.db = forwardDatabase;
  }

  reply(parameters: string): Message {
    const menu = meal(["Breakfast", "Lunch", "Dinner"], this.db);
    return menu();
  }
}

export class breakfast implements IMessageHandler {
  private db: Record<string, LegacyMealFormat>;

  constructor(forwardDatabase: any) {
    this.db = forwardDatabase;
  }

  reply(parameters: string): Message {
    const breakfast = meal(["Breakfast"], this.db);
    return breakfast();
  }
}

export class lunch implements IMessageHandler {
  private db: Record<string, LegacyMealFormat>;

  constructor(forwardDatabase: any) {
    this.db = forwardDatabase;
  }

  reply(parameters: string): Message {
    const lunch = meal(["Lunch"], this.db);
    return lunch();
  }
}

export class dinner implements IMessageHandler {
  private db: Record<string, LegacyMealFormat>;

  constructor(forwardDatabase: any) {
    this.db = forwardDatabase;
  }

  reply(parameters: string): Message {
    const dinner = meal(["Dinner"], this.db);
    return dinner();
  }
}

export class tomorrow implements IMessageHandler {
  private db: Record<string, LegacyMealFormat>;

  constructor(forwardDatabase: any) {
    this.db = forwardDatabase;
  }

  reply(parameters: string): Message {
    const menu = meal(["Breakfast", "Lunch", "Dinner"], this.db);
    let tmr = getDate().add(1, "d");
    return menu(tmr);
  }
}

export class nextMeal implements IMessageHandler {
  private db: Record<string, LegacyMealFormat>;

  constructor(forwardDatabase: any) {
    this.db = forwardDatabase;
  }

  reply(parameters: string): Message {
    const breakfast = meal(["Breakfast"], this.db);
    const lunch = meal(["Lunch"], this.db);
    const dinner = meal(["Dinner"], this.db);
    if (getTime() < timeToEat["breakfast"]) return breakfast();
    if (getTime() < timeToEat["lunch"]) return lunch();
    if (getTime() < timeToEat["dinner"]) return dinner();
    return breakfast();
  }
}

export class bug implements IMessageHandler {
  private db: Record<string, LegacyMealFormat>;

  constructor(forwardDatabase: any) {
    this.db = forwardDatabase;
  }

  reply(parameters: string): Message {
    return textMessage(
      "Report bugs or Comments : https://forms.gle/xG1S6Xn28J5onKfG6"
    );
  }
}

export class help implements IMessageHandler {
  private db: Record<string, LegacyMealFormat>;

  constructor(forwardDatabase: any) {
    this.db = forwardDatabase;
  }

  reply(parameters: string): Message {
    return flexHelp([
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
  }
}
