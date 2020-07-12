const { isInStr } = require("./utils.js");
const { flexMessage, textMessage } = require("./style.js");
const moment = require("moment");

// Used to split by first whitespace
const firstWhitespaceSplitRegex = /^(\S*)\s*(.*)/m;

/**
 * Top level message router
 */
class MessageRouter {
  constructor(routes, alias) {
    this.routes = routes; // Map<string, CommandProcessor> of command to destination processor
    this.alias = alias; // Map<string, Array<string>> of aliases to the same command
  }

  /**
   * Process the top level message, generate and return the appropriate reply
   * @param {string} message of the message from the user
   * @returns reply given directly to linesdk
   */
  reply(message) {
    let parseSplit = firstWhitespaceSplitRegex.exec(message);

    if (parseSplit) {
      let currentCommand = parseSplit[1];
      let forwardParameters = parseSplit[2];

      for (const [key, entries] of Object.entries(this.alias)) {
        if (key in this.routes && isInStr(currentCommand, entries)) {
          return this.routes[key].generateReply(forwardParameters);
        }
      }
    }

    // TODO: Regression: add easter eggs back
    return textMessage("Try \'help\' to get a list of commands.")
  }
}

class GetCurrentMenu {
  constructor(database) {
    this.database = database;
  }

  generateReply(parameters) {
    const now = moment().utcOffset(7);
    let date = now;
    let tomorrowQuery = false;

    // If it is passed 19:00, give menu for next day instead
    if (now.hour() > 19) {
      date = now.add(1, "d");
      tomorrowQuery = true;
    }

    // TODO: Replace with proper service
    let menu = this.database[date.format("M/D/YYYY")];

    if (!menu) {
      return textMessage("Unable to get menu");
    }

    let meals = {
      "breakfast": [...menu["Breakfast"]],
      "lunch": [...menu["Lunch"]],
      "dinner": [...menu["Dinner"]],
    };

    return flexMessage(
      `[${date.format("ddd")}] ${date.format("D MMM YYYY")} ${tomorrowQuery ? " (tomorrow)" : ""})`,
      meals
    );
  }
}

module.exports = {
  MessageRouter, GetCurrentMenu
}