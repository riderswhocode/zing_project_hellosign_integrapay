const axios = require('axios')
const hellosign = require('hellosign-sdk')({key: process.env.HSKEY})


exports.create_cookies = (req, res, next) => {
    const IPUsername = process.env.INTEGRAPAY_USERNAME
    const IPUserKey = process.env.INTEGRAPAY_USERKEY

    axios.post('https://sandbox.auth.paymentsapi.io/login', {Username: IPUsername, Password: IPUserKey})
    .then(data => {
        res.cookie('auth', data.data.access_token)
        // console.log(data.data.access_token)
        // res.end()
        next()
    })
    .catch(err => {
        console.log(err)
    })
}

exports.list_templates = (req, res, next) => {
    hellosign.template.list()
    .then(res => {
        // console.log(templates)
        let template_list = []
        res.templates.map(output => {
            template_list.push([output.template_id,output.title])
        })
        next()
    })
    .catch(err => {
        console.log(err)
    })
}