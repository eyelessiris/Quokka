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
            // commands 객체 초기화
            client.commands.clear();

            // commands 폴더 내 하위 폴더 모두 탐색
            const folders = fs.readdirSync(commandsDir).filter(f => fs.statSync(path.join(commandsDir, f)).isDirectory());

            for (const folder of folders) {
                const commandsPath = path.join(commandsDir, folder);
                const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

                for (const file of commandFiles) {
                    const filePath = path.join(commandsPath, file);

                    // 캐시 삭제
                    delete require.cache[require.resolve(filePath)];

                    // 새로 require
                    const command = require(filePath);

                    // 필수 프로퍼티 확인 후 등록
                    if ('data' in command && 'execute' in command) {
                        command.category = folder; // 카테고리 저장
                        command.path = filePath;   // 경로 저장 (optional)
                        client.commands.set(command.data.name, command);
                    } else {
                        console.warn(`[WARN] Command at ${filePath} is missing required "data" or "execute" property.`);
                    }
                }
            }

            await interaction.reply({ content: `명령어 다시 불러오기 성공`, ephemeral: true });
        } catch (error) {
            console.error('Failed to reload commands:', error);
            await interaction.reply({ content: `명령어 다시 불러오기 실패:\n\`${error.message}\``, ephemeral: true });
        }
    },
};
