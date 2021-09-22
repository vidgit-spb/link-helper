const { Telegraf, Markup } = require("telegraf");
require("dotenv").config();
const textHelp = require("./const");
const I18n = require("telegraf-i18n");
const path = require("path");
var index = 0;
//у нас тут будет описываться доступность тех или иных зеркал
const exempleJson = [
  { "google.com": true },
  { "yandex.ru": true },
  { "youtube.com": true },
  { "vkontake.ru": false },
];
const i18n = new I18n({
  directory: path.resolve(__dirname, "locales"),
  defaultLanguage: "rus",
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
    console.log(curIndex);
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
})

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
