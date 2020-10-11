const express = require('express');
const incident_controller = require('../controllers/incidentController');
const validateToken=require('../verification/tokenVerify')
const router = new express.Router();

//Report an incident
router.post('/add',validateToken ,incident_controller.users_add_incident)
router.post('/upload',incident_controller.users_incident_docupload)
router.post('/addshort',incident_controller.users_add_incident_short)
router.post('/list',validateToken,incident_controller.users_get_incidents)
router.post('/uploadasnonuser', incident_controller.nonusers_add_incident)

module.exports = router;