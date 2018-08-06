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
    .run(connection)                                // run the query with the connection
    .then( (cursor) => {
        cursor.each( (err, drawingRow) => client.emit('drawing',   // publish 'drawing' new value
        drawingRow.new_val));
    });
};

function subscribeToDrawingLines({ client, connection, drawingId }){
    return r.table('lines')
        .filter(r.row('drawingId').eq(drawingId))
        .changes({ include_initial: true })    // if there is a change in the table, run sql
        .run(connection)
        .then( (cursor) => {
            cursor.each( (err, lineRow) => 
              client.emit(`drawingLine:${drawingId}`, lineRow.new_val)); // topic is by drawingId, emit the drawing line points
        });
};

function handleLinePublish({ line, connection }) {
    console.log('saving line to the db');
    r.table('lines')
    .insert(Object.assign(line, {timestamp: new Date() }))
    .run(connection);
}

r.connect({
    host: 'localhost',
    port: 28015,
    db: 'awesome_whiteboard',
}).then( (connection) => {
    // receiving message from client
    io.on('connection', (client) => {
       client.on('createDrawing', ({ name }) => {       // receive from client message 'createDrawing'
            createDrawing( { connection, name });
       });

       client.on('subscribeToDrawings', () => subscribeToDrawings({  // received from client message 'subscribeToDrawings'
           client,
           connection,
       }));

       client.on('publishLine', (line) => handleLinePublish(
           { line, connection }
       ));

       client.on('subscribeToDrawingLines', (drawingId) => {
           subscribeToDrawingLines({
              client,
              connection,
              drawingId,
           });
       });
    });
});

const port = parseInt(process.argv[2], 10) || 8000;
io.listen(8000);
console.log('listening on post ', port);
