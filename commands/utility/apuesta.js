const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('apuestas')
        .setDescription('Explica el sistema de apuestas y los juegos disponibles'),
    async execute(interaction) {
        try {
            const embed = new EmbedBuilder()
                .setTitle('🎲 Sistema de Apuestas')
                .setColor(0xFFD700)
                .setDescription(
                    '¡Bienvenido al sistema de apuestas! Aquí puedes jugar y ganar (o perder) **Pesos** apostando en distintos juegos.\n\n' +
                    '**Reglas básicas:**\n' +
                    '🎫 PARA COMENZAR, USA `/puntos` PARA INICIALIZAR TU CUENTA, DE LO CONTRARIO NO PODRAS JUGAR NI APOSTAR EN NINGUN JUEGO! \n\n' +
                    '💰 Ganas o pierdes Pesos según el resultado de tu apuesta.\n' +
                    '⚖️ No puedes apostar más Pesos de los que tienes.\n' +
                    '🎮 Actualmente, los juegos disponibles son:\n'
                )
                .addFields(
                    { name: '🪙 **Cruz o Cara**', value: 'Usa `/cruzocara <apuesta> <elección>` para apostar en un lanzamiento de moneda.', inline: false },
                    { name: '🎲 **Dados**', value: 'Usa `/dados <apuesta> <predicción>` para apostar en el resultado de un dado.', inline: false },
                    { name: '🎡 **Ruleta**', value: 'Usa `/ruleta <apuesta> <número/color>` para apostar en la ruleta.', inline: false },
                    { name: '🎰 **Tragaperras**', value: 'Usa `/tragaperras <apuesta>` para jugar a la máquina tragaperras.', inline: false }, // Línea añadida
                    { name: '📈 **Próximamente**', value: 'Se agregarán más juegos en el futuro.', inline: false },
                    {
                        name: '📌 **Gestión de Puntos**', value:
                            '🔹 Usa `/puntos` para inicializar tu cuenta o consultar tu saldo actual.\n' +
                            '🔹 Usa `/rank` para ver el top 3 de usuarios con más Pesos.', inline: false
                    }
                )
                .setFooter({ text: '¡Juega con responsabilidad y buena suerte!' });

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('❌ Error en el comando /apuestas:', error);
            await interaction.reply('❌ Ocurrió un error inesperado al ejecutar el comando.');
        }
    },
};