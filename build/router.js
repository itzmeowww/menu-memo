"use strict";
/**
 * Various router and handler for messages
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LegacyWeekOverview = exports.LegacyPassthru = exports.StaticTextReplyCommand = exports.InvalidCommand = exports.MessageRouter = void 0;
const moment = require("moment");
require("./arrayRandom");
const oldReplyHandler = require("./reply");
// Used to split by first whitespace
const firstWhitespaceSplitRegex = /^(\S*)\s*(.*)/m;
/**
 * Route message to appropriate handler
 */
class MessageRouter {
    /**
     * @param routes map of command name to its handler
     * @param aliases map of command name to the uer input which invoke said command
     * @param fallthroughHandler handle messages with no command, parameters are directly forwarded with no processing
     */
    constructor(routes, aliases, fallthroughHandler = new InvalidCommand()) {
        this.routes = routes;
        this.aliases = {};
        for (const [key, entries] of Object.entries(aliases)) {
            this.aliases[key] = entries.map(i => i.toLowerCase().trim());
        }
        this.fallthroughHandler = fallthroughHandler;
    }
    /**
     * Give reply to user by forwarding to other handler, use fallthroughHandler if no match found
     * @param parameters is the message from the user
     * @returns reply to the user via line sdk
     */
    reply(parameters) {
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
exports.MessageRouter = MessageRouter;
/**
 * Default handler for invalid command
 */
class InvalidCommand {
    constructor() {
        this.replyMessages = [
            "🙄",
            "🤨",
            "😪",
            "จริงป่าววว",
            "🍉",
            "🥺",
            "เปนงง",
            "ม่ายเข้าจายย",
        ];
    }
    reply(parameters) {
        return {
            type: "text",
            text: `${this.replyMessages.pickRandom()}\nลองพิมพ์ "help" ดูสิ`
        };
    }
}
exports.InvalidCommand = InvalidCommand;
/**
 * Reply with a static (unchanging) text regardless of what is said
 */
class StaticTextReplyCommand {
    constructor(replyMessage) {
        this.replyMessage = replyMessage;
    }
    reply(parameters) {
        return {
            type: "text",
            text: this.replyMessage
        };
    }
}
exports.StaticTextReplyCommand = StaticTextReplyCommand;
/**
 * Forward to the old reply handler so that we don't have to rewrite them (for now)
 */
class LegacyPassthru {
    constructor(forwardDatabase) {
        this.db = forwardDatabase;
    }
    reply(parameters) {
        // @ts-ignore
        return oldReplyHandler.replyMessage(parameters, this.db).reply;
    }
}
exports.LegacyPassthru = LegacyPassthru;
/**
 * Give a week overview
 * This version is using the old database api, hence the prefix
 */
class LegacyWeekOverview {
    constructor(forwardDatabase) {
        this.db = forwardDatabase;
    }
    reply(parameters) {
        var _a, _b, _c;
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
            let meal = this.db[date.format("M/D/YYYY")];
            // if it exists in database (more likely, it didn't failed)
            if (meal) {
                let result = {
                    type: "bubble",
                    size: "micro",
                    header: {
                        type: "box",
                        layout: "vertical",
                        backgroundColor: "#fecece",
                        contents: [
                            {
                                type: "text",
                                text: date.format("dddd D/MM"),
                                align: "center",
                                weight: "bold",
                                size: "xl",
                            },
                        ],
                    },
                    body: {
                        type: "box",
                        layout: "vertical",
                        backgroundColor: "#e5edff",
                        contents: [],
                    }
                };
                // Formatting for each meal
                const formatMeal = (name, list) => {
                    let result = [{
                            type: "text",
                            text: name,
                            align: "center",
                            weight: "bold",
                            margin: "md",
                        }];
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
                    (_a = result.body) === null || _a === void 0 ? void 0 : _a.contents.push(...formatMeal("Breakfast", meal.Breakfast));
                }
                if (meal.Lunch) {
                    (_b = result.body) === null || _b === void 0 ? void 0 : _b.contents.push(...formatMeal("Lunch", meal.Lunch));
                }
                if (meal.Dinner) {
                    (_c = result.body) === null || _c === void 0 ? void 0 : _c.contents.push(...formatMeal("Dinner", meal.Dinner));
                }
                // push element to carousel
                menu.push(result);
            }
            // iterate date
            date.add(1, "d");
        }
        return {
            type: "flex",
            altText: "Menu Memo sent you this week's menu!",
            contents: {
                type: "carousel",
                contents: menu,
            }
        };
    }
}
exports.LegacyWeekOverview = LegacyWeekOverview;
//# sourceMappingURL=router.js.map