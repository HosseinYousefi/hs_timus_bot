import Telegraf, { Markup } from "telegraf";
import axios from "axios";
import { exec } from "child_process";
const LocalSession = require("telegraf-session-local");

const { NODE_ENV } = process.env;

if (NODE_ENV !== "production") require("dotenv").config();

const { TELEGRAM_TOKEN, SERVER_URL } = process.env;

if (!TELEGRAM_TOKEN) {
  throw new Error("Telegram token is not defined.");
}

const bot = new Telegraf(TELEGRAM_TOKEN);
const localSession = new LocalSession();

axios.defaults.baseURL = "https://app.clickup.com/api/v2";
axios.defaults.headers.post["Content-Type"] = "application/json";

let ids = [
  140391,
  308410,
  308486,
  308487,
  308485
]

bot.use(localSession.middleware());

bot.start(async (ctx) => {
  ctx.replyWithMarkdown(
    `How many timus problems did everyone solve?`
  );
});

bot.on('text', (ctx) => {
  let answer = "";
  for (let id in ids) {
    exec(`curl -s https://timus.online/author.aspx\?id\=${id} | sed -E "s/.*author_name\">([a-zA-Z ]+)<.*>([0-9]+) out of 1148<.*/\1: \2/g"`,
    (err, stdout, stderr) => {
      answer += stdout;
    });
  }
  ctx.reply(answer);
})

bot.launch()