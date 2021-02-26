const router = require('express').Router()
const ipController = require('../controller/integrapay.controller')

const mw = require('../middleware/ip_auth')

const bodyParser = require('body-parser')
const urlEncodedParser = bodyParser.urlencoded({extended: false})

router.get('/payment', mw.create_cookies, urlEncodedParser, ipController.check_user)
router.post('/payment/update', mw.create_cookies, urlEncodedParser, ipController.update_user)



module.exports = router