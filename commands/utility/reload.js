const { SlashCommandBuilder } = require('discord.js');
const path = require('node:path');
const fs = require('node:fs');

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Reloads a command.')
        .addStringOption(option =>
            option.setName('command')
                .setDescription('The command to reload.')
                .setRequired(true)
        ),
    async execute(interaction) {
        if (interaction.user.id !== '607797808329916447') {
            return await interaction.reply({ content: '❌ You are not authorized to use this command.', ephemeral: true });
        }

        const commandName = interaction.options.getString('command', true).toLowerCase();
        const command = interaction.client.commands.get(commandName);

        if (!command) {
            return await interaction.reply({ content: `❌ No command named \`${commandName}\` found.`, ephemeral: true });
        }

        // commands 폴더 내 모든 하위 디렉토리 검색
        const commandsDir = path.join(__dirname, '..');
        let commandPath;

        const folders = fs.readdirSync(commandsDir);
        for (const folder of folders) {
            const fullPath = path.join(commandsDir, folder, `${commandName}.js`);
            if (fs.existsSync(fullPath)) {
                commandPath = fullPath;
                break;
            }
        }

        if (!commandPath) {
            return await interaction.reply({ content: `❌ Could not find the file for command \`${commandName}\`.`, ephemeral: true });
        }

        try {
            delete require.cache[require.resolve(commandPath)];
            const newCommand = require(commandPath);

            if (!newCommand.data || !newCommand.execute) {
                return await interaction.reply({ content: '❌ The new command is missing required properties (`data`, `execute`).', ephemeral: true });
            }

            interaction.client.commands.set(newCommand.data.name, newCommand);
            await interaction.reply({ content: `✅ Command \`${newCommand.data.name}\` reloaded successfully.`, ephemeral: true });
        } catch (error) {
            console.error(`❌ Failed to reload ${commandName}:`, error);
            await interaction.reply({ content: `❌ Failed to reload command \`${commandName}\`:\n\`${error.message}\``, ephemeral: true });
        }
    },
};
