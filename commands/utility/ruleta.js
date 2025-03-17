const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const puntosFilePath = path.join(__dirname, '../../puntosApuestas.json');
const imagesPath = path.join(__dirname, '../../images');

// Rutas de imágenes
const ruletaGif = path.join(imagesPath, 'imagesInteraction/ruleta.gif'); // Animación de ruleta girando
const advertenciaImage = path.join(imagesPath, 'imagesInteraction/advertencia.jpg'); // Advertencia si no tiene cuenta

// Definir los colores de los números (como en una ruleta real)
const colorMap = {
    0: 'verde',
    1: 'rojo', 2: 'negro', 3: 'rojo', 4: 'negro', 5: 'rojo', 6: 'negro', 7: 'rojo', 8: 'negro',
    9: 'rojo', 10: 'negro', 11: 'negro', 12: 'rojo', 13: 'negro', 14: 'rojo', 15: 'negro', 16: 'rojo',
    17: 'negro', 18: 'rojo', 19: 'rojo', 20: 'negro', 21: 'rojo', 22: 'negro', 23: 'rojo', 24: 'negro',
    25: 'rojo', 26: 'negro', 27: 'rojo', 28: 'negro', 29: 'negro', 30: 'rojo', 31: 'negro', 32: 'rojo',
    33: 'negro', 34: 'rojo', 35: 'negro', 36: 'rojo'
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ruleta')
        .setDescription('Juega a la ruleta y apuesta tus puntos.')
        .addStringOption(option =>
            option.setName('apuesta')
                .setDescription('Elige un número (0-36) o un color (rojo, negro, verde)')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('puntos')
                .setDescription('Cantidad de puntos a apostar')
                .setRequired(true)),

    async execute(interaction) {
        try {
            const userId = interaction.user.id;
            const apuesta = interaction.options.getString('apuesta').toLowerCase();
            const puntosApostados = interaction.options.getInteger('puntos');

            // Cargar datos de puntos
            let puntosData = fs.existsSync(puntosFilePath)
                ? JSON.parse(fs.readFileSync(puntosFilePath, 'utf8'))
                : {};

            // Verificar si el usuario tiene cuenta
            if (!puntosData[userId]) {
                await interaction.reply({
                    content: '⚠️ No tienes una cuenta de puntos. Usa `/puntos` para inicializarla.',
                    files: [new AttachmentBuilder(advertenciaImage)]
                });
                return;
            }

            // Verificar si tiene suficientes puntos
            if (puntosApostados > puntosData[userId] || puntosApostados <= 0) {
                await interaction.reply(`❌ No tienes suficientes puntos para apostar. Actualmente tienes **${puntosData[userId]}** Pesos.`);
                return;
            }

            // Validar apuesta
            const esNumero = !isNaN(apuesta) && apuesta >= 0 && apuesta <= 36;
            const esColor = ['rojo', 'negro', 'verde'].includes(apuesta);

            if (!esNumero && !esColor) {
                await interaction.reply('❌ Apuesta inválida. Debes elegir un número entre **0 y 36**, o un color (**rojo, negro, verde**).');
                return;
            }

            // Animación de la ruleta girando
            await interaction.reply({
                content: '🎡 La ruleta está girando...',
                files: [new AttachmentBuilder(ruletaGif)]
            });

            setTimeout(async () => {
                // Generar resultado aleatorio
                const resultadoNumero = Math.floor(Math.random() * 37); // Números del 0 al 36
                const resultadoColor = colorMap[resultadoNumero];

                // Determinar resultado de la apuesta
                let mensajeResultado = `🎰 La ruleta ha caído en **${resultadoColor.toUpperCase()} ${resultadoNumero}**.\n`;

                if (esNumero && parseInt(apuesta) === resultadoNumero) {
                    // Apuesta exacta al número → x36
                    const ganancia = puntosApostados * 36;
                    puntosData[userId] += ganancia;
                    mensajeResultado += `🎉 **¡Increíble! Has acertado el número exacto y ganado ${ganancia} Pesos!**\n💰 Ahora tienes **${puntosData[userId]}** Pesos.`;
                } else if (esColor && apuesta === resultadoColor) {
                    // Apuesta al color correcto → x2
                    const ganancia = puntosApostados * 2;
                    puntosData[userId] += ganancia;
                    mensajeResultado += `✅ ¡Has acertado el color y duplicado tu apuesta!\n💰 Ahora tienes **${puntosData[userId]}** Pesos.`;
                } else {
                    // Apuesta fallida → pierde puntos
                    puntosData[userId] -= puntosApostados;
                    mensajeResultado += `❌ Has perdido **${puntosApostados}** Pesos.\n💰 Ahora tienes **${puntosData[userId]}** Pesos.`;
                }

                // Guardar cambios
                fs.writeFileSync(puntosFilePath, JSON.stringify(puntosData, null, 2));

                await interaction.followUp(mensajeResultado);

            }, 3000); // Simulación de espera para la animación

        } catch (error) {
            console.error('❌ Error en el comando /ruleta:', error);
            await interaction.reply('❌ Ocurrió un error inesperado al ejecutar el comando.');
        }
    },
};
