// backend/index.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const postRoutes = require('./routes/postRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
  },
});

app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api/posts', postRoutes);

mongoose.connect("mongodb+srv://admin:2Bm3DAmD9FNaaGrr@cluster0.0fogwws.mongodb.net/instagram-clone", {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

app.set('io', io);

server.listen(5050, () => {
  console.log('Server running on http://localhost:5050');
});
