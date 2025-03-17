const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const puntosFilePath = path.join(__dirname, '../../puntosApuestas.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('Muestra el top 3 de los usuarios con más dinero dentro del servidor'),
    async execute(interaction) {
        try {
            await interaction.deferReply();

            let puntosData = fs.existsSync(puntosFilePath)
                ? JSON.parse(fs.readFileSync(puntosFilePath, 'utf8'))
                : {};

            // Ordenar los usuarios por puntos en orden descendente
            const sortedUsers = Object.entries(puntosData).sort(([, a], [, b]) => b - a).slice(0, 3);

            if (sortedUsers.length === 0) {
                return await interaction.editReply('❌ No hay usuarios con puntos registrados.');
            }

            // Emojis de ranking
            const rankingEmojis = ['🥇', '🥈', '🥉'];

            for (const [index, [userId, puntos]] of sortedUsers.entries()) {
                const user = await interaction.client.users.fetch(userId);

                const embed = new EmbedBuilder()
                    .setColor(0xFFD700)
                    .setAuthor({ name: `${rankingEmojis[index]} ${user.username}`, iconURL: user.displayAvatarURL({ dynamic: true }) })
                    .setDescription(`💰 **${puntos} Pesos**`);

                await interaction.followUp({ embeds: [embed] });
            }

        } catch (error) {
            console.error('❌ Error en el comando /rank:', error);
            await interaction.editReply('❌ Ocurrió un error inesperado al ejecutar el comando.');
        }
    },
};
