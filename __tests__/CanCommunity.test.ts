// import { logger } from './../src/utils/logger';
// tslint:disable:no-implicit-dependencies
import * as faker from 'faker';
import _ from 'lodash';
import { options } from './test-helper';
import { CanCommunity } from '../src';
import { ActionNameEnum } from '../src/smart-contract-types/ActionNameEnum';
import { SignTrxOption, VoteForPositionInput } from '../src/types/can-community-types';
import { CODE_IDS, EXECUTION_TYPE, SIGN_TRX_METHOD } from '../src/utils/constant';
import utils from '../src/utils/utils';
import { Create } from '../src/smart-contract-types/Create';
import * as actions from '../src/utils/actions';
import { TableNameEnum } from '../src/smart-contract-types/TableNameEnum';
import app from '../src/app';
import tableCodes from './table-codes.json';
import { CodeTypeEnum } from '../src/types/smart-contract-enum';
import { ExecutionCodeData } from '../src/smart-contract-types/ExecutionCodeData';
import { ConfigCodeInput } from '../src/types/right-holder-type';
import { Setexectype } from '../src/smart-contract-types/Setexectype';
import { Setsoleexec } from '../src/smart-contract-types/Setsoleexec';
import { Setapprotype } from '../src/smart-contract-types/Setapprotype';
import { Setproposer } from '../src/smart-contract-types/Setproposer';
import { Setvoter } from '../src/smart-contract-types/Setvoter';
import { Setvoterule } from '../src/smart-contract-types/Setvoterule';
import { Configpos } from '../src/smart-contract-types/Configpos';
import { Dismisspos } from '../src/smart-contract-types/Dismisspos';
import { Approvepos } from '../src/smart-contract-types/Approvepos';
import { Appointpos } from '../src/smart-contract-types/Appointpos';
import { Createbadge } from '../src/smart-contract-types/Createbadge';
import { Configbadge } from '../src/smart-contract-types/Configbadge';
import { Issuebadge } from '../src/smart-contract-types/Issuebadge';
import { RightHolder } from '../src/smart-contract-types/RightHolder';
import { Inputmembers } from '../src/smart-contract-types/Inputmembers';

