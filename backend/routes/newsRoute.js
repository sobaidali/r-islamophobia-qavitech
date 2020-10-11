const express = require('express');
const news_controller = require('../controllers/newsController');
const router = new express.Router();
const validateToken=require('../verification/tokenVerify')

//Report an incident
router.post('/add',validateToken,news_controller.users_add_news)
router.post('/edit',validateToken,news_controller.users_edit_news)
router.post('/remove',validateToken,news_controller.users_delete_news)
router.get('/news',news_controller.users_view_news)
router.get('/list',news_controller.users_view_newslist)
module.exports = router;