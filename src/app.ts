import { JsonRpc, Api } from 'eosjs/dist';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';

class App {
  rpc: JsonRpc;
  api: Api;

  init(canUrl: string, fetch: any, textEncoder, textDecoder) {
    this.rpc = new JsonRpc(canUrl, { fetch });
    this.api = new Api({
      rpc: this.rpc,
      signatureProvider: new JsSignatureProvider([]),
      textDecoder,
      textEncoder,
    });
  }
}

export default new Proxy(new App(), {
  get(obj, p) {
    if (!obj[p]) {
      throw new Error('cif js was not initialized correctly, check options params');
    }

    return obj[p];
  },
});
