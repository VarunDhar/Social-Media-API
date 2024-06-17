const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${message} : ${level} : ${timestamp}`;
});

const logger = createLogger({
  format: combine(
    timestamp({format:'YYYY-MM-DD HH:mm:ss'}),
    myFormat
  ),
  transports: [new transports.Console(), new transports.File({filename:'Combines.log'})]
});

module.exports = logger;