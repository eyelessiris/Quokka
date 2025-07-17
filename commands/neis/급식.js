const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    category: 'neis',
    data: new SlashCommandBuilder()
        .setName('급식')
        .setDescription('급식을 불러옵니다.')
        .addStringOption(option =>
            option.setName('number')
                .setDescription('숫자를 선택하세요')
                .setRequired(true)
                .addChoices(
                    { name: '조식', value: '1' },
                    { name: '중식', value: '2' },
                    { name: '석식', value: '3' }
                )
        ),
    async execute(interaction) {
        const meal = interaction.options.getString('number');

        let message = '';
        switch (meal) {
            case '1':
                message = '조식';
                break;
            case '2':
                message = '중식';
                break;
            case '3':
                message = '석식';
                break;
        }

        await interaction.reply(message);
    }
};