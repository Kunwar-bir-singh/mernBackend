const express = require('express');
const routerProvider  = express.Router();
const { loginProvider, registerProvider } = require('../controller/auth_controller_provider');

routerProvider.post('/registerProvider', registerProvider);
routerProvider.post('/loginProvider', loginProvider);

module.exports = routerProvider;