// import dotenv from 'dotenv'
const dotenv = require('dotenv')
const { EffectClient, createAccount, createWallet } = require('../dist/lib')
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');      // development only
const {connectEosAccount, connectBscAccount} = require('./connect_efx_account')
const fs = require('fs')

// import json
const error_qls = require('./error_correct_qualis.json').data
const correct_qls = require('./correct_qualis.json').data
const current_users = require('./cur_user_quali.json').data

console.log('error_qls', error_qls)
console.log('correct_qls', correct_qls)
console.log('current_users', current_users)


// Initialize
dotenv.config({path: '.env'})
console.log(process.env.ACCOUNTNAME, process.env.PERMISSION, process.env.PRIVATE_KEY, process.env.BSC_KEY)

const config = {
    ACCOUNTNAME: process.env.ACCOUNTNAME,
    PERMISSION: process.env.PERMISSION,
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    BSC_KEY: process.env.BSC_KEY
}

console.log(EffectClient)

// Run the Track!! 
main()

async function main () {
    try {

        const sdk = new EffectClient('mainnet')
        // console.log('sdk', sdk)

        const effectAccount = await connectEosAccount(sdk, config)
        // const effectAccount = await connectBscAccount(sdk, config)
        console.log('effectAccount', effectAccount)





        // sdk.force.uploadCampaign(json).then(console.log)
        /**
         * Miscellaneous functions 
         */
        // const res = await sdk.force.getCampaignBatches(6).then(console.log).catch(console.error)
        // const res = await sdk.force.deleteBatch(0, 6).then(console.log).catch(console.error)
        // const res = await sdk.force.getSubmissionsOfBatch(17179869185).catch(console.error)
        // const res = await sdk.force.deleteCampaign(13).catch(console.error)
        // const res = await sdk.force.getCampaign(13, true).catch(console.error)
        // const res = await sdk.force.getMyLastCampaign(false).catch(console.error)
        // const res = await sdk.force.getCampaignBatches(14).then(console.log).catch(console.error)
        // const res = await sdk.force.deleteBatch(0, 14).then(console.log).catch(console.error)
        
        
        /**
         * Qualification methods
         */
        // sdk.force.getQualifications().then(res => console.log(res.rows)).catch(console.error)
        // sdk.force.getAssignedQualifications(417).then(console.log).catch(console.error)
        // sdk.force.unAssignQualification(20, 417).then(console.log).catch(console.error)
        // sdk.force.editQualification(18,  'Papiament: C1 Advanced Test', 'Description', 0, null, false).then(console.log).catch(console.error)
        // .then(console.log)
        // .catch(console.error)
        // sdk.force.getQualification(0).then(console.log).catch(console.error)
        // await sdk.force.getQualification(1).then(console.log).catch(console.error)
        
        // sdk.force.assignQualification(0,  389).then(console.log).catch(console.error)
        // sdk.force.unAssignQualification(5, 127).then(console.log).catch(console.error)



        
    } catch (e) {
        console.error(e)
    }
}
