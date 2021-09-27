const { Telegraf, Markup } = require("telegraf");
require("dotenv").config();
const textHelp = require("./const");
const I18n = require("telegraf-i18n");
const path = require("path");
const { exempleJson } = require("./mirrors");
var index = 0;
const mongoose = require("mongoose");
const Links = require("./models/bot");

 let urlConnectDb = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@vidgitcluster.yzarw.mongodb.net/${process.env.COLLECTION_NAME}` 

mongoose
  .connect(urlConnectDb, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => console.log("in bd current"))
  .catch((err) => console.log(err));

//у нас тут будет описываться доступность тех или иных зеркал

const i18n = new I18n({
  directory: path.resolve(__dirname, "locales"),
  defaultLanguage: "rus",
  sessionName: "session",
  useSession: true,
});

//В этом месте я создаю инициализированные значения с link 0 , пока я придумал так что если пользователь просит следующую ссылку значит эта его не
//Устроила , запустил 1 раз и закомментировал чтобы была понятна логика в дальнейшем

// for(item of exempleJson){

//   const botTest = new Links({
//       link: Object.keys(item)[0],
//       counter: 0,
//     });

//   botTest.save();
// }

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
    let dataToUpdate = { link: Object.keys(exempleJson[index])[0] };
    let newValue = { $inc: { counter: 1 } };
    Links.updateOne(dataToUpdate, newValue, (err, res) => {
      if (err) throw err;
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
