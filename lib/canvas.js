const Canvas  = require('canvas');
const targetCanvas = new Canvas(128, 64);

function renderer(data = {gps: {}, obd: {}}) {
    console.table(data);
    const {
        speed = 0,
    } = data.gps;
    const {
        // gear = 0,
        rpm = 0,
        temp = 0,
        throttlepos = 0,
    } = data.obd;
    const speedUnit = 'kmph';
    // const gearUnit = 'gear';
    const coolantUnit = 'coolant';
    const rpmUnit = 'rpm';
    const throttleUnit = 'Thr %';
    const context = targetCanvas.getContext('2d');
    const sizer = sizeInPixels => `${sizeInPixels}px 'Square Pixel7'`;
    const displayWidth = 128;
    const displayHeight = 64;

    context.fillStyle = 'black';
    context.fillRect(0, 0, displayWidth, displayHeight);
    context.fillStyle = 'white';
    context.textAlign = 'left';
    context.textBaseline = 'top';
    context.font = sizer(12);
    context.fillText(coolantUnit, 5, 2);
    context.fillText(throttleUnit, 5, 54);
    context.fillText(rpmUnit, 104, 2);
    context.fillText(speedUnit, 97, 54);

    context.font = sizer(40);
    // context.fillText(gear === 0 ? 'N' : gear, 5, 9);
    context.fillText(temp, 5, 9);
    context.font = sizer(20);
    context.fillText(Math.round(throttlepos), 5, 40);
    context.textAlign = 'right';
    context.fillText(rpm, 125, 10);
    context.font = sizer(30);
    context.fillText(speed, 125, 32);

    const OLEDBuffer = targetCanvas.toDataURL().split(',')[1];
    io.emit('pi/buffer/oled', OLEDBuffer);
}

module.exports = {
    renderer,
};
