const { Scenes, Markup } = require("telegraf");
const { Bets } = require("../modules/Bet");
const { BookiesBooks } = require("../modules/Web3");

const handleError = async (err, ctx) => {
  console.log(err);
  await ctx.reply(`Error blockchain not response`);
  await ctx.scene.leave();
  return await ctx.scene.enter("betsScene");
};

// addBetWizard
const addBetWizard = new Scenes.WizardScene(
  "add-bet-wizard",

  async (ctx) => {
    ctx.wizard.state.data = {};
    ctx.wizard.state.data.bet = {};
    ctx.wizard.state.data.betA = {};
    ctx.wizard.state.data.betB = {};

    ctx.reply("Enter address of Bookie for newBook");
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.wizard.state.data.bet.address = await ctx.message.text;
    await ctx.reply("Please Wait");
    const bookiesBooks = await BookiesBooks(
      ctx.wizard.state.data.bet.address
    ).catch((err) => handleError(err, ctx));
    if (!bookiesBooks) return handleError("empty response", ctx);

    ctx.wizard.state.data.betA.address = bookiesBooks.bet1;
    ctx.wizard.state.data.betB.address = bookiesBooks.bet2;

    ctx.wizard.state.data.bet.name = await ctx.message.text;
    await ctx.reply("Enter Bet Name");
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.wizard.state.data.bet.name = await ctx.message.text;
    await ctx.reply("Enter OptiionName A:");
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.wizard.state.data.betA.name = await ctx.message.text;
    await ctx.reply("Enter OptiionName B:");
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.wizard.state.data.betB.name = ctx.message.text;
    Bets.add(
      ctx.wizard.state.data.bet.address,
      ctx.wizard.state.data.bet.name,
      ctx.wizard.state.data.betA.address,
      ctx.wizard.state.data.betA.name,
      ctx.wizard.state.data.betB.address,
      ctx.wizard.state.data.betB.name
    );
    await ctx.reply(`Bet Added`);
    await ctx.scene.leave();
    return await ctx.scene.enter("betsScene");
  }
);

// removeBetWizard
const removeBetWizard = new Scenes.WizardScene(
  "remove-bet-wizard",
  async (ctx) => {
    await ctx.reply(
      "Are you sure delete this bet?",
      Markup.keyboard([["Yes", "No"]])
        .oneTime()
        .resize()
    );
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (ctx.message.text !== "Yes") {
      await ctx.reply("Canceled");
      await ctx.scene.leave();
      return await ctx.scene.enter("betsScene");
    }
    Bets.remove();
    await ctx.reply("Bet removed.");
    await ctx.scene.leave();
    return await ctx.scene.enter("betsScene");
  }
);

// adminScene
const adminScene = new Scenes.BaseScene("adminScene");
adminScene.enter((ctx) =>
  ctx.reply(
    "Admin Panel",
    Markup.keyboard([["Bets"]])
      .oneTime()
      .resize()
  )
);
adminScene.hears("Bets", (ctx) => {
  ctx.scene.enter("betsScene");
});

adminScene.hears("🔥 Start Bet 🔥", (ctx) => {
  ctx.reply("🔊 Event sended to all subscribers.");
});

// setAddressScene
const setAddressScene = new Scenes.BaseScene("setAddressScene");
setAddressScene.enter((ctx) => ctx.reply("Send address : "));
setAddressScene.leave((ctx) => ctx.reply("exiting setAddressScene scene"));
setAddressScene.command("back", (ctx) => {
  ctx.scene.enter("adminScene");
});
setAddressScene.on("text", (ctx) => {
  ctx.reply("setAddressScene: ✅ Setup completed");
  ctx.scene.enter("adminScene");
});
setAddressScene.on("message", (ctx) => ctx.reply("Only text messages please"));

// betsScene
const betsScene = new Scenes.BaseScene("betsScene");
betsScene.enter((ctx) =>
  ctx.replyWithHTML(
    ` 
${
  Bets.get() !== undefined && Object.keys(Bets.get()).length !== 0
    ? `Current Bet:
    
name: ${Bets.get().bet_name}

option name: ${Bets.get().name_a}
address: <code>${Bets.get().address_a}</code>

option name: ${Bets.get().name_b}
address: <code>${Bets.get().address_b}</code>
    `
    : "There is currently no Bet"
}`,
    Markup.keyboard([["Add", "Remove"], ["Back"]])
      .oneTime()
      .resize()
  )
);
betsScene.hears("Back", (ctx) => {
  ctx.scene.enter("adminScene");
});
betsScene.hears("Add", (ctx) => {
  ctx.scene.enter("add-bet-wizard");
});
betsScene.hears("Remove", (ctx) => {
  ctx.scene.enter("remove-bet-wizard");
});

module.exports = {
  adminScene,
  setAddressScene,
  betsScene,
  addBetWizard,
  removeBetWizard,
};
