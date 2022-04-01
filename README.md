# Telegram Bot Project

## Install Node.js:

Uubuntu:

```shell
sudo apt install nodejs
```

Arch:

```shell
sudo pacman -S nodejs
```

Windows:

download windows installer and setup
https://nodejs.org/en/download/current/

> Project tested with nodejs Version `17.7.1`

## Installing Dependencies:

in project folder run command:

```shell
npm install
```

## Setup Bot Config:

### **open and edit `.env` file:**

- `BOT_TOKEN` : Its telegram bot token you can create and get from Official Bot `@BotFather` at Telegram.

- `ADMIN_TG_ID` : Its admin id you can get from this bot `@RawDataBot` (its numbers)

- `GROUP_TG_ID` : Its groupe id you want bot send events to people `@RawDataBot` (its numbers maybe with negative sign)

- `WEB3_PROVIDER` : its web3 provider (already filled out with a default value)

- `SMART_CONTRACT_ADDRESS` : setup the smart contract address here (already filled out with a default value)

## Start Bot:

in project folder run command :

```shell
npm start
```

check the bot working by `/start` command in bot messages

## Notes:

- when you add bot on group you most set bot can read and write messages ( add full permission to bot without this bot cant send events to group)
