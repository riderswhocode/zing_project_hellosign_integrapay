const hellosign = require('hellosign-sdk')({key: process.env.HSKEY })

exports.list_signature_request = (req, res) => {
    
    hellosign.signatureRequest.list()
    .then(signaturelist => {
        const list = signaturelist.signature_requests
        let signature_list = []

        // console.log(list)
        list.map(m => {
            // console.log("---------------------------------")
            // console.log(m)
            const new_date = new Date(m.created_at * 1000)
            const created_date = new_date.toLocaleDateString()
            signature_list.push([
                m.signature_request_id,
                m.title,
                m.signatures[0].signer_name,
                m.signatures[0].signer_email_address,
                m.signatures[0].status_code,
                created_date
            ])

        })
        res.render('signature-request-list', {signature_list: signature_list})
        // console.log(signature_list)
        // console.log(request.signature_request) //return array of data
        // {
        //     signature_request_id: '703bae45fd237fbec5e0a67dee0599dc9d1da3aa',
        //     test_mode: true,
        //     title: 'Coaching Agreement',
        //     original_title: 'Coaching Agreement',
        //     subject: 'Coaching Agreement',
        //     message: 'Coaching Agreement that we have discussed',
        //     metadata: {},
        //     created_at: 1612253401,
        //     is_complete: false,
        //     is_declined: false,
        //     has_error: false,
        //     custom_fields: [
        //       {
        //         name: 'name',
        //         type: 'text',
        //         required: true,
        //         api_id: 'b9d30ba9-f5db-4113-9941-4dec614c63d1',
        //         editor: null,
        //         value: null
        //       },
        //       {
        //         name: 'email_address',
        //         type: 'text',
        //         required: true,
        //         api_id: '09dff585-2688-4351-a9e5-a2a15f2db5d7',
        //         editor: null,
        //         value: null
        //       }
        //     ],
        //     response_data: [],
        //     signing_url: null,
        //     signing_redirect_url: null,
        //     final_copy_uri: '/v3/signature_request/final_copy/703bae45fd237fbec5e0a67dee0599dc9d1da3aa',
        //     files_url: 'https://api.hellosign.com/v3/signature_request/files/703bae45fd237fbec5e0a67dee0599dc9d1da3aa',
        //     details_url: 'https://app.hellosign.com/home/manage?guid=703bae45fd237fbec5e0a67dee0599dc9d1da3aa',
        //     requester_email_address: 'ariane.r@techflow.ai',
        //     signatures: [
        //       {
        //         signature_id: '20b9d0825f2ac80cf7a054898e10b463',
        //         has_pin: false,
        //         has_sms_auth: false,
        //         signer_email_address: 'rootxenon@gmail.com',
        //         signer_name: 'ARIANE JADE REY',
        //         signer_role: 'Customer',
        //         order: null,
        //         status_code: 'awaiting_signature',
        //         signed_at: null,
        //         last_viewed_at: 1612253426,
        //         last_reminded_at: null,
        //         error: null
        //       }
        //     ],
        //     cc_email_addresses: [],
        //     template_ids: [ 'e7f83d3ec13544c0f9175b0d131280c86199ffbe' ],
        //     client_id: '5f86a503c0e0f2cf9908ccbe5df1d16a'
        //   }
    })
    .catch(err => {
        console.log(err)
    })
}

exports.list_template = (req, res) => {

    hellosign.template.list()
    .then(templates => {
        let template_list = []
        templates.templates.map(output => {
            template_list.push([output.template_id,output.title,output.message])
        })
        res.render('template-list', {template_list: template_list})
    })
    .catch(err => {
        console.log(err)
    })
}

exports.send_template = (req, res) => {
    const title = req.body.title
    const sbj = req.body.subject
    const msg = req.body.message
    const email = req.body.email
    const name = req.body.name
    const template = req.body.template

    const opts = {
        test_mode: 1,
        template_id: template,
        title: title,
        subject: sbj,
        message: msg,
        signing_redirect_url : process.env.REDIRECT_LINK,
        signers: [
            {
                email_address: email,
                name: name,
                role: 'Client'
            }
        ]
    }
    
    hellosign.signatureRequest.sendWithTemplate(opts)
    .then(() => {
        console.log(`New Signature Request has been created`)
        res.json({
            status: 'success',
            message: 'New Signature Request has been created.'
        })
    })
    .catch(err => {
        console.log(`There is an error:  ${err}`)
        res.json({
            status: 'error',
            message: err
        })
    })
}

exports.create_template = (req, res) => {
    
    let title = req.body.title
    let sbj = req.body.subject
    let msg = req.body.message
    let upload_file = req.body.upload_file

    const opts = {
        test_mode: 1,
        clientId: process.env.CLIENTID,
        title: title,
        subject: sbj,
        message: msg,
        signer_roles: [
            {   
                name: 'Client',
                order: 0
            }
        ],
        files: [upload_file]
    }
    hellosign.template.createEmbeddedDraft(opts)
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })
}

exports.show_request_form = (req, res) => {
    hellosign.template.list()
    .then(templates => {
        // console.log(templates)
        let template_list = []
        templates.templates.map(output => {
            template_list.push([output.template_id,output.title])
        })
        res.render('agreement-form', {template_list: template_list})
    })
    .catch(err => {
        console.log(err)
    })
    // res.render('agreement-form')
}

exports.create_template_form = (req, res) => {
    res.render('template-form')
}

exports.callback_url = (req, res) => {
    console.log(req)
}