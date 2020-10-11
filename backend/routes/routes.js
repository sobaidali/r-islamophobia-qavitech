const express = require('express');
const router = new express.Router();
const incident=require('./incidentRoute')
const news=require('./newsRoute')
const users = require('./userRoute');

router.use('/api/users', users)
router.use('/api/incident',incident);

router.use('/api/news',news)

module.exports=router