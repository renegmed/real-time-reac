const io = require('socket.io')(); // with (), io becomes an object

// receiving message from client
io.on('connection', (client) => {
    client.on('subscribeToTimer', (interval) => {  // response to event named 'subscribeToTimer'
        console.log('client is subscribing to timer with intereval ', interval);
        setInterval(() => {
            client.emit('timer', new Date());  // publish an event to client/s at specified interval
        }, interval);
    });
});

const port = 8000;
io.listen(8000);
console.log('listening on post ', port);
