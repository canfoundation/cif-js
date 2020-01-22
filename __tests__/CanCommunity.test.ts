// tslint:disable:no-implicit-dependencies
import * as faker from 'faker';
import { options } from './test-helper';
import { CanCommunity } from '../src';
import { ActionNameEnum } from '../src/smart-contract-types/ActionNameEnum';
import { SignTrxOption } from '../src/types/can-community-types';
import { SIGN_TRX_METHOD } from '../src/utils/constant';

describe('test CanCommunity', () => {
  const canPass: any = {
    signTx: jest.fn(),
  };
  const cif = new CanCommunity(options, canPass);

  it('should make action', async () => {
    const action = cif.makeAction(ActionNameEnum.CREATE, options.code, {
      obj: 'this is data sent to blockchain',
    });

    expect(action).toEqual({
      account: 'governance23',
      authorization: [
        {
          actor: 'governance23',
          permission: 'active',
        },
      ],
      data: {
        obj: 'this is data sent to blockchain',
      },
      name: 'create',
    });
  });

  describe('should select method for singing trx', () => {
    const spySignTx = canPass.signTx;

    it('missing of signOption', async () => {
      const trx = {};
      expect(() => cif.signTrx(trx)).toThrow('missing `userId` in `signOption`');
    });

    it('has signOption with CAN_PASS as method', async () => {
      const spySignTrx = jest.spyOn(cif, 'signTrx');
      const trx = {};
      const signOption: SignTrxOption = {
        ...options.signOption,
        userId: faker.random.uuid(),
        signTrxMethod: SIGN_TRX_METHOD.CAN_PASS,
      };
      expect(() => cif.signTrx(trx, signOption)).not.toThrow('missing `userId` in `signOption`');
      expect(spySignTrx).toBeCalledWith(trx, signOption);
      expect(spySignTx).toBeCalledWith(trx, signOption.userId);
    });
  });
});
