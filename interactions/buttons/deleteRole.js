const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    customIdPrefix: 'deleteRole_btn',
    async execute(interaction) {
        if (!interaction.member.permissions.has('Administrator')) {
            await interaction.reply({ content: '❌ 이 기능은 관리자만 사용할 수 있습니다.', flags: 64 });
            return;
        }

        try {
            const data = JSON.parse(fs.readFileSync('./bot_data.json', 'utf8'));
            const roles = data.roles || [];

            if (roles.length === 0) {
                await interaction.reply({ content: '❌ 삭제할 역할이 없습니다.', flags: 64 });
                return;
            }

            const modal = new ModalBuilder()
                .setCustomId('deleteRole_modal')
                .setTitle('역할 삭제');

            const roleInput = new TextInputBuilder()
                .setCustomId('delRoleName')
                .setLabel('삭제할 역할 이름')
                .setPlaceholder('예: 테스트')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            modal.addComponents(
                new ActionRowBuilder().addComponents(roleInput)
            );

            await interaction.showModal(modal);
        } catch (error) {
            console.error('역할 삭제 버튼 오류:', error);
            await interaction.reply({ content: '❌ 오류가 발생했습니다.', flags: 64 });
        }
    }
};