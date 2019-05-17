const express = require('express');
const winston = require('winston');
const bodyparser = require('body-parser');

const index = require('./routes/index');

const logger = winston.createLogger({

    transports: [

        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.Console({ format: winston.format.simple() })
    ]
});

module.exports = function (app) {

    app.use(express.json());
    app.use(bodyparser.urlencoded({ extended: true }));
    app.use('/', index);

    app.on('unhandledException', ex => logger.error(ex.message, ex));
    app.on('unhandledRejection', ex => logger.error(ex.message, ex));

    app.use(function (err, req, res, next) {

        console.log(err);
        logger.error(err, err);
        return res.status(500).json({ status: false, message: err.message, data: null });
    });
}