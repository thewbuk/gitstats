import * as React from 'react';
import { useParams } from 'next/navigation';
import { io, Socket } from 'socket.io-client';

type VideoState = {
  videoUrl: string;
  leaderTime: number;
  isPlaying: boolean;
  serverTimestamp: number;
};

type UseSocketReturn = {
  videoState: VideoState;
  sendMessage: (message: any) => void;
  isConnected: boolean;
};

const initialVideoState: VideoState = {
  videoUrl: '',
  leaderTime: 0,
  isPlaying: false,
  serverTimestamp: Date.now(),
};

export const useSocket = (): UseSocketReturn => {
  const { roomId } = useParams();
  const [isConnected, setIsConnected] = React.useState(false);
  const [videoState, setVideoState] =
    React.useState<VideoState>(initialVideoState);
  const socketRef = React.useRef<Socket | null>(null);
  const broadcastChannel = React.useRef<BroadcastChannel | null>(null);

  React.useEffect(() => {
    if (!roomId) return;

    // Create a BroadcastChannel for tab synchronization
    broadcastChannel.current = new BroadcastChannel(`room-${roomId}`);
    broadcastChannel.current.onmessage = (event) => {
      const data = event.data;
      if (data.type === 'videoState') {
        setVideoState(data.state);
      }
    };

    // Connect to Socket.IO server
    const SOCKET_URL =
      process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8080';

    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Socket event handlers
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('error', (error) => {
      setIsConnected(false);
    });

    socket.on('sync', (data) => {
      if (!data) return;

      const newState = {
        videoUrl: data.videoUrl || videoState.videoUrl,
        leaderTime:
          typeof data.leaderTime === 'number'
            ? data.leaderTime
            : videoState.leaderTime,
        isPlaying: data.isPlaying === true,
        serverTimestamp: Date.now(),
      };
      setVideoState(newState);

      // Broadcast to other tabs
      if (broadcastChannel.current) {
        broadcastChannel.current.postMessage({
          type: 'videoState',
          state: newState,
        });
      }
    });

    socketRef.current = socket;

    // Connect immediately
    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.disconnect();
      if (broadcastChannel.current) {
        broadcastChannel.current.close();
      }
    };
  }, [roomId]);

  const sendMessage = React.useCallback((message: any) => {
    if (!socketRef.current) {
      return;
    }

    if (!socketRef.current.connected) {
      socketRef.current.connect();
      return;
    }

    const eventType =
      message.command === 'videoUpdate'
        ? 'videoUpdate'
        : message.command === 'play'
          ? 'play'
          : message.command === 'pause'
            ? 'pause'
            : 'seek';

    socketRef.current.emit(eventType, message);
  }, []);

  return {
    videoState,
    sendMessage,
    isConnected,
  };
};
