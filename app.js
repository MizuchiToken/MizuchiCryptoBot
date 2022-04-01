require("dotenv").config();
const { Scenes, session } = require("telegraf");
const { Bot } = require("./modules/Bot");
const {
  adminScene,
  setAddressScene,
  betsScene,
  addBetWizard,
  removeBetWizard,
} = require("./scenes/admin");
const { userScene } = require("./scenes/user");

class Admin {
  constructor(_id, _address, _isActive) {
    this.id = _id;
    this.address = _address;
    this.isActive = _isActive;
  }
}

const admin = new Admin();
admin.id = process.env.ADMIN_TG_ID;

Bot.get().use((ctx, next) => {
  if (ctx?.message?.chat)
    ctx.state.isAdmin = ctx.message.chat.id == admin.id ? true : false;
  return next();
});

const stageBase = new Scenes.Stage([
  setAddressScene,
  userScene,
  adminScene,
  betsScene,
  addBetWizard,
  removeBetWizard,
]);

Bot.get().use(session());
Bot.get().use(stageBase.middleware());

Bot.get().start((ctx) => {
  if (ctx.state.isAdmin) {
    return ctx.scene.enter("adminScene");
  }
  ctx.scene.enter("userScene");
});

Bot.get().command("setup", (ctx) => {
  if (ctx.state.isAdmin) {
    return ctx.scene.enter("adminScene");
  }
  ctx.scene.enter("userScene");
});

Bot.get().launch();

// Enable graceful stop
process.once("SIGINT", () => Bot.get().stop("SIGINT"));
process.once("SIGTERM", () => Bot.get().stop("SIGTERM"));
