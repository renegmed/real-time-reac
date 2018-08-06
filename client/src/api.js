import openSocket from 'socket.io-client';
import Rx from 'rxjs/Rx';

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

export {
    createDrawing,
    subscribeToDrawings,
    publishLine,
    subscribeToDrawingLines,
};