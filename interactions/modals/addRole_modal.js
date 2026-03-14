const fs = require('fs');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    customId: 'addRole_modal',
    async execute(interaction) {
        if (!interaction.member.permissions.has('Administrator')) {
            await interaction.reply({ content: '❌ 이 기능은 관리자만 사용할 수 있습니다.', flags: 64 });
            return;
        }

        try {
            let roleName = interaction.fields.getTextInputValue('roleName').trim();
            let emoji = interaction.fields.getTextInputValue('roleEmoji').trim();
            
            if (emoji.startsWith(':') && emoji.endsWith(':')) {
                await interaction.reply({ 
                    content: `❌ "${emoji}" 형식은 지원하지 않습니다!\n실제 이모지를 입력하세요. (예: ⭐, ❤️, 🔥)\n\n이모지 찾기: https://emojipedia.org/`, 
                    flags: 64 
                });
                return;
            }
            
            const data = JSON.parse(fs.readFileSync('./bot_data.json', 'utf8'));
            const guildId = interaction.guildId;
            
            if (!data.roleSettings) data.roleSettings = {};
            if (!data.roleSettings[guildId]) data.roleSettings[guildId] = {};
            if (!data.roles) data.roles = [];
            
            const roles = await interaction.guild.roles.fetch();
            const role = roles.find(r => r.name === roleName);
            
            if (!role) {
                await interaction.reply({ content: `❌ "${roleName}" 역할을 찾을 수 없습니다.`, flags: 64 });
                return;
            }
            
            if (data.roles.some(r => r.name === roleName)) {
                await interaction.reply({ content: `❌ "${roleName}" 역할은 이미 추가되어 있습니다.`, flags: 64 });
                return;
            }
            
            data.roles.push({ name: roleName, emoji });
            data.roleSettings[guildId][roleName] = role.id;
            fs.writeFileSync('./bot_data.json', JSON.stringify(data, null, 2));
            
            try {
                const channel = interaction.client.channels.cache.get(data.dashboardChannelId);
                if (channel && data.dashboardMessageId) {
                    const message = await channel.messages.fetch(data.dashboardMessageId);
                    
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
                    
                    await message.edit({ embeds: [embed], components: [row1, row2] });
                }
            } catch (e) {
                console.log('대시보드 업데이트:', e.message);
            }
            
            await interaction.reply({ content: ' ', flags: 64 });
        } catch (error) {
            console.error('역할 추가 오류:', error);
            await interaction.reply({ content: '❌ 오류가 발생했습니다.', flags: 64 }).catch(() => {});
        }
    }
};