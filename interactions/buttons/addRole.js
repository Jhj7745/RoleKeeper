const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    customIdPrefix: 'addRole_btn',
    async execute(interaction) {
        if (!interaction.member.permissions.has('Administrator')) {
            await interaction.reply({ content: '❌ 이 기능은 관리자만 사용할 수 있습니다.', flags: 64 });
            return;
        }

        try {
            const roles = await interaction.guild.roles.fetch();

            const modal = new ModalBuilder()
                .setCustomId('addRole_modal')
                .setTitle('역할 추가');

            const roleInput = new TextInputBuilder()
                .setCustomId('roleName')
                .setLabel('추가할 역할 이름')
                .setPlaceholder('예: 테스트')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const emojiInput = new TextInputBuilder()
                .setCustomId('roleEmoji')
                .setLabel('이모지 (⭐, ❤️, 🔥 등)')
                .setPlaceholder('예: ⭐')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            modal.addComponents(
                new ActionRowBuilder().addComponents(roleInput),
                new ActionRowBuilder().addComponents(emojiInput)
            );

            await interaction.showModal(modal);
        } catch (error) {
            console.error('역할 추가 버튼 오류:', error);
            await interaction.reply({ content: '❌ 오류가 발생했습니다.', flags: 64 });
        }
    }
};