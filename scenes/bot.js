require("dotenv").config();
const ProxyAgent = require("proxy-agent");
const { Telegraf } = require("telegraf");

const proxy = process.env.SOCKS_PROXY;
const agent = new ProxyAgent(proxy);

const bot = new Telegraf(process.env.BOT_TOKEN, {
  telegram: { agent: agent },
});

module.exports = {
  bot,
};
