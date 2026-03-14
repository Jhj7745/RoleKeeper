const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    customIdPrefix: 'setMessage_btn',
    async execute(interaction) {
        if (!interaction.member.permissions.has('Administrator')) {
            await interaction.reply({ content: '❌ 이 기능은 관리자만 사용할 수 있습니다.', flags: 64 });
            return;
        }

        const modal = new ModalBuilder()
            .setCustomId('setMessage_modal')
            .setTitle('안내 메시지 설정');

        const input = new TextInputBuilder()
            .setCustomId('msgContent')
            .setLabel('전송할 안내 메시지 내용')
            .setStyle(TextInputStyle.Paragraph);

        const row = new ActionRowBuilder().addComponents(input);

        modal.addComponents(row);

        await interaction.showModal(modal);
    }
};