const fs = require('fs');
const OBDReader = require('./lib/obd/obd');
const OBDReaderPIDs = require('./pid-list.json');

const btOBDReader = new OBDReader();
const obdScanner = fs.createWriteStream('./data/obdScannerResults.json');
const obdScannerResults = [];
const initScanner = () => btOBDReader.connect('00:1D:A5:68:98:8C', 1);

let pidNames = OBDReaderPIDs.slice();
const sendNextCommand = () => {
    if (pidNames.length > 0) {
        setTimeout(() => btOBDReader.write(pidNames.shift()), 100);
    } else {
        console.log('Scan Completed, press Ctrl + c to exit.');
    }
};

btOBDReader.on('connected', function onConnection() {
    sendNextCommand();
});

btOBDReader.on('dataReceived', (data) => {
    console.clear();
    console.log(`Remaining PIDs to scan: ${pidNames.length}`);
    if (data.value && data.value !== 'NO DATA') {
        obdScannerResults.push(data);
        obdScanner.write(JSON.stringify(data) + ",\n");
        console.table(obdScannerResults);
    }
    sendNextCommand();
});

btOBDReader.on('error', (data) => {
    console.log(`OBD Error: ${data}`);
    if(data.indexof('Cannot connect') > -1){
        setTimeout(initScanner, 5000);
    }
});

btOBDReader.on('debug', (data) => {
    console.log(`OBD Debug: ${data}`);
});

initScanner();

const valuableData = [
    "load_pct",
    "shrtft13",
    "rpm",
    "sparkadv",
    "o2s11",
    "evap_pct",
];
