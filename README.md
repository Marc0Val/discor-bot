# Discor Bot

Este es un bot de Discord que permite a los usuarios participar en varios juegos de apuestas y gestionar sus puntos. A continuación se describen las funcionalidades y comandos disponibles.

## Instalación

1. Clona este repositorio.
2. Instala las dependencias con `npm install`.
3. Configura el archivo `config.json` con tu token de Discord, clientId y guildId.
4. Ejecuta el bot con `node index.js`.

## Comandos Disponibles

### `/puntos`

Inicializa tu cuenta de puntos o consulta tu saldo actual.

### `/apuestas`

Explica el sistema de apuestas y los juegos disponibles.

### `/caraocruz`

Juega a cara o cruz y apuesta tus puntos.

- **Opciones:**
  - `eleccion`: Elige cara o cruz.
  - `puntos`: Cantidad de puntos a apostar.

### `/dados`

Apuesta puntos prediciendo el resultado de un dado.

- **Opciones:**
  - `prediccion`: Predice el resultado del dado (Mayor que 3, Menor que 3, Igual a 3).
  - `puntos`: Cantidad de puntos a apostar.

### `/ruleta`

Juega a la ruleta y apuesta tus puntos.

- **Opciones:**
  - `apuesta`: Elige un número (0-36) o un color (rojo, negro, verde).
  - `puntos`: Cantidad de puntos a apostar.

### `/tragaperras`

Juega a la máquina tragaperras y apuesta tus puntos.

- **Opciones:**
  - `puntos`: Cantidad de puntos a apostar.

### `/rank`

Muestra el top 3 de los usuarios con más dinero dentro del servidor.

### `/pinga`

Comando de prueba.
