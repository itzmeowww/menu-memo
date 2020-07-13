import { MessageRouter, StaticTextReplyCommand } from "../src/router";

describe("MessageRouter", () => {
  let messageRouter: MessageRouter;

  beforeAll(() => {
    let routes = {
      "staticA": new StaticTextReplyCommand("AAAAA"),
      "staticB": new StaticTextReplyCommand("BBBBB")
    };
    let aliases = {
      "staticA": ["A", "aliasA"],
      "staticB": ["B", "aliasB"]
    };

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
    expect(reply.type == "text" && reply.text.includes("help")).toBeTruthy();
  });

  test("basic command", () => {
    let reply = messageRouter.reply("A");
    expect(reply.type === "text" && reply.text === "AAAAA").toBeTruthy();

    reply = messageRouter.reply("   B      ");
    expect(reply.type === "text" && reply.text === "BBBBB").toBeTruthy();

    reply = messageRouter.reply("aliasB   \n parameter");
    expect(reply.type === "text" && reply.text === "BBBBB").toBeTruthy();
  });
});
