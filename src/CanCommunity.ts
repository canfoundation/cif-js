import { CanCommunityOptions, ExecCodeInput, QueryOptions, SignTrxOption } from './types/can-community-types';
import { CODE_IDS, EXECUTION_TYPE, SIGN_TRX_METHOD, TABLE } from './utils/constant';
import { serializeActionData } from './utils/actions';
import utils from './utils/utils';
import { logger } from './utils/logger';
import { CAT_Token, EosName } from './smart-contract-types/base-types';
import { Create } from './smart-contract-types/Create';
import { ActionNameEnum } from './smart-contract-types/ActionNameEnum';
import { Createcode } from './smart-contract-types/Createcode';
import { Execcode } from './smart-contract-types/Execcode';
import { Proposecode } from './smart-contract-types/Proposecode';
import { Setrightcode } from './smart-contract-types/Setrightcode';
import { Setcollectrl } from './smart-contract-types/Setcollectrl';
import { Voteforcode } from './smart-contract-types/Voteforcode';
import { Voteforpos } from './smart-contract-types/Voteforpos';
import { Nominatepos } from './smart-contract-types/Nominatepos';
import { Createpos } from './smart-contract-types/Createpos';
import { Dismisspos } from './smart-contract-types/Dismisspos';
import { Approvepos } from './smart-contract-types/Approvepos';
import { Appointpos } from './smart-contract-types/Appointpos';
import { Execproposal } from './smart-contract-types/Execproposal';
import app from './app';
import { TableNameEnum } from './smart-contract-types/TableNameEnum';

export class CanCommunity {
  public config: CanCommunityOptions;

  constructor(config: CanCommunityOptions, public canPass?: any) {
    app.init(config.canUrl, config.fetch);
    this.config = config;
  }

  makeAction(action: string, actor: EosName, input: any) {
    return {
      account: this.config.code,
      name: action,
      authorization: [
        {
          actor,
          permission: 'active',
        },
      ],
      data: input,
    };
  }

  signTrx(trx: any, signOption: SignTrxOption = this.config.signOption) {
    logger.debug('signOption.signTrxMethod', signOption?.signTrxMethod);

    switch (signOption.signTrxMethod) {
      case SIGN_TRX_METHOD.MANUAL:
        return trx;
      case SIGN_TRX_METHOD.CAN_PASS:
      default:
        if (!signOption.userId) {
          logger.error('missing `userId` in `signOption`', signOption);
          throw new Error('missing `userId` in `signOption`');
        }
        return this.canPass.signTx(trx, signOption.userId);
    }
  }

  /**
   * exec code helper
   * create action param and make request of signing transaction on behap of user
   * @param code_id
   * @param code_action
   * @param packed_params
   * @param execCodeInput
   */
  async execCode(
    code_id: CODE_IDS,
    code_action: ActionNameEnum,
    packed_params: string,
    execCodeInput: ExecCodeInput = {},
  ): Promise<any> {
    const community_account = this.config.signOption.communityCanAccount;
    const canAccount = this.config.signOption.canAccount;

    const code = await utils.findCode(this.config.code, this.config.signOption.communityCanAccount, code_id);

    let trx;

    switch (code.code_exec_type) {
      case EXECUTION_TYPE.SOLE_DECISION:
        const execCode: Execcode = {
          community_account,
          exec_account: canAccount,
          code_id: code.code_id,
          code_action,
          packed_params,
        };

        trx = {
          actions: [this.makeAction(ActionNameEnum.EXECCODE, canAccount, execCode)],
        };
        break;
      case EXECUTION_TYPE.COLLECTIVE_DECISION:
        let { proposal_name } = execCodeInput;
        if (!proposal_name) {
          proposal_name = utils.randomEosName();
          logger.debug('---- missing param proposal_name, auto generate one:', proposal_name);
        }

        const proposeCode: Proposecode = {
          community_account,
          proposer: canAccount,
          code_id: code.code_id,
          code_action,
          data: packed_params,
          proposal_name,
        };

        trx = {
          actions: [this.makeAction(ActionNameEnum.PROPOSECODE, canAccount, proposeCode)],
        };
        break;
    }

    return this.signTrx(trx);
  }

