const { renderer } = require('./lib/canvas');
import {
    initOBDReader,
    knotsToKmph,
    serialParser,
    parseNMEA,
    gpsLogger,
    navLogger,
    btOBDReader,
    obdLogger,
    io,
} from './lib/utils';

const cachedData = {
    gps: {},
    obd: {},
};
const CONFIG_PID_PINGS = [
    'rpm',
    'temp',
    'throttlepos',
];

serialParser.on('data', (data) => {
    try {
        const emitData = parseNMEA(data);

        io.emit('pi/message/gps', emitData);
        gpsLogger.write(JSON.stringify(emitData) + "\n");
        if (emitData.type === 'nav-info') {
            navLogger.write(JSON.stringify(emitData) + "\n");
            cachedData.gps.speed = knotsToKmph(emitData.speedKnots);
        }
    } catch (e) { }
});


btOBDReader.on('connected', function onConnection() {
    CONFIG_PID_PINGS.forEach(this.addPoller);
    this.startPolling(250);
});
btOBDReader.on('dataReceived', (data) => {
    io.emit('pi/message/obd', data);
    cachedData.obd[data.name] = data.value;
    obdLogger.write(JSON.stringify({_timestamp: Date.now(), ...data}) + "\n");
});
btOBDReader.on('error', (data) => {
    console.error(`OBD Error: ${data}`);
    setTimeout(initOBDReader, 5000);
});
btOBDReader.on('debug', (data) => {
    console.debug(`OBD Debug: ${data}`);
});

io.listen(9000);

setInterval(() => {
    renderer(cachedData);
    io.emit('pi/message/cachedData', cachedData);
}, 300);

initOBDReader();
