const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const puntosFilePath = path.join(__dirname, '../../puntosApuestas.json');
const imagesPath = path.join(__dirname, '../../images');

// Rutas de imágenes
const caraImagePath = path.join(imagesPath, 'cara/cara1.png');
const cruzImagePath = path.join(imagesPath, 'cruz/cruz1.jpg');
const lanzamientoImagePath = path.join(imagesPath, 'imagesInteraction/lanzamiento.jpg');
const advertenciaImagePath = path.join(imagesPath, 'imagesInteraction/advertencia.jpg');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('caraocruz')
        .setDescription('Juega a cara o cruz y apuesta tus puntos.')
        .addStringOption(option =>
            option.setName('eleccion')
                .setDescription('Elige cara o cruz')
                .setRequired(true)
                .addChoices(
                    { name: 'Cara', value: 'cara' },
                    { name: 'Cruz', value: 'cruz' }
                ))
        .addIntegerOption(option =>
            option.setName('puntos')
                .setDescription('Cantidad de puntos a apostar')
                .setRequired(true)),

    async execute(interaction) {
        try {
            const userId = interaction.user.id;
            const eleccion = interaction.options.getString('eleccion');
            const puntosApostados = interaction.options.getInteger('puntos');

            // Cargar datos de puntos
            let puntosData = fs.existsSync(puntosFilePath)
                ? JSON.parse(fs.readFileSync(puntosFilePath, 'utf8'))
                : {};

            // Verificar si el usuario tiene cuenta
            if (!(userId in puntosData)) {
                await interaction.reply({
                    content: '⚠️ No tienes una cuenta de puntos. Usa `/puntos` para inicializarla.',
                    files: [new AttachmentBuilder(advertenciaImagePath)]
                });
                return;
            }

            // Verificar si tiene suficientes puntos
            if (puntosData[userId] === 0) {
                await interaction.reply('❌ No puedes apostar porque tienes **0 Pesos**. Usa `/puntos` para verificar tu saldo.');
                return;
            }

            if (puntosApostados > puntosData[userId] || puntosApostados <= 0) {
                await interaction.reply(`❌ No tienes suficientes puntos para apostar. Actualmente tienes **${puntosData[userId]}** Pesos.`);
                return;
            }

            // Anunciar lanzamiento de la moneda con imagen
            await interaction.reply({
                content: '🪙 La moneda ha sido lanzada...',
                files: [new AttachmentBuilder(lanzamientoImagePath)]
            });

            setTimeout(async () => {
                // Determinar resultado aleatorio
                const resultado = Math.random() < 0.5 ? 'cara' : 'cruz';
                const resultadoImagePath = resultado === 'cara' ? caraImagePath : cruzImagePath;

                // Evaluar apuesta
                let mensajeResultado = `🪙 La moneda cayó en **${resultado.toUpperCase()}**.\n`;

                if (eleccion === resultado) {
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

                // Guardar cambios en los puntos
                fs.writeFileSync(puntosFilePath, JSON.stringify(puntosData, null, 2));

            }, 3000); // Simulación de espera

        } catch (error) {
            console.error('❌ Error en el comando /caraocruz:', error);
            await interaction.reply('❌ Ocurrió un error inesperado al ejecutar el comando.');
        }
    },
};
