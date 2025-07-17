const { SlashCommandBuilder } = require('discord.js');
const path = require('node:path');
const fs = require('node:fs');

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('불러오기')
        .setDescription('명령어를 다시 불러옵니다.'),
    async execute(interaction) {
        if (interaction.user.id !== '607797808329916447') {
            return await interaction.reply({ content: '권한이 없습니다.', ephemeral: true });
        }

        const commandsDir = path.join(__dirname, '..');
        const client = interaction.client;

        try {
            client.commands.clear();

            const folders = fs.readdirSync(commandsDir).filter(f => fs.statSync(path.join(commandsDir, f)).isDirectory());

            for (const folder of folders) {
                const commandsPath = path.join(commandsDir, folder);
                const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

                for (const file of commandFiles) {
                    const filePath = path.join(commandsPath, file);

                    delete require.cache[require.resolve(filePath)];

                    const command = require(filePath);

                    if ('data' in command && 'execute' in command) {
                        command.category = folder;
                        command.path = filePath;
                        client.commands.set(command.data.name, command);
                    } else {
                        console.warn(`[WARN] Command at ${filePath} is missing required "data" or "execute" property.`);
                    }
                }
            }

            await interaction.reply({ content: `명령어 다시 불러오기 성공.`, ephemeral: true });
        } catch (error) {
            console.error('Failed to reload commands:', error);
            await interaction.reply({ content: `명령어 다시 불러오기 실패:\n\`${error.message}\``, ephemeral: true });
        }
    },
};
