const effectjs = require('./')
const Web3 = require('web3')

const main = async () => {
    console.log('Starting...')

    // Example sdkOptions, that are not needed right now. But are here for illuminating how to use the configuration object.
    const sdkOptions = {
        network: 'kylin',
        host: 'https://api.kylin.alohaeos.com'
    }
    const sdk = new effectjs.EffectClient('node', sdkOptions)

    // Instantiating burnerwallet.
    const burnerwallet = new effectjs.BurnerWallet().addAccount()
    // OR
    
    // const burnerWallet = new effectjs.BurnerWallet(
    //     '0x6f46d8d7c9684ed049c941758cb9186eb2b5758221a229e27861fe357edb770d'
    // ).addAccount()

    const web3 = burnerWallet.getWeb3()
    const account = burnerWallet.getAccount()

    const effectAccount = await sdk.connectAccount('bsc', null, web3, account);
    console.log(effectAccount)
}

main()