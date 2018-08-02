import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8000');

function subscribeToTimer(cb) {
    socket.on('timer', timestamp => cb(timestamp));  // subscribe 'timer' topic from server
    socket.emit('subscribeToTimer', 1000);   // publish message by sending to server
}

export default subscribeToTimer;
