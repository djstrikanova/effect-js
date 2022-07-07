// import dotenv from 'dotenv'
const dotenv = require('dotenv')
const { EffectClient, createAccount, createWallet } = require('../dist/lib')
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');      // development only
const {connectEosAccount, connectBscAccount} = require('./connect_efx_account')
const fs = require('fs')

// import json
// const ids = require('./old_newwrongid_newcorrectid.json')
// const qualis = require('./new_qualis.json').data
const new_wrong_correct = require('./fix_new_wrong_correct.json')
const user_qualifications = require('./cur_user_quali.json')
const fixed_user_qualifications = require('./fix_user_quali.json')
const ALPHAQUALI = 117

const HUMANQUALIBLOCK = 119

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

        const non_human_users = fixed_user_qualifications.filter(user => user.quali_id === HUMANQUALIBLOCK)
        console.log('non_human_users', non_human_users.length)

        for (const user of non_human_users) {
            console.log('user', user)
            sdk.force.unAssignQualification(user.quali_id, user.account_id).then(console.log).catch(console.error)
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

function mapids () {
    // use ids
    for (const id of ids) {
        if (id.old_name === "ES Translation Validator") {
            
            /**
                {
                    "id": 94,
                    "content": {
                    "field_0": 0,
                    "field_1": "QmaQW5A61p7W5LMeDSMKKwttXASa5Tp3iPsoTsJnuFzdjD"
                    },
                    "account_id": 389,
                    "info": {
                    "name": "ES Translation Validator",
                    "description": "Official Effect Network Qualification.",
                    "type": null,
                    "image": "https://effect.network/img/logo/logo_icon.png",
                    "ishidden": false
                    }
                },
                */

                id.new_correct_id = 94
                console.log('id', id)
        } else {
            const now_cor_quali = qualis.find(ql => ql.info.name === id.old_name)
            console.log('now_cor_quali', now_cor_quali)
            id.new_correct_id = now_cor_quali.id
            console.log(id.new_correct_id + '\t' + now_cor_quali.info.name)
        }
    }

    for (const id of ids) {
        console.log(id.new_correct_id + '\t' + id.old_name)
    }

    // console.log('ids', ids)

    // save json to file
    // fs.writeFileSync('./old_newwrongid_newcorrectid.json', JSON.stringify(ids, null, 2))
}

async function reassignQuali () {
    // filter out users that have the alpha quali
    const users_with_alpha = user_qualifications.filter(user => user.quali_id === ALPHAQUALI)
    // console.log('users_with_alpha', users_with_alpha)

    // Create list of qualifications from the users_with_alpha
    const qualifications = users_with_alpha.map(user => {
        return user_qualifications.filter(qual => qual.account_id === user.account_id)
    })

    // console.log('qualifications', qualifications)

    // Check that the the length of the qualifications  are the same as the users_with_alpha
    console.log(qualifications.length, users_with_alpha.length)

    if (qualifications.length !== users_with_alpha.length) {
        console.log('ERROR: The length of the qualifications and the users_with_alpha are not the same')
        process.exit(1)
    }

    // loop through qualificaitons after flattening it. This list only contains users with the alpha quali
    let tally = 0
    for (const qual of qualifications.flat()) {
        // console.log(qual)
        if (new_wrong_correct.some(wrngcor => wrngcor.new_wrong_id === qual.quali_id)) {
            console.log(tally)
            const new_wrong_id = new_wrong_correct.find(wrngcor => wrngcor.new_wrong_id === qual.quali_id)
            console.log('Error found, reassigning quali:\n', qual, '\n', new_wrong_id.old_name, '\n','Error ID: ', new_wrong_id.new_wrong_id, '\n', 'Fix ID: ', new_wrong_id.new_correct_id)

            await sdk.force.unAssignQualification(qual.quali_id, qual.account_id).then(res => console.log('Success\n', res)).catch(console.error)
            await sdk.force.assignQualification(new_wrong_id.new_correct_id, qual.account_id).then(res => console.log('Success\n', res)).catch(console.error)

            console.log('\n-----------------------------------------------------\n')
            tally += 1
        }
    }    
}

async function checkdiff () {
        // console.log(user_qualifications)
    // console.log(fixed_user_qualifications)
    // console.log(new_wrong_correct)

    const alpha_users = user_qualifications.filter(user => user.quali_id === ALPHAQUALI)
    console.log('alpha_users', alpha_users)

    const alpha_users_qualis = alpha_users.map(alphauser => {
        const cur_user = user_qualifications.filter(user => user.account_id === alphauser.account_id)
        console.log('cur_user', cur_user)
        const fix_user = fixed_user_qualifications.filter(user => user.account_id === alphauser.account_id)
        console.log('fix_user', fix_user)
        return {
            account_id: alphauser.account_id,
            cur_user: cur_user.length,
            fix_user: fix_user.length,
            correct: cur_user.length === fix_user.length
        }
    })
    console.log('alpha_users_qualis', alpha_users_qualis)
}