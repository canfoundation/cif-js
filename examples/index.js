const fetch = require('node-fetch');
const { CanCommunity } = require('cif-js');
const { TextEncoder, TextDecoder } = require('util');

const canCommunity = new CanCommunity('leonardo', '1.0', {
  // @ts-ignore
  fetch: fetch,
  canUrl: 'http://18.182.95.163:8888',
  // @ts-ignore
  textEncoder: new TextEncoder(),
  textDecoder: new TextDecoder(),
  governanceAccount: 'governance22',
});

console.log('canCommunity', canCommunity);
