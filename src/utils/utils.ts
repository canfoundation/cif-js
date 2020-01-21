import { CODE_IDS, TABLE } from './constant';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';
import { JsonRpc, Api as EOSAPI } from 'eosjs';
import { CanCommunityOptions, EosName } from '../types/can-community-types';
import { logger } from './logger';

let canApi: EOSAPI;
let rpc: JsonRpc;

function makeRpc(fetch, canUrl) {
  if (rpc) {
    return rpc;
  }

  return (rpc = new JsonRpc(canUrl, {
    fetch,
  }));
}

function makeCanApi(options: CanCommunityOptions) {
  if (canApi) {
    return canApi;
  }

  const { textEncoder, textDecoder } = options;

  const signatureProvider: JsSignatureProvider = new JsSignatureProvider([]);

  return (canApi = new EOSAPI({
    rpc: makeRpc(options.fetch, options.canUrl),
    signatureProvider,
    textEncoder,
    textDecoder,
  }));
}

/**
 * Each CODE_IDS has unique integer id for each position for example.
 * This is function which help get the integer id
 * @param options
 * @param community_account
 * @param code_id
 */
async function findCode(options: CanCommunityOptions, community_account: EosName, code_id: CODE_IDS): Promise<any> {
  makeRpc(options.fetch, options.canUrl);

  const res = await rpc.get_table_rows({
    code: options.governanceAccount,
    scope: community_account,
    table: TABLE.CODES,
    lower_bound: code_id,
    upper_bound: code_id,
    index_position: 2,
    key_type: 'i64',
  });

  logger.debug('---- getCodeId - get_table_rows', JSON.stringify(res));

  return res.rows[0];
}

export default {
  makeRpc,
  makeCanApi,
  findCode,
};
