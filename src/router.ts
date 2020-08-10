/**
 * Various router and handler for messages
 */

import { flexMessage, textMessage } from "./style.js";
import * as moment from "moment";
import "./arrayRandom";
import { FlexBubble, FlexComponent, FlexMessage, Message } from "@line/bot-sdk";
import * as oldReplyHandler from "./reply";

// Used to split by first whitespace
const firstWhitespaceSplitRegex = /^(\S*)\s*(.*)/m;

export interface IMessageHandler {
  reply(parameters: string): Message;
}

/**
 * Route message to appropriate handler
 */
export class MessageRouter implements IMessageHandler {
  private readonly routes: Record<string, IMessageHandler>;
  private readonly aliases: Record<string, Array<string>>;
  private readonly fallthroughHandler: IMessageHandler;

  /**
   * @param routes map of command name to its handler
   * @param aliases map of command name to the uer input which invoke said command
   * @param fallthroughHandler handle messages with no command, parameters are directly forwarded with no processing
   */
  constructor(
    routes: Record<string, IMessageHandler>,
    aliases: Record<string, Array<string>>,
    fallthroughHandler: IMessageHandler = new InvalidCommand()
  ) {
    this.routes = routes;
    this.aliases = {};
    for (const [key, entries] of Object.entries(aliases)) {
      this.aliases[key] = entries.map((i) => i.toLowerCase().trim());
    }
    this.fallthroughHandler = fallthroughHandler;
  }

  /**
   * Give reply to user by forwarding to other handler, use fallthroughHandler if no match found
   * @param parameters is the message from the user
   * @returns reply to the user via line sdk
   */
  reply(parameters: string): Message {
    let parseSplit = firstWhitespaceSplitRegex.exec(parameters.trim());

    if (parseSplit) {
      let currentCommand = parseSplit[1].toLowerCase();
      let forwardParameters = parseSplit[2];

      for (const [key, entries] of Object.entries(this.aliases)) {
        if (key in this.routes && entries.includes(currentCommand)) {
          return this.routes[key].reply(forwardParameters);
        }
      }
    }

    return this.fallthroughHandler.reply(parameters);
  }
}

/**
 * Default handler for invalid command
 */
export class InvalidCommand implements IMessageHandler {
  private readonly replyMessages: Array<string> = [
    "🙄",
    "🤨",
    "😪",
    "จริงป่าววว",
    "🍉",
    "🥺",
    "เปนงง",
    "ม่ายเข้าจายย",
    "อิอิ",
    "หิวแย้วว",
  ];

  reply(parameters: string): Message {
    return {
      type: "text",
      text: `${this.replyMessages.pickRandom()}\nลองพิมพ์ "help" ดูสิ`,
    };
  }
}

/**
 * Reply with a static (unchanging) text regardless of what is said
 */
export class StaticTextReplyCommand implements IMessageHandler {
  private readonly replyMessage: string;

  constructor(replyMessage: string) {
    this.replyMessage = replyMessage;
  }

  reply(parameters: string): Message {
    return {
      type: "text",
      text: this.replyMessage,
    };
  }
}

/**
 * Forward to the old reply handler so that we don't have to rewrite them (for now)
 */
export class LegacyPassthru implements IMessageHandler {
  private db: any;

  constructor(forwardDatabase: any) {
    this.db = forwardDatabase;
  }

  reply(parameters: string): Message {
    // @ts-ignore
    return oldReplyHandler.replyMessage(parameters, this.db).reply;
  }
}

type LegacyMealFormat = {
  Breakfast: Array<string>;
  Lunch: Array<string>;
  Dinner: Array<string>;
};

/**
 * Give a week overview
 * This version is using the old database api, hence the prefix
 */
export class LegacyWeekOverview implements IMessageHandler {
  private db: Record<string, LegacyMealFormat>;

  constructor(forwardDatabase: any) {
    this.db = forwardDatabase;
  }

  reply(parameters: string): Message {
    const now = moment().utcOffset(7);
    let date = now;

    if (now.hour() >= 19) {
      // Start the next day if the last meal is done
      date.add(1, "d");
    }

    // Each element of carousel is put here
    let menu = [];

    for (let day = 0; day < 7; day++) {
      // get the meal for this date
      let meal: LegacyMealFormat = this.db[date.format("M/D/YYYY")];

      // if it exists in database (more likely, it didn't failed)
      if (meal) {
        let result: FlexBubble = {
          type: "bubble",
          size: "micro",
          header: {
            type: "box",
            layout: "vertical",
            backgroundColor: "#fadadd",
            contents: [
              {
                type: "text",
                text: date.format("ddd D MMM"),
                align: "center",
                weight: "bold",
                size: "md",
              },
            ],
          },
          body: {
            type: "box",
            layout: "vertical",
            backgroundColor: "#e5edff",
            contents: [],
          },
        };

        // Formatting for each meal
        const formatMeal = (
          name: string,
          list: Array<string>
        ): Array<FlexComponent> => {
          let result: Array<FlexComponent> = [
            {
              type: "text",
              text: name,
              align: "center",
              weight: "bold",
              margin: "md",
            },
          ];

          for (let item of list) {
            result.push({
              type: "text",
              text: item,
              align: "center",
              gravity: "center",
            });
          }

          result.push({
            type: "separator",
            margin: "md",
            color: "#000000",
          });

          return result;
        };

        // For each meal, check if it exists, format and push to current carousel element
        if (meal.Breakfast) {
          result.body?.contents.push(
            ...formatMeal("Breakfast", meal.Breakfast)
          );
        }

        if (meal.Lunch) {
          result.body?.contents.push(...formatMeal("Lunch", meal.Lunch));
        }

        if (meal.Dinner) {
          result.body?.contents.push(...formatMeal("Dinner", meal.Dinner));
        }

        // push element to carousel
        if (
          result.body?.contents[result.body?.contents.length - 1].type ==
          "separator"
        ) {
          result.body?.contents.pop();
        }
        menu.push(result);
      }

      // iterate date
      date.add(1, "d");
    }

    if (menu.length === 0) {
      return {
        type: "text",
        text: "Unable to get your menu. Please try again later.",
      };
    }

    return {
      type: "flex",
      altText: "Menu Memo sent you this week's menu!",
      contents: {
        type: "carousel",
        contents: menu,
      },
    };
  }
}
