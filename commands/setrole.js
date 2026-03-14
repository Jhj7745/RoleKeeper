const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setrole')
        .setDescription('역할 시스템 관리 대시보드'),
    async execute(interaction) {
        if (!interaction.member.permissions.has('Administrator')) {
            await interaction.reply({ content: '❌ 이 명령어는 관리자만 사용할 수 있습니다.', flags: 64 });
            return;
        }

        const data = JSON.parse(fs.readFileSync('./bot_data.json', 'utf8'));
        const roleList = (data.roles || []).map(r => `• ${r.name} : ${r.emoji}`).join('\n') || '없음';

        const embed = new EmbedBuilder()
            .setTitle('⚙️ 역할 시스템 관리 대시보드')
            .addFields(
                { name: '📋 현재 역할 목록', value: roleList, inline: false },
                { name: '💬 안내 메시지', value: data.mainMessage || '설정된 메시지가 없습니다.', inline: false }
            )
            .setColor(0x2b2d31);

        const row1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('addRole_btn').setLabel('역할 추가').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('setMessage_btn').setLabel('메시지 설정').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('deleteRole_btn').setLabel('역할 삭제').setStyle(ButtonStyle.Danger)
        );

        const row2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('finalize_btn').setLabel('설정 완료 및 전송').setStyle(ButtonStyle.Primary)
        );

        const response = await interaction.reply({ 
            embeds: [embed], 
            components: [row1, row2], 
            withResponse: true
        });
        
        data.dashboardMessageId = response.resource.message.id;
        data.dashboardChannelId = interaction.channelId;
        fs.writeFileSync('./bot_data.json', JSON.stringify(data, null, 2));
    },
};