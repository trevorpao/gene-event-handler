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
    },

    // Extracts all attributes from a node into a plain object
    extractAttr: function (nodes) {
        const attr = {};
        if (!nodes) return attr;
        const list = nodes.length !== undefined ? nodes : [nodes];
        list.forEach(node => {
            if (!node || !node.attributes) return;
            Array.from(node.attributes).forEach(a => {
                attr[a.name] = a.value;
            });
        });
        return attr;
    }
};

export default utils;