  /**
   * Create a new community
   * @param input
   * @param initialCAT example '10.0000 CAT'
   */
  createCommunity(input: Create, initialCAT: CAT_Token) {
    const trx = {
      actions: [
        {
          account: 'eosio.token',
          authorization: [{ actor: input.creator, permission: 'active' }],
          data: {
            from: input.creator,
            memo: input.community_account,
            quantity: initialCAT,
            to: this.config.code,
          },
          name: 'transfer',
        },
        this.makeAction(ActionNameEnum.CREATE, input.creator, input),
      ],
    };

    return this.signTrx(trx);
  }

  async createCode(input: Createcode, execCodeInput?: ExecCodeInput): Promise<any> {
    const packedParams = await serializeActionData(this.config, ActionNameEnum.CREATECODE, input);

    return this.execCode(CODE_IDS.CREATE_CODE, ActionNameEnum.CREATECODE, packedParams, execCodeInput);
  }

  async setRightHolderForCode(input: Setrightcode, execCodeInput?: ExecCodeInput): Promise<any> {
    const packedParams = await serializeActionData(this.config, ActionNameEnum.SETRIGHTCODE, input);

    return this.execCode(CODE_IDS.SET_RIGHT_HOLDER_FOR_CODE, ActionNameEnum.SETRIGHTCODE, packedParams, execCodeInput);
  }

  async setCollectionRuleForCode(input: Setcollectrl, execCodeInput?: ExecCodeInput): Promise<any> {
    const packedParams = await serializeActionData(this.config, ActionNameEnum.SETCOLLECTRL, input);

    return this.execCode(CODE_IDS.SET_COLLECTION_RULE_FOR_CODE, ActionNameEnum.SETCOLLECTRL, packedParams, execCodeInput);
  }

  async setRightHolderForPosition(input: Setrightcode, execCodeInput?: ExecCodeInput): Promise<any> {
    const packedParams = await serializeActionData(this.config, ActionNameEnum.SETRIGHTCODE, input);

    return this.execCode(CODE_IDS.SET_RIGHT_HOLDER_FOR_POSITION, ActionNameEnum.SETRIGHTCODE, packedParams, execCodeInput);
  }

  async createPosition(input: Createpos, execCodeInput?: ExecCodeInput): Promise<any> {
    const packedParams = await serializeActionData(this.config, ActionNameEnum.CREATEPOS, input);

    return this.execCode(CODE_IDS.CREATE_POSITION, ActionNameEnum.CREATEPOS, packedParams, execCodeInput);
  }

  async dismissPosition(input: Dismisspos, execCodeInput?: ExecCodeInput): Promise<any> {
    const packedParams = await serializeActionData(this.config, ActionNameEnum.DISMISSPOS, input);

    return this.execCode(CODE_IDS.DISMISS_POSITION, ActionNameEnum.DISMISSPOS, packedParams, execCodeInput);
  }

  async approvePosition(input: Approvepos, execCodeInput?: ExecCodeInput): Promise<any> {
    const packedParams = await serializeActionData(this.config, ActionNameEnum.APPROVEPOS, input);

    return this.execCode(CODE_IDS.APPROVE_POSITION, ActionNameEnum.APPROVEPOS, packedParams, execCodeInput);
  }

  async appointPosition(input: Appointpos, execCodeInput?: ExecCodeInput): Promise<any> {
    const packedParams = await serializeActionData(this.config, ActionNameEnum.APPOINTPOS, input);

    return this.execCode(CODE_IDS.APPOINT_POSITION, ActionNameEnum.APPOINTPOS, packedParams, execCodeInput);
  }

  voteForCode(input: Voteforcode) {
    return this.signTrx({
      actions: [this.makeAction(ActionNameEnum.VOTEFORCODE, this.config.signOption.canAccount, input)],
    });
  }

  voteForPosition(input: Voteforpos) {
    return this.signTrx({
      actions: [this.makeAction(ActionNameEnum.VOTEFORPOS, this.config.signOption.canAccount, input)],
    });
  }

