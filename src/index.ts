import * as router from "./router";
import { Credentials } from "google-auth-library";
import * as winston from "winston";
import * as express from "express";
import { exit } from "process";
import * as line from "@line/bot-sdk";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.simple(),
  transports: [
    new winston.transports.File({ filename: "log.log" }),
    new winston.transports.Console(),
  ],
});

require("dotenv").config();

const { gsrun, client } = require("./sheet");
const { replyMessage } = require("./reply");

const app = express();
const port = process.env.PORT || 5000;

if (!process.env.access_token || !process.env.secret) {
  logger.error(
    "Process environment is missing credentials for line sdk client. Process will exit"
  );
  exit(1);
}

const lineConfig: line.Config = {
  channelAccessToken: process.env.access_token,
  channelSecret: process.env.secret,
};
const lineClient: line.Client = new line.Client(<line.ClientConfig>lineConfig);

(async () => {
  let db: any = {};

  try {
    const credential: Credentials = await client.authorize();
    db = await gsrun(client);
    logger.info("DB listed successful");
  } catch (err) {
    logger.error(err);
  }

  const messageRouter = new router.MessageRouter(
    {
      week: new router.LegacyWeekOverview(db),
    },
    {
      week: ["week", "wk", "summary", "sum", "overview"],
    },
    new router.LegacyPassthru(db)
  );

  const handleEvent = async (event: line.WebhookEvent) => {
    if (event.type !== "message" || event.message.type !== "text") {
      return null;
    }
    const msg = event.message.text;
    const userId = event.source.userId;
    const theReply = messageRouter.reply(msg);

    if (userId) {
      const profile = await lineClient.getProfile(userId);
      // logger.info(`[${new Date().toISOString()}] "${profile.displayName}" said ${msg}`);
      logger.info(`[${new Date().toISOString()}] "Someone" said ${msg}`);
    }

    return lineClient.replyMessage(event.replyToken, theReply);
  };

  app.get("/", (req: express.Request, res: express.Response) => {
    res.send("Running. . .");
  });

  app.post(
    "/webhook",
    line.middleware(<line.MiddlewareConfig>lineConfig),
    (req: express.Request, res: express.Response) => {
      Promise.all(req.body.events.map(handleEvent))
        .then((result) => res.json(result))
        .catch((err) => {
          logger.error(err);
          res.status(500).end();
        });
    }
  );

  app.get("/test/:cmd", (req: express.Request, res: express.Response) => {
    let cmd = req.params.cmd;
    if (!cmd) res.status(500).end();
    res.json(messageRouter.reply(cmd));
    res.status(200).end();
  });

  app.get("/api/:date", (req: express.Request, res: express.Response) => {
    let date = req.params.date.replace("-", "/").replace("-", "/");
    if (db[date] === undefined) res.json({ status: "Notfound" });
    else res.json(db[date]);
    res.status(200).end();
  });

  app.listen(port);
})();
