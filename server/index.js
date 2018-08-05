const io = require('socket.io')(); // with (), io becomes an object
const r = require('rethinkdb');

function createDrawing({ connection, name}) {
    r.table('drawings')
        .insert({
            name,
            timestamp: new Date(),
        })
        .run(connection)  // run the query with the connection
        .then(() => console.log('created a drawing with name: ', name));
};

function subscribeToDrawings({ client, connection }){
    r.table('drawings')
    .changes({ include_initial: true})
    .run(connection)        // run the query with the connection
    .then( (cursor) => {
        cursor.each( (err, drawingRow) => client.emit('drawing', 
        drawingRow.new_val));
    });
};

r.connect({
    host: 'localhost',
    port: 28015,
    db: 'awesome_whiteboard',
}).then( (connection) => {
    // receiving message from client
    io.on('connection', (client) => {
       client.on('createDrawing', ({ name }) => {
            createDrawing( { connection, name });
       });

       client.on('subscribeToDrawings', () => subscribeToDrawings({
           client,
           connection,
       }));
    });
});

const port = 8000;
io.listen(8000);
console.log('listening on post ', port);
