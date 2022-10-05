const express = require('express');
const api = express.Router();

api.use('/mix-tapes', require('./mix-tapes'));


module.exports = api;
