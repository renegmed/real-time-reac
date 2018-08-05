const io = require('socket.io')(); // with (), io becomes an object
const r = require('rethinkdb');

r.connect({
    host: 'localhost',
    port: 28015,
    db: 'awesome_whiteboard',
}).then( (connection) => {
    // receiving message from client
    io.on('connection', (client) => {
        client.on('subscribeToTimer', (interval) => {  // response to event named 'subscribeToTimer'
            console.log('client is subscribing to timer with intereval ', interval);
           
            r.table('timers')
                .changes()
                .run(connection)
                .then( (cursor) => {
                    cursor.each( (err, timerRow) => {
                        // send 'timer' message with date timestamp value
                        client.emit('timer', timerRow.new_val.timestamp);
                    });
                });     
             ;
        }); 
    });
});

const port = 8000;
io.listen(8000);
console.log('listening on post ', port);
