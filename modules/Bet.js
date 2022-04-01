let betList;

class Bet {
  constructor(
    _bet_address,
    _bet_name,
    _address_a,
    _name_a,
    _address_b,
    _name_b
  ) {
    this.bet_address = _bet_address;
    this.bet_name = _bet_name;

    this.address_a = _address_a;
    this.name_a = _name_a;

    this.address_b = _address_b;
    this.name_b = _name_b;
  }
}

const Bets = {
  add: (
    _bet_address,
    _bet_name,

    _address_a,
    _name_a,
    _address_b,
    _name_b
  ) => {
    const bet = new Bet(
      _bet_address,
      _bet_name,
      _address_a,
      _name_a,
      _address_b,
      _name_b
    );
    betList = bet;
    return betList;
  },
  remove: () => {
    betList = undefined;
    return betList;
  },
  get: () => {
    return betList;
  },
};

module.exports = {
  Bets,
};
