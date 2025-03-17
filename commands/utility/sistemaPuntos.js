const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const puntosFilePath = path.join(__dirname, '../../puntosApuestas.json');
const entregaPesosImagePath = path.join(__dirname, '../../images/imagesInteraction/entrega_pesos.png');
const advertenciaImagePath = path.join(__dirname, '../../images/imagesInteraction/advertencia.jpg');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('puntos')
        .setDescription('Inicializa tu cuenta de puntos o consulta tu saldo actual'),

    async execute(interaction) {
        try {
            const userId = interaction.user.id;
            let puntosData = fs.existsSync(puntosFilePath)
                ? JSON.parse(fs.readFileSync(puntosFilePath, 'utf8'))
                : {};

            // Si el usuario no tiene cuenta, la crea
            if (!(userId in puntosData)) {
                await interaction.reply({
                    content: '⚠️ No tienes una cuenta de puntos. Creándola ahora...',
                    files: [new AttachmentBuilder(advertenciaImagePath)]
                });

                await new Promise(resolve => setTimeout(resolve, 3000)); // Simulación de espera

                puntosData[userId] = 20; // Asigna 20 puntos iniciales
                fs.writeFileSync(puntosFilePath, JSON.stringify(puntosData, null, 2));

                await interaction.followUp({
                    content: '✅ ¡Cuenta creada! Se te han otorgado **20 Pesos** de bienvenida 🎉',
                    files: [new AttachmentBuilder(entregaPesosImagePath)]
                });
                return;
            }

            // Mostrar saldo actual
            await interaction.reply(`💰 Actualmente tienes **${puntosData[userId]}** Pesos.`);
        } catch (error) {
            console.error('❌ Error en el comando /puntos:', error);
            await interaction.reply('❌ Ocurrió un error inesperado al ejecutar el comando.');
        }
    },
};
