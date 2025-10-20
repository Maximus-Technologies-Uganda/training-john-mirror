/**
 * Pure stopwatch core logic without file system dependencies
 * This module contains the business logic for stopwatch operations
 */

/**
 * Creates a new stopwatch state
 * @returns {Object} Initial stopwatch state
 */
const createStopwatch = () => {
    return {
        startTime: null,
        isRunning: false,
        totalElapsed: 0
    };
};

const resolveNow = (nowProvider) => {
    const value = typeof nowProvider === 'function' ? nowProvider() : Date.now();
    if (!Number.isFinite(value)) {
        throw new Error('Invalid time source provided to stopwatch');
    }
    return value;
};

/**
 * Starts the stopwatch
 * @param {Object} stopwatch - Current stopwatch state
 * @returns {Object} Updated stopwatch state
 */
const startStopwatch = (stopwatch, nowProvider = Date.now) => {
    if (!stopwatch || typeof stopwatch !== 'object') {
        throw new Error('startStopwatch requires a stopwatch object');
    }

    if (stopwatch.isRunning) {
        throw new Error('Stopwatch is already running');
    }

    const currentTime = resolveNow(nowProvider);

    return {
        ...stopwatch,
        startTime: currentTime,
        isRunning: true
    };
};

/**
 * Stops the stopwatch
 * @param {Object} stopwatch - Current stopwatch state
 * @returns {Object} Updated stopwatch state with total elapsed time
 */
const stopStopwatch = (stopwatch, nowProvider = Date.now) => {
    if (!stopwatch || typeof stopwatch !== 'object') {
        throw new Error('stopStopwatch requires a stopwatch object');
    }

    if (!stopwatch.isRunning) {
        throw new Error('Stopwatch has not been started');
    }

    const currentTime = resolveNow(nowProvider);
    const elapsed = currentTime - stopwatch.startTime;
    const newTotalElapsed = stopwatch.totalElapsed + elapsed;

    return {
        ...stopwatch,
        isRunning: false,
        startTime: null,
        totalElapsed: newTotalElapsed
    };
};

/**
 * Gets the current elapsed time
 * @param {Object} stopwatch - Current stopwatch state
 * @returns {number} Elapsed time in milliseconds
 */
const getElapsedTime = (stopwatch, nowProvider = Date.now) => {
    if (!stopwatch || typeof stopwatch !== 'object') {
        throw new Error('getElapsedTime requires a stopwatch object');
    }

    if (!stopwatch.isRunning) {
        return stopwatch.totalElapsed;
    }

    const currentTime = resolveNow(nowProvider);
    const currentElapsed = currentTime - stopwatch.startTime;
    return stopwatch.totalElapsed + currentElapsed;
};

/**
 * Resets the stopwatch
 * @param {Object} stopwatch - Current stopwatch state
 * @returns {Object} Reset stopwatch state
 */
const resetStopwatch = () => {
    return {
        startTime: null,
        isRunning: false,
        totalElapsed: 0
    };
};

/**
 * Formats elapsed time in a human-readable format
 * @param {number} milliseconds - Time in milliseconds
 * @returns {string} Formatted time string
 */
const getStopwatchStatus = (stopwatch, nowProvider = Date.now) => {
    if (!stopwatch || typeof stopwatch !== 'object') {
        throw new Error('getStopwatchStatus requires a stopwatch object');
    }

    return {
        isRunning: Boolean(stopwatch.isRunning),
        elapsedTime: getElapsedTime(stopwatch, nowProvider)
    };
};

const formatElapsedTime = (milliseconds) => {
    const safeMilliseconds = Math.max(0, Number(milliseconds) || 0);
    const seconds = Math.floor(safeMilliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    const remainingSeconds = seconds % 60;
    const remainingMinutes = minutes % 60;

    if (hours > 0) {
        return `${hours}h ${remainingMinutes}m ${remainingSeconds}s`;
    }

    if (minutes > 0) {
        return `${minutes}m ${remainingSeconds}s`;
    }

    return `${remainingSeconds}s`;
};

const formatStopwatchOutput = (status) => {
    if (!status || typeof status !== 'object') {
        throw new Error('formatStopwatchOutput requires a status object');
    }

    const { isRunning = false, elapsedTime = 0, formattedTime } = status;
    const displayTime = typeof formattedTime === 'string'
        ? formattedTime
        : formatElapsedTime(elapsedTime);

    if (isRunning) {
        return `Stopwatch is running\nElapsed time: ${displayTime}`;
    }

    if (elapsedTime > 0) {
        return `Stopwatch is not running\nTotal elapsed time: ${displayTime}`;
    }

    return 'Stopwatch is not running';
};

export {
    createStopwatch,
    startStopwatch,
    stopStopwatch,
    getElapsedTime,
    resetStopwatch,
    getStopwatchStatus,
    formatElapsedTime,
    formatStopwatchOutput
};
