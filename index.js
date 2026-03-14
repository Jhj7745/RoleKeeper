const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });
client.commands = new Collection();
client.buttons = new Collection();
client.modals = new Collection();

function loadModules() {
    try {
        const cmdFiles = fs.readdirSync('./commands').filter(f => f.endsWith('.js'));
        for (const f of cmdFiles) { 
            const cmd = require(`./commands/${f}`); 
            client.commands.set(cmd.data.name, cmd);
        }
        
        const bFiles = fs.readdirSync('./interactions/buttons').filter(f => f.endsWith('.js'));
        for (const f of bFiles) { 
            const b = require(`./interactions/buttons/${f}`); 
            client.buttons.set(b.customIdPrefix, b);
        }
        
        const mFiles = fs.readdirSync('./interactions/modals').filter(f => f.endsWith('.js'));
        for (const f of mFiles) { 
            const m = require(`./interactions/modals/${f}`); 
            client.modals.set(m.customIdPrefix || m.customId, m);
        }
    } catch (error) {
        console.error('모듈 로드 오류:', error);
    }
}

client.once('clientReady', async (c) => {
    loadModules();
    console.log(`${c.user.tag} 로그인 완료!`);
    
    try {
        const data = JSON.parse(fs.readFileSync('./bot_data.json', 'utf8'));
        if (data.roleChannelId) {
            const channel = await c.channels.fetch(data.roleChannelId);
            if (channel) {
                const messages = await channel.messages.fetch({ limit: 100 });
                for (const msg of messages.values()) {
                    if (!msg.pinned) {
                        await msg.delete().catch(() => {});
                    }
                }
            }
        }
    } catch (error) {
        console.log('채널 정리 중 오류:', error.message);
    }
});

client.on('interactionCreate', async interaction => {
    try {
        if (interaction.isChatInputCommand()) {
            const cmd = client.commands.get(interaction.commandName);
            if (cmd) await cmd.execute(interaction);
        } else if (interaction.isButton()) {
            const handler = client.buttons.find(b => interaction.customId.includes(b.customIdPrefix));
            if (handler) await handler.execute(interaction);
        } else if (interaction.isModalSubmit()) {
            const handler = client.modals.get(interaction.customId);
            if (handler) await handler.execute(interaction);
        }
    } catch (error) {
        console.error('상호작용 오류:', error);
    }
});

client.login(process.env.TOKEN);