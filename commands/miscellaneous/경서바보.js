const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('경서바보')
        .setDescription('그야 주경서는 바보니까요.'),
    async execute(interaction) {
        await interaction.reply(`야 주경서 <@764441094413877259> ${interaction.user.displayName}이(가) 너 바보래ㅋ`);
    },
};