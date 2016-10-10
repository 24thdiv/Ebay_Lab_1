/**
 * Created by Divya Patel on 10/10/2016.
 */
var winston = require('winston');

var eventlog = new (winston.Logger)({
    transports: [
        // colorize the output to the console
        new (winston.transports.Console)({
            timestamp: true,
            json : false,
            colorize: true,
            level: 'info'
        }),
        new (winston.transports.File)({
            filename: 'log/event.log',
            timestamp: true,
            json : false,
            level: 'info'
        })
    ]
});

var bidlog = new (winston.Logger)({
    transports: [
        // colorize the output to the console
        new (winston.transports.Console)({
            timestamp: true,
            json : false,
            colorize: true,
            level: 'info'
        }),
        new (winston.transports.File)({
            filename: 'log/bid.log',
            timestamp: true,
            json : false,
            level: 'info'
        })
    ]
});

exports.eventlog = eventlog;
exports.bidlog = bidlog;
