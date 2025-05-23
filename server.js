const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Permite conexiones desde cualquier origen (ajusta según necesidad)
  },
});

const PORT = process.env.PORT || 3000;
const roomCode = 'D13LZW'; // Código de la sala
let players = []; // Lista de jugadores

// Middleware
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor de Sopa de Letras activo');
});

// Manejo de conexiones con Socket.io
io.on('connection', (socket) => {
  console.log(`Jugador conectado: ${socket.id}`);

  // Unir jugador a la sala
  socket.on('joinGame', (playerName) => {
    players.push({ id: socket.id, name: playerName });
    console.log(`${playerName} se unió a la sala ${roomCode}`);
    io.emit('playerList', players); // Enviar lista actualizada a todos
  });

  // Iniciar el juego (solo el administrador)
  socket.on('startGame', () => {
    console.log('¡El juego ha comenzado!');
    io.emit('gameStart'); // Enviar evento a todos los jugadores
  });

  // Manejar desconexión de jugadores
  socket.on('disconnect', () => {
    players = players.filter((p) => p.id !== socket.id);
    io.emit('playerList', players); // Actualizar la lista para todos
    console.log(`Jugador desconectado: ${socket.id}`);
  });
});

// Método para desconectar a todos los jugadores
socket.on('disconnectAll', () => {
  players = []; // Vaciar la lista de jugadores
  io.emit('playerList', players); // Notificar a todos que la lista está vacía
  console.log(
    'Todos los jugadores han sido desconectados por el administrador.'
  );
});

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
