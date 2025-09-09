require('dotenv').config();
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const dayjs = require('dayjs');
const NEIS_API = process.env.NEIS_API;
const ATPT_OFCDC_SC_CODE = 'F10';
const SD_SCHUL_CODE = '7380292';

async function getMealData(date) {
    const url = `https://open.neis.go.kr/hub/mealServiceDietInfo?KEY=${NEIS_API}&Type=json&ATPT_OFCDC_SC_CODE=${ATPT_OFCDC_SC_CODE}&SD_SCHUL_CODE=${SD_SCHUL_CODE}&MLSV_YMD=${date}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.RESULT && data.RESULT.CODE !== 'INFO-000') {
            throw new Error(`API 오류: ${data.RESULT.MESSAGE}`);
        }

        const mealList = data.mealServiceDietInfo?.[1]?.row;
        if (!mealList) return null;

        // [{ MMEAL_SC_NM, DDISH_NM }, ...] 형태로 반환
        return mealList.map(x => ({
            name: x.MMEAL_SC_NM, // 조식 / 중식 / 석식
            menu: x.DDISH_NM.replace(/<br\/>/g, '\n')
        }));
    } catch (error) {
        throw new Error(`급식 데이터를 가져오는 중 오류 발생: ${error.message}`);
    }
}

module.exports = {
    category: '나이스',
    data: new SlashCommandBuilder()
        .setName('급식')
        .setDescription('급식을 출력합니다.'),
    async execute(interaction) {
        await interaction.deferReply();

        const today = dayjs().format('YYYYMMDD');
        const year = dayjs().format('YYYY');
        const month = dayjs().format('MM');
        const day = dayjs().format('DD');

        try {
            const meals = await getMealData(today);

            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle(`${year}년 ${month}월 ${day}일 급식`)
                .setTimestamp();

            if (meals && meals.length > 0) {
                meals.forEach(meal => {
                    embed.addFields({
                        name: meal.name, // 조식 / 중식 / 석식
                        value: meal.menu
                    });
                });
            } else {
                embed.setDescription('급식 정보가 없습니다.');
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
}
