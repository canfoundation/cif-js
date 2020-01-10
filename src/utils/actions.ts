import { Serialize, JsonRpc, Api as EOSAPI } from 'eosjs';
import { CanCommunityOptions } from '../types/canCommunity';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';

let governanceContract;
let canApi: EOSAPI;

function makeCanApi(options: CanCommunityOptions) {
  if (canApi) {
    return canApi;
  }

  const { canUrl, textEncoder, textDecoder, fetch } = options;

  const signatureProvider: JsSignatureProvider = new JsSignatureProvider([]);

  return (canApi = new EOSAPI({
    rpc: new JsonRpc(canUrl, {
      fetch,
    }),
    signatureProvider,
    textEncoder,
    textDecoder,
  }));
}

async function serializeActionData(options: CanCommunityOptions, actionName: string, data: any): Promise<string> {
  makeCanApi(options);
  const governanceAccount: string = options.governanceAccount;

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

export { serializeActionData };
