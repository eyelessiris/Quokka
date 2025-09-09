const { SlashCommandBuilder, time, TimestampStyles} = require('discord.js');
const date = new Date();
const timeString = time(date);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('시간')
        .setDescription('시간을 출력합니다.'),
    async execute(interaction) {
        await interaction.reply(`지금 시간은 ${timeString} 입니다.`);
    }
}