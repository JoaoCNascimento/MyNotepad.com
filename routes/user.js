const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth-controller')
const { requireAuth } = require('../middleware/middleware')

router.get('/', controller.home);
router.get('/cadastrar', controller.sign_up_get);
router.post('/cadastrar', controller.sign_up_post);
router.get('/login', controller.login_get)
router.post('/login', controller.login_post);
router.get('/log_out', controller.log_out_get);
router.delete('/excluir_conta', requireAuth, controller.delete_user)

module.exports = router