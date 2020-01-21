import utils from '../../src/utils/utils';
import { options } from '../test-helper';
import { CODE_IDS } from '../../src/utils/constant';

describe('test some utility functions', () => {
  it('should get code id', async () => {
    const code = await utils.findCode(options, 'community242', CODE_IDS.CREATE_POSITION);
    expect(code.code_id).toEqual(1);
    expect(code.code_name).toEqual(CODE_IDS.CREATE_POSITION);
  });
});
