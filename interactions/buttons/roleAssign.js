const fs = require('fs');

module.exports = {
    customIdPrefix: 'role_',
    async execute(interaction) {
        try {
            await interaction.deferUpdate();
            const roleName = interaction.customId.replace('role_', '');
            const data = JSON.parse(fs.readFileSync('./bot_data.json', 'utf8'));
            const guildId = interaction.guildId;
            
            const roleId = data.roleSettings?.[guildId]?.[roleName];
            if (!roleId) {
                await interaction.reply({ content: '❌ 역할을 찾을 수 없습니다.', flags: 64 });
                return;
            }
            
            const role = await interaction.guild.roles.fetch(roleId);
            if (!role) {
                await interaction.reply({ content: '❌ Discord 역할을 찾을 수 없습니다.', flags: 64 });
                return;
            }
            
            const hasRole = interaction.member.roles.cache.has(roleId);
            
            if (hasRole) {
                await interaction.member.roles.remove(role);
            } else {
                await interaction.member.roles.add(role);
            }
            
            if (data.roleMessageId && data.roleChannelId) {
                try {
                    const roleChannel = await interaction.client.channels.fetch(data.roleChannelId);
                    const roleMessage = await roleChannel.messages.fetch(data.roleMessageId);
                    
                    const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
                    const embed = new EmbedBuilder()
                        .setTitle('역할 선택')
                        .setDescription(data.mainMessage || '아래 버튼을 눌러 역할을 선택하세요.');
                    
                    const row = new ActionRowBuilder();
                    for (const r of data.roles) {
                        const rId = data.roleSettings?.[guildId]?.[r.name];
                        const memberHasRole = rId && interaction.member.roles.cache.has(rId);
                        
                        const btnStyle = memberHasRole ? ButtonStyle.Danger : ButtonStyle.Success;
                        const btnLabel = memberHasRole 
                            ? `${r.emoji} ${r.name} (회수)` 
                            : `${r.emoji} ${r.name} (지급)`;
                        
                        row.addComponents(
                            new ButtonBuilder()
                                .setCustomId(`role_${r.name}`)
                                .setLabel(btnLabel)
                                .setStyle(btnStyle)
                        );
                    }
                    
                    await roleMessage.edit({ embeds: [embed], components: [row] });
                } catch (err) {
                    console.log('역할메시지 업데이트 실패:', err.message);
                }
            }
        } catch (error) {
            console.error('역할 지급/회수 오류:', error);
            await interaction.reply({ content: '❌ 작업 중 오류가 발생했습니다.', flags: 64 }).catch(() => {});
        }
    }
};
