const mockdate = require("mockdate");
const moment = require("moment");

const { GetCurrentMenu, MessageRouter } = require("../router.js");

describe("MessageRouter", () => {
  let messageRouter;

  beforeAll(()=>{
    let mockDatabase = {
      "1/1/2069": {
        "Breakfast": ["CocoCrunch(tm) Cereal", "Milk", "Coffee from Vending Machine"],
        "Lunch": ["ไข่ระเบิด", "กองขยะปรุงรส", "Dihydrogen Monoxide"],
        "Dinner": []
      },
      "1/2/2069": {
        "Breakfast": ["MaiMeeAraiKinWoi"],
        "Lunch": ["หิวจะตายแล้ว"],
        "Dinner": ["หญ้า"]
      }
    };

    let getCurrentMenu = new GetCurrentMenu(mockDatabase);

    let routes = {
      "menu": getCurrentMenu,
    }

    let aliases = {
      "menu": ["menu", "เมนู"]
    }

    messageRouter = new MessageRouter(routes, aliases);
  });

  test("no command", () => {
    let reply = messageRouter.reply("");
    expect(reply.type).toEqual("text");
  });

  describe("menu", () => {
    test("before 1pm", () => {
      mockdate.set(moment("2069-01-01T18").toDate());
      let reply = messageRouter.reply("menu");
      expect(reply.type).toEqual("flex");
      let replyString = JSON.stringify(reply);
      expect(replyString).toEqual(expect.stringContaining("CocoCrunch(tm) Cereal"));
    });

    test("after 1pm", () => {
      mockdate.set(moment("2069-01-01T20").toDate());
      let reply = messageRouter.reply("menu");
      expect(reply.type).toEqual("flex");
      let replyString = JSON.stringify(reply);
      expect(replyString).toEqual(expect.stringContaining("หญ้า"));
    });

    test("not in database", ()=>{
      mockdate.set(moment("2069-01-02T20").toDate());
      let reply = messageRouter.reply("menu");
      expect(reply.type).toEqual("text");
    });
  });
})