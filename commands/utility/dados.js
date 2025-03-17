const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const puntosFilePath = path.join(__dirname, '../../puntosApuestas.json');
const imagesPath = path.join(__dirname, '../../images');

// Rutas de imágenes
const lanzamientoDadoImagePath = path.join(imagesPath, 'imagesInteraction/lanzamientoDado.jpg');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dados')
        .setDescription('Apuesta puntos prediciendo el resultado de un dado.')
        .addIntegerOption(option =>
            option.setName('puntos')
                .setDescription('Cantidad de puntos a apostar')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('prediccion')
                .setDescription('Predice el resultado del dado')
                .setRequired(true)
                .addChoices(
                    { name: 'Mayor que 3', value: 'mayor' },
                    { name: 'Menor que 3', value: 'menor' },
                    { name: 'Igual a 3', value: 'igual' }
                )),

    async execute(interaction) {
        try {
            const userId = interaction.user.id;
            const puntosApostados = interaction.options.getInteger('puntos');
            const prediccion = interaction.options.getString('prediccion');

            let puntosData = fs.existsSync(puntosFilePath)
                ? JSON.parse(fs.readFileSync(puntosFilePath, 'utf8'))
                : {};

            if (!(userId in puntosData)) {
                await interaction.reply('⚠️ No tienes una cuenta de puntos. Usa `/puntos` para inicializarla.');
                return;
            }

            if (puntosData[userId] <= 0) {
                await interaction.reply('💰 No tienes puntos suficientes para apostar. Usa `/puntos` para verificar tu saldo.');
                return;
            }

            if (puntosApostados > puntosData[userId] || puntosApostados <= 0) {
                await interaction.reply(`❌ No tienes suficientes puntos para apostar. Actualmente tienes **${puntosData[userId]}** Pesos.`);
                return;
            }

            // Anunciar lanzamiento del dado con imagen
            await interaction.reply({
                content: '🎲 Se arroja el dado...',
                files: [new AttachmentBuilder(lanzamientoDadoImagePath)]
            });

            setTimeout(async () => {
                const resultadoDado = Math.floor(Math.random() * 6) + 1;
                const resultadoImagePath = path.join(imagesPath, `dados/dado${resultadoDado}.png`);

                let mensajeResultado = `🎲 El dado cayó en **${resultadoDado}**.\n`;

                let acierto = false;
                if ((prediccion === 'mayor' && resultadoDado > 3) ||
                    (prediccion === 'menor' && resultadoDado < 3) ||
                    (prediccion === 'igual' && resultadoDado === 3)) {
                    acierto = true;
                }

                if (acierto) {
                    puntosData[userId] += puntosApostados;
                    mensajeResultado += `🎉 ¡Felicidades! Has ganado **${puntosApostados}** Pesos.\n💰 Ahora tienes **${puntosData[userId]}** Pesos.`;
                } else {
                    puntosData[userId] -= puntosApostados;
                    mensajeResultado += `😔 Lo siento, has perdido **${puntosApostados}** Pesos.\n💰 Ahora tienes **${puntosData[userId]}** Pesos.`;
                }

                await interaction.followUp({
                    content: mensajeResultado,
                    files: [new AttachmentBuilder(resultadoImagePath)]
                });

                fs.writeFileSync(puntosFilePath, JSON.stringify(puntosData, null, 2));

            }, 3000); // Simulación de espera

        } catch (error) {
            console.error('❌ Error en el comando /dados:', error);
            await interaction.reply('❌ Ocurrió un error inesperado al ejecutar el comando.');
        }
    },
};
