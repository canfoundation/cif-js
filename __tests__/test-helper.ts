import { CanCommunityOptions } from '../src/types/can-community-types';
// tslint:disable-next-line:no-implicit-dependencies
import * as fetch from 'node-fetch';
import { TextDecoder, TextEncoder } from 'util';
import { SIGN_TRX_METHOD } from '../src/utils/constant';

export const options: CanCommunityOptions = {
  // @ts-ignore
  fetch,
  canUrl: process.env.app__can_main_net_url,
  // @ts-ignore
  textEncoder: new TextEncoder(),
  textDecoder: new TextDecoder(),
  code: process.env.app__can_governance_account,
  signOption: {
    canAccount: 'testaccount1',
    communityCanAccount: 'community242',
    signTrxMethod: SIGN_TRX_METHOD.CAN_PASS,
  },
};

it('should pass test', done => {
  done();
});
