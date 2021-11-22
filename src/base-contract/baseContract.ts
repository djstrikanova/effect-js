import { Account } from './../account/account';
import * as EthAccount from 'eth-lib/lib/account';
import { EffectClientConfig } from './../types/effectClientConfig';
import { Api, Serialize } from 'eosjs'
import RIPEMD160 from "eosjs/dist/ripemd"
import Web3 from 'web3';
import { Signature } from 'eosjs/dist/eosjs-key-conversions';
import { utils } from 'ethers';
import { EffectAccount } from '../types/effectAccount';
import BN from 'bn.js';
import retry from 'async-retry'
import { Transaction } from 'eosjs/dist/eosjs-api-interfaces';
import { isBscAddress } from '../utils/bscAddress'

const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

/**
 * > “Elinor agreed to it all, for she did not think he deserved the compliment of rational opposition.” ― Jane Austen
 *
 * The BaseContract class is the base class for Accounts and Force classes.
 * It's main functionality is to handle the signatures and the connection to the network.
 */
export class BaseContract {
  api: Api;
  web3: Web3;
  config: EffectClientConfig;
  effectAccount: EffectAccount;
  fetch: any;
  blob: any;
  formData: any;

  /**
   * Constructor for the BaseContract class.
   * @param api The EOSIO API
   * @param configuration The configuration object for the client.
   * @param environment The environment to connect to, either 'node' or 'browser'
   */
  constructor(api: Api, configuration: EffectClientConfig) {
    this.api = api;
    this.config = configuration;
    this.web3 = this.config.web3;
    if (typeof window === 'undefined') {
      import('@web-std/fetch').then(module => this.fetch = module.default)
      import('@web-std/blob').then(module => this.blob = module.Blob)
      import('@web-std/form-data').then(module => this.formData = module.FormData)
    } else {
      this.fetch = window.fetch.bind(window);
      this.blob = Blob
      this.formData = FormData
    }
  }

  isAccountConnected = target => next => (...args) => {
    if (!this.effectAccount) {
      console.error(`🖐🏽🖐🏽🖐🏽\nBaseContract::this.effectAccount\n${this.effectAccount}`)
      throw 'No account connected.'
    }
    return next(...args)
  }

  /**
  * Update vAccountRows, then use length of rows as nonce.
  * @returns {Promise<number>} Nonce to be used with each transaction
  */
  updatevAccountRows = async (): Promise<EffectAccount> => {
    try {
      const account = this.effectAccount.accountName;
      this.effectAccount.vAccountRows = Account.getVAccountByName(account)
      return this.effectAccount
    } catch (err) {
      throw new Error(err)
    }
  }

  /**
<<<<<<< HEAD
   * 
   * @param effectAccount 
   * @param api 
   * @param web3 
=======
   *
   * @param rpc
   * @param signatureProvider
   * @param web3
   * @returns
>>>>>>> a9836d5ae1048384d782bb409f44af01fad7e959
   */
  setSignatureProvider = async (effectAccount: EffectAccount, api: Api, web3: Web3): Promise<void> => {
    if (web3) {
      this.web3 = web3;
    }
    this.api = api
    this.effectAccount = effectAccount
  }

  /**
   * Recover BSC public key from signed message
   * @param message
   * @param signature
   * @returns
   */
  recoverPublicKey = async (message: string, signature: string): Promise<object> => {
    // recover public key
    const hashedMsg = utils.hashMessage(message)
    const pk = utils.recoverPublicKey(utils.arrayify(hashedMsg), signature.trim())
    const address = utils.computeAddress(utils.arrayify(pk))

    // compress public key
    const keypair = ec.keyFromPublic(pk.substring(2), 'hex')
    const compressed = keypair.getPublic().encodeCompressed('hex')

    // RIPEMD160 hash public key
    const ripemd16 = RIPEMD160.RIPEMD160.hash(Serialize.hexToUint8Array(compressed))
    const accountName = Serialize.arrayToHex(new Uint8Array(ripemd16)).toLowerCase()
    return { address, accountName }
  }

  /**
   *
   * @param serialbuff
   * @returns signature
   */
  generateSignature = async (serialbuff: Serialize.SerialBuffer): Promise<Signature> => {
    let sig = undefined
    const bytes = serialbuff.asUint8Array()

    let paramsHash = ec.hash().update(bytes).digest()
    paramsHash = Serialize.arrayToHex(paramsHash)

    try {
      if (this.effectAccount.privateKey) {
        // TODO: figure out how to do this more clean later on.
        sig = EthAccount.sign('0x' + paramsHash, this.effectAccount.privateKey);
      } else {
        sig = await this.web3.eth.sign('0x' + paramsHash, this.effectAccount.address)
      }
    } catch (error) {
      return Promise.reject(error)
    }

    sig = utils.splitSignature(sig)
    // TODO: figure out how to get Signature in right format without this hack
    sig.r = new BN(sig.r.substring(2), 16)
    sig.s = new BN(sig.s.substring(2), 16)
    sig = Signature.fromElliptic(sig, 0)

    return sig
  }

  /**
   * Get IPFS Content in JSON
   * @param hash - hash of the IPFS content you want to fetch
   * @param format - format of the content you are fetching.
   * @returns content of the ipfs hash in your preferred format
   */
  getIpfsContent = async (hash: string, format: string = 'json'): Promise<any> => {
    const data = await this.fetch(`${this.config.ipfs_node}/ipfs/${hash}`)
    switch (format.toLowerCase()) {
      case 'formdata':
      case 'form':
        return data.text()
      case 'buffer':
      case 'arraybuffer':
      case 'array':
        return data.arrayBuffer()
      case 'blob':
        return data.blob()
      case 'text':
        return data.text()
      case 'json':
        return data.json()
    }
    return data
  }

  /**
   * 
   * @param tx 
   * @param irreversible 
   * @returns 
   */
  waitTransaction = async function (tx: string, irreversible?: boolean): Promise<Transaction> {
    let transaction
    await retry(async () => {
      transaction = await this.api.rpc.history_get_transaction(tx)
      if (!transaction || irreversible && !transaction.irreversible || !transaction.block_num || transaction.trx.receipt.status !== 'executed') {
        throw new Error('Transaction not ready yet')
      }
    }, {
        retries: 10,
        onRetry: (error, number) => {
          console.log('attempt', number, error)
        }
    })
    return transaction
  }
  
  /*
   * @param owner
   * @param action
   * @returns
   */
  sendTransaction = async function (owner: string, action: object | object[]): Promise<any> {
    let actions = [].concat(action)
    try {
      if (isBscAddress(owner)) {
        // post to relayer
        return this.fetch(this.config.eos_relayer_url + '/transaction', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(actions)
        }).then(response=>response.json())
        .then(data=>{ return JSON.parse(data) })
     } else {
       return await this.api.transact({
         actions
       }, {
         blocksBehind: 3,
         expireSeconds: 30,
       });
     }

    } catch (error) {
      throw new Error(error)
    }
  }
}
