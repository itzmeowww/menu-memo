import * as mockdate from "mockdate";
import * as moment from "moment";
import { MessageRouter } from "../src/router";

describe("MessageRouter", () => {
  let messageRouter: MessageRouter;

  beforeAll(() => {
    let routes = {};
    let aliases = {};

    messageRouter = new MessageRouter(routes, aliases);
  });

  test("empty command", () => {
    let reply = messageRouter.reply("");
    let replyJSON = JSON.stringify(reply);
    expect(reply.type).toEqual("text");
    expect(replyJSON).toEqual(expect.stringContaining("help"));
  });

  test("invalid command", () => {
    let reply = messageRouter.reply("¯\\_(ツ)_/¯");
    let replyJSON = JSON.stringify(reply);
    expect(reply.type).toEqual("text");
    expect(replyJSON).toEqual(expect.stringContaining("help"));
  });
})