import io from 'socket.io-client';

const socket = io('https://chat-app-backend-7dsr.onrender.com', {
  withCredentials: true,
});

export default socket;
