import CanPass, { CanPassApiConfig } from 'can-pass-js';
import { JsonRpc } from 'eosjs';
import {
  AppointPositionInput,
  ApprovePositionInput,
  CanCommunityOptions,
  CreateCodeInput,
  CreateCommunityInput,
  CreatePositionInput,
  DismissPositionInput,
  ExecCodeInput,
  ExecProposalInput,
  NominatePositionInput,
  SetCollectionRuleForCodeInput,
  SetCredentialsInput,
  SetFillingRuleForPositionInput,
  SetRightHolderForCodeInput,
  SetRightHolderForPositionInput,
  SignTrxOption,
  VoteForCodeInput,
  VoteForPositionInput,
} from './types/can-community-types';
import { ACTIONS_NAME, CODE_IDS, EXECUTION_TYPE, SIGN_TRX_METHOD, TABLE } from './utils/constant';
import { serializeActionData } from './utils/actions';
import utils from './utils/utils';
import { logger } from './utils/logger';

export class CanCommunity {
  public init: CanPassApiConfig;
  public config: CanCommunityOptions;
  public canRpc: JsonRpc;

  constructor(config: CanCommunityOptions, canPassApiConfig?: CanPassApiConfig) {
    if (canPassApiConfig) {
      this.init = CanPass.init(canPassApiConfig);
    }

    this.config = config;
    this.canRpc = utils.makeRpc(config.fetch, config.canUrl);
  }

  initLoginButton() {
    CanPass.loginButton();
  }

  setCredentials(options: SetCredentialsInput) {
    return CanPass.setCredentials({
      idToken: options.idToken,
      accessToken: options.accessToken,
    });
  }

