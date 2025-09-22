const fs = require('fs');

const command = process.argv[2];
const timeFile = 'time.json';

// Helper function to read the start time
function getStartTime() {
    if (fs.existsSync(timeFile)) {
        const content = fs.readFileSync(timeFile);
        const data = JSON.parse(content);
        return data.startTime;
    }
    return null;
}

// Helper function to write the start time
function setStartTime(time) {
    fs.writeFileSync(timeFile, JSON.stringify({ startTime: time }));
}

// Main logic
switch (command) {
    case 'start':
        const now = Date.now();
        setStartTime(now);
        console.log('Stopwatch started.');
        break;

    case 'stop':
        const startTime = getStartTime();
        if (startTime) {
            const endTime = Date.now();
            const elapsed = ((endTime - startTime) / 1000).toFixed(2);
            console.log(`Stopwatch stopped. Elapsed time: ${elapsed} seconds.`);
            setStartTime(null); // Reset the start time
        } else {
            console.log('Stopwatch has not been started.');
        }
        break;

    default:
        console.log('Unknown command. Use "start" or "stop".');
        break;
}