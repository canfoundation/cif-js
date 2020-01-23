import { CODE_IDS, TABLE } from './constant';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';
import { Api as EOSAPI } from 'eosjs';
import { CanCommunityOptions } from '../types/can-community-types';
import { logger } from './logger';
import app from '../app';
import { EosName } from '../smart-contract-types/base-types';

function makeCanApi(options: CanCommunityOptions) {
  const { textEncoder, textDecoder } = options;
  const signatureProvider: JsSignatureProvider = new JsSignatureProvider([]);

  return new EOSAPI({
    rpc: app.rpc,
    signatureProvider,
    textEncoder,
    textDecoder,
  });
}

/**
 * Each CODE_IDS has unique integer id for each position for example.
 * This is function which help get the integer id
 * @param code
 * @param community_account
 * @param code_id
 */
async function findCode(code: EosName, community_account: EosName, code_id: CODE_IDS): Promise<any> {
  const res = await app.rpc.get_table_rows({
    code,
    scope: community_account,
    table: TABLE.CODES,
    lower_bound: code_id,
    upper_bound: code_id,
    index_position: 2,
    key_type: 'i64',
  });

  logger.debug('---- getCodeId - get_table_rows', JSON.stringify(res));

  return res?.rows[0];
}

function randomNumberInRange(min: number, max: number): number {
  return Math.floor(Math.random() * max) + min;
}

function randomEosName(length?: number): EosName {
  if (!length) {
    length = randomNumberInRange(8, 12);
  }

  const characters = '.12345abcdefghijklmnopqrstuvwxyz';
  const charactersLength = characters.length;
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export default {
  makeCanApi,
  findCode,
  randomEosName,
  randomNumberInRange,
};
