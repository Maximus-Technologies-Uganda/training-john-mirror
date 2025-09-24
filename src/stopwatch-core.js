/**
 * Pure stopwatch core logic without file system dependencies
 * This module contains the business logic for stopwatch operations
 */

/**
 * Creates a new stopwatch state
 * @returns {Object} Initial stopwatch state
 */
function createStopwatch() {
    return {
        startTime: null,
        isRunning: false,
        totalElapsed: 0
    };
}

/**
 * Starts the stopwatch
 * @param {Object} stopwatch - Current stopwatch state
 * @returns {Object} Updated stopwatch state
 */
function startStopwatch(stopwatch) {
    if (stopwatch.isRunning) {
        throw new Error('Stopwatch is already running');
    }
    
    return {
        ...stopwatch,
        startTime: Date.now(),
        isRunning: true
    };
}

/**
 * Stops the stopwatch
 * @param {Object} stopwatch - Current stopwatch state
 * @returns {Object} Updated stopwatch state with total elapsed time
 */
function stopStopwatch(stopwatch) {
    if (!stopwatch.isRunning) {
        throw new Error('Stopwatch is not running');
    }
    
    const currentTime = Date.now();
    const elapsed = currentTime - stopwatch.startTime;
    const newTotalElapsed = stopwatch.totalElapsed + elapsed;
    
    return {
        ...stopwatch,
        isRunning: false,
        startTime: null,
        totalElapsed: newTotalElapsed
    };
}

/**
 * Gets the current elapsed time
 * @param {Object} stopwatch - Current stopwatch state
 * @returns {number} Elapsed time in milliseconds
 */
function getElapsedTime(stopwatch) {
    if (!stopwatch.isRunning) {
        return stopwatch.totalElapsed;
    }
    
    const currentTime = Date.now();
    const currentElapsed = currentTime - stopwatch.startTime;
    return stopwatch.totalElapsed + currentElapsed;
}

/**
 * Resets the stopwatch
 * @param {Object} stopwatch - Current stopwatch state
 * @returns {Object} Reset stopwatch state
 */
function resetStopwatch(stopwatch) {
    return createStopwatch();
}

/**
 * Formats elapsed time in a human-readable format
 * @param {number} milliseconds - Time in milliseconds
 * @returns {string} Formatted time string
 */
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

/**
 * Gets the current status of the stopwatch
 * @param {Object} stopwatch - Current stopwatch state
 * @returns {Object} Status information
 */
function getStopwatchStatus(stopwatch) {
    const elapsed = getElapsedTime(stopwatch);
    return {
        isRunning: stopwatch.isRunning,
        elapsedTime: elapsed,
        formattedTime: formatElapsedTime(elapsed)
    };
}

module.exports = {
    createStopwatch,
    startStopwatch,
    stopStopwatch,
    getElapsedTime,
    resetStopwatch,
    formatElapsedTime,
    getStopwatchStatus
};
