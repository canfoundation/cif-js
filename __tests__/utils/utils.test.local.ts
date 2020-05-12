import { TextDecoder, TextEncoder } from 'util';
import utils from '../../src/utils/utils';
import { options } from '../test-helper';
import { CODE_IDS } from '../../src/utils/constant';
import app from '../../src/app';
import { CodeTypeEnum } from '../../src/types/smart-contract-enum';

describe('test some utility functions', () => {
  app.init(options.canUrl, options.fetch, TextEncoder, TextDecoder);

  // skip due to test request directly to can net
  xit('should get code id', async () => {
    const code = await utils.findCode(options.code, 'community244', CODE_IDS.CREATE_POSITION, CodeTypeEnum.NORMAL);
    expect(code.code_id).toEqual(1);
    expect(code.code_name).toEqual(CODE_IDS.CREATE_POSITION);
  });
});
