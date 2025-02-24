import * as winston from "winston";
const { combine, timestamp, prettyPrint, errors, json } = winston.format

const timezone = () => {
    return new Date().toLocaleString();
}

const logger = winston.createLogger({
  exitOnError: false,
  level: "error",
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "hrms_error.log",
    }),
  ],
});

winston.loggers.add('payrollLogger', {
    level: 'info',
    format: combine(
        errors({ stack: true }),
        timestamp({ format: timezone }),
        json(),
        prettyPrint()
    ),
    transports: [
        // new winston.transports.Console(),
        new winston.transports.File({
            filename: 'payroll.log',
            level: 'info'
        })
    ]
})

export default logger;
