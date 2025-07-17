const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    category: miscellaneous
    data: new SlashCommandBuilder()
        .setName('와차차')
        .setDescription('와차차!!!'),
    async execute(interaction) {
        await interaction.reply(`# 와차차!!!!!`);
    },
};