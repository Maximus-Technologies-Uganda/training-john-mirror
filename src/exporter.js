/**
 * Exporter module for formatting stopwatch data
 * This module handles the formatting of stopwatch data for display
 */

/**
 * Formats stopwatch data for display
 * @param {Object} rawData - Raw stopwatch data object
 * @returns {string} Formatted string for display
 */
const formatStopwatchData = (rawData) => {
    const { isRunning, elapsedTime, formattedTime } = rawData;
    
    let output = '';
    
    if (isRunning) {
        output += 'Stopwatch is running\n';
        output += `Elapsed time: ${formattedTime}`;
    } else {
        output += 'Stopwatch is not running';
        if (elapsedTime > 0) {
            output += `\nTotal elapsed time: ${formattedTime}`;
        }
    }
    
    return output;
};

export { formatStopwatchData };
