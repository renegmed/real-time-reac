import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8000');

function subscribeToDrawings(cb) {
    socket.on('drawing', cb);                   // receives 'drawing' topic from server
    socket.emit('subscribeToDrawings', 1000);   // subscribes to server topic 'subscribeToDrawings'
}

function createDrawing(name) {
    socket.emit('createDrawing', { name });
}

function publishLine({ drawingId, line }) {
    socket.emit('publishLine', { drawingId, ...line });
}


export {
    createDrawing,
    subscribeToDrawings,
    publishLine,
};