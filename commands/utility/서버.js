const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    category: utility
    data: new SlashCommandBuilder()
        .setName('서버')
        .setDescription('서버 정보'),
    async execute(interaction) {
        // interaction.guild is the object representing the Guild in which the command was run
        await interaction.reply(`${interaction.guild.name} 서버는 ${interaction.guild.memberCount}명의 멤버가 있습니다.`);
    },
};