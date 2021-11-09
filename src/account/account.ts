import { BaseContract } from '../base-contract/baseContract';
import { EffectClientConfig } from './../types/effectClientConfig';
import { Api, Serialize, Numeric } from 'eosjs'
import RIPEMD160 from "eosjs/dist/ripemd"
import { utils } from 'ethers';
import { isBscAddress } from '../utils/bscAddress'
import { convertToAsset } from '../utils/asset'
import { nameToHex } from '../utils/hex'
import { vAccountRow } from '../types/vAccountRow';
import { TransactResult } from 'eosjs/dist/eosjs-api-interfaces';
import { ReadOnlyTransactResult, PushTransactionArgs } from 'eosjs/dist/eosjs-rpc-interfaces';
import { Signature } from 'eosjs/dist/Signature';

/**
 * > “And he read Principles of Accounting all morning, but just to make it interesting, he put lots of dragons in it.” ― Terry Pratchett, Wintersmith 
 *
 * This class is used to interact with the virtual account system of Effect Network.
 * The virtual account system is a system that allows you to create virtual accounts on the blockchain.
 * This allows users to login with both their EOS and BSC addresses. 
 * Then have one unififying interface from which transactions can be signed from the wallet of the user.
 * 
 */
export class Account extends BaseContract {
  pub: string;

  /**
  * @constructor Creates a new instance of Account
  * @param api The EOS api instance that is used to send transactions to EOS blockchain
  * @param environment The environment that is used to connect to mainnet or testnet blockchain, default is `testnet` which connects to `kylin`
  * @param configuration The configuration that is used to connect to Effect Network
  * @param web3 The web3 instance that is used to interact with BSC blockchain
  */
  constructor(api: Api, configuration: EffectClientConfig, environment: string = 'node') {
    super(api, configuration, environment)
  }

  /**
   * Get a vaccount
   * @param account - name of the account or bsc
   * @returns - object of the given account name
   */
  static getVAccountByName(account: string) {
    const vAccount = this.getVAccountByName(account)
    console.log(`🧑🏽‍🚒🧑🏽‍🚒\nAccount::this.getVaccountByName\n${vAccount}`);
    return vAccount
  }

  /**
   * Get a vaccount
   * @param account - name of the account or bsc
   * @returns - object of the given account name
   */
  getVAccountByName = async (account: string): Promise<Array<vAccountRow>> => {
    try {
      let accString: string;

      if (isBscAddress(account)) {
        const address: string = account.length == 42 ? account.substring(2) : account;
        accString = (nameToHex(this.config.efx_token_account) + "00" + address).padEnd(64, "0");
      } else {
        accString = (nameToHex(this.config.efx_token_account) + "01" + nameToHex(account)).padEnd(64, "0");
      }

      return (await this.api.rpc.get_table_rows({
        code: this.config.account_contract,
        scope: this.config.account_contract,
        index_position: 2,
        key_type: "sha256",
        lower_bound: accString,
        upper_bound: accString,
        table: 'account',
        json: true,
      })).rows;

    } catch (err) {
      throw new Error(err)
    }
  }

  /**
   * Get a vaccount
   * @param id - id of the account
   * @returns - object of the given account id
   */
  getVAccountById = async (id: number): Promise<Array<vAccountRow>> => {
    try {
      return (await this.api.rpc.get_table_rows({
        code: this.config.account_contract,
        scope: this.config.account_contract,
        index_position: 1,
        key_type: "sha256",
        lower_bound: id,
        upper_bound: id,
        table: 'account',
        json: true,
      })).rows

    } catch (err) {
      throw new Error(err)
    }
  }

  /**
   * Open a vaccount
   * @param account - name or address of the account to open, for BSC addresses without 0x
   * @returns
   */
  // TODO: optional parameter signatureProvider, use relayer
  openAccount = async (account: string, permission?: string): Promise<ReadOnlyTransactResult | TransactResult | PushTransactionArgs> => {
    try {
      let type = 'name'
      let address: string
      if (isBscAddress(account)) {
        type = 'address'
        address = account.length == 42 ? account.substring(2) : account;
      }
      return await this.api.transact({
        actions: [{
          account: this.config.account_contract,
          name: 'open',
          authorization: [{
            actor: type == 'address' ? this.config.eos_relayer : account,
            permission: isBscAddress(account) ? this.config.eos_relayer_permission : permission
          }],
          data: {
            acc: [type, type == 'address' ? address : account],
            symbol: { contract: this.config.efx_token_account, sym: this.config.efx_extended_symbol },
            payer: type == 'address' ? this.config.eos_relayer : account,
          },
        }]
      },
      {
        blocksBehind: 3,
        expireSeconds: 60
      });

    } catch (err) {
      throw new Error(err)
    }
  }

