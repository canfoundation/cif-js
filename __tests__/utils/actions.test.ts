import { TextDecoder, TextEncoder } from 'util';
// tslint:disable:no-implicit-dependencies
import { serializeActionData, deserializeActionData } from '../../src/utils/actions';
import app from '../../src/app';
import { options } from '../test-helper';
import { Create } from '../../src/smart-contract-types/Create';
import { ActionNameEnum } from '../../src/smart-contract-types/ActionNameEnum';

describe('test action util', () => {
  app.init(options.canUrl, options.fetch, TextEncoder, TextDecoder);

  it('should pack a hex string - contract action params', async () => {
    const action = ActionNameEnum.CREATE;
    const data: Create = {
      creator: options.signOption.canAccount,
      community_account: options.signOption.communityCanAccount,
      community_name: 'Lecle Vietname',
      member_badge: [],
      community_url: 'http://lecle.vn',
      description: 'Hello Vietnam',
      create_default_code: true,
    };

    const getPackedParams = await serializeActionData(options, action, data);

    expect(getPackedParams).toBe(
      '10F2D4142193B1CA2088F0D94D2D25450E4C65636C6520566965746E616D65000F687474703A2F2F6C65636C652E766E0D48656C6C6F20566965746E616D01',
    );
  }, 50000);

  it('should unpack hex string - contract action params', async () => {
    const action = ActionNameEnum.CREATE;
    const data: Create = {
      creator: options.signOption.canAccount,
      community_account: options.signOption.communityCanAccount,
      community_name: 'Lecle Vietname',
      member_badge: [],
      community_url: 'http://lecle.vn',
      description: 'Hello Vietnam',
      create_default_code: true,
    };

    const packedData =
      '10F2D4142193B1CA2088F0D94D2D25450E4C65636C6520566965746E616D65000F687474703A2F2F6C65636C652E766E0D48656C6C6F20566965746E616D01';

    const unpackedData = await deserializeActionData(options, action, packedData);

    expect(unpackedData).toBeTruthy();
    expect(unpackedData.creator).toBe(data.creator);
    expect(unpackedData.description).toBe(data.description);
  }, 50000);
});
