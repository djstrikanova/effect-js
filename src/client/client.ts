import { defaultConfiguration } from './../config/config';
import { Api, JsonRpc } from 'eosjs'
import { Account } from '../account/account'
import { Force } from '../force/force'
import { EffectClientConfig } from '../types/effectClientConfig'
import { EffectAccount } from '../types/effectAccount';
import { SignatureProvider } from 'eosjs/dist/eosjs-api-interfaces';
import Web3 from 'web3';
import { eosWalletAuth } from '../types/eosWalletAuth';
import fetch from 'cross-fetch';
import retry from 'async-retry'
export class EffectClient {
    api: Api;
    account: Account;
    effectAccount: EffectAccount;
    force: Force;
    config: EffectClientConfig;
    rpc: JsonRpc;
    fetch: any;
    blob: any;
    formData: any;

    constructor(environment: string = 'node', configuration?: EffectClientConfig) {
        // TODO: set relayer, after merge with relayer branch
        this.config = defaultConfiguration(configuration)
        const { signatureProvider, host } = this.config

        this.rpc = new JsonRpc(host, { fetch })
        this.api = new Api({ rpc: this.rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() })

        this.account = new Account(this.api, this.config, environment)
        this.force = new Force(this.api, this.config, environment)
    }

    /**
     * Connect Account to SDK
     * @param chain 
     * @param signatureProvider 
     * @param web3
     * @param eosAccount 
     * @returns 
     */
    connectAccount = async (signatureProvider?: SignatureProvider, web3?: Web3, eosAccount?: eosWalletAuth, effectAccount?: EffectAccount): Promise<EffectAccount> => {
        try {
            let account;
            let bscAddress;
            
            // TODO look into this; why is 'web3 instanceof Web3' not working?
            if (web3) {
                const message = 'Effect Account'
                const signature = await this.sign(web3, message, effectAccount)
                account = await this.account.recoverPublicKey(message, signature)

                if (effectAccount && effectAccount.provider === 'burner-wallet') {
                    this.effectAccount = { accountName: account.accountAddress, ...effectAccount }
                } else {
                    bscAddress = web3.eth.accounts.wallet[0].address
                    this.effectAccount = { 
                        accountName: account.accountAddress,
                        address: bscAddress,
                    }
                }
                
            } else if (signatureProvider) {
                this.effectAccount = { accountName: eosAccount.accountName, permission: eosAccount.permission, address: eosAccount.publicKey }
                this.api = new Api({ rpc: this.rpc, signatureProvider: signatureProvider ? signatureProvider : null, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() })
            }

            await this.account.setSignatureProvider(this.effectAccount, this.api, web3 ? web3 : null)
            await this.force.setSignatureProvider(this.effectAccount, this.api, web3 ? web3 : null)

            this.effectAccount.vAccountRows = await this.account.getVAccountByName(this.effectAccount.accountName)
         
            // if account doesnt exists: openAccount
            if (!this.effectAccount.vAccountRows || !this.effectAccount.vAccountRows.length) {
                const openedAccount = await this.account.openAccount(this.effectAccount.accountName)
                console.log('Opened account:', openedAccount);

                await retry(async () => {
                    console.log('getVAccountByName after openAccount')
                    this.effectAccount.vAccountRows = await this.account.getVAccountByName(this.effectAccount.accountName)
                }, {
                    retries: 5,
                    onRetry: (error, number) => {
                        console.log('attempt', number, error)
                    }
                })
            }
            return this.effectAccount
        } catch (error) {
            console.error(error)
            throw new Error(error)
        }
    }

    /**
     * BSC Sign
     * @param bsc 
     * @param message 
     * @returns 
     */
    sign = async (web3: Web3, message: string, effectAccount?: EffectAccount): Promise<string> => {
        try {
            const address = web3.eth.accounts.wallet[0].address
            // TODO: how to detect if its a burner-wallet?
            if (effectAccount && effectAccount.provider === 'burner-wallet') {
                // TODO: need to find another solution to sign without giving the private key again
                return (await web3.eth.accounts.sign(message, effectAccount.privateKey)).signature
            } else {
                return await web3.eth.sign(message, address)
            }
        } catch (error) {
            console.error(error)
            return Promise.reject(error)
        }
    }

}
