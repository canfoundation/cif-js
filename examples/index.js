const fetch = require('node-fetch');
const { CanCommunity } = require('cif-js');
const { TextEncoder, TextDecoder } = require('util');

const canCommunity = new CanCommunity({
  canUrl: 'http://18.182.95.163:8888',
  signOption: {
    userId: '1',
    signTrxMethod: 'CAN_PASS',
    canAccount: 'leonardo',
    communityCanAccount: 'Coin',
  },
  textEncoder: new TextEncoder(),
  textDecoder: new TextDecoder(),
  code: 'governance23',
  fetch,
});

console.log('canCommunity', canCommunity);
