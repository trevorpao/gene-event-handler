// Utility functions used across the application

const utils = {
    // Converts an array-like object to a true array
    toArray: function (obj) {
        return Array.prototype.slice.call(obj);
    },

    // Checks if an object is defined and not null
    isDefined: function (obj) {
        return obj !== void 0 && obj !== null;
    },

    // Logs messages to the console if debugging is enabled
    logDebug: function (message, debugEnabled = false) {
        if (typeof console !== 'undefined' && debugEnabled) {
            if (typeof message === 'string' || typeof message === 'number') {
                console.log('gene::' + message);
            } else {
                console.log('gene::' + typeof(message));
                console.log(message);
            }
        }
    }
};

export default utils;
