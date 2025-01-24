import { Server } from 'socket.io';
import { createServer } from 'http';
import type { Socket } from 'socket.io';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Video state management
let currentVideoTime = 0;
let isPlaying = false;
let playbackStartTime = Date.now();
let currentVideoUrl = '';

// Broadcast current state to all clients
const broadcastState = (excludeSocket?: Socket) => {
  const state = {
    videoUrl: currentVideoUrl,
    leaderTime: currentVideoTime,
    isPlaying: isPlaying,
    serverTimestamp: Date.now(),
  };

  if (excludeSocket) {
    excludeSocket.broadcast.emit('sync', state);
  } else {
    io.emit('sync', state);
  }
};

// Handle socket connections
io.on('connection', (socket: Socket) => {
  // Send initial sync data immediately
  socket.emit('sync', {
    videoUrl: currentVideoUrl,
    leaderTime: currentVideoTime,
    isPlaying: isPlaying,
    serverTimestamp: Date.now(),
  });

  // Handle video updates
  socket.on('videoUpdate', (data: any) => {
    currentVideoUrl = data.videoUrl;
    currentVideoTime = 0;
    isPlaying = true;
    playbackStartTime = Date.now();
    broadcastState(socket);
  });

  // Handle play/pause events
  socket.on('play', (data: any) => {
    isPlaying = true;
    currentVideoTime = data.currentTime || currentVideoTime;
    playbackStartTime = Date.now() - currentVideoTime * 1000;
    broadcastState(socket);
  });

  socket.on('pause', (data: any) => {
    isPlaying = false;
    currentVideoTime = data.currentTime || currentVideoTime;
    broadcastState(socket);
  });

  // Handle seek events
  socket.on('seek', (data: any) => {
    currentVideoTime = data.currentTime;
    if (isPlaying) {
      playbackStartTime = Date.now() - currentVideoTime * 1000;
    }
    broadcastState(socket);
  });

  socket.on('disconnect', () => {});
});

// Periodic sync broadcast
setInterval(() => {
  if (isPlaying) {
    currentVideoTime = (Date.now() - playbackStartTime) / 1000;
  }
  broadcastState();
}, 500);

const PORT = process.env.WS_PORT || 8080;
httpServer.listen(PORT, () => {
  console.log(`Socket.IO server is running on port ${PORT}`);
});
