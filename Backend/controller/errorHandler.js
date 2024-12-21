const express = require('express');

const error_handler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500; // Default to 500 if statusCode is not set

    res.status(statusCode).json({
        message: err.message || 'Internal Server Error',
    });
};

module.exports = error_handler;