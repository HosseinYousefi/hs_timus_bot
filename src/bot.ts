import Telegraf, { Markup } from "telegraf";
import axios from "axios";
import { exec } from "child_process";
const LocalSession = require("telegraf-session-local");

const { NODE_ENV } = process.env;

if (NODE_ENV !== "production") require("dotenv").config();

const { TELEGRAM_TOKEN } = process.env;

if (!TELEGRAM_TOKEN) {
  throw new Error("Telegram token is not defined.");
}

const bot = new Telegraf(TELEGRAM_TOKEN);
const localSession = new LocalSession();

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

bot.command('tellme', (ctx) => {
  let answer = [];
  let count = 0;

  for (let i = 0; i < ids.length; i++) {
    exec('curl -s https://timus.online/author.aspx\\?id\\=' + ids[i] + ' | sed -E "s/.*author_name\\">([a-zA-Z ]+)<.*>([0-9]+) out of 1148<.*/\\1-\\2/g"',
    (err, stdout, stderr) => {
      let name = stdout.slice(0, stdout.search('-'));
      let score = parseInt(stdout.slice(stdout.search('-')+1, stdout.length));
      ++count;
      if (stdout.length < 100) {
        answer.push({score, name});
      }
      if (count == ids.length) {
        answer.sort((a, b) => b.score - a.score);
        console.log(answer);
        let result = '';
        for (let i = 0; i < answer.length; i++) {
          result += answer[i].score + ': ' + answer[i].name + '\n';
        }
        ctx.reply(result);
      }
    });
  }
});

bot.launch()