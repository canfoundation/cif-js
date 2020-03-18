import { CODE_IDS } from './constant';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';
import { Api as EOSAPI } from 'eosjs';
import { CanCommunityOptions } from '../types/can-community-types';
import { logger } from './logger';
import app from '../app';
import { EosName } from '../smart-contract-types/base-types';
import { TableNameEnum } from '../smart-contract-types/TableNameEnum';
import { CodeTypeEnum } from '../types/smart-contract-enum';

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
 * @param code_type
 * @param referenceId
 */
async function findCode(
  code: EosName,
  community_account: EosName,
  code_id: CODE_IDS,
  code_type: CodeTypeEnum,
  referenceId?: number,
): Promise<any> {
  let res;
  if (code_type === CodeTypeEnum.NORMAL) {
    const codeTable = await app.rpc.get_table_rows({
      code,
      scope: community_account,
      table: TableNameEnum.CODES,
      lower_bound: code_id,
      upper_bound: code_id,
      index_position: 2,
      key_type: 'i64',
    });
    res = codeTable?.rows[0];
  } else if (code_type === CodeTypeEnum.POSITION) {
    const codeTable = await app.rpc.get_table_rows({
      code,
      scope: community_account,
      table: TableNameEnum.CODES,
      lower_bound: referenceId,
      upper_bound: referenceId,
      index_position: 3,
      key_type: 'i64',
    });
    const positionCodes = codeTable?.rows;
    if (positionCodes.length) {
      res = positionCodes.find(c => c.code_name === code_id);
    }
  } else if (code_type === CodeTypeEnum.AMENDMENT) {
    const codeTable = await app.rpc.get_table_rows({
      code,
      scope: community_account,
      table: TableNameEnum.CODES,
      lower_bound: referenceId,
      upper_bound: referenceId,
    });

    res = codeTable?.rows[0];
  }

  logger.debug('---- getCodeId - get_table_rows', JSON.stringify(res));

  return res;
}

function randomNumberInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
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