  /**
   * Deposit from account to vaccount
   * @param amountEfx amount of tokens
   * @returns transaction result
   */
  deposit = async (amountEfx: string): Promise<ReadOnlyTransactResult | TransactResult | PushTransactionArgs> => {
    try {
      const fromAccount = this.effectAccount.accountName;
      const accountId = this.effectAccount.vAccountRows[0].id

      const amount = convertToAsset(amountEfx)
      await this.updatevAccountRows()
      return await this.api.transact({
        actions: [{
          account: this.config.efx_token_account,
          name: 'transfer',
          authorization: [{
            actor: fromAccount,
            permission: isBscAddress(fromAccount) ? this.config.eos_relayer_permission : this.effectAccount.permission
          }],
          data: {
            from: fromAccount,
            to: this.config.account_contract,
            quantity: amount + ' ' + this.config.efx_symbol,
            memo: accountId,
          },
        }]
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
      });
    } catch (err) {
      throw new Error(err)
    }
  }

  /**
   * Withdraw from vaccount to account
   * @param toAccount account to withdraw to
   * @param amountEfx amount of tokens
   * @param memo optional memo
   * @returns transaction result
   */
  withdraw = async (toAccount: string, amountEfx: string, memo?: string): Promise<ReadOnlyTransactResult | TransactResult | PushTransactionArgs> => {
    let sig: Signature;

    await this.updatevAccountRows()
    const amount = convertToAsset(amountEfx)
    const fromAccount = this.effectAccount.accountName;
    const accountId = this.effectAccount.vAccountRows[0].id
    const nonce = this.effectAccount.vAccountRows[0].nonce

    if (isBscAddress(fromAccount)) {
      const serialbuff = new Serialize.SerialBuffer()
      serialbuff.push(2)
      serialbuff.pushUint32(nonce)
      serialbuff.pushArray(Numeric.decimalToBinary(8, accountId.toString()))
      serialbuff.pushName(toAccount)
      serialbuff.pushAsset(amount + ' ' + this.config.efx_symbol)
      serialbuff.pushName(this.config.efx_token_account)

      sig = await this.generateSignature(serialbuff)
    }
    // TODO: BSC -> BSC transactie met memo via pnetwork
    try {
      return await this.api.transact({
        actions: [{
          account: this.config.account_contract,
          name: 'withdraw',
          authorization: [{
            actor: isBscAddress(fromAccount) ? this.config.eos_relayer : fromAccount,
            permission: isBscAddress(fromAccount) ? this.config.eos_relayer_permission : this.effectAccount.permission
          }],
          data: {
            from_id: accountId,
            to_account: toAccount,
            quantity: {
              quantity: amount + ' ' + this.config.efx_symbol,
              contract: this.config.efx_token_account
            },
            memo: memo,
            sig: isBscAddress(fromAccount) ? sig.toString() : null,
            fee: null
          },
        }]
      },
      {
        blocksBehind: 3,
        expireSeconds: 60
      });

    } catch (err) {
      throw new Error(err)
    }
  }

  /**
   * Transfer between vaccounts
   * @param toAccount vaccount to transfer from
   * @param toAccountId vaccount to transfer to
   * @param amountEfx amount of tokens, example: '10.0000'
   * @returns transaction result
   */
  vtransfer = async (toAccount: string, toAccountId: number, amountEfx: string): Promise<ReadOnlyTransactResult | TransactResult | PushTransactionArgs> => {
    let sig: Signature;

    await this.updatevAccountRows()
    const balanceTo: object = await this.getVAccountByName(toAccount)
    const balanceIndexTo: number = balanceTo[0].id
    const amount = convertToAsset(amountEfx)
    const fromAccount = this.effectAccount.accountName;
    const fromAccountId = this.effectAccount.vAccountRows[0].id
    const nonce = this.effectAccount.vAccountRows[0].nonce

    if (isBscAddress(fromAccount)) {
      const serialbuff = new Serialize.SerialBuffer()
      serialbuff.push(1)
      serialbuff.pushUint32(nonce)
      serialbuff.pushArray(Numeric.decimalToBinary(8, fromAccountId.toString()))
      serialbuff.pushArray(Numeric.decimalToBinary(8, toAccountId.toString()))
      serialbuff.pushAsset(amount + ' ' + this.config.efx_symbol)
      serialbuff.pushName(this.config.efx_token_account)

      sig = await this.generateSignature(serialbuff)
    }

    try {
      return await this.api.transact({
        actions: [{
          account: this.config.account_contract,
          name: 'vtransfer',
          authorization: [{
            actor: isBscAddress(fromAccount) ? this.config.eos_relayer : fromAccount,
            permission: isBscAddress(fromAccount) ? this.config.eos_relayer_permission : this.effectAccount.permission,
          }],
          data: {
            from_id: fromAccountId,
            to_id: balanceIndexTo,
            quantity: {
              quantity: amount + ' ' + this.config.efx_symbol,
              contract: this.config.efx_token_account
            },
            sig: isBscAddress(fromAccount) ? sig.toString() : null,
            fee: null
          },
        }]
      },
      {
        blocksBehind: 3,
        expireSeconds: 60
      });

    } catch (err) {
      throw new Error(err)
    }
  }
}
