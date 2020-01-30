import { JsonRpc } from 'eosjs/dist';

class App {
  rpc: JsonRpc;

  init(canUrl: string, fetch: any) {
    this.rpc = new JsonRpc(canUrl, { fetch });
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
