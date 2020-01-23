// tslint:disable:no-implicit-dependencies
import * as faker from 'faker';
import _ from 'lodash';
import { options } from './test-helper';
import { CanCommunity } from '../src';
import { ActionNameEnum } from '../src/smart-contract-types/ActionNameEnum';
import { SignTrxOption } from '../src/types/can-community-types';
import { CODE_IDS, EXECUTION_TYPE, SIGN_TRX_METHOD } from '../src/utils/constant';
import utils from '../src/utils/utils';
import { Create } from '../src/smart-contract-types/Create';
import * as actions from '../src/utils/actions';

describe('test CanCommunity', () => {
  const canPass: any = {
    signTx: jest.fn(),
  };

  it('should make action', async () => {
    const cif = new CanCommunity(options, canPass);
    const data = {
      obj: faker.lorem.words(),
    };
    const action = cif.makeAction(ActionNameEnum.CREATE, options.signOption.canAccount, data);

    expect(action).toEqual({
      account: options.code,
      authorization: [
        {
          actor: options.signOption.canAccount,
          permission: 'active',
        },
      ],
      data,
      name: ActionNameEnum.CREATE,
    });
  });

  describe('should select method for singing trx', () => {
    const cif = new CanCommunity(options, canPass);
    const spySignTx = canPass.signTx;
    beforeEach(async () => {
      spySignTx.mockRestore();
    });

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

    it('has signOption with MANUAL as method', async () => {
      const spySignTrx = jest.spyOn(cif, 'signTrx');
      const trx = {};

      const signOption: SignTrxOption = {
        ...options.signOption,
        signTrxMethod: SIGN_TRX_METHOD.MANUAL,
      };

      let rs;
      expect(() => (rs = cif.signTrx(trx, signOption))).not.toThrow('missing `userId` in `signOption`');
      expect(spySignTrx).toBeCalledWith(trx, signOption);
      expect(spySignTx).not.toBeCalled();
      expect(rs).toEqual(trx);
    });
  });

  describe('test execCode function', () => {
    it('no default param', async () => {
      const cif = new CanCommunity(options, canPass);
      const code_id: CODE_IDS = CODE_IDS.CREATE_POSITION;
      const code_action: ActionNameEnum = ActionNameEnum.CREATEPOS;
      const packed_params: string = faker.lorem.words();

      const spyFindCode = jest.spyOn(utils, 'findCode');
      spyFindCode.mockResolvedValue({
        code_exec_type: EXECUTION_TYPE.COLLECTIVE_DECISION,
        code_id: faker.random.number(),
      });

      await expect(cif.execCode(code_id, code_action, packed_params)).rejects.toThrow('missing `userId` in `signOption`');
      spyFindCode.mockResolvedValue({
        code_exec_type: EXECUTION_TYPE.SOLE_DECISION,
        code_id: faker.random.number(),
      });

      await expect(cif.execCode(code_id, code_action, packed_params)).rejects.toThrow('missing `userId` in `signOption`');
    });

    describe('no default param, but has userId', () => {
      it('EXECUTION_TYPE.COLLECTIVE_DECISION', async () => {
        const _options = _.cloneDeep(options);
        _options.signOption.userId = faker.random.uuid();

        const cif = new CanCommunity(_options, canPass);
        const signTrx = jest.spyOn(cif, 'signTrx');
        const code_id: CODE_IDS = CODE_IDS.CREATE_POSITION;
        const code_action: ActionNameEnum = ActionNameEnum.CREATEPOS;
        const packed_params: string = faker.lorem.words();

        const setupCode = {
          code_exec_type: EXECUTION_TYPE.COLLECTIVE_DECISION,
          code_id: faker.random.number(),
        };
        const spyFindCode = jest.spyOn(utils, 'findCode');
        spyFindCode.mockResolvedValue(setupCode);

        await cif.execCode(code_id, code_action, packed_params);
        expect(signTrx).toBeCalledWith({
          actions: [
            {
              account: _options.code,
              authorization: [
                {
                  actor: _options.signOption.canAccount,
                  permission: 'active',
                },
              ],
              data: {
                code_action: ActionNameEnum.CREATEPOS,
                code_id: setupCode.code_id,
                community_account: _options.signOption.communityCanAccount,
                data: packed_params,
                proposal_name: expect.stringMatching(/[1-5.a-z]{1,12}/),
                proposer: _options.signOption.canAccount,
              },
              name: ActionNameEnum.PROPOSECODE,
            },
          ],
        });
      });

      it('EXECUTION_TYPE.SOLE_DECISION', async () => {
        const _options = _.cloneDeep(options);
        _options.signOption.userId = faker.random.uuid();

        const cif = new CanCommunity(_options, canPass);
        const signTrx = jest.spyOn(cif, 'signTrx');
        const code_id: CODE_IDS = CODE_IDS.CREATE_POSITION;
        const code_action: ActionNameEnum = ActionNameEnum.CREATEPOS;
        const packed_params: string = faker.lorem.words();

        const setupCode = {
          code_exec_type: EXECUTION_TYPE.SOLE_DECISION,
          code_id: faker.random.number(),
        };
        const spyFindCode = jest.spyOn(utils, 'findCode');
        spyFindCode.mockResolvedValue(setupCode);

        await cif.execCode(code_id, code_action, packed_params);

        expect(signTrx).toBeCalledWith({
          actions: [
            {
              account: _options.code,
              authorization: [
                {
                  actor: _options.signOption.canAccount,
                  permission: 'active',
                },
              ],
              data: {
                code_action: ActionNameEnum.CREATEPOS,
                code_id: setupCode.code_id,
                community_account: _options.signOption.communityCanAccount,
                exec_account: _options.signOption.canAccount,
                packed_params,
              },
              name: ActionNameEnum.EXECCODE,
            },
          ],
        });
      });
    });
  });

  it('should create community', async () => {
    const _options = _.cloneDeep(options);
    _options.signOption.userId = faker.random.uuid();

    const cif = new CanCommunity(_options, canPass);

    const input: Create = {
      creator: _options.signOption.canAccount,
      community_account: utils.randomEosName(),
      community_name: faker.lorem.words(),
      member_badge: new Array(faker.random.number({ max: 10 })).fill(0).map(() => faker.random.number()),
      community_url: faker.internet.url(),
      description: faker.lorem.paragraph(),
      create_default_code: faker.random.boolean(),
    };

    const signTrx = jest.spyOn(cif, 'signTrx');
    const initialCAT = `${faker.random.number()}.0000 CAT`;

    cif.createCommunity(input, initialCAT);

    expect(signTrx).toBeCalledWith({
      actions: [
        {
          account: 'eosio.token',
          authorization: [{ actor: _options.signOption.canAccount, permission: 'active' }],
          data: {
            from: options.signOption.canAccount,
            memo: input.community_account,
            quantity: initialCAT,
            to: _options.code,
          },
          name: 'transfer',
        },
        {
          account: _options.code,
          authorization: [{ actor: options.signOption.canAccount, permission: 'active' }],
          data: input,
          name: ActionNameEnum.CREATE,
        },
      ],
    });
  });

  describe('the same pattern functions 1', () => {
    it('should createCode', async () => {
      const _options = _.cloneDeep(options);
      _options.signOption.userId = faker.random.uuid();

      const cif = new CanCommunity(_options, canPass);

      const input = {};
      const packedParams = faker.lorem.words();

      const execCode = jest.spyOn(cif, 'execCode');
      execCode.mockResolvedValue({});

      const serializeActionData = jest.spyOn(actions, 'serializeActionData');
      serializeActionData.mockResolvedValue(packedParams);

      // @ts-ignore
      await cif.createCode(input);
      expect(serializeActionData).toBeCalledWith(_options, ActionNameEnum.CREATECODE, input);
      expect(execCode).toBeCalledWith(CODE_IDS.CREATE_CODE, ActionNameEnum.CREATECODE, packedParams, undefined);
    });

    it('should setRightHolderForCode', async () => {
      const _options = _.cloneDeep(options);
      _options.signOption.userId = faker.random.uuid();

      const cif = new CanCommunity(_options, canPass);

      const input = {};
      const packedParams = faker.lorem.words();

      const execCode = jest.spyOn(cif, 'execCode');
      execCode.mockResolvedValue({});

      const serializeActionData = jest.spyOn(actions, 'serializeActionData');
      serializeActionData.mockResolvedValue(packedParams);

      // @ts-ignore
      await cif.setRightHolderForCode(input);
      expect(serializeActionData).toBeCalledWith(_options, ActionNameEnum.SETRIGHTCODE, input);
      expect(execCode).toBeCalledWith(CODE_IDS.SET_RIGHT_HOLDER_FOR_CODE, ActionNameEnum.SETRIGHTCODE, packedParams, undefined);
    });

    it('should setCollectionRuleForCode', async () => {
      const _options = _.cloneDeep(options);
      _options.signOption.userId = faker.random.uuid();

      const cif = new CanCommunity(_options, canPass);

      const input = {};
      const packedParams = faker.lorem.words();

      const execCode = jest.spyOn(cif, 'execCode');
      execCode.mockResolvedValue({});

      const serializeActionData = jest.spyOn(actions, 'serializeActionData');
      serializeActionData.mockResolvedValue(packedParams);

      // @ts-ignore
      await cif.setCollectionRuleForCode(input);
      expect(serializeActionData).toBeCalledWith(_options, ActionNameEnum.SETCOLLECTRL, input);
      expect(execCode).toBeCalledWith(
        CODE_IDS.SET_COLLECTION_RULE_FOR_CODE,
        ActionNameEnum.SETCOLLECTRL,
        packedParams,
        undefined,
      );
    });

    it('should setRightHolderForPosition', async () => {
      const _options = _.cloneDeep(options);
      _options.signOption.userId = faker.random.uuid();

      const cif = new CanCommunity(_options, canPass);

      const input = {};
      const packedParams = faker.lorem.words();

      const execCode = jest.spyOn(cif, 'execCode');
      execCode.mockResolvedValue({});

      const serializeActionData = jest.spyOn(actions, 'serializeActionData');
      serializeActionData.mockResolvedValue(packedParams);

      // @ts-ignore
      await cif.setRightHolderForPosition(input);
      expect(serializeActionData).toBeCalledWith(_options, ActionNameEnum.SETRIGHTCODE, input);
      expect(execCode).toBeCalledWith(
        CODE_IDS.SET_RIGHT_HOLDER_FOR_POSITION,
        ActionNameEnum.SETRIGHTCODE,
        packedParams,
        undefined,
      );
    });

    it('should createPosition', async () => {
      const _options = _.cloneDeep(options);
      _options.signOption.userId = faker.random.uuid();

      const cif = new CanCommunity(_options, canPass);

      const input = {};
      const packedParams = faker.lorem.words();

      const execCode = jest.spyOn(cif, 'execCode');
      execCode.mockResolvedValue({});

      const serializeActionData = jest.spyOn(actions, 'serializeActionData');
      serializeActionData.mockResolvedValue(packedParams);

      // @ts-ignore
      await cif.createPosition(input);
      expect(serializeActionData).toBeCalledWith(_options, ActionNameEnum.CREATEPOS, input);
      expect(execCode).toBeCalledWith(CODE_IDS.CREATE_POSITION, ActionNameEnum.CREATEPOS, packedParams, undefined);
    });

    it('should dismissPosition', async () => {
      const _options = _.cloneDeep(options);
      _options.signOption.userId = faker.random.uuid();

      const cif = new CanCommunity(_options, canPass);

      const input = {};
      const packedParams = faker.lorem.words();

      const execCode = jest.spyOn(cif, 'execCode');
      execCode.mockResolvedValue({});

      const serializeActionData = jest.spyOn(actions, 'serializeActionData');
      serializeActionData.mockResolvedValue(packedParams);

      // @ts-ignore
      await cif.dismissPosition(input);
      expect(serializeActionData).toBeCalledWith(_options, ActionNameEnum.DISMISSPOS, input);
      expect(execCode).toBeCalledWith(CODE_IDS.DISMISS_POSITION, ActionNameEnum.DISMISSPOS, packedParams, undefined);
    });

    it('should approvePosition', async () => {
      const _options = _.cloneDeep(options);
      _options.signOption.userId = faker.random.uuid();

      const cif = new CanCommunity(_options, canPass);

      const input = {};
      const packedParams = faker.lorem.words();

      const execCode = jest.spyOn(cif, 'execCode');
      execCode.mockResolvedValue({});

      const serializeActionData = jest.spyOn(actions, 'serializeActionData');
      serializeActionData.mockResolvedValue(packedParams);

      // @ts-ignore
      await cif.approvePosition(input);
      expect(serializeActionData).toBeCalledWith(_options, ActionNameEnum.APPROVEPOS, input);
      expect(execCode).toBeCalledWith(CODE_IDS.APPROVE_POSITION, ActionNameEnum.APPROVEPOS, packedParams, undefined);
    });

    it('should appointPosition', async () => {
      const _options = _.cloneDeep(options);
      _options.signOption.userId = faker.random.uuid();

      const cif = new CanCommunity(_options, canPass);

      const input = {};
      const packedParams = faker.lorem.words();

      const execCode = jest.spyOn(cif, 'execCode');
      execCode.mockResolvedValue({});

      const serializeActionData = jest.spyOn(actions, 'serializeActionData');
      serializeActionData.mockResolvedValue(packedParams);

      // @ts-ignore
      await cif.appointPosition(input);
      expect(serializeActionData).toBeCalledWith(_options, ActionNameEnum.APPOINTPOS, input);
      expect(execCode).toBeCalledWith(CODE_IDS.APPOINT_POSITION, ActionNameEnum.APPOINTPOS, packedParams, undefined);
    });
  });

  describe('the same pattern functions 2', () => {
    it('should voteForCode', async () => {
      const _options = _.cloneDeep(options);
      _options.signOption.userId = faker.random.uuid();

      const cif = new CanCommunity(_options, canPass);

      const input = {};
      const signTrx = jest.spyOn(cif, 'signTrx');

      // @ts-ignore
      cif.voteForCode(input);
      // doing
      expect(signTrx).toBeCalledWith({
        actions: [
          {
            account: _options.code,
            authorization: [{ actor: _options.signOption.canAccount, permission: 'active' }],
            data: input,
            name: ActionNameEnum.VOTEFORCODE,
          },
        ],
      });
    });

    it('should voteForPosition', async () => {
      const _options = _.cloneDeep(options);
      _options.signOption.userId = faker.random.uuid();

      const cif = new CanCommunity(_options, canPass);

      const input = {};
      const signTrx = jest.spyOn(cif, 'signTrx');

      // @ts-ignore
      cif.voteForPosition(input);
      // doing
      expect(signTrx).toBeCalledWith({
        actions: [
          {
            account: _options.code,
            authorization: [{ actor: _options.signOption.canAccount, permission: 'active' }],
            data: input,
            name: ActionNameEnum.VOTEFORPOS,
          },
        ],
      });
    });

    it('should nominatePosition', async () => {
      const _options = _.cloneDeep(options);
      _options.signOption.userId = faker.random.uuid();

      const cif = new CanCommunity(_options, canPass);

      const input = {};
      const signTrx = jest.spyOn(cif, 'signTrx');

      // @ts-ignore
      cif.nominatePosition(input);
      // doing
      expect(signTrx).toBeCalledWith({
        actions: [
          {
            account: _options.code,
            authorization: [{ actor: _options.signOption.canAccount, permission: 'active' }],
            data: input,
            name: ActionNameEnum.NOMINATEPOS,
          },
        ],
      });
    });

    it('should execProposal', async () => {
      const _options = _.cloneDeep(options);
      _options.signOption.userId = faker.random.uuid();

      const cif = new CanCommunity(_options, canPass);

      const input = {};
      const signTrx = jest.spyOn(cif, 'signTrx');

      // @ts-ignore
      cif.execProposal(input);
      // doing
      expect(signTrx).toBeCalledWith({
        actions: [
          {
            account: _options.code,
            authorization: [{ actor: _options.signOption.canAccount, permission: 'active' }],
            data: input,
            name: ActionNameEnum.EXECPROPOSAL,
          },
        ],
      });
    });
  });
});
