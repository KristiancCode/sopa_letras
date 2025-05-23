const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Permite conexiones desde cualquier origen
  },
});

const PORT = process.env.PORT || 3000;
const roomCode = 'D13LZW'; // Código de la sala
let players = []; // Lista de jugadores
let winners = []; // Lista de ganadores

app.use(cors());
app.use(express.json());

// ✅ Endpoint para crear la sala
app.post('/createRoom', (req, res) => {
  const { adminName } = req.body;
  console.log(`Sala creada por ${adminName}, código: ${roomCode}`);
  res.json({ message: 'Sala creada', roomCode });
});

// ✅ Endpoint para unirse a la sala
app.post('/joinRoom', (req, res) => {
  const { playerName } = req.body;
  players.push(playerName);
  io.emit('playerList', players); // Actualizar lista de jugadores en frontend
  console.log(`${playerName} se unió a la sala.`);
  res.json({ message: 'Jugador añadido', players });
});

// ✅ Evento para iniciar el juego
io.on('connection', (socket) => {
  console.log(`Jugador conectado: ${socket.id}`);

  socket.on('startGame', () => {
    console.log('¡El juego ha comenzado!');
    io.emit('gameStart'); // Notificar a todos los jugadores
  });

  socket.on('submitWinner', (playerName) => {
    if (!winners.includes(playerName)) {
      winners.push(playerName);
      console.log(
        `${playerName} ha ganado! Total ganadores: ${winners.length}`
      );

      if (winners.length === 3) {
        io.emit('gameFinished', { winners });
        console.log('¡Tenemos 3 ganadores!');
      }
    }
  });

  socket.on('joinGame', (playerName) => {
    players.push(playerName);
    io.emit('playerList', players); // Enviar lista actualizada a todos los clientes
    console.log(`${playerName} se unió a la sala.`);
  });

  socket.on('leaveGame', (playerName) => {
    players = players.filter((p) => p !== playerName);
    io.emit('playerList', players); // Enviar lista actualizada a todos los clientes
    console.log(`${playerName} ha salido de la sala.`);
  });
  socket.on('disconnect', () => {
    players = players.filter((p) => p !== socket.id);
    io.emit('playerList', players);
    console.log(`Jugador desconectado: ${socket.id}`);
  });

  socket.on('disconnectAll', () => {
    players = [];
    winners = [];
    io.emit('playerList', players);
    io.emit('gameReset');
    console.log('Todos los jugadores han sido desconectados.');
  });
});

// ✅ Obtener estado del juego
app.get('/gameStatus', (req, res) => {
  res.json({ players, winners });
});

// 🔥 Iniciar el servidor
server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
