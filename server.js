const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.get('/', (req, res) => {
  res.send('WhatsApp UAJ Backend Server is running successfully!');
});

io.on('connection', (socket) => {
  console.log(`[WhatsApp UAJ] User connected: ${socket.id}`);

  socket.on('join_room', (roomID) => {
    socket.join(roomID);
    console.log(`User joined room: ${roomID}`);
  });

  socket.on('send_message', (data) => {
    const { roomID, message, sender } = data;
    io.to(roomID).emit('receive_message', { message, sender, timestamp: new Date() });
  });

  socket.on('disconnect', () => {
    console.log('[WhatsApp UAJ] User disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
