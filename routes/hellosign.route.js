const router = require('express').Router()

const bodyParser = require('body-parser')
const urlEncodedParser = bodyParser.urlencoded({extended: false})

const hsController = require('../controller/hellosign.controller')
const mw = require('../middleware/ip_auth')

router.post('/callback', hsController.callback_url)

router.get('/signature/list', hsController.list_signature_request)
router.get('/signature/new', mw.list_templates, hsController.show_request_form)
router.post('/signature/create', urlEncodedParser, hsController.send_template)

router.get('/templates/list', mw.list_templates, hsController.list_template)
router.get('/templates/new', hsController.create_template_form)
router.post('/templates/create', urlEncodedParser, hsController.create_template)

module.exports = router