const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    category: 'neis',
    data: new SlashCommandBuilder()
        .setName('급식')
        .setDescription('급식을 불러옵니다.'),
    async execute(interaction) {
        const select = new StringSelectMenuBuilder()
            .setCustomId('ㅁㄴㅇㄹ')
            .setPlaceholder('qwer')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('조식')
                    .setDescription('조식')
                    .setValue('breakfast'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('중식')
                    .setDescription('중식')
                    .setValue('lunch'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('석식')
                    .setDescription('석식')
                    .setValue('dinner'),
            );

        const row = new ActionRowBuilder()
            .addComponents(select);

        await interaction.reply({
           content: '와우',
            components: [row],
        });
    },
};