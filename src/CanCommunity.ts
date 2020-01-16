import CanPass, { CanPassApiConfig } from 'can-pass-js';
import { JsonRpc } from 'eosjs';
import {
  SetCredentialsInput,
  CanCommunityOptions,
  CreateCommunityInput,
  SetRightHolderForCodeInput,
  CreateCodeInput,
  ExecCodeInput,
  SetCollectionRuleForCodeInput,
  VoteForCodeInput,
  SetRightHolderForPositionInput,
  VoteForPositionInput,
  SetFillingRuleForPositionInput,
  NominatePositionInput,
  CreatePositionInput,
  DismissPositionInput,
  ApprovePositionInput,
  AppointPositionInput,
  ExecProposalInput,
} from './types/canCommunity';
import { ACTIONS_NAME, CODE_IDS, TABLE } from './utils/constant';
import { serializeActionData } from './utils/actions';

export class CanCommunity {
  public init: CanPassApiConfig;
  public config: CanCommunityOptions;
  public canRpc: JsonRpc;

  constructor(clientId: string, version: string, config: CanCommunityOptions, store?: string) {
    const defaultStore = 'memory';
    const { canUrl, fetch } = config;
    this.init = CanPass.init({
      clientId,
      version: version || '1.0',
      store: store || defaultStore,
      fetch,
    });
    this.config = config;
    this.canRpc = new JsonRpc(canUrl, {
      fetch,
    });
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
    const transactionAction = {
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
    return transactionAction;
  }

  createCommunity(input: CreateCommunityInput) {
    return CanPass.signTx(
      {
        actions: [
          {
            account: 'eosio.token',
            authorization: [{ actor: input.creator, permission: 'active' }],
            data: {
              from: input.creator,
              memo: input.community_account,
              quantity: '10.0000 CAT',
              to: this.config.governanceAccount,
            },
            name: 'transfer',
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
      },
      input.creator,
    );
  }

  execCode(input: ExecCodeInput): Promise<any> {
    return CanPass.signTx(
      {
        actions: [
          this.pushAction(ACTIONS_NAME.EXECUTE_CODE, input.exec_account, {
            community_account: input.community_account,
            exec_account: input.exec_account,
            code_id: input.code_id,
            code_action: input.code_action,
            packed_params: input.packed_params,
          }),
        ],
      },
      input.exec_account,
    );
  }

  async createCode(input: CreateCodeInput): Promise<any> {
    const packedParams = await serializeActionData(this.config, ACTIONS_NAME.CREATE_CODE, {
      community_account: input.community_account,
      code_id: input.code_id,
      contract_name: input.contract_name,
      code_actions: input.code_actions,
      exec_type: input.exec_type,
    });

    return this.execCode({
      community_account: input.community_account,
      exec_account: input.exec_account,
      code_id: CODE_IDS.CREATE_CODE,
      code_action: ACTIONS_NAME.CREATE_CODE,
      packed_params: packedParams,
    });
  }

  async setRightHolderForCode(input: SetRightHolderForCodeInput): Promise<any> {
    const packedParams = await serializeActionData(this.config, ACTIONS_NAME.SET_RIGHT_HOLDER_FOR_CODE, {
      community_account: input.community_account,
      code_id: input.code_id,
      right_accounts: input.right_accounts,
      pos_ids: input.pos_ids,
    });
    return this.execCode({
      community_account: input.community_account,
      exec_account: input.exec_account,
      code_id: CODE_IDS.SET_RIGHT_HOLDER_FOR_CODE,
      code_action: ACTIONS_NAME.SET_RIGHT_HOLDER_FOR_CODE,
      packed_params: packedParams,
    });
  }

  async setCollectionRuleForCode(input: SetCollectionRuleForCodeInput): Promise<any> {
    const packedParams = await serializeActionData(this.config, ACTIONS_NAME.SET_COLLECTION_RULE_FOR_CODE, {
      community_account: input.community_account,
      code_id: input.code_id,
      right_accounts: input.right_accounts,
      pass_rule: input.pass_rule,
      execution_duration: input.execution_duration,
      vote_duration: input.vote_duration,
    });
    return this.execCode({
      community_account: input.community_account,
      exec_account: input.exec_account,
      code_id: CODE_IDS.SET_COLLECTION_RULE_FOR_CODE,
      code_action: ACTIONS_NAME.SET_COLLECTION_RULE_FOR_CODE,
      packed_params: packedParams,
    });
  }

  voteForCode(input: VoteForCodeInput) {
    return CanPass.signTx(
      {
        actions: [
          this.pushAction(ACTIONS_NAME.VOTE_FOR_CODE, input.exec_account, {
            community_account: input.community_account,
            proposal_id: input.proposal_id,
            voter: input.exec_account,
            vote_status: input.vote_status,
          }),
        ],
      },
      input.exec_account,
    );
  }

  async setRightHolderForPosition(input: SetRightHolderForPositionInput): Promise<any> {
    const packedParams = await serializeActionData(this.config, ACTIONS_NAME.SET_RIGHT_HOLDER_FOR_POSITION, {
      community_account: input.community_account,
      pos_id: input.pos_id,
      right_accounts: input.right_accounts,
    });
    return this.execCode({
      community_account: input.community_account,
      exec_account: input.exec_account,
      code_id: CODE_IDS.SET_RIGHT_HOLDER_FOR_POSITION,
      code_action: ACTIONS_NAME.SET_RIGHT_HOLDER_FOR_POSITION,
      packed_params: packedParams,
    });
  }

  voteForPosition(input: VoteForPositionInput) {
    return CanPass.signTx(
      {
        actions: [
          this.pushAction(ACTIONS_NAME.VOTE_FOR_POSITION, input.exec_account, {
            community_account: input.community_account,
            pos_id: input.pos_id,
            voter: input.exec_account,
            candidate: input.candidate,
            vote_status: input.vote_status,
          }),
        ],
      },
      input.exec_account,
    );
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
      community_account: input.community_account,
      exec_account: input.exec_account,
      code_id: CODE_IDS.SET_FILLING_RULE_FOR_POSITION,
      code_action: ACTIONS_NAME.SET_FILLING_RULE_FOR_POSITION,
      packed_params: packedParams,
    });
  }

  nominatePosition(input: NominatePositionInput) {
    return CanPass.signTx(
      {
        actions: [
          this.pushAction(ACTIONS_NAME.NOMINATE_POSITION, input.exec_account, {
            community_account: input.community_account,
            pos_id: input.pos_id,
            owner: input.exec_account,
          }),
        ],
      },
      input.exec_account,
    );
  }

  async createPosition(input: CreatePositionInput): Promise<any> {
    const packedParams = await serializeActionData(this.config, ACTIONS_NAME.CREATE_POSITION, {
      community_account: input.community_account,
      pos_name: input.pos_name,
      max_holder: input.max_holder,
    });

    return this.execCode({
      community_account: input.community_account,
      exec_account: input.exec_account,
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
      community_account: input.community_account,
      exec_account: input.exec_account,
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
      community_account: input.community_account,
      exec_account: input.exec_account,
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
      community_account: input.community_account,
      exec_account: input.exec_account,
      code_id: CODE_IDS.APPOINT_POSITION,
      code_action: ACTIONS_NAME.APPOINT_POSITION,
      packed_params: packedParams,
    });
  }

  execProposal(input: ExecProposalInput) {
    return CanPass.signTx(
      {
        actions: [
          this.pushAction(ACTIONS_NAME.EXEC_PROPOSAL, input.exec_account, {
            community_account: input.community_account,
            proposal_id: input.proposal_id,
          }),
        ],
      },
      input.exec_account,
    );
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
