const { table } = require("table");
const { Scenes } = require("telegraf");
const { Bets } = require("../modules/Bet");
const { getOdds } = require("../modules/Web3");

// userScene
const userScene = new Scenes.BaseScene("userScene");
userScene.enter(async (ctx) => {
  if (Bets.get() === undefined || Object.keys(Bets.get()).length === 0) {
    return await ctx.replyWithHTML("There is currently no active Bet");
  }

  await ctx.reply("please wait");
  try {
    const odds = await getOdds(Bets.get().bet_address);

    const tbl = [
      ["Odds", "0.01", "0.05", "0.1"],
      [
        Bets.get().name_a,
        parseFloat(odds?.isB1True[0]).toFixed(3),
        parseFloat(odds?.isB1True[1]).toFixed(3),
        parseFloat(odds?.isB1True[2]).toFixed(3),
      ],
      [
        Bets.get().name_b,
        parseFloat(odds?.isB1False[0]).toFixed(3),
        parseFloat(odds?.isB1False[1]).toFixed(3),
        parseFloat(odds?.isB1False[2]).toFixed(3),
      ],
    ];
    await ctx.replyWithHTML(`<pre>${table(tbl)}</pre>`);
    await ctx.replyWithHTML(`Current Bet:
  
name: ${Bets.get().bet_name}

option name: ${Bets.get().name_a}
address: <code>${Bets.get().address_a}</code>

option name: ${Bets.get().name_b}
address: <code>${Bets.get().address_b}</code>
      `);
  } catch (error) {
    return await ctx.replyWithHTML("This book is no longer active");
  }
});
userScene.command("back", userScene.leave);
userScene.hears("Refresh", (ctx) => {
  ctx.scene.enter("userScene");
});

module.exports = {
  userScene,
};
