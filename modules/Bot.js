const { Telegraf } = require("telegraf");

const Bot = (() => {
  var instance;

  function Bot() {
    const bot = new Telegraf(process.env.BOT_TOKEN);
    return bot;
  }

  return {
    get: () => {
      if (!instance) {
        instance = new Bot();
        delete instance.constructor;
      }
      return instance;
    },
  };
})();
module.exports = {
  Bot,
};
