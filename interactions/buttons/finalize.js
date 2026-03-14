const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');

module.exports = {
    customIdPrefix: 'finalize_btn',
    async execute(interaction) {
        if (!interaction.member.permissions.has('Administrator')) {
            await interaction.reply({ content: '❌ 이 기능은 관리자만 사용할 수 있습니다.', flags: 64 });
            return;
        }

        try {
            await interaction.deferUpdate();
            const data = JSON.parse(fs.readFileSync('./bot_data.json', 'utf8'));
            
            const channel = interaction.channel;
            let allMessages = [];
            let lastId = undefined;
            
            while (true) {
                const batch = await channel.messages.fetch({ limit: 100, before: lastId }).catch(() => new Map());
                if (batch.size === 0) break;
                allMessages = allMessages.concat(Array.from(batch.values()));
                lastId = batch.last()?.id;
            }
            
            const messagesToDelete = allMessages.filter(msg => 
                msg.id !== data.dashboardMessageId && 
                msg.id !== data.roleMessageId
            );
            
            for (const msg of messagesToDelete) {
                await msg.delete().catch(() => {});
            }
            
            const embed = new EmbedBuilder()
                .setTitle('역할 선택')
                .setDescription(data.mainMessage || '아래 버튼을 눌러 역할을 선택하세요.');

            const row = new ActionRowBuilder();
            for (const r of data.roles) {
                const roleId = data.roleSettings?.[interaction.guildId]?.[r.name];
                const hasRole = roleId && interaction.member.roles.cache.has(roleId);
                
                const buttonStyle = hasRole ? ButtonStyle.Danger : ButtonStyle.Success;
                const buttonLabel = hasRole 
                    ? `${r.emoji} ${r.name} (회수)` 
                    : `${r.emoji} ${r.name} (지급)`;
                
                row.addComponents(
                    new ButtonBuilder()
                        .setCustomId(`role_${r.name}`)
                        .setLabel(buttonLabel)
                        .setStyle(buttonStyle)
                );
            }

            const roleMessage = await interaction.channel.send({ embeds: [embed], components: [row] });
            
            await roleMessage.pin();
            
            data.roleMessageId = roleMessage.id;
            data.roleChannelId = interaction.channelId;
            fs.writeFileSync('./bot_data.json', JSON.stringify(data, null, 2));
        } catch (error) {
            console.error('finalize 오류:', error);
            await interaction.reply({ content: '❌ 작업 중 오류가 발생했습니다.', flags: 64 }).catch(() => {});
        }
    }
};