describe('test CanCommunity', () => {
  const canPass: any = {
    signTx: jest.fn().mockResolvedValue(true),
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
      spySignTx.mockClear();
    });

    it('has signOption with CAN_PASS as method', async () => {
      const spySignTrx = jest.spyOn(cif, 'signTrx');
      const trx = Promise.resolve({});
      const signOts = { broadcast: true };
      const signOption: SignTrxOption = {
        ...options.signOption,
        userId: faker.random.uuid(),
        signTrxMethod: SIGN_TRX_METHOD.CAN_PASS,
      };
      const rs = cif.signTrx(trx, signOption);
      expect(spySignTrx).toBeCalledWith(trx, signOption);
      expect(spySignTx).toBeCalledWith(trx, signOts);
      expect(rs).toEqual(trx);
    });

    it('has signOption with MANUAL as method', async () => {
      const spySignTrx = jest.spyOn(cif, 'signTrx');
      const trx = {};

      const signOption: SignTrxOption = {
        ...options.signOption,
        signTrxMethod: SIGN_TRX_METHOD.MANUAL,
      };

      const rs = cif.signTrx(trx, signOption);
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
        exec_type: EXECUTION_TYPE.COLLECTIVE_DECISION,
        code_id: faker.random.number(),
      });

      const codeActions: ExecutionCodeData[] = [
        {
          code_action,
          packed_params,
        },
      ];

      await expect(cif.execCode(code_id, codeActions, CodeTypeEnum.NORMAL));
      spyFindCode.mockResolvedValue({
        exec_type: EXECUTION_TYPE.SOLE_DECISION,
        code_id: faker.random.number(),
      });
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

        const codeActions: ExecutionCodeData[] = [
          {
            code_action,
            packed_params,
          },
        ];

        await cif.execCode(code_id, codeActions, CodeTypeEnum.NORMAL, {
          proposal_name: 'testproposal',
          user_exec_type: EXECUTION_TYPE.COLLECTIVE_DECISION,
        });
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
                code_id: setupCode.code_id,
                community_account: _options.signOption.communityCanAccount,
                code_actions: codeActions,
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

        const codeActions: ExecutionCodeData[] = [
          {
            code_action,
            packed_params,
          },
        ];

        await cif.execCode(code_id, codeActions, CodeTypeEnum.NORMAL);

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
                code_id: setupCode.code_id,
                community_account: _options.signOption.communityCanAccount,
                exec_account: _options.signOption.canAccount,
                code_actions: codeActions,
              },
              name: ActionNameEnum.EXECCODE,
            },
          ],
        });
      });
    });
  });

  describe('test CiF access check', () => {
    it('should return true if right holder is any one', async () => {
      const _options = _.cloneDeep(options);
      _options.signOption.userId = faker.random.uuid();

      const account = 'daniel111111';
      const commumityAccount = 'cifcomtest11';

      const cif = new CanCommunity(_options, canPass);
      const mockQuery = jest.spyOn(cif, 'query');
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            right_access: {
              is_anyone: 1,
              is_any_community_member: 0,
              required_badges: [],
              required_positions: [],
              required_tokens: [],
              required_exp: 0,
              accounts: [],
            },
          },
        ],
        more: false,
      });

      const res = await cif.isAccessHolder(commumityAccount, account);
      expect(res).toBe(true);
      expect(mockQuery).toBeCalledWith(TableNameEnum.V1_ACCESS, { scope: commumityAccount });
    });

    it('should return false if right holder is not set', async () => {
      const _options = _.cloneDeep(options);
      _options.signOption.userId = faker.random.uuid();

      const account = 'daniel111111';
      const commumityAccount = 'cifcomtest11';

      const cif = new CanCommunity(_options, canPass);
      const mockQuery = jest.spyOn(cif, 'query');
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            right_access: {
              is_anyone: 0,
              is_any_community_member: 0,
              required_badges: [],
              required_positions: [],
              required_tokens: [],
              required_exp: 0,
              accounts: [],
            },
          },
        ],
        more: false,
      });

      const res = await cif.isAccessHolder(commumityAccount, account);
      expect(res).toBe(false);
      expect(mockQuery).toBeCalledWith(TableNameEnum.V1_ACCESS, { scope: commumityAccount });
    });

    it('should return true if user account is includes in right accounts', async () => {
      const _options = _.cloneDeep(options);
      _options.signOption.userId = faker.random.uuid();

      const account = 'daniel111111';
      const commumityAccount = 'cifcomtest11';

      const cif = new CanCommunity(_options, canPass);
      const mockQuery = jest.spyOn(cif, 'query');
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            right_access: {
              is_anyone: 0,
              is_any_community_member: 0,
              required_badges: [],
              required_positions: [],
              required_tokens: [],
              required_exp: 0,
              accounts: ['daniel111111', 'daniel333333'],
            },
          },
        ],
        more: false,
      });

      const res = await cif.isAccessHolder(commumityAccount, account);
      expect(res).toBe(true);
      expect(mockQuery).toBeCalledWith(TableNameEnum.V1_ACCESS, { scope: commumityAccount });
    });
  });

  describe('test right holder check', () => {
    it('should return false if right holder is not set', async () => {
      const _options = _.cloneDeep(options);
      _options.signOption.userId = faker.random.uuid();

      const account = 'daniel111111';
      const codeId = 1;

      const cif = new CanCommunity(_options, canPass);
      const mockQuery = jest.spyOn(cif, 'query');
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            code_id: 0,
            right_executor: {
              is_anyone: 0,
              is_any_community_member: 0,
              required_badges: [],
              required_positions: [],
              required_tokens: [],
              required_exp: 0,
              accounts: [],
            },
          },
        ],
        more: false,
      });

      const res = await cif.isRightHolderOfCode(codeId, account, EXECUTION_TYPE.SOLE_DECISION, 'createcode');
      expect(res).toBe(false);
      expect(mockQuery).toBeCalledWith(TableNameEnum.V1_CODEEXEC, { lower_bound: codeId, upper_bound: codeId });
    });

    it('should return true if right holder is any one', async () => {
      const _options = _.cloneDeep(options);
      _options.signOption.userId = faker.random.uuid();

      const account = 'daniel111111';
      const codeId = 1;

      const cif = new CanCommunity(_options, canPass);
      const mockQuery = jest.spyOn(cif, 'query');
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            code_id: 1,
            right_executor: {
              is_anyone: 1,
              is_any_community_member: 0,
              required_badges: [],
              required_positions: [],
              required_tokens: [],
              required_exp: 0,
              accounts: [],
            },
          },
        ],
        more: false,
      });

      const res = await cif.isRightHolderOfCode(codeId, account, EXECUTION_TYPE.SOLE_DECISION, 'createcode');
      expect(res).toBe(true);
      expect(mockQuery).toBeCalledWith(TableNameEnum.V1_CODEEXEC, { lower_bound: codeId, upper_bound: codeId });
    });

    it('should return true if right holder is any community member and user is community member', async () => {
      const _options = _.cloneDeep(options);
      _options.signOption.userId = faker.random.uuid();

      const account = 'daniel111111';
      const codeId = 1;

      const cif = new CanCommunity(_options, canPass);
      const mockQuery = jest.spyOn(cif, 'query');
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            code_id: 1,
            right_executor: {
              is_anyone: 0,
              is_any_community_member: 1,
              required_badges: [],
              required_positions: [],
              required_tokens: [],
              required_exp: 0,
              accounts: [],
            },
          },
        ],
        more: false,
      });

      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            member: account,
          },
        ],
        more: false,
      });

      const res = await cif.isRightHolderOfCode(codeId, account, EXECUTION_TYPE.SOLE_DECISION, 'createcode');
      expect(res).toBe(true);
      expect(mockQuery).toBeCalledWith(TableNameEnum.V1_CODEEXEC, { lower_bound: codeId, upper_bound: codeId });
      expect(mockQuery).toHaveBeenNthCalledWith(1, TableNameEnum.V1_CODEEXEC, { lower_bound: codeId, upper_bound: codeId });
      expect(mockQuery).toHaveBeenNthCalledWith(2, TableNameEnum.V1_MEMBER, { lower_bound: account, upper_bound: account });
    });

    it('should return false if right holder is any community member and user is not community member', async () => {
      const _options = _.cloneDeep(options);
      _options.signOption.userId = faker.random.uuid();

      const account = 'daniel111111';
      const codeId = 1;

      const cif = new CanCommunity(_options, canPass);
      const mockQuery = jest.spyOn(cif, 'query');
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            code_id: 1,
            right_executor: {
              is_anyone: 0,
              is_any_community_member: 1,
              required_badges: [],
              required_positions: [],
              required_tokens: [],
              required_exp: 0,
              accounts: [],
            },
          },
        ],
        more: false,
      });

      mockQuery.mockResolvedValueOnce({
        rows: [],
        more: false,
      });

      const res = await cif.isRightHolderOfCode(codeId, account, EXECUTION_TYPE.SOLE_DECISION, 'createcode');
      expect(res).toBe(false);
      expect(mockQuery).toBeCalledWith(TableNameEnum.V1_CODEEXEC, { lower_bound: codeId, upper_bound: codeId });
      expect(mockQuery).toHaveBeenNthCalledWith(1, TableNameEnum.V1_CODEEXEC, { lower_bound: codeId, upper_bound: codeId });
      expect(mockQuery).toHaveBeenNthCalledWith(2, TableNameEnum.V1_MEMBER, { lower_bound: account, upper_bound: account });
    });

    it('should return false if user account is not includes in right accounts', async () => {
      const _options = _.cloneDeep(options);
      _options.signOption.userId = faker.random.uuid();

      const account = 'daniel111111';
      const codeId = 1;

      const cif = new CanCommunity(_options, canPass);
      const mockQuery = jest.spyOn(cif, 'query');
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            code_id: 0,
            right_executor: {
              is_anyone: 0,
              is_any_community_member: 0,
              required_badges: [],
              required_positions: [],
              required_tokens: [],
              required_exp: 0,
              accounts: ['daniel222222', 'daniel333333'],
            },
          },
        ],
        more: false,
      });

      const res = await cif.isRightHolderOfCode(codeId, account, EXECUTION_TYPE.SOLE_DECISION, 'configCode');
      expect(res).toBe(false);
      expect(mockQuery).toBeCalledWith(TableNameEnum.V1_AMENEXEC, { lower_bound: codeId, upper_bound: codeId });
    });

    it('should return true if user account is includes in right accounts', async () => {
      const _options = _.cloneDeep(options);
      _options.signOption.userId = faker.random.uuid();

      const account = 'daniel111111';
      const codeId = 1;

      const cif = new CanCommunity(_options, canPass);
      const mockQuery = jest.spyOn(cif, 'query');
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            code_id: 0,
            right_executor: {
              is_anyone: 0,
              is_any_community_member: 0,
              required_badges: [],
              required_positions: [],
              required_tokens: [],
              required_exp: 0,
              accounts: ['daniel111111', 'daniel333333'],
            },
          },
        ],
        more: false,
      });

      const res = await cif.isRightHolderOfCode(codeId, account, EXECUTION_TYPE.SOLE_DECISION, 'configCode');
      expect(res).toBe(true);
      expect(mockQuery).toBeCalledWith(TableNameEnum.V1_AMENEXEC, { lower_bound: codeId, upper_bound: codeId });
    });

    it('should return false if user does not satisfy position requirement', async () => {
      const _options = _.cloneDeep(options);
      _options.signOption.userId = faker.random.uuid();

      const account = 'daniel111111';
      const codeId = 1;

      const cif = new CanCommunity(_options, canPass);
      const mockQuery = jest.spyOn(cif, 'query');
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            code_id: 0,
            right_executor: {
              is_anyone: 0,
              is_any_community_member: 0,
              required_badges: [],
              required_positions: [1],
              required_tokens: [],
              required_exp: 0,
              accounts: [],
            },
          },
        ],
        more: false,
      });

      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            pos_id: 1,
            pos_name: 'Admin',
            max_holder: 10,
            holders: ['daniel222222'],
            fulfillment_type: 0,
            refer_codes: [
              {
                key: 'po.appoint',
                value: 5,
              },
              {
                key: 'po.config',
                value: 4,
              },
              {
                key: 'po.dismiss',
                value: 6,
              },
            ],
          },
        ],
        more: false,
      });

      const res = await cif.isRightHolderOfCode(codeId, account, EXECUTION_TYPE.SOLE_DECISION, 'configCode');
      expect(res).toBe(false);
      expect(mockQuery).toHaveBeenNthCalledWith(1, TableNameEnum.V1_AMENEXEC, { lower_bound: codeId, upper_bound: codeId });
      expect(mockQuery).toHaveBeenNthCalledWith(2, TableNameEnum.V1_POSITION, { lower_bound: 1, upper_bound: 1 });
    });

    it('should return true if user satisfy position requirement', async () => {
      const _options = _.cloneDeep(options);
      _options.signOption.userId = faker.random.uuid();

      const account = 'daniel111111';
      const codeId = 1;

      const cif = new CanCommunity(_options, canPass);
      const mockQuery = jest.spyOn(cif, 'query');
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            code_id: 0,
            right_executor: {
              is_anyone: 0,
              is_any_community_member: 0,
              required_badges: [],
              required_positions: [1],
              required_tokens: [],
              required_exp: 0,
              accounts: [],
            },
          },
        ],
        more: false,
      });

      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            pos_id: 1,
            pos_name: 'Admin',
            max_holder: 10,
            holders: ['abc111111111', 'daniel111111'],
            fulfillment_type: 0,
            refer_codes: [
              {
                key: 'po.appoint',
                value: 5,
              },
              {
                key: 'po.config',
                value: 4,
              },
              {
                key: 'po.dismiss',
                value: 6,
              },
            ],
          },
        ],
        more: false,
      });

      const res = await cif.isRightHolderOfCode(codeId, account, EXECUTION_TYPE.SOLE_DECISION, 'configCode');
      expect(res).toBe(true);
      expect(mockQuery).toHaveBeenNthCalledWith(1, TableNameEnum.V1_AMENEXEC, { lower_bound: codeId, upper_bound: codeId });
      expect(mockQuery).toHaveBeenNthCalledWith(2, TableNameEnum.V1_POSITION, { lower_bound: 1, upper_bound: 1 });
    });

    it('should return false if user does not satisfy badges requirement', async () => {
      const _options = _.cloneDeep(options);
      _options.signOption.userId = faker.random.uuid();

      const account = 'daniel111111';
      const codeId = 1;

      const cif = new CanCommunity(_options, canPass);
      const mockQuery = jest.spyOn(cif, 'query');
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            code_id: 0,
            right_executor: {
              is_anyone: 0,
              is_any_community_member: 0,
              required_badges: [10, 99],
              required_positions: [],
              required_tokens: [],
              required_exp: 0,
              accounts: [],
            },
          },
        ],
        more: false,
      });

      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            badge_id: 11,
            issuer: '1cryptobadge',
          },
          {
            badge_id: 22,
            issuer: '1cryptobadge',
          },
        ],
      });

      const res = await cif.isRightHolderOfCode(codeId, account, EXECUTION_TYPE.SOLE_DECISION, 'configCode');
      expect(res).toBe(false);
      expect(mockQuery).toHaveBeenNthCalledWith(1, TableNameEnum.V1_AMENEXEC, { lower_bound: codeId, upper_bound: codeId });
      expect(mockQuery).toHaveBeenNthCalledWith(2, TableNameEnum.V1_CERT, {
        scope: account,
        code: _options.cryptoBadgeContractAccount,
        index_position: 2,
        key_type: 'i64',
        lower_bound: 10,
        upper_bound: 99,
      });
    });

    it('should return true if user satisfy badges requirement', async () => {
      const _options = _.cloneDeep(options);
      _options.signOption.userId = faker.random.uuid();

      const account = 'daniel111111';
      const codeId = 1;

      const cif = new CanCommunity(_options, canPass);
      const mockQuery = jest.spyOn(cif, 'query');
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            code_id: 0,
            right_executor: {
              is_anyone: 0,
              is_any_community_member: 0,
              required_badges: [10, 99],
              required_positions: [],
              required_tokens: [],
              required_exp: 0,
              accounts: [],
            },
          },
        ],
        more: false,
      });

      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            badge_id: 10,
            issuer: '1cryptobadge',
          },
          {
            badge_id: 99,
            issuer: '1cryptobadge',
          },
        ],
      });

      const res = await cif.isRightHolderOfCode(codeId, account, EXECUTION_TYPE.SOLE_DECISION, 'configCode');
      expect(res).toBe(true);
      expect(mockQuery).toHaveBeenNthCalledWith(1, TableNameEnum.V1_AMENEXEC, { lower_bound: codeId, upper_bound: codeId });
      expect(mockQuery).toHaveBeenNthCalledWith(2, TableNameEnum.V1_CERT, {
        scope: account,
        code: _options.cryptoBadgeContractAccount,
        index_position: 2,
        key_type: 'i64',
        lower_bound: 10,
        upper_bound: 99,
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

      const codeActions: ExecutionCodeData[] = [
        {
          code_action: ActionNameEnum.CREATECODE,
          packed_params: packedParams,
        },
      ];

      const serializeActionData = jest.spyOn(actions, 'serializeActionData');
      serializeActionData.mockResolvedValue(packedParams);

      // @ts-ignore
      await cif.createCode(input);
      expect(serializeActionData).toBeCalledWith(_options, ActionNameEnum.CREATECODE, input);
      expect(execCode).toBeCalledWith(CODE_IDS.CREATE_CODE, codeActions, CodeTypeEnum.NORMAL, undefined);
    });

    it('should set code in force access', async () => {
      const _options = _.cloneDeep(options);
      _options.signOption.userId = faker.random.uuid();

      const cif = new CanCommunity(_options, canPass);

      const right_access: RightHolder = {
        is_anyone: false,
        is_any_community_member: false,
        accounts: ['daniel111111', 'daniel221222'],
        required_badges: [1, 2, 3],
        required_tokens: ['100.0000 CAT'],
        required_exp: 0,
        required_positions: [99, 55, 33],
      };

      const input = {
        community_account: 'test-community',
        right_access,
      };

      const packedParams = faker.lorem.words();

      const execCode = jest.spyOn(cif, 'execCode');
      execCode.mockResolvedValue({});

      const serializeActionData = jest.spyOn(actions, 'serializeActionData');
      serializeActionData.mockResolvedValue(packedParams);

      const codeActions: ExecutionCodeData[] = [
        {
          code_action: ActionNameEnum.SETACCESS,
          packed_params: packedParams,
        },
      ];

      await cif.setAccess(input);
      expect(serializeActionData).toBeCalledWith(_options, ActionNameEnum.SETACCESS, input);
      expect(execCode).toBeCalledWith(CODE_IDS.ACCESS_CODE, codeActions, CodeTypeEnum.NORMAL, undefined);
    });

    it('should input commuity member', async () => {
      const _options = _.cloneDeep(options);
      _options.signOption.userId = faker.random.uuid();

      const cif = new CanCommunity(_options, canPass);

      const addedMember = ['member111111', 'member111112', 'member111113'];

      const input: Inputmembers = {
        community_account: 'test-community',
        added_members: addedMember,
        removed_members: [],
      };

      const packedParams = faker.lorem.words();

      const execCode = jest.spyOn(cif, 'execCode');
      execCode.mockResolvedValue({});

      const serializeActionData = jest.spyOn(actions, 'serializeActionData');
      serializeActionData.mockResolvedValue(packedParams);

      const codeActions: ExecutionCodeData[] = [
        {
          code_action: ActionNameEnum.INPUTMEMBERS,
          packed_params: packedParams,
        },
      ];

      await cif.inputCommunityMember(input);
      expect(serializeActionData).toBeCalledWith(_options, ActionNameEnum.INPUTMEMBERS, input);
      expect(execCode).toBeCalledWith(CODE_IDS.MEMBER_CODE, codeActions, CodeTypeEnum.NORMAL, undefined);
    });

    it('should set code execution type using configCode', async () => {
      const _options = _.cloneDeep(options);
      _options.signOption.userId = faker.random.uuid();

      const cif = new CanCommunity(_options, canPass);

      const input: ConfigCodeInput = {
        community_account: 'test-community',
        code_id: 99,
        code_right_holder: {
          exec_type: 1,
        },
      };
      const packedParams = faker.lorem.words();

      const setExecTypeInput: Setexectype = {
        community_account: input.community_account,
        code_id: input.code_id,
        exec_type: input.code_right_holder.exec_type,
        is_amend_code: false,
      };

      const codeActions: ExecutionCodeData[] = [
        {
          code_action: ActionNameEnum.SETEXECTYPE,
          packed_params: packedParams,
        },
      ];

      const execCode = jest.spyOn(cif, 'execCode');
      execCode.mockResolvedValue({});

      const serializeActionData = jest.spyOn(actions, 'serializeActionData');
      serializeActionData.mockResolvedValue(packedParams);

      // @ts-ignore
      await cif.configCode(input);
      expect(serializeActionData).toBeCalledWith(_options, ActionNameEnum.SETEXECTYPE, setExecTypeInput);
      expect(execCode).toBeCalledWith(
        CODE_IDS.SET_RIGHT_HOLDER_FOR_CODE,
        codeActions,
        CodeTypeEnum.AMENDMENT,
        undefined,
        input.code_id,
      );
    });

    it('should set code execution type and sole right holder using configCode', async () => {
      const _options = _.cloneDeep(options);
      _options.signOption.userId = faker.random.uuid();

      const cif = new CanCommunity(_options, canPass);

      const input: ConfigCodeInput = {
        community_account: 'test-community',
        code_id: 99,
        code_right_holder: {
          exec_type: 1,
          right_sole_executor: {
            is_anyone: false,
            is_any_community_member: false,
            required_exp: 0,
            required_badges: [],
            required_tokens: [],
            required_positions: [],
            accounts: ['daniel111111'],
          },
        },
      };
      const packedParams = faker.lorem.words();

      const setExecTypeInput: Setexectype = {
        community_account: input.community_account,
        code_id: input.code_id,
        exec_type: input.code_right_holder.exec_type,
        is_amend_code: false,
      };

      const setSoleExecInput: Setsoleexec = {
        community_account: input.community_account,
        code_id: input.code_id,
        right_sole_executor: input.code_right_holder.right_sole_executor,
        is_amend_code: false,
      };

      const codeActions: ExecutionCodeData[] = [
        {
          code_action: ActionNameEnum.SETSOLEEXEC,
          packed_params: packedParams,
        },
        {
          code_action: ActionNameEnum.SETEXECTYPE,
          packed_params: packedParams,
        },
      ];

      const execCode = jest.spyOn(cif, 'execCode');
      execCode.mockResolvedValue({});

      const serializeActionData = jest.spyOn(actions, 'serializeActionData');
      serializeActionData.mockResolvedValue(packedParams);

      // @ts-ignore
      await cif.configCode(input);
      expect(serializeActionData).toHaveBeenNthCalledWith(1, _options, ActionNameEnum.SETSOLEEXEC, setSoleExecInput);
      expect(serializeActionData).toHaveBeenNthCalledWith(2, _options, ActionNameEnum.SETEXECTYPE, setExecTypeInput);
      expect(execCode).toBeCalledWith(
        CODE_IDS.SET_RIGHT_HOLDER_FOR_CODE,
        codeActions,
        CodeTypeEnum.AMENDMENT,
        undefined,
        input.code_id,
      );
    });

    it('should set amendment execution type and sole right holder using configCode', async () => {
      const _options = _.cloneDeep(options);
      _options.signOption.userId = faker.random.uuid();

      const cif = new CanCommunity(_options, canPass);

      const input: ConfigCodeInput = {
        community_account: 'test-community',
        code_id: 99,
        amendment_right_holder: {
          exec_type: 1,
          right_sole_executor: {
            is_anyone: false,
            is_any_community_member: false,
            required_exp: 0,
            required_badges: [],
            required_tokens: [],
            required_positions: [],
            accounts: ['daniel111111'],
          },
        },
      };
      const packedParams = faker.lorem.words();

      const setExecTypeInput: Setexectype = {
        community_account: input.community_account,
        code_id: input.code_id,
        exec_type: input.amendment_right_holder.exec_type,
        is_amend_code: true,
      };

      const setSoleExecInput: Setsoleexec = {
        community_account: input.community_account,
        code_id: input.code_id,
        right_sole_executor: input.amendment_right_holder.right_sole_executor,
        is_amend_code: true,
      };

      const codeActions: ExecutionCodeData[] = [
        {
          code_action: ActionNameEnum.SETSOLEEXEC,
          packed_params: packedParams,
        },
        {
          code_action: ActionNameEnum.SETEXECTYPE,
          packed_params: packedParams,
        },
      ];

      const execCode = jest.spyOn(cif, 'execCode');
      execCode.mockResolvedValue({});

      const serializeActionData = jest.spyOn(actions, 'serializeActionData');
      serializeActionData.mockResolvedValue(packedParams);

      // @ts-ignore
      await cif.configCode(input);
      expect(serializeActionData).toHaveBeenNthCalledWith(1, _options, ActionNameEnum.SETSOLEEXEC, setSoleExecInput);
      expect(serializeActionData).toHaveBeenNthCalledWith(2, _options, ActionNameEnum.SETEXECTYPE, setExecTypeInput);
      expect(execCode).toBeCalledWith(
        CODE_IDS.SET_RIGHT_HOLDER_FOR_CODE,
        codeActions,
        CodeTypeEnum.AMENDMENT,
        undefined,
        input.code_id,
      );
    });

    it('should set code collective rule using configCode', async () => {
      const _options = _.cloneDeep(options);
      _options.signOption.userId = faker.random.uuid();

      const cif = new CanCommunity(_options, canPass);

      const input: ConfigCodeInput = {
        community_account: 'test-community',
        code_id: 99,
        code_right_holder: {
          exec_type: 1,
          approval_type: 1,
          right_proposer: {
            is_anyone: false,
            is_any_community_member: false,
            required_exp: 0,
            required_badges: [],
            required_tokens: [],
            required_positions: [],
            accounts: ['daniel111111'],
          },
          right_voter: {
            is_anyone: false,
            is_any_community_member: false,
            required_exp: 0,
            required_badges: [],
            required_tokens: [],
            required_positions: [],
            accounts: ['daniel111111'],
          },
          pass_rule: 60,
          vote_duration: 600,
        },
      };
      const packedParams = faker.lorem.words();

      const setExecTypeInput: Setexectype = {
        community_account: input.community_account,
        code_id: input.code_id,
        exec_type: input.code_right_holder.exec_type,
        is_amend_code: false,
      };

      const setApprovalTypeInput: Setapprotype = {
        community_account: input.community_account,
        code_id: input.code_id,
        approval_type: input.code_right_holder.approval_type,
        is_amend_code: false,
      };

      const setProposerInput: Setproposer = {
        community_account: input.community_account,
        code_id: input.code_id,
        right_proposer: input.code_right_holder.right_proposer,
        is_amend_code: false,
      };

      const setVoterInput: Setvoter = {
        community_account: input.community_account,
        code_id: input.code_id,
        right_voter: input.code_right_holder.right_voter,
        is_amend_code: false,
      };

      const setVoteRuleInput: Setvoterule = {
        community_account: input.community_account,
        code_id: input.code_id,
        pass_rule: input.code_right_holder.pass_rule,
        vote_duration: input.code_right_holder.vote_duration,
        is_amend_code: false,
      };

      const codeActions: ExecutionCodeData[] = [
        {
          code_action: ActionNameEnum.SETAPPROTYPE,
          packed_params: packedParams,
        },
        {
          code_action: ActionNameEnum.SETPROPOSER,
          packed_params: packedParams,
        },
        {
          code_action: ActionNameEnum.SETVOTER,
          packed_params: packedParams,
        },
        {
          code_action: ActionNameEnum.SETVOTERULE,
          packed_params: packedParams,
        },
        {
          code_action: ActionNameEnum.SETEXECTYPE,
          packed_params: packedParams,
        },
      ];

      const execCode = jest.spyOn(cif, 'execCode');
      execCode.mockResolvedValue({});

      const serializeActionData = jest.spyOn(actions, 'serializeActionData');
      serializeActionData.mockResolvedValue(packedParams);

      // @ts-ignore
      await cif.configCode(input);
      expect(serializeActionData).toHaveBeenNthCalledWith(1, _options, ActionNameEnum.SETAPPROTYPE, setApprovalTypeInput);
      expect(serializeActionData).toHaveBeenNthCalledWith(2, _options, ActionNameEnum.SETPROPOSER, setProposerInput);
      expect(serializeActionData).toHaveBeenNthCalledWith(3, _options, ActionNameEnum.SETVOTER, setVoterInput);
      expect(serializeActionData).toHaveBeenNthCalledWith(4, _options, ActionNameEnum.SETVOTERULE, setVoteRuleInput);
      expect(serializeActionData).toHaveBeenNthCalledWith(5, _options, ActionNameEnum.SETEXECTYPE, setExecTypeInput);
      expect(execCode).toBeCalledWith(
        CODE_IDS.SET_RIGHT_HOLDER_FOR_CODE,
        codeActions,
        CodeTypeEnum.AMENDMENT,
        undefined,
        input.code_id,
      );
    });

    it('should config for position', async () => {
      const _options = _.cloneDeep(options);
      _options.signOption.userId = faker.random.uuid();

      const cif = new CanCommunity(_options, canPass);

      const input: Configpos = {
        community_account: 'test-community',
        pos_id: 999,
        pos_name: 'position-test',
        max_holder: 10,
        filled_through: 1,
        term: 99,
        next_term_start_at: 1000,
        voting_period: 100,
        right_candidate: {
          is_anyone: false,
          is_any_community_member: false,
          required_exp: 0,
          required_badges: [],
          required_tokens: [],
          required_positions: [],
          accounts: ['daniel111111'],
        },
        right_voter: {
          is_anyone: false,
          is_any_community_member: false,
          required_exp: 0,
          required_badges: [],
          required_tokens: [],
          required_positions: [],
          accounts: ['daniel111111'],
        },
      };
      const packedParams = faker.lorem.words();

      const codeActions: ExecutionCodeData[] = [
        {
          code_action: ActionNameEnum.CONFIGPOS,
          packed_params: packedParams,
        },
      ];

      const execCode = jest.spyOn(cif, 'execCode');
      execCode.mockResolvedValue({});

      const serializeActionData = jest.spyOn(actions, 'serializeActionData');
      serializeActionData.mockResolvedValue(packedParams);

      // @ts-ignore
      await cif.configurePosition(input);
      expect(serializeActionData).toBeCalledWith(_options, ActionNameEnum.CONFIGPOS, input);
      expect(execCode).toBeCalledWith(CODE_IDS.CONFIGURE_POSITION, codeActions, CodeTypeEnum.POSITION_CONFIG, undefined, 999);
    });

    it('should createPosition', async () => {
      const _options = _.cloneDeep(options);
      _options.signOption.userId = faker.random.uuid();

      const cif = new CanCommunity(_options, canPass);

      const input = {
        community_account: 'test-community',
        creator: 'creator',
        pos_name: 'leader',
        max_holder: 3,
        filled_through: 0,
        term: 0,
        next_term_start_at: 0,
        right_candidate: {
          is_anyone: false,
          is_any_community_member: false,
          required_exp: 0,
          required_badges: [],
          required_tokens: [],
          required_positions: [],
          accounts: [],
        },
        right_voter: {
          is_anyone: false,
          is_any_community_member: false,
          required_exp: 0,
          required_badges: [],
          required_tokens: [],
          required_positions: [],
          accounts: [],
        },
        voting_period: 0,
      };
      const packedParams = faker.lorem.words();

      const execCode = jest.spyOn(cif, 'execCode');
      execCode.mockResolvedValue({});

      const serializeActionData = jest.spyOn(actions, 'serializeActionData');
      serializeActionData.mockResolvedValue(packedParams);

      const codeActions: ExecutionCodeData[] = [
        {
          code_action: ActionNameEnum.CREATEPOS,
          packed_params: packedParams,
        },
      ];

      // @ts-ignore
      await cif.createPosition(input);
      expect(serializeActionData).toBeCalledWith(_options, ActionNameEnum.CREATEPOS, input);
      expect(execCode).toBeCalledWith(CODE_IDS.CREATE_POSITION, codeActions, CodeTypeEnum.NORMAL, undefined);
    });

    it('should dismissPosition', async () => {
      const _options = _.cloneDeep(options);
      _options.signOption.userId = faker.random.uuid();

      const cif = new CanCommunity(_options, canPass);

      const input: Dismisspos = {
        community_account: 'test-community',
        pos_id: 998,
        holder: 'daniel111111',
        dismissal_reason: 'test',
      };
      const packedParams = faker.lorem.words();

      const execCode = jest.spyOn(cif, 'execCode');
      execCode.mockResolvedValue({});

      const serializeActionData = jest.spyOn(actions, 'serializeActionData');
      serializeActionData.mockResolvedValue(packedParams);

      const codeActions: ExecutionCodeData[] = [
        {
          code_action: ActionNameEnum.DISMISSPOS,
          packed_params: packedParams,
        },
      ];

      // @ts-ignore
      await cif.dismissPosition(input);
      expect(serializeActionData).toBeCalledWith(_options, ActionNameEnum.DISMISSPOS, input);
      expect(execCode).toBeCalledWith(
        CODE_IDS.DISMISS_POSITION,
        codeActions,
        CodeTypeEnum.POSITION_DISMISS,
        undefined,
        input.pos_id,
      );
    });

    it('should approvePosition', async () => {
      const _options = _.cloneDeep(options);
      _options.signOption.userId = faker.random.uuid();

      const cif = new CanCommunity(_options, canPass);

      const input: Approvepos = {
        community_account: 'test-communitty',
        pos_id: 998,
      };
      const packedParams = faker.lorem.words();

      const execCode = jest.spyOn(cif, 'execCode');
      execCode.mockResolvedValue({});

      const codeActions: ExecutionCodeData[] = [
        {
          code_action: ActionNameEnum.APPROVEPOS,
          packed_params: packedParams,
        },
      ];

      const serializeActionData = jest.spyOn(actions, 'serializeActionData');
      serializeActionData.mockResolvedValue(packedParams);

      // @ts-ignore
      await cif.approvePosition(input);
      expect(serializeActionData).toBeCalledWith(_options, ActionNameEnum.APPROVEPOS, input);
      expect(execCode).toBeCalledWith(CODE_IDS.APPROVE_POSITION, codeActions, CodeTypeEnum.NORMAL, undefined, input.pos_id);
    });

    it('should appointPosition', async () => {
      const _options = _.cloneDeep(options);
      _options.signOption.userId = faker.random.uuid();

      const cif = new CanCommunity(_options, canPass);

      const input: Appointpos = {
        community_account: 'test-community',
        pos_id: 998,
        holder_accounts: ['daniel111111'],
        appoint_reason: 'test',
      };
      const packedParams = faker.lorem.words();

      const execCode = jest.spyOn(cif, 'execCode');
      execCode.mockResolvedValue({});

      const serializeActionData = jest.spyOn(actions, 'serializeActionData');
      serializeActionData.mockResolvedValue(packedParams);

      const codeActions: ExecutionCodeData[] = [
        {
          code_action: ActionNameEnum.APPOINTPOS,
          packed_params: packedParams,
        },
      ];

      // @ts-ignore
      await cif.appointPosition(input);
      expect(serializeActionData).toBeCalledWith(_options, ActionNameEnum.APPOINTPOS, input);
      expect(execCode).toBeCalledWith(
        CODE_IDS.APPOINT_POSITION,
        codeActions,
        CodeTypeEnum.POSITION_APPOINT,
        undefined,
        input.pos_id,
      );
    });

    it('should create new badge', async () => {
      const _options = _.cloneDeep(options);
      _options.signOption.userId = faker.random.uuid();

      const cif = new CanCommunity(_options, canPass);

      const input: Createbadge = {
        community_account: 'test-community',
        issue_type: 0,
        badge_propose_name: 'createbadge',
        issue_exec_type: 0,
        right_issue_sole_executor: {
          is_anyone: false,
          is_any_community_member: false,
          required_exp: 0,
          required_badges: [],
          required_tokens: [],
          required_positions: [],
          accounts: ['daniel111111'],
        },
        right_issue_approver: {
          is_anyone: false,
          is_any_community_member: false,
          required_exp: 0,
          required_badges: [],
          required_tokens: [],
          required_positions: [],
          accounts: [],
        },
        issue_approval_type: 0,
        right_issue_proposer: {
          is_anyone: false,
          is_any_community_member: false,
          required_exp: 0,
          required_badges: [],
          required_tokens: [],
          required_positions: [],
          accounts: [],
        },
        right_issue_voter: {
          is_anyone: false,
          is_any_community_member: false,
          required_exp: 0,
          required_badges: [],
          required_tokens: [],
          required_positions: [],
          accounts: [],
        },
        issue_pass_rule: 0,
        issue_vote_duration: 0,
      };
      const packedParams = faker.lorem.words();

      const execCode = jest.spyOn(cif, 'execCode');
      execCode.mockResolvedValue({});

      const serializeActionData = jest.spyOn(actions, 'serializeActionData');
      serializeActionData.mockResolvedValue(packedParams);

      const codeActions: ExecutionCodeData[] = [
        {
          code_action: ActionNameEnum.CREATEBADGE,
          packed_params: packedParams,
        },
      ];

      // @ts-ignore
      await cif.createBadge(input);
      expect(serializeActionData).toBeCalledWith(_options, ActionNameEnum.CREATEBADGE, input);
      expect(execCode).toBeCalledWith(CODE_IDS.CREATE_BADGE, codeActions, CodeTypeEnum.NORMAL, undefined);
    });

    it('should config badge', async () => {
      const _options = _.cloneDeep(options);
      _options.signOption.userId = faker.random.uuid();

      const cif = new CanCommunity(_options, canPass);

      const input: Configbadge = {
        community_account: 'test-community',
        badge_id: 999,
        issue_type: 0,
        update_badge_proposal_name: 'updatebadge',
      };
      const packedParams = faker.lorem.words();

      const execCode = jest.spyOn(cif, 'execCode');
      execCode.mockResolvedValue({});

      const serializeActionData = jest.spyOn(actions, 'serializeActionData');
      serializeActionData.mockResolvedValue(packedParams);

      const codeActions: ExecutionCodeData[] = [
        {
          code_action: ActionNameEnum.CONFIGBADGE,
          packed_params: packedParams,
        },
      ];

      // @ts-ignore
      await cif.configBadge(input);
      expect(serializeActionData).toBeCalledWith(_options, ActionNameEnum.CONFIGBADGE, input);
      expect(execCode).toBeCalledWith(CODE_IDS.CONFIG_BADGE, codeActions, CodeTypeEnum.BADGE_CONFIG, undefined, input.badge_id);
    });

    it('should issue badge', async () => {
      const _options = _.cloneDeep(options);
      _options.signOption.userId = faker.random.uuid();

      const cif = new CanCommunity(_options, canPass);

      const input: Issuebadge = {
        community_account: 'test-community',
        badge_propose_name: 'newcert1234',
      };

      const proposalBadgeId = 3550;
      const packedParams = faker.lorem.words();

      const execCode = jest.spyOn(cif, 'execCode');
      execCode.mockResolvedValue({});

      const serializeActionData = jest.spyOn(actions, 'serializeActionData');
      serializeActionData.mockResolvedValue(packedParams);

      const codeActions: ExecutionCodeData[] = [
        {
          code_action: ActionNameEnum.ISSUEBADGE,
          packed_params: packedParams,
        },
      ];

      const mockQuery = jest.spyOn(cif, 'query');
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            proposal_name: 'newcert1234',
            packed_transaction:
              '3c70f85e000000000000000000000200000000000074450040565357a4d45d01000000000000744500000000a8ed3232180000000000c592390f7061792063707520616e64206e65740000000000c59239008062c91ca53176020000000000c5923900000000a8ed323280c008219949a54a00000000a8ed32328b0280c008219949a54af0ffbdaef91b704ade0d00000000000001000000000000003210000000000000d801424f346e782f44412b316745734259324251786233394d514b455361696a303257667873467261516d696668622b4254776b5a644c34575837396e5075765074325661734b68616a6a77553862634c584576414c447774716d506a2b7a77704969744a4238494b336239684731624f483947586647485a79574f715a534e61506f484f6f6769485a4b4a52346e756147766869554f3764696a355a5a66714b356a5a5557476174352f7a42376a746271394442367a4b46364739483649614a704b3571624c517942786456397474597a637656412b50553d00000000000000000000',
          },
        ],
      });

      // @ts-ignore
      await cif.issueBadge(input);
      expect(serializeActionData).toBeCalledWith(_options, ActionNameEnum.ISSUEBADGE, input);
      expect(execCode).toBeCalledWith(CODE_IDS.ISSUE_BADGE, codeActions, CodeTypeEnum.BADGE_ISSUE, undefined, proposalBadgeId);
      expect(mockQuery).toBeCalledTimes(1);
      expect(mockQuery).toBeCalledWith('proposal', {
        code: process.env.app__can_multisig_account,
        scope: 'badge',
        lower_bound: input.badge_propose_name,
        upper_bound: input.badge_propose_name,
      });
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

      const input: VoteForPositionInput = {
        community_account: 'cifdemoaccm3',
        pos_id: 3,
        candidates: ['cifdemoaccx2'],
        voter: 'cifdemoaccx2',
        vote_status: true,
      };

      const signTrx = jest.spyOn(cif, 'signTrx');

      // @ts-ignore
      cif.voteForPosition(input);
      // doing
      expect(signTrx).toBeCalledWith({
        actions: input.candidates.map(candidate => ({
          account: _options.code,
          authorization: [{ actor: _options.signOption.canAccount, permission: 'active' }],
          data: {
            community_account: input.community_account,
            pos_id: input.pos_id,
            candidate,
            voter: input.voter,
            vote_status: input.vote_status,
          },
          name: ActionNameEnum.VOTEFORPOS,
        })),
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

  describe('test query api', () => {
    it('should no default params', async () => {
      const _options = _.cloneDeep(options);
      _options.signOption.userId = faker.random.uuid();

      const cif = new CanCommunity(_options, canPass);
      const table = TableNameEnum.V1_CODE;

      const get_table_rows = jest.spyOn(app.rpc, 'get_table_rows');
      get_table_rows.mockResolvedValue(tableCodes);

      const res = await cif.query(table);
      expect(get_table_rows).toBeCalledWith({
        code: _options.code,
        scope: _options.signOption.communityCanAccount,
        table,
      });
      expect(res).toEqual(tableCodes);
    });

    it('should no default params', async () => {
      const _options = _.cloneDeep(options);
      _options.signOption.userId = faker.random.uuid();

      const cif = new CanCommunity(_options, canPass);
      const table = TableNameEnum.V1_CODE;

      const fakeRes = {
        more: false,
        rows: [
          {
            amendment_exec_type: 0,
            amendment_execution_right: {
              accounts: ['creator.can'],
              required_badges: [],
              required_exp: 0,
              required_positions: [],
              required_tokens: [],
            },
            code_actions: ['createcode'],
            exec_type: 0,
            code_execution_right: {
              accounts: ['creator.can'],
              required_badges: [],
              required_exp: 0,
              required_positions: [],
              required_tokens: [],
            },
            code_id: 0,
            code_name: 'co.amend',
            code_type: { refer_id: 0, type: 0 },
            contract_name: 'governance23',
          },
        ],
      };

      const get_table_rows = jest.spyOn(app.rpc, 'get_table_rows');
      get_table_rows.mockResolvedValue(fakeRes);

      const res = await cif.query(table, {
        key_type: 'i64',
        index_position: 2,
        lower_bound: CODE_IDS.CREATE_CODE,
        upper_bound: CODE_IDS.CREATE_CODE,
      });
      expect(get_table_rows).toBeCalledWith({
        code: _options.code,
        scope: _options.signOption.communityCanAccount,
        table,
        key_type: 'i64',
        index_position: 2,
        lower_bound: CODE_IDS.CREATE_CODE,
        upper_bound: CODE_IDS.CREATE_CODE,
      });
      expect(res).toEqual(fakeRes);
    });
  });
});
