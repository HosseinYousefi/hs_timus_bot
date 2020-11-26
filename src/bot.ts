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

let students = [
  {name: 'Hossein Yousefi', id: 140391, telegram: 'uhossein'},
  {name: 'Ilya Yarmolkevich', id: 308410, telegram: 'yarilo2607'},
  {name: 'Maksym Oboznyi', id: 308486, telegram: 'oboznyi'},
  {name: 'Artem Plotkin', id: 308487, telegram: 'artemrox'},
  {name: 'Anier Velasco Sotomayor', id: 308485, telegram: 'aniervs'}
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

  for (let i = 0; i < students.length; i++) {
    exec('curl -s https://timus.online/author.aspx\\?id\\=' + students[i].id + ' | sed -E "s/.*>([0-9]+) out of 1148<.*/\\1/g"',
    (err, stdout, stderr) => {
      let score = parseInt(stdout);
      ++count;
      if (stdout.length < 100) {
        answer.push({score: score, name: students[i].name, telegram: students[i].telegram});
      }
      if (count == students.length) {
        answer.sort((a, b) => b.score - a.score);
        console.log(answer);
        let result = '';
        for (let i = 0; i < answer.length; i++) {
          result += `${i+1}. [${answer[i].name}](https://telegram.me/${answer[i].telegram}): *${answer[i].score}*\n`;
        }
        ctx.replyWithMarkdown(result, {disable_web_page_preview: true});
      }
    });
  }
});

bot.launch()