import { Serialize } from 'eosjs';
import { CanCommunityOptions } from '../types/can-community-types';
import utils from './utils';

let governanceContract;

async function serializeActionData(options: CanCommunityOptions, actionName: string, data: any): Promise<string> {
  const canApi = utils.makeCanApi(options);
  const governanceAccount: string = options.code;

  /**
   * TODO consider to pack governance contract in final build
   * Do so will reduce time of loading contract
   */
  if (!governanceContract) {
    governanceContract = await canApi.getContract(governanceAccount);
  }

  return Serialize.serializeActionData(
    governanceContract,
    governanceAccount,
    actionName,
    data,
    options.textEncoder,
    options.textDecoder,
  );
}

async function deserializeActionData(options: CanCommunityOptions, actionName: string, serializedData: any): Promise<any> {
  const canApi = utils.makeCanApi(options);
  const governanceAccount: string = options.code;

  /**
   * TODO consider to pack governance contract in final build
   * Do so will reduce time of loading contract
   */
  if (!governanceContract) {
    governanceContract = await canApi.getContract(governanceAccount);
  }

  return Serialize.deserializeActionData(
    governanceContract,
    governanceAccount,
    actionName,
    serializedData,
    options.textEncoder,
    options.textDecoder,
  );
}

export { serializeActionData, deserializeActionData };
