const axios = require('axios')
const { response } = require('express')

exports.check_user = (req, res) => {
    
    // const { cookies } = req
    // console.log(req.cookies.auth)
    const authToken = req.cookies.auth

    const email = req.body.email
    const givenName = req.body.Name
    const familyName = req.body.FamilyOrBusinessName
    const uniqueReference = req.body.email
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress

    // const query = { email: email }
    const query = ''

    const config = {
        method: 'get',
        url: `https://sandbox.rest.paymentsapi.io/businesses/2232/payers/${email}`,
        headers: {
            Authorization:`Bearer ${authToken}`
        },
        data: query
    }
    axios(config)
    .then(users => {
        if((Object.keys(users.data).length === 0) && (users.constructor === Object)) { //Check if there is a returned user
            //Create new User Object
            const data = { 
                "UniqueReference": uniqueReference,
                "FamilyOrBusinessName": familyName,
                "GivenName": givenName,
                "Email": email,
                "Phone": "",
                "Mobile": "",
                "Address": {
                  "Line1": "",
                  "Line2": "",
                  "Suburb": "",
                  "State": "",
                  "PostCode": "",
                  "Country": ""
              },
              "DateOfBirth": "",
              "ExtraInfo": {
                "XeroAutoDebitEnabled": false
              },
              "Audit": {
                "Username": "Zing",
                "UserIP": ip
              }

            }
            //Create new Axios Config to be submitted in Integrapay and pass the data that we have created
            const newConfig = {
                method: 'post',
                url: 'https://sandbox.rest.paymentsapi.io/businesses/2232/payers',
                headers: {
                    Authorization:`Bearer ${authToken}`
                },
                data: data
            }
            axios(newConfig)
            .then(output => {
                const data = {
                    status: 'success',
                    big_message: 'Success',
                    small_message: `${ email } is now registered on IntegraPay`
                }
                return res.render('message', {data: data})
            })
            .catch(err => {
                // console.log(`Error creating new Payer on Integrapay: ${err}`)
                // res.json({
                //     'status': 'error',
                //     'message': `Error creating new Payer on Integrapay: ${err}`
                // })
                const data = {
                    status: 'error',
                    big_message: 'Error creating new Payer on Integrapay',
                    small_message: err
                }
                return res.render('message', {data: data})
            })
        }
        //Email address already exist in IntegraPay
        else {
        //    return res.render('payer-update-form')
            return res.render('payer-update-form', {userInfo: users.data})
            // console.log(users.data)
            // res.json(users.data)
        }
    })
    .catch(err => {
        console.log(err)
    })

}

exports.update_user = (req, res) => {
    
    const authToken = req.cookies.auth
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    const uniqueReference = req.body.reference
    const givenName = req.body.givenName
    const familyName = req.body.familyOrBusinessName
    const email = req.body.email
    const phone = req.body.phone
    const mobile = req.body.mobile
    const line1 = req.body.line1[0]
    const line2 = req.body.line1[1]
    const suburb = req.body.suburb
    const state = req.body.state
    const postcode = req.body.postcode
    const country = req.body.country
    const dob = req.body.dob

    const data = { 
        "UniqueReference": uniqueReference,
        "GroupReference": uniqueReference,
        "FamilyOrBusinessName": familyName,
        "GivenName": givenName,
        "Email": email,
        "Phone": phone,
        "Mobile": mobile,
        "Address": {
            "Line1": line1,
            "Line2": line2,
            "Suburb": suburb,
            "State": state,
            "PostCode": postcode,
            "Country": country
         },
        "DateOfBirth": dob,
        "ExtraInfo": {
            "XeroAutoDebitEnabled": false
        },
        "Audit": {
            "Username": "Zing",
            "UserIP": ip
      }

    }
    
    const config = {
        method: 'put',
        url: `https://sandbox.rest.paymentsapi.io/businesses/2232/payers/${uniqueReference}`,
        headers: {
            'Content-Type': 'application/json',
             Authorization:`Bearer ${authToken}`
        },
        data: data
    }

    axios(config)
    .then(response => {
        console.log(response)
        if(response.status == 200) {
            const data = {
                status: 'success',
                big_message: 'Updated Successfully',
                small_message: 'IntegraPay user information has been updated.'
            }
            return res.render('message', {data: data})
        }
        else {
            const data = {
                status: 'error',
                big_message: 'Oops!',
                small_message: 'Encountered an Error while updating IntegraPay user information.'
            }
            return res.render('message', {data: data})
        }
    })
    .catch(err => {
        const data = {
            status: 'error',
            big_message: 'Oops!',
            small_message: err
        }
        return res.render('message', {data: data})
    })
}

