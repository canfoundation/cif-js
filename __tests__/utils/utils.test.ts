import utils from '../../src/utils/utils';
import { options } from '../test-helper';
import { CODE_IDS } from '../../src/utils/constant';
import app from '../../src/app';

jest.mock('eosjs');

describe('test some utility functions', () => {
  app.init(options.canUrl, options.fetch);

  it('should get code id', async () => {
    const get_table_rows = jest.spyOn(app.rpc, 'get_table_rows');
    get_table_rows.mockResolvedValue({
      // @ts-ignore
      rows: [
        {
          code_id: 1,
          code_name: 'po.create',
          contract_name: 'governance23',
          code_actions: ['createpos'],
          code_execution_right: {
            required_badges: [],
            required_positions: [],
            required_tokens: [],
            required_exp: 0,
            accounts: ['creator.can'],
          },
          amendment_execution_right: {
            required_badges: [],
            required_positions: [],
            required_tokens: [],
            required_exp: 0,
            accounts: ['creator.can'],
          },
          code_exec_type: 1,
          amendment_exec_type: 0,
          code_type: { type: 0, refer_id: 0 },
        },
      ],
      more: false,
    });

    const code = await utils.findCode(options.code, 'community242', CODE_IDS.CREATE_POSITION);
    expect(get_table_rows).toBeCalledWith({
      code: 'governance23',
      index_position: 2,
      key_type: 'i64',
      lower_bound: 'po.create',
      scope: 'community242',
      table: 'codes',
      upper_bound: 'po.create',
    });
    expect(code.code_id).toEqual(1);
    expect(code.code_name).toEqual(CODE_IDS.CREATE_POSITION);
  });
});
