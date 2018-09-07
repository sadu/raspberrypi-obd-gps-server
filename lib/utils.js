const fs = require('fs');
const io = require('socket.io')();
const NMEAParser = require('nmea');
const ReadLine = require('@serialport/parser-readline');
const SerialPort = require('serialport');

const OBDReader = require('./obd/obd');

const portName = '/dev/ttyUSB0';
const port = new SerialPort(portName, { baudRate: 9600 });
const serialParser = port.pipe(new ReadLine({ delimiter: '\n' }));
const gpsLogger = fs.createWriteStream('./data.old/gps.log', { flag: 'a' });
const navLogger = fs.createWriteStream('./data.old/gps-nav.log', { flag: 'a' });
const obdLogger = fs.createWriteStream('./data.old/obd.log', { flag: 'a' });
const btOBDReader = new OBDReader();

function initOBDReader() {
    btOBDReader.connect('00:1D:A5:68:98:8C', 1);
}

function knotsToKmph(speedInKnots) {
    const knotInKmph = 1.852;
    return Math.round(speedInKnots * knotInKmph);
}

module.exports = {
    initOBDReader,
    knotsToKmph,

    io,
    parseNMEA: NMEAParser.parse,
    serialParser,
    gpsLogger,
    navLogger,
    obdLogger,
    btOBDReader,
};
