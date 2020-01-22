import { CanCommunityOptions } from '../src/types/can-community-types';
// tslint:disable-next-line:no-implicit-dependencies
import * as fetch from 'node-fetch';
import { TextDecoder, TextEncoder } from 'util';

export const options: CanCommunityOptions = {
  // @ts-ignore
  fetch,
  canUrl: process.env.app__can_main_net_url,
  // @ts-ignore
  textEncoder: new TextEncoder(),
  textDecoder: new TextDecoder(),
  code: process.env.app__can_governance_account,
};

it('should pass test', done => {
  done();
});
