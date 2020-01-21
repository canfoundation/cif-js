// tslint:disable-next-line:no-implicit-dependencies
import { TextDecoder, TextEncoder } from 'util';
// tslint:disable-next-line:no-implicit-dependencies
import * as fetch from 'node-fetch';
import { serializeActionData } from '../src/utils/actions';
import { CanCommunityOptions } from '../src/types/can-community-types';

describe('test action util', () => {
  const options: CanCommunityOptions = {
    // @ts-ignore
    fetch,
    canUrl: process.env.app__can_main_net_url,
    // @ts-ignore
    textEncoder: new TextEncoder(),
    textDecoder: new TextDecoder(),
    governanceAccount: 'governance22',
  };

  it('should pack a hex string - contract action params', async () => {
    const action = 'createcode';
    const data = {
      community_account: 'community413',
      code_id: 'test.test1',
      contract_name: options.governanceAccount,
      code_actions: ['any_string', 'any_string'],
      exec_type: 0,
    };

    const getPackedParams = await serializeActionData(options, action, data);

    expect(getPackedParams).toBe('3002F1D94D2D25450040C8586590B1CA208442D3CCAB36650200009BEE660CFC3400009BEE660CFC3400');
  }, 50000);
});
