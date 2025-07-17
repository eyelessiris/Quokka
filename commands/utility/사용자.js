const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('사용자')
        .setDescription('사용자 정보'),
    async execute(interaction) {
        // interaction.user is the object representing the User who ran the command
        // interaction.member is the GuildMember object, which represents the user in the specific guild
        await interaction.reply(`이 명령어는 ${interaction.member.joinedAt}에 서버에 참가한 ${interaction.user.displayName}(${interaction.user.username})에 의해 실행되었습니다.`);
    },
};