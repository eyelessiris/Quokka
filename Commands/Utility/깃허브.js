const { SlashCommandBuilder, time, TimestampStyles} = require('discord.js');
const date = new Date();
const timeString = time(date);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('깃허브')
        .setDescription('쿼카봇의 깃허브 리포지토리'),
    async execute(interaction) {
        await interaction.reply(`쿼카봇의 깃허브 리포지토리는 https://github.com/eyelessiris/Quokka 입니다.`);
    }
}