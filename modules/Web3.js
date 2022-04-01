require("dotenv").config();
const Web3 = require("web3");
const ABI = require("../ABI.json");
const { Bot } = require("./Bot");
const { ethers } = require("ethers");

const GROUP_TG_ID = process.env.GROUP_TG_ID;
const ADMIN_TG_ID = process.env.ADMIN_TG_ID;
const WEB3_PROVIDER = process.env.WEB3_PROVIDER;
const SMART_CONTRACT_ADDRESS = process.env.SMART_CONTRACT_ADDRESS;
const provider = new ethers.providers.JsonRpcProvider(WEB3_PROVIDER);

const ethersContract = new ethers.Contract(
  SMART_CONTRACT_ADDRESS,
  ABI,
  provider
);
const web3 = new Web3(WEB3_PROVIDER);
const Contract = (() => {
  var instance;

  function BetContract() {
    const contract = new web3.eth.Contract(ABI, SMART_CONTRACT_ADDRESS);
    return contract;
  }

  return {
    get: () => {
      if (!instance) {
        instance = new BetContract();
        delete instance.constructor;
      }
      return instance;
    },
  };
})();

const handleError = (err) => console.log(err);

// create two pair bet
const BookiesBooks = async (inputAddress) => {
  const response = await Contract.get()
    .methods.bookiesBooks(inputAddress)
    .call()
    .catch(handleError);
  return response;
};

const getOdds = async (bet_address) => {
  let B1TrueResult = [];
  let B1FalseResult = [];
  const odds = [0.01, 0.05, 0.1];
  B1TrueResult[0] = await web3.utils.fromWei(
    await Contract.get()
      .methods.getOdds(
        bet_address,
        web3.utils.toWei(odds[0] + "", "ether"),
        true
      )
      .call()
      .catch(handleError),
    "ether"
  );
  B1TrueResult[1] = await web3.utils.fromWei(
    await Contract.get()
      .methods.getOdds(
        bet_address,
        web3.utils.toWei(odds[1] + "", "ether"),
        true
      )
      .call()
      .catch(handleError),
    "ether"
  );
  B1TrueResult[2] = await web3.utils.fromWei(
    await Contract.get()
      .methods.getOdds(
        bet_address,
        web3.utils.toWei(odds[2] + "", "ether"),
        true
      )
      .call()
      .catch(handleError),
    "ether"
  );

  B1FalseResult[0] = await web3.utils.fromWei(
    await Contract.get()
      .methods.getOdds(
        bet_address,
        web3.utils.toWei(odds[0] + "", "ether"),
        false
      )
      .call()
      .catch(handleError),
    "ether"
  );
  B1FalseResult[1] = await web3.utils.fromWei(
    await Contract.get()
      .methods.getOdds(
        bet_address,
        web3.utils.toWei(odds[1] + "", "ether"),
        false
      )
      .call()
      .catch(handleError),
    "ether"
  );
  B1FalseResult[2] = await web3.utils.fromWei(
    await Contract.get()
      .methods.getOdds(
        bet_address,
        web3.utils.toWei(odds[2] + "", "ether"),
        false
      )
      .call()
      .catch(handleError),
    "ether"
  );

  return { isB1True: B1TrueResult, isB1False: B1FalseResult };
};
async function NewBook(event) {
  await Bot.get().telegram.sendMessage(
    GROUP_TG_ID,
    `New bet upcoming soon ...`
  );
  await Bot.get().telegram.sendMessage(ADMIN_TG_ID, `NewBook Event Adrres:`);
  await Bot.get().telegram.sendMessage(ADMIN_TG_ID, event);
  await Bot.get().telegram.sendMessage(ADMIN_TG_ID, "/start to set the Bet");
}
async function ClosedBook(bookie, winner) {
  await Bot.get().telegram.sendMessage(GROUP_TG_ID, `Bet ended ...`);
  
  const message = "Winner is: https://bscscan.com/address/" + web3.utils.toChecksumAddress(winner).toString();
  await Bot.get().telegram.sendMessage(GROUP_TG_ID, message);
  // FOR LATER UPDATE
  // SEND WINNER ADDRESS
}

ethersContract.on("NewBook", NewBook);
ethersContract.on("ClosedBook", ClosedBook);

module.exports = {
  BookiesBooks,
  getOdds,
};
