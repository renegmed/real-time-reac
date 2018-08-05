import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8000');

function subscribeToTimer(cb) {
    socket.on('drawing', cb);                   // receives 'drawing' topic from server
    socket.emit('subscribeToDrawings', 1000);   // subscribes to server topic 'subscribeToDrawings'
}

function createDrawing(name) {
    socket.emit('createDrawing', { name });
}
export {
    createDrawing,
    subscribeToTimer,
};