  pushAction(action: string, actor: string, input: any) {
    return {
      account: this.config.governanceAccount,
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

  signTrx(signOption: SignTrxOption, trx: any) {
    switch (signOption.signTrxMethod) {
      case SIGN_TRX_METHOD.MANUAL:
        return trx;
      case SIGN_TRX_METHOD.CAN_PASS:
      default:
        if (!signOption.userId) {
          logger.error('missing `userId` in `signOption`', signOption);
          throw new Error('missing `userId` in `signOption`');
        }
        return CanPass.signTx(trx, signOption.userId);
    }
  }

  createCommunity(input: CreateCommunityInput) {
    const trx = {
      actions: [
        {
          account: 'eosio.token',
          authorization: [{ actor: input.creator, permission: 'active' }],
          data: {
            from: input.creator,
            memo: input.community_account,
            quantity: input.initialCAT || '10.0000 CAT',
            to: this.config.governanceAccount,
          },
          name: ACTIONS_NAME.CREATE_COMMUNITY_ACCOUNT,
        },
        this.pushAction(ACTIONS_NAME.CREATE_COMMUNITY, input.creator, {
          creator: input.creator,
          community_account: input.community_account,
          community_name: input.community_name,
          member_badge: input.member_badge,
          community_url: input.community_url,
          description: input.description,
          create_default_code: input.create_default_code,
        }),
      ],
    };

    return this.signTrx(input.signOption, trx);
  }

  async execCode(input: ExecCodeInput): Promise<any> {
    const code = await utils.findCode(this.config, input.community_account, input.code_id);

    let trx;

    switch (code.code_exec_type) {
      case EXECUTION_TYPE.SOLE_DECISION:
        trx = {
          actions: [
            this.pushAction(ACTIONS_NAME.EXECUTE_CODE, input.exec_account, {
              community_account: input.community_account,
              exec_account: input.exec_account,
              code_id: code.code_id,
              code_action: input.code_action,
              packed_params: input.packed_params,
            }),
          ],
        };
        break;
      case EXECUTION_TYPE.COLLECTIVE_DECISION:
        if (!input.proposal_name) {
          throw new Error('missing `input.proposal_name`');
        }

        trx = {
          actions: [
            this.pushAction(ACTIONS_NAME.PROPOSE_CODE, input.exec_account, {
              community_account: input.community_account,
              exec_account: input.exec_account,
              proposer: input.exec_account,
              proposal_name: input.proposal_name,
              code_id: code.code_id,
              code_action: input.code_action,
              data: input.packed_params,
            }),
          ],
        };
        break;
    }

    return this.signTrx(input.signOption, trx);
  }

  async createCode(input: CreateCodeInput): Promise<any> {
    const packedParams = await serializeActionData(this.config, ACTIONS_NAME.CREATE_CODE, {
      community_account: input.community_account,
      code_id: CODE_IDS.CREATE_CODE,
      contract_name: input.contract_name,
      code_actions: input.code_actions,
      exec_type: input.exec_type,
    });

    return this.execCode({
      ...input,
      code_id: CODE_IDS.CREATE_CODE,
      code_action: ACTIONS_NAME.CREATE_CODE,
      packed_params: packedParams,
    });
  }

  async setRightHolderForCode(input: SetRightHolderForCodeInput): Promise<any> {
    const packedParams = await serializeActionData(this.config, ACTIONS_NAME.SET_RIGHT_HOLDER_FOR_CODE, {
      community_account: input.community_account,
      code_id: CODE_IDS.SET_RIGHT_HOLDER_FOR_CODE,
      right_accounts: input.right_accounts,
      pos_ids: input.pos_ids,
    });
    return this.execCode({
      ...input,
      code_id: CODE_IDS.SET_RIGHT_HOLDER_FOR_CODE,
      code_action: ACTIONS_NAME.SET_RIGHT_HOLDER_FOR_CODE,
      packed_params: packedParams,
    });
  }

  async setCollectionRuleForCode(input: SetCollectionRuleForCodeInput): Promise<any> {
    const packedParams = await serializeActionData(this.config, ACTIONS_NAME.SET_COLLECTION_RULE_FOR_CODE, {
      community_account: input.community_account,
      code_id: CODE_IDS.SET_COLLECTION_RULE_FOR_CODE,
      right_accounts: input.right_accounts,
      pass_rule: input.pass_rule,
      execution_duration: input.execution_duration,
      vote_duration: input.vote_duration,
    });
    return this.execCode({
      ...input,
      code_id: CODE_IDS.SET_COLLECTION_RULE_FOR_CODE,
      code_action: ACTIONS_NAME.SET_COLLECTION_RULE_FOR_CODE,
      packed_params: packedParams,
    });
  }

  voteForCode(input: VoteForCodeInput) {
    return this.signTrx(input.signOption, {
      actions: [
        this.pushAction(ACTIONS_NAME.VOTE_FOR_CODE, input.exec_account, {
          community_account: input.community_account,
          // proposal_id is changed to proposal_name (string - eosio name)
          proposal_id: input.proposal_id,
          voter: input.exec_account,
          vote_status: input.vote_status,
        }),
      ],
    });
  }

  async setRightHolderForPosition(input: SetRightHolderForPositionInput): Promise<any> {
    const packedParams = await serializeActionData(this.config, ACTIONS_NAME.SET_RIGHT_HOLDER_FOR_POSITION, {
      community_account: input.community_account,
      pos_id: input.pos_id,
      right_accounts: input.right_accounts,
    });
    return this.execCode({
      ...input,
      code_id: CODE_IDS.SET_RIGHT_HOLDER_FOR_POSITION,
      code_action: ACTIONS_NAME.SET_RIGHT_HOLDER_FOR_POSITION,
      packed_params: packedParams,
    });
  }

  voteForPosition(input: VoteForPositionInput) {
    return this.signTrx(input.signOption, {
      actions: [
        this.pushAction(ACTIONS_NAME.VOTE_FOR_POSITION, input.exec_account, {
          community_account: input.community_account,
          pos_id: input.pos_id,
          voter: input.exec_account,
          candidate: input.candidate,
          vote_status: input.vote_status,
        }),
      ],
    });
  }

  async setFillingRuleForPosition(input: SetFillingRuleForPositionInput): Promise<any> {
    const startAtEpoch = new Date(input.start_at).getTime() / 1000; // second unit
    const endAtEpoch = new Date(input.end_at).getTime() / 1000; // second unit
    const packedParams = await serializeActionData(this.config, ACTIONS_NAME.SET_FILLING_RULE_FOR_POSITION, {
      community_account: input.community_account,
      pos_id: input.pos_id,
      filling_type: input.filling_type,
      start_at: startAtEpoch,
      end_at: endAtEpoch,
      pass_rule: input.pass_rule,
      right_accounts: input.right_accounts,
    });
    return this.execCode({
      ...input,
      code_id: CODE_IDS.SET_FILLING_RULE_FOR_POSITION,
      code_action: ACTIONS_NAME.SET_FILLING_RULE_FOR_POSITION,
      packed_params: packedParams,
    });
  }

  nominatePosition(input: NominatePositionInput) {
    return this.signTrx(input.signOption, {
      actions: [
        this.pushAction(ACTIONS_NAME.NOMINATE_POSITION, input.exec_account, {
          community_account: input.community_account,
          pos_id: input.pos_id,
          owner: input.exec_account,
        }),
      ],
    });
  }

  async createPosition(input: CreatePositionInput): Promise<any> {
    const packedParams = await serializeActionData(this.config, ACTIONS_NAME.CREATE_POSITION, {
      community_account: input.community_account,
      pos_name: input.pos_name,
      max_holder: input.max_holder,
      filling_through: input.filling_through,
    });

    return this.execCode({
      ...input,
      code_id: CODE_IDS.CREATE_POSITION,
      code_action: ACTIONS_NAME.CREATE_POSITION,
      packed_params: packedParams,
    });
  }

  async dismissPosition(input: DismissPositionInput): Promise<any> {
    const packedParams = await serializeActionData(this.config, ACTIONS_NAME.DISMISS_POSITION, {
      community_account: input.community_account,
      pos_id: input.pos_id,
      holder: input.holder,
    });

    return this.execCode({
      ...input,
      code_id: CODE_IDS.DISMISS_POSITION,
      code_action: ACTIONS_NAME.DISMISS_POSITION,
      packed_params: packedParams,
    });
  }

  async approvePosition(input: ApprovePositionInput): Promise<any> {
    const packedParams = await serializeActionData(this.config, ACTIONS_NAME.APPROVE_POSITION, {
      community_account: input.community_account,
      pos_id: input.pos_id,
    });

    return this.execCode({
      ...input,
      code_id: CODE_IDS.APPROVE_POSITION,
      code_action: ACTIONS_NAME.APPROVE_POSITION,
      packed_params: packedParams,
    });
  }

  async appointPosition(input: AppointPositionInput): Promise<any> {
    const packedParams = await serializeActionData(this.config, ACTIONS_NAME.APPOINT_POSITION, {
      community_account: input.community_account,
      pos_id: input.pos_id,
      holder_accounts: input.holder_accounts,
    });

    return this.execCode({
      ...input,
      code_id: CODE_IDS.APPOINT_POSITION,
      code_action: ACTIONS_NAME.APPOINT_POSITION,
      packed_params: packedParams,
    });
  }

  execProposal(input: ExecProposalInput) {
    return this.signTrx(input.signOption, {
      actions: [
        this.pushAction(ACTIONS_NAME.EXEC_PROPOSAL, input.exec_account, {
          community_account: input.community_account,
          proposal_id: input.proposal_id,
        }),
      ],
    });
  }

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

    results = await this.canRpc.get_table_rows(parameters);
    return results.rows;
  }

  async getAllCommunities(size: number, lowerBound: string = null) {
    return this.getTableRows(this.config.governanceAccount, this.config.governanceAccount, TABLE.COMMUNITY, size, lowerBound);
  }

  async getAllCodeOfCommunity(communityAccount: string, size: number) {
    return this.getTableRows(this.config.governanceAccount, communityAccount, TABLE.CODES, size);
  }

  async getCollectiveRuleOfCode(communityAccount: string, codeId: string) {
    const results = await this.getTableRows(this.config.governanceAccount, communityAccount, TABLE.COLLEC_RULES, 1, codeId);
    return results[0];
  }

  async getAllCodeProposalOfCommunity(communityAccount: string, size: number) {
    return this.getTableRows(this.config.governanceAccount, communityAccount, TABLE.CO_PROPOSALS, size);
  }

  async getAllPositionOfCommunity(communityAccount: string, size: number) {
    return this.getTableRows(this.config.governanceAccount, communityAccount, TABLE.POSITIONS, size);
  }

  async getPosition(communityAccount: string, positionId: string) {
    return this.getTableRows(this.config.governanceAccount, communityAccount, TABLE.POSITIONS, 1, positionId);
  }

  async getFillingRuleOfPosition(communityAccount: string, positionId: string) {
    const results = await this.getTableRows(this.config.governanceAccount, communityAccount, TABLE.FILLING_RULE, 1, positionId);
    return results[0];
  }

  async getAllPositionProposalOfCommunity(communityAccount: string, size: number) {
    return this.getTableRows(this.config.governanceAccount, communityAccount, TABLE.POS_PROPOSAL, size);
  }

  async getProposalOfPosition(communityAccount: string, positionId: string) {
    const results = await this.getTableRows(this.config.governanceAccount, communityAccount, TABLE.POS_PROPOSAL, 1, positionId);
    return results[0];
  }

  async getAllCandidateOfPosition(communityAccount: string, positionId: string, size: number) {
    const positionProposal = await this.getProposalOfPosition(communityAccount, positionId);
    return this.getTableRows(
      this.config.governanceAccount,
      positionProposal.pos_proposal_id,
      TABLE.POS_CANDIDATE,
      size,
      positionId,
    );
  }
}
