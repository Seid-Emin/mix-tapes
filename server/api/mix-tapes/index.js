const express = require('express');
const baseRouteHandler = require('../base-route-handler.api');
const { getAll, create, update, remove } = require('./mix-tapes.api');

const api = express.Router({ mergeParams: true });

api.get('/', (req, res, next) => baseRouteHandler(req, res, next, getAll));
api.post('/', (req, res, next) => baseRouteHandler(req, res, next, create))
api.put('/:id', (req, res, next) => baseRouteHandler(req, res, next, update))
api.delete('/:id', (req, res, next) => baseRouteHandler(req, res, next, remove));
api.delete('/:id/:name', (req, res, next) => baseRouteHandler(req, res, next, remove));
api.delete('/:id/:name/:artist', (req, res, next) => baseRouteHandler(req, res, next, remove));

module.exports = api;
