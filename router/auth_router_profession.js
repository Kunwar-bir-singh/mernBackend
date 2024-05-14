const express = require('express');
const { createProfession, getProfession, editProfession, getProviders } = require('../controller/auth_controller_profession');
const routerProfession  = express.Router();

routerProfession.post('/createProfession', createProfession);
routerProfession.get('/getProfession', getProfession);
routerProfession.put('/editProfession', editProfession);
routerProfession.get('/getProviders' , getProviders)

module.exports = routerProfession;