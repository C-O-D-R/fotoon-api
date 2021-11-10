// Date And Time
import date from 'date-and-time';

// Terminal
global.terminal = new class {
    info(text) {
        var now = new Date();
        var nowFormatted = date.format(now, 'YYYY/MM/DD HH:mm:ss');

        return console.log(`<${nowFormatted}> [INFO] ${text}`);
    }

    error(text) {
        var now = new Date();
        var nowFormatted = date.format(now, 'YYYY/MM/DD HH:mm:ss');

        return console.log(`<${nowFormatted}> [ERROR] ${text}`);
    }

    warn(text) {
        var now = new Date();
        var nowFormatted = date.format(now, 'YYYY/MM/DD HH:mm:ss');

        return console.log(`<${nowFormatted}> [WARN] ${text}`);
    }
}