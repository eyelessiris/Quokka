const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const dayjs = require('dayjs');
const NEIS_API_KEY = '8b9a7f9297914e9581120a991c035028';
const ATPT_OFCDC_SC_CODE = 'F10';
const SD_SCHUL_CODE = '7380292';

async function getMealData(date, mealCode) {
    const url = `https://open.neis.go.kr/hub/mealServiceDietInfo?KEY=${NEIS_API_KEY}&Type=json&ATPT_OFCDC_SC_CODE=${ATPT_OFCDC_SC_CODE}&SD_SCHUL_CODE=${SD_SCHUL_CODE}&MLSV_YMD=${date}&MMEAL_SC_CODE=${mealCode}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        // 에러 및 데이터 확인
        if (data.RESULT && data.RESULT.CODE !== 'INFO-000') {
            throw new Error(`API 오류: ${data.RESULT.MESSAGE}`);
        }

        // 급식 정보 파싱
        const mealList = data.mealServiceDietInfo?.[1]?.row;
        if (!mealList) return null;

        // 급식 문자열 합치기 (메뉴명은 공백으로 나누어져 있으니, \n으로 줄바꿈)
        return mealList.map(x => x.DDISH_NM.replace(/<br\/>/g, '\n')).join('\n');
    } catch (error) {
        throw new Error(`급식 데이터를 가져오는 중 오류 발생: ${error.message}`);
    }
}

module.exports = {
    category: 'neis',
    data: new SlashCommandBuilder()
        .setName('급식')
        .setDescription('급식을 불러옵니다.')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('급식을 선택하세요.')
                .setRequired(true)
                .addChoices(
                    { name: '조식', value: '1' },
                    { name: '중식', value: '2' },
                    { name: '석식', value: '3' }
                )
        ),
    async execute(interaction) {
        await interaction.deferReply(); // API 호출이 오래 걸릴 수 있으므로 deferReply 사용

        const mealCode = interaction.options.getString('type');
        const mealNames = { '1': '조식', '2': '중식', '3': '석식' };
        const mealName = mealNames[mealCode];
        const today = dayjs().format('YYYYMMDD');
        const year = dayjs().format('YYYY');
        const month = dayjs().format('MM');
        const day = dayjs().format('DD');

        try {
            const mealData = await getMealData(today, mealCode);

            // Embed 생성
            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle(`${year}년 ${month}월 ${day}일 ${mealName}`)
                .setTimestamp();

            if (mealData) {
                embed.setDescription(mealData);
            } else {
                embed.setDescription(`${mealName} 정보가 없습니다.`);
            }

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('오류 발생')
                .setDescription(error.message)
                .setTimestamp();

            await interaction.editReply({ embeds: [errorEmbed] });
        }
    }
};