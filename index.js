const { Telegraf, Markup } = require("telegraf");
const textHelp = require("./const");
const I18n = require("telegraf-i18n");
const path = require("path");
let mysql = require('mysql');
require("dotenv").config();
const { exempleJson } = require("./mirrors");
const { BOT_MYSQL_HOST, BOT_MYSQL_USER, BOT_MYSQL_PASSWORD, BOT_MYSQL_DATABASE } = process.env;

var index = 0;
let conectionToMysql = mysql.createConnection({
    host: BOT_MYSQL_HOST,
    user: BOT_MYSQL_USER,
    password: BOT_MYSQL_PASSWORD,
    database: BOT_MYSQL_DATABASE
}); 

const i18n = new I18n({
  directory: path.resolve(__dirname, "locales"),
  defaultLanguage: "ru",
  sessionName: "session",
  useSession: true,
});

const findItemToShow = (curIndex, objectToFind, ctx) => {
  if (curIndex >= objectToFind.length) {
    console.error("Недопустимое значение индекса");
  } else {
    let currentLink = exempleJson[curIndex];
    if (curIndex > 0) {
      index++;
    }
    if (Object.values(currentLink)[0]) {
      return Object.keys(currentLink)[0];
    } else {
      return findItemToShow(index + 1, objectToFind);
    }
  }
};
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(i18n.middleware());

bot.start((ctx) => ctx.reply());
bot.help((ctx) => ctx.reply(textHelp.commands));

bot.command("getLink", async (ctx) => {
  index = 0;
  try {
    await ctx.replyWithHTML(
      `<b> ${findItemToShow(0, exempleJson, ctx)} </b>`,
      Markup.inlineKeyboard([
        [Markup.button.callback(ctx.i18n.t("message"), "btn_2")],
      ])
    );
  } catch (e) {
    console.error(e);
  }
});

bot.action("btn_2", async (ctx) => {
  try {
    let sqlUpdate = `UPDATE tgBotDb.users SET count= 'count' + 1 WHERE link = ${Object.keys(exempleJson[index])[0]}`
    conectionToMysql.query(sqlUpdate, function (err, result) {
      if (err) throw err;
      console.log(result.affectedRows + " record(s) updated");
    });

    await ctx.answerCbQuery();
    await ctx.replyWithHTML(
      `<b> ${findItemToShow(index + 1, exempleJson, ctx)} </b>`,
      Markup.inlineKeyboard([
        [Markup.button.callback(ctx.i18n.t("message"), "btn_2")],
      ])
    );
    disable_web_page_preview: true;
  } catch (e) {
    console.error(e);
  }
});

bot.action("error", async (ctx) => {
  ctx.reply(ctx.i18n.t("error"));
});

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
