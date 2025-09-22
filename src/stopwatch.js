const fs = require('fs');
const path = require('path');

const command = process.argv[2];
const timeFile = path.join(__dirname, '../data/time.json');

// Helper function to read the start time
function getStartTime() {
    try {
        if (fs.existsSync(timeFile)) {
            const content = fs.readFileSync(timeFile, 'utf8');
            const data = JSON.parse(content);
            return data.startTime;
        }
    } catch (error) {
        console.error('Error reading time file:', error.message);
        return null;
    }
    return null;
}

// Helper function to write the start time
function setStartTime(time) {
    try {
        const data = { startTime: time };
        fs.writeFileSync(timeFile, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error writing time file:', error.message);
    }
}

// Helper function to format elapsed time
function formatElapsedTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    const remainingSeconds = seconds % 60;
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
        return `${hours}h ${remainingMinutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
        return `${minutes}m ${remainingSeconds}s`;
    } else {
        return `${remainingSeconds}s`;
    }
}

// Main logic
switch (command) {
    case 'start':
        const now = Date.now();
        setStartTime(now);
        console.log('Stopwatch started at', new Date(now).toLocaleTimeString());
        break;

    case 'lap':
        const startTimeForLap = getStartTime();
        if (startTimeForLap) {
            const currentTime = Date.now();
            const elapsed = currentTime - startTimeForLap;
            console.log(`Lap time: ${formatElapsedTime(elapsed)}`);
        } else {
            console.log('Stopwatch has not been started. Use the "start" command first.');
        }
        break;

    case 'stop':
        const startTimeForStop = getStartTime();
        if (startTimeForStop) {
            const endTime = Date.now();
            const elapsed = endTime - startTimeForStop;
            console.log(`Stopwatch stopped. Total elapsed time: ${formatElapsedTime(elapsed)}`);
            setStartTime(null); // Reset the start time
        } else {
            console.log('Stopwatch has not been started. Use the "start" command first.');
        }
        break;

    case 'status':
        const startTimeForStatus = getStartTime();
        if (startTimeForStatus) {
            const currentTime = Date.now();
            const elapsed = currentTime - startTimeForStatus;
            console.log(`Stopwatch is running. Elapsed time: ${formatElapsedTime(elapsed)}`);
        } else {
            console.log('Stopwatch is not running.');
        }
        break;

    case 'reset':
        setStartTime(null);
        console.log('Stopwatch reset.');
        break;

    default:
        console.log('Usage: node stopwatch.js <command>');
        console.log('Commands:');
        console.log('  start  - Start the stopwatch');
        console.log('  lap    - Show current elapsed time');
        console.log('  stop   - Stop the stopwatch and show total time');
        console.log('  status - Show current status and elapsed time');
        console.log('  reset  - Reset the stopwatch');
        break;
}