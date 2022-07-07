// import dotenv from 'dotenv'
const dotenv = require('dotenv')
const { EffectClient, createAccount, createWallet } = require('../dist/lib')
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');      // development only
const {connectEosAccount, connectBscAccount} = require('./connect_efx_account')
const fs = require('fs')

// import json
const new_qls = require('./new_qualis.json').data // newly created qualifications
const error_qls = require('./error_qualis.json').data // Old invalid qualifications
const correct_qls = require('./correct_qualis.json').data // Correct qualifications
const current_users = require('./cur_user_quali.json').data // Current user qualifications

const ALPHAQUALI = 117

// console.log('new_qls', new_qls)
// console.log('error_qls', error_qls)
// console.log('correct_qls', correct_qls)
// console.log('current_users', current_users)
// console.log(typeof error_qls, typeof correct_qls, typeof current_users)

// Initialize
dotenv.config({path: '.env'})
console.log(process.env.ACCOUNTNAME, process.env.PERMISSION, process.env.PRIVATE_KEY, process.env.BSC_KEY)

const config = {
    ACCOUNTNAME: process.env.ACCOUNTNAME,
    PERMISSION: process.env.PERMISSION,
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    BSC_KEY: process.env.BSC_KEY
}

// Run the Track!! 
main()

async function main () {
    try {

            const sdk = new EffectClient('mainnet')
            // console.log('sdk', sdk)

            const effectAccount = await connectEosAccount(sdk, config)
            // const effectAccount = await connectBscAccount(sdk, config)
            console.log('effectAccount', effectAccount)

            // Find users that have ALPHAQUALI qualification
            const filtered_user = current_users.filter(user => user.quali_id === ALPHAQUALI)
            console.log('filtered_user', filtered_user)

            // Create list of qualification for each user that has the ALPHAQUALI qualification
            const amend_users = []
            for (const fltruser of filtered_user) {
                amend_users.push(current_users.filter(user => user.account_id === fltruser.account_id))
            }
            console.log('amend_users', amend_users)

            // Use mapping of error_qls to correct_qls to amend the user qualifications
            const err_to_cor = []
            for (const err of error_qls) {
                for (const cor of correct_qls) {
                    if (err.name === cor.name) {
                        err_to_cor.push({ err, cor })
                    }
                }
            }
            // console.log('err_to_cor', err_to_cor)

            // Only use the qualification that is not correct
            const err_cor_filter = err_to_cor.filter(err => err.err.id !== err.cor.id)
            console.log('err_cor_filter', err_cor_filter, '\n', err_cor_filter.length, '\n', err_to_cor.length)

            // Loop over list of users that need to be amended
            for (const amnduser of amend_users) {

                // Loop over amnduser to find the qualification that is not correct
                for (const amndql of amnduser) {

                    console.log('amndql', amndql)

                    // Loop over err_cor_filter to find the qualification that is not correct
                    for (const errcor of err_cor_filter) {
                        const quali_info = await sdk.force.getQualification(amndql.quali_id)
                        // console.log('quali_info', quali_info)
                        if (quali_info.info.name === errcor.err.name) {
                            console.log('found error.')
                            console.log('quali_info.info.name', quali_info.info.name)
                            console.log('The incorrect qualification is:', errcor.err.id)
                            console.log('The correct qualification is:', errcor.cor.id)

                            // Amend the qualification
                            // sdk.force.unAssignQualification(amndql.quali_id, amndql.account_id).then(console.log).catch(console.error)
                            // sdk.force.assignQualification(quali.cor.id, amndql.account_id).then(console.log).catch(console.error)
                        } else {
                            console.log('no error found, continue.')
                        }
                    }
                }
            }
    } catch (e) {
        console.error(e)
    }
}



async function map_old_new () {
    const map = []
    for (const newql of new_qls) {
        for (const cor of correct_qls) {
            if (newql.info.name === cor.name) {
                const res = await sdk.force.getQualification(newql.id).catch(console.error)
                console.log('res\n', res.info.name, '\n', cor.name, '\n', newql.info.name, '\n')
                map.push({ newql, cor, res })
            }
        }
    }
    return map
}