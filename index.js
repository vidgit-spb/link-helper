const { Telegraf, Markup } = require("telegraf");
require("dotenv").config();
const textHelp = require("./const");
var index = 0;
//у нас тут будет описываться доступность тех или иных зеркал
const exempleJson = [
  {"google.com": true},
  {"yandex.ru": true},
  {"youtube.com": true}
  {"vkontake.ru": false},
  {}
];


const findItemToShow = (curIndex, objectToFind) =>{
     if (curIndex >=objectToFind.length) {
         console.error('Недопустимое занчение индекса');
     } else {
        let currentLink = exempleJson[curIndex];
        console.log(curIndex);
        if(Object.values(currentLink)[0]){
            return Object.keys(currentLink)[0]
        } else {
            findItemToShow(index + 1, objectToFind);
        }
     }
}
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply());
bot.help((ctx) => ctx.reply(textHelp.commands));

bot.command("getLink", async (ctx) => {
  try {
    await ctx.replyWithHTML(
      `<b> ${findItemToShow(index, exempleJson)} </b>`,
      Markup.inlineKeyboard([
        [Markup.button.callback("Заменить ссылку", "btn_2")],
      ])
    );
  } catch (e) {
    console.error(e);
  }
});

bot.action('btn_2', async ctx => {
    
    try {
        await ctx.answerCbQuery()
        await ctx.replyWithHTML(`<b> ${findItemToShow(index + 1, exempleJson)} </b>`,
        Markup.inlineKeyboard([
            [Markup.button.callback("Заменить ссылку", "btn_2")],
          ]))
        disable_web_page_preview: true
    }
    catch (e) {
        console.error(e)
    }
})

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
