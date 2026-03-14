const fs = require('fs');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    customId: 'deleteRole_modal',
    async execute(interaction) {
        if (!interaction.member.permissions.has('Administrator')) {
            await interaction.reply({ content: '❌ 이 기능은 관리자만 사용할 수 있습니다.', flags: 64 });
            return;
        }

        try {
            const roleName = interaction.fields.getTextInputValue('delRoleName').trim();
            const data = JSON.parse(fs.readFileSync('./bot_data.json', 'utf8'));
            const guildId = interaction.guildId;

            const roleIndex = data.roles.findIndex(r => r.name.toLowerCase() === roleName.toLowerCase());

            if (roleIndex === -1) {
                await interaction.reply({ content: `❌ "${roleName}"이(가) 없습니다.`, flags: 64 });
                return;
            }

            const deletedRole = data.roles[roleIndex];

            if (data.roleSettings && data.roleSettings[guildId]) {
                delete data.roleSettings[guildId][deletedRole.name];
            }

            data.roles.splice(roleIndex, 1);

            fs.writeFileSync('./bot_data.json', JSON.stringify(data, null, 2));

            // 대시보드 업데이트
            if (data.dashboardMessageId && data.dashboardChannelId) {
                try {
                    const channel = await interaction.client.channels.fetch(data.dashboardChannelId);
                    const message = await channel.messages.fetch(data.dashboardMessageId);

                    const roleList = data.roles.map(r => `• ${r.name} : ${r.emoji}`).join('\n') || '없음';
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

                    await message.edit({ embeds: [embed], components: [row1, row2] });
                } catch (err) {
                    console.log('대시보드 메시지 업데이트 실패:', err.message);
                }
            }
            
            await interaction.reply({ content: ' ', flags: 64 });
        } catch (error) {
            console.error('역할 삭제 모달 오류:', error);
            await interaction.reply({ content: '❌ 오류가 발생했습니다.', flags: 64 });
        }
    }
};