/**
 * Various router and handler for messages
 */

import { flexMessage, textMessage } from "./style.js";
import * as moment from "moment";
import * as line from '@line/bot-sdk';
import "./arrayRandom";

// Used to split by first whitespace
const firstWhitespaceSplitRegex = /^(\S*)\s*(.*)/m;

export interface IMessageHandler {
  reply(parameters: string): line.Message;
}

/**
 * Route message to appropriate handler
 */
export class MessageRouter implements IMessageHandler {
  private readonly routes: Record<string, IMessageHandler>;
  private readonly aliases: Record<string, Array<string>>;
  private readonly fallthroughHandler: IMessageHandler;

  constructor(routes: Record<string, IMessageHandler>,
              aliases: Record<string, Array<string>>,
              defaultHandler: IMessageHandler = new InvalidCommand()) {
    this.routes = routes;
    this.aliases = aliases;
    this.fallthroughHandler = defaultHandler;
  }

  /**
   * Give reply to user by forwarding to other handler, use fallthroughHandler if no match found
   * @param parameters is the message from the user
   * @returns reply to the user via line sdk
   */
  reply(parameters: string): line.Message {
    let parseSplit = firstWhitespaceSplitRegex.exec(parameters);

    if (parseSplit) {
      let currentCommand = parseSplit[1].toLowerCase();
      let forwardParameters = parseSplit[2];

      for (const [key, entries] of Object.entries(this.aliases)) {
        if (key in this.routes && currentCommand in entries) {
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
  private readonly replyMessages = [
    "🙄",
    "🤨",
    "😪",
    "จริงป่าววว",
    "🍉",
    "🥺",
    "เปนงง",
    "ม่ายเข้าจายย",
  ];

  reply(parameters: string): line.Message {
    return {
      type: "text",
      text: `${this.replyMessages.pickRandom()}\nลองพิมพ์ "help" ดูสิ`
    };
  }

}
