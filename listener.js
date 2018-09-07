const socket = require('socket.io-client')('http://localhost:9000');

const restrictToDevice = process.argv[2];

if (!restrictToDevice || restrictToDevice === 'gps') {
    socket.on('pi/message/gps', console.table);
}

if (!restrictToDevice || restrictToDevice === 'obd') {
    socket.on('pi/message/obd', console.table);
}




