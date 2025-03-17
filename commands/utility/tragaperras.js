const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const puntosFilePath = path.join(__dirname, '../../puntosApuestas.json');
const imagesPath = path.join(__dirname, '../../images');

// Rutas de imágenes de los símbolos
const imagenesSimbolos = [
    path.join(imagesPath, 'tragaperras/cherry.png'),  // 🍒
    path.join(imagesPath, 'tragaperras/star.png'),    // ⭐
    path.join(imagesPath, 'tragaperras/bell.png'),    // 🔔
    path.join(imagesPath, 'tragaperras/lemon.png'),   // 🍋
    path.join(imagesPath, 'tragaperras/bar.png')      // ⿧
];

// Mapeo de imágenes a emojis
const simbolosEmojis = {
    [path.join(imagesPath, 'tragaperras/cherry.png')]: '🍒',
    [path.join(imagesPath, 'tragaperras/star.png')]: '⭐',
    [path.join(imagesPath, 'tragaperras/bell.png')]: '🔔',
    [path.join(imagesPath, 'tragaperras/lemon.png')]: '🍋',
    [path.join(imagesPath, 'tragaperras/bar.png')]: '⿧'
};

// Ruta del GIF de la máquina girando
const gifMaquina = path.join(imagesPath, 'tragaperras/giro_maquina.gif');

// Mensajes de premios
const premios = {
    tresIguales: 50,   // Si aciertan tres símbolos iguales
    dosIguales: 20,    // Si aciertan dos iguales
    combinacionEspecial: 100 // Para una combinación especial
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tragaperras')
        .setDescription('Juega a la máquina tragaperras y apuesta tus puntos.')
        .addIntegerOption(option =>
            option.setName('puntos')
                .setDescription('Cantidad de puntos a apostar')
                .setRequired(true)),

    async execute(interaction) {
        try {
            const userId = interaction.user.id;
            const puntosApostados = interaction.options.getInteger('puntos');

            // Cargar datos de puntos
            let puntosData = fs.existsSync(puntosFilePath)
                ? JSON.parse(fs.readFileSync(puntosFilePath, 'utf8'))
                : {};

            // Verificar si el usuario tiene cuenta
            if (!puntosData[userId]) {
                await interaction.reply({
                    content: '⚠️ No tienes una cuenta de puntos. Usa `/puntos` para inicializarla.',
                    files: [new AttachmentBuilder(path.join(imagesPath, 'imagesInteraction/advertencia.jpg'))]
                });
                return;
            }

            // Verificar si tiene suficientes puntos
            if (puntosApostados > puntosData[userId] || puntosApostados <= 0) {
                await interaction.reply(`❌ No tienes suficientes puntos para apostar. Actualmente tienes **${puntosData[userId]}** Pesos.`);
                return;
            }

            // Animación de la máquina girando
            await interaction.reply({
                content: '🎰 La máquina está girando...',
                files: [new AttachmentBuilder(gifMaquina)]
            });

            // Simulación de giro (3 símbolos aleatorios)
            setTimeout(async () => {
                const simbolosSeleccionados = [];
                for (let i = 0; i < 3; i++) {
                    simbolosSeleccionados.push(imagenesSimbolos[Math.floor(Math.random() * imagenesSimbolos.length)]);
                }

                // Mostrar los símbolos con intervalos de 5 segundos
                let mensajeResultado = `🎰 Los símbolos son: ${simbolosSeleccionados.map(simbolo => simbolosEmojis[simbolo]).join(' ')}`;
                let premio = 0;


                const mostrarSimbolo = async (index) => {
                    if (index < simbolosSeleccionados.length) {
                        await interaction.followUp({
                            files: [new AttachmentBuilder(simbolosSeleccionados[index])]
                        });
                    }
                };


                for (let i = 0; i < simbolosSeleccionados.length; i++) {
                    setTimeout(() => {
                        mostrarSimbolo(i);
                    }, i * 5000);
                }


                setTimeout(async () => {
                    // Verificar combinaciones
                    if (simbolosSeleccionados[0] === simbolosSeleccionados[1] && simbolosSeleccionados[1] === simbolosSeleccionados[2]) {
                        // Tres símbolos iguales
                        premio = premios.tresIguales;
                        mensajeResultado += `\n🎉 ¡Tres símbolos iguales! Ganaste **${premio}** puntos.`;
                    } else if (simbolosSeleccionados[0] === simbolosSeleccionados[1] || simbolosSeleccionados[1] === simbolosSeleccionados[2] || simbolosSeleccionados[0] === simbolosSeleccionados[2]) {
                        // Dos símbolos iguales
                        premio = premios.dosIguales;
                        mensajeResultado += `\n✅ ¡Dos símbolos iguales! Ganaste **${premio}** puntos.`;
                    } else {
                        premio = 0;
                        mensajeResultado += `\n❌ Lo siento, no ganaste. Has perdido **${puntosApostados}** puntos.`;
                    }

                    // Asegurar que los puntos sean añadidos o retirados
                    if (premio > 0) {
                        puntosData[userId] += premio;
                    } else {
                        puntosData[userId] -= puntosApostados;
                    }


                    fs.writeFileSync(puntosFilePath, JSON.stringify(puntosData, null, 2));


                    await interaction.followUp(mensajeResultado);

                }, 15000);

            }, 3000);

        } catch (error) {
            console.error('❌ Error en el comando /tragaperras:', error);
            await interaction.reply('❌ Ocurrió un error inesperado al ejecutar el comando.');
        }
    },
};