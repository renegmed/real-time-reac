import openSocket from 'socket.io-client';
import Rx from 'rxjs/Rx';

// this is a hack, not recommeded
// search the current location's search attribute, replace ? with ''. if it is not possible, use default 8000 port
console.log(window.location.search);
const port = parseInt(window.location.search.replace('?', ''), 10) || 8000;
console.log(port);

const socket = openSocket(`http://localhost:${port}`);

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

function subscribeToDrawingLines(drawingId, cb) {
    // observing the event, receiving of data i.e. socket.on() 
    const lineStream = Rx.Observable.fromEventPattern(
        h => socket.on(`drawingLine:${drawingId}`, h),  // function that use handler to open and receive stream of data
        h => socket.off(`drawingLine:${drawingId}`, h),  // function that remove/dispose handler after receiving stream of data
    );

    const bufferedTimeStream = lineStream
        .bufferTime(200)   // 100 millisecond limit to receive number of events, for batching stream of dta
        .map(lines => ({ lines } ));

    bufferedTimeStream.subscribe(linesEvent => cb(linesEvent));
    //socket.on(`drawingLine:${drawingId}`, cb);          // ready to receive drawingId's drawing line points
    socket.emit('subscribeToDrawingLines', drawingId);  // subscribing to drawing lines points
}

function subscribeToConnectionEvent(cb) {
    socket.on('connect', () => cb({
        state: 'connected',
        port,
    }));

    socket.on('disconnect', () => cb({
        state: 'disconnected',
        port,
    }));

    socket.on('connect_error', () => cb({
        state: 'disconnected',
        port,
    }));
}

export {
    createDrawing,
    subscribeToDrawings,
    publishLine,
    subscribeToDrawingLines,
    subscribeToConnectionEvent,
};