  nominatePosition(input: Nominatepos) {
    return this.signTrx({
      actions: [this.makeAction(ActionNameEnum.NOMINATEPOS, this.config.signOption.canAccount, input)],
    });
  }

  execProposal(input: Execproposal) {
    return this.signTrx({
      actions: [this.makeAction(ActionNameEnum.EXECPROPOSAL, this.config.signOption.canAccount, input)],
    });
  }

  async query(table: TableNameEnum, queryOptions?: QueryOptions) {
    const queryInput: QueryOptions = {
      code: this.config.code,
      table,
      scope: this.config.signOption.communityCanAccount,
      ...queryOptions,
    };

    return app.rpc.get_table_rows(queryInput);
  }

  /**
   * @deprecated will be remove on version > 0.9.10
   */
  async getTableRows(
    code: string,
    scope: string,
    table: string,
    limit = -1,
    lowerBound: any = null,
    upperBound: any = null,
    json = true,
  ) {
    let results: any;
    const parameters = {
      json,
      code,
      scope,
      table,
      lower_bound: lowerBound,
      upper_bound: upperBound,
      limit,
    };

    results = await app.rpc.get_table_rows(parameters);
    return results.rows;
  }

  /**
   * @deprecated will be remove on version > 0.9.10
   */
  async getAllCommunities(size: number, lowerBound: string = null) {
    return this.getTableRows(this.config.code, this.config.code, TABLE.COMMUNITY, size, lowerBound);
  }

  /**
   * @deprecated will be remove on version > 0.9.10
   */
  async getAllCodeOfCommunity(communityAccount: string, size: number) {
    return this.getTableRows(this.config.code, communityAccount, TABLE.CODES, size);
  }

  /**
   * @deprecated will be remove on version > 0.9.10
   */
  async getCollectiveRuleOfCode(communityAccount: string, codeId: string) {
    const results = await this.getTableRows(this.config.code, communityAccount, TABLE.COLLEC_RULES, 1, codeId);
    return results[0];
  }

  /**
   * @deprecated will be remove on version > 0.9.10
   */
  async getAllCodeProposalOfCommunity(communityAccount: string, size: number) {
    return this.getTableRows(this.config.code, communityAccount, TABLE.CO_PROPOSALS, size);
  }

  /**
   * @deprecated will be remove on version > 0.9.10
   */
  async getAllPositionOfCommunity(communityAccount: string, size: number) {
    return this.getTableRows(this.config.code, communityAccount, TABLE.POSITIONS, size);
  }

  /**
   * @deprecated will be remove on version > 0.9.10
   */
  async getPosition(communityAccount: string, positionId: string) {
    return this.getTableRows(this.config.code, communityAccount, TABLE.POSITIONS, 1, positionId);
  }

  /**
   * @deprecated will be remove on version > 0.9.10
   */
  async getFillingRuleOfPosition(communityAccount: string, positionId: string) {
    const results = await this.getTableRows(this.config.code, communityAccount, TABLE.FILLING_RULE, 1, positionId);
    return results[0];
  }

  /**
   * @deprecated will be remove on version > 0.9.10
   */
  async getAllPositionProposalOfCommunity(communityAccount: string, size: number) {
    return this.getTableRows(this.config.code, communityAccount, TABLE.POS_PROPOSAL, size);
  }

  /**
   * @deprecated will be remove on version > 0.9.10
   */
  async getProposalOfPosition(communityAccount: string, positionId: string) {
    const results = await this.getTableRows(this.config.code, communityAccount, TABLE.POS_PROPOSAL, 1, positionId);
    return results[0];
  }

  /**
   * @deprecated will be remove on version > 0.9.10
   */
  async getAllCandidateOfPosition(communityAccount: string, positionId: string, size: number) {
    const positionProposal = await this.getProposalOfPosition(communityAccount, positionId);
    return this.getTableRows(this.config.code, positionProposal.pos_proposal_id, TABLE.POS_CANDIDATE, size, positionId);
  }
}
