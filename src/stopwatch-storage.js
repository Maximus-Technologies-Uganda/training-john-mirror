/**
 * File system storage wrapper for stopwatch state
 * Handles persistence of stopwatch data to JSON files
 */

import fs from 'fs';
import path from 'path';

/**
 * Creates a storage manager for stopwatch state
 * @param {string} storagePath - Path to the storage file
 * @returns {Object} Storage manager instance
 */
function createStopwatchStorage(storagePath) {
    return {
        /**
         * Loads stopwatch state from storage
         * @returns {Object} Stopwatch state or default state if file doesn't exist
         */
        load() {
            try {
                if (fs.existsSync(storagePath)) {
                    const content = fs.readFileSync(storagePath, 'utf8');
                    const data = JSON.parse(content);
                    
                    // Validate the loaded data structure
                    if (data && typeof data === 'object') {
                        return {
                            startTime: data.startTime || null,
                            isRunning: data.isRunning || false,
                            totalElapsed: data.totalElapsed || 0
                        };
                    }
                }
            } catch (error) {
                console.error('Error reading stopwatch storage:', error.message);
            }
            
            // Return default state if loading fails
            return {
                startTime: null,
                isRunning: false,
                totalElapsed: 0
            };
        },

        /**
         * Saves stopwatch state to storage
         * @param {Object} stopwatch - Stopwatch state to save
         */
        save(stopwatch) {
            try {
                // Ensure the directory exists
                const dir = path.dirname(storagePath);
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }
                
                const data = {
                    startTime: stopwatch.startTime,
                    isRunning: stopwatch.isRunning,
                    totalElapsed: stopwatch.totalElapsed,
                    lastUpdated: new Date().toISOString()
                };
                
                fs.writeFileSync(storagePath, JSON.stringify(data, null, 2));
            } catch (error) {
                console.error('Error saving stopwatch storage:', error.message);
            }
        },

        /**
         * Clears the storage file
         */
        clear() {
            try {
                if (fs.existsSync(storagePath)) {
                    fs.unlinkSync(storagePath);
                }
            } catch (error) {
                console.error('Error clearing stopwatch storage:', error.message);
            }
        }
    };
}

export { createStopwatchStorage };
