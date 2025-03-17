const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pinga')
        .setDescription('Solo ejecutra xd'),
    async execute(interaction) {
        console.log('Ping command executed');
        await interaction.reply('Piedra... Papel... Tijera... Pistola ijo de puta');
    },
};