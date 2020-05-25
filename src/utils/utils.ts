import { CODE_IDS } from './constant';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';
import { Api as EOSAPI } from 'eosjs';
import { CanCommunityOptions } from '../types/can-community-types';
import { logger } from './logger';
import app from '../app';
import { EosName } from '../smart-contract-types/base-types';
import { TableNameEnum } from '../smart-contract-types/TableNameEnum';
import { CodeTypeEnum } from '../types/smart-contract-enum';
const bigInt = require('big-integer');

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
  let codeTable;

  switch (code_type) {
    case CodeTypeEnum.NORMAL:
      codeTable = await app.rpc.get_table_rows({
        code,
        scope: community_account,
        table: TableNameEnum.V1_CODE,
        lower_bound: code_id,
        upper_bound: code_id,
        index_position: 2,
        key_type: 'i64',
      });
      res = codeTable?.rows[0];
      break;
    case CodeTypeEnum.POSITION_APPOINT:
    case CodeTypeEnum.POSITION_DISMISS:
    case CodeTypeEnum.POSITION_CONFIG:
    case CodeTypeEnum.BADGE_ISSUE:
    case CodeTypeEnum.BADGE_CONFIG:
      codeTable = await app.rpc.get_table_rows({
        code,
        scope: community_account,
        table: TableNameEnum.V1_CODE,
        lower_bound: buildReferenceId(referenceId, code_type),
        upper_bound: buildReferenceId(referenceId, code_type),
        index_position: 3,
        key_type: 'i128',
      });
      res = codeTable?.rows[0];
      break;
    case CodeTypeEnum.AMENDMENT:
      codeTable = await app.rpc.get_table_rows({
        code,
        scope: community_account,
        table: TableNameEnum.V1_CODE,
        lower_bound: referenceId,
        upper_bound: referenceId,
      });

      res = codeTable?.rows[0];
  }

  logger.debug('---- getCodeId - get_table_rows', JSON.stringify(res));

  return res;
}

function buildReferenceId(itemId: number, codeType: CodeTypeEnum): string {
  // C++ static_cast<uint128_t>(type)  | static_cast<uint128_t>(reference_id) << 64;
  // build id to get code by reference id and code type
  const resBigInt = bigInt(itemId).shiftLeft(64).value | bigInt(codeType).value;
  return resBigInt.toString();
}

function randomNumberInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomEosName(length?: number, characters = '.12345abcdefghijklmnopqrstuvwxyz'): EosName {
  if (!length) {
    length = randomNumberInRange(8, 12);
  }

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
  buildReferenceId,
};
