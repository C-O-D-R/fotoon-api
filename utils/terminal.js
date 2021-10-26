// Libraries
const DateTime = require('date-and-time');

// Current Time
module.exports.time = () => {
    // Current Date
    var currentDate = new Date();

    // Formatted Date
    var formattedDate = DateTime.format(currentDate, 'YYYY-MM-DD HH:mm:ss');

    // Formatted String
    return `<${formattedDate}>`;
}

// Log
module.exports.log = (text) => {
    var time = module.exports.time();
    return console.log(`${time} [INFO] ${text}`);
}

// Error
module.exports.error = (text) => {
    var time = module.exports.time();
    return console.log(`${time} [ERROR] ${text}`);
}

// Warn
module.exports.warn = (text) => {
    var time = module.exports.time();
    return console.log(`${time} [WARN] ${text}`);
}