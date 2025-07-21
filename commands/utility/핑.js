const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('핑')
        .setDescription('퐁!'),
    async execute(interaction) {
        await interaction.reply('퐁!');
    },
};