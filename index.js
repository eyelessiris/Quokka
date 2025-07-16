require('dotenv').config();

const { Client, Events, GatewayIntentBits } = require('discord.js');
const token = process.env.TOKEN;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, readyClient => {
    console.log(`Operating as '${readyClient.user.tag}. Ready!`);
});

client.login(token);