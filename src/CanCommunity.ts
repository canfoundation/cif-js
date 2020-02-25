import {
  CanCommunityOptions,
  ExecCodeInput,
  QueryOptions,
  SignTrxOption,
  VoteForPositionInput,
} from './types/can-community-types';
import { ConfigCodeInput, RightHolderType } from './types/right-holder-type';
import { CODE_IDS, EXECUTION_TYPE, SIGN_TRX_METHOD } from './utils/constant';
import { serializeActionData } from './utils/actions';
import utils from './utils/utils';
import { logger } from './utils/logger';
import { CodeTypeEnum, FillingType } from './types/smart-contract-enum';
import { Asset, EosName } from './smart-contract-types/base-types';
import { Create } from './smart-contract-types/Create';
import { ActionNameEnum } from './smart-contract-types/ActionNameEnum';
import { Createcode } from './smart-contract-types/Createcode';
import { Execcode } from './smart-contract-types/Execcode';
import { ExecutionCodeData } from './smart-contract-types/ExecutionCodeData';
import { Proposecode } from './smart-contract-types/Proposecode';
import { Setexectype } from './smart-contract-types/Setexectype';
import { Setsoleexec } from './smart-contract-types/Setsoleexec';
import { Setapprotype } from './smart-contract-types/Setapprotype';
import { Setapprover } from './smart-contract-types/Setapprover';
import { Setproposer } from './smart-contract-types/Setproposer';
import { Setvoter } from './smart-contract-types/Setvoter';
import { Setvoterule } from './smart-contract-types/Setvoterule';
import { Nominatepos } from './smart-contract-types/Nominatepos';
import { Createpos } from './smart-contract-types/Createpos';
import { Dismisspos } from './smart-contract-types/Dismisspos';
import { Approvepos } from './smart-contract-types/Approvepos';
import { Appointpos } from './smart-contract-types/Appointpos';
import { Execproposal } from './smart-contract-types/Execproposal';
import { Voteforcode } from './smart-contract-types/Voteforcode';
import app from './app';
import { TableNameEnum } from './smart-contract-types/TableNameEnum';
import { JsonRpc } from 'eosjs/dist';
import { Configpos } from './smart-contract-types/Configpos';

export class CanCommunity {
  public config: CanCommunityOptions;
  public rpc: JsonRpc;

  constructor(config: CanCommunityOptions, public canPass?: any) {
    app.init(config.canUrl, config.fetch);
    this.config = config;
    this.rpc = app.rpc;
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
        return this.canPass.signTx(trx, signOption.userId, this.config.userName);
    }
  }

  /**
   * exec code helper
   * create action param and make request of signing transaction on behap of user
   * @param code_id
   * @param code_action
   * @param packed_params
   * @param execCodeInput
   * @param referenceId
   */
  async execCode(
    code_id: CODE_IDS,
    code_actions: ExecutionCodeData[],
    codeType: CodeTypeEnum,
    execCodeInput: ExecCodeInput = {},
    referenceId?: number,
  ): Promise<any> {
    const community_account = this.config.signOption.communityCanAccount;
    const canAccount = this.config.signOption.canAccount;

    const code = await utils.findCode(
      this.config.code,
      this.config.signOption.communityCanAccount,
      code_id,
      codeType,
      referenceId,
    );

    let trx;
    const execType = codeType === CodeTypeEnum.AMENDMENT ? code.amendment_exec_type : code.code_exec_type;

    if (execCodeInput.proposal_name) {
      if (execType === EXECUTION_TYPE.SOLE_DECISION) {
        throw new Error('Can not create proposal for sole decision code');
      }

      const proposeCode: Proposecode = {
        community_account,
        proposer: canAccount,
        code_id: code.code_id,
        code_actions,
        proposal_name: execCodeInput.proposal_name,
      };

      trx = {
        actions: [this.makeAction(ActionNameEnum.PROPOSECODE, canAccount, proposeCode)],
      };
    } else {
      if (execType === EXECUTION_TYPE.COLLECTIVE_DECISION) {
        throw new Error('Can not execute for collective decision code');
      }

      const execCode: Execcode = {
        community_account,
        exec_account: canAccount,
        code_id: code.code_id,
        code_actions,
      };

      trx = {
        actions: [this.makeAction(ActionNameEnum.EXECCODE, canAccount, execCode)],
      };
    }

    return this.signTrx(trx);
  }

  async isRightHolderOfCode(codeId: number, account: EosName, execType: EXECUTION_TYPE, action: string) {
    const isAmendCode = action === 'configCode';
    let rightHolder;
    if (execType === EXECUTION_TYPE.SOLE_DECISION) {
      let codeExecRule;
      if (isAmendCode) {
        // if it is amendment action, get right holder from amenexecrule table
        const amendExecRuleTable = await this.query(TableNameEnum.AMENEXECRULE, {
          lower_bound: codeId,
          upper_bound: codeId,
        });
        if (amendExecRuleTable.rows.length === 0) {
          return false;
        }
        codeExecRule = amendExecRuleTable.rows[0];
      } else {
        // if it is normal action, get right holder from codeexecrule table
        const codeExecRuleTable = await this.query(TableNameEnum.CODEEXECRULE, {
          lower_bound: codeId,
          upper_bound: codeId,
        });
        if (codeExecRuleTable.rows.length === 0) {
          return false;
        }
        codeExecRule = codeExecRuleTable.rows[0];
      }
      rightHolder = codeExecRule.right_executor;
    } else if (execType === EXECUTION_TYPE.COLLECTIVE_DECISION) {
      let codeVoteRule;
      if (isAmendCode) {
        // if it is amendment code, get right holder from amenvoterule table
        const amendVoteRuleTable = await this.query(TableNameEnum.AMENVOTERULE, {
          lower_bound: 1,
          upper_bound: 1,
        });
        if (amendVoteRuleTable.rows.length === 0) {
          return false;
        }
        codeVoteRule = amendVoteRuleTable.rows[0];
      } else {
        // if it is amendment code, get right holder from codevoterule table
        const codeVoteRuleTable = await this.query(TableNameEnum.CODEVOTERULE, {
          lower_bound: 1,
          upper_bound: 1,
        });
        if (codeVoteRuleTable.rows.length === 0) {
          return false;
        }
        codeVoteRule = codeVoteRuleTable.rows[0];
      }
      rightHolder = codeVoteRule.right_proposer;
    }

    // check right holder is set or not
    const isSetRightHolder =
      rightHolder.accounts.length !== 0 ||
      rightHolder.required_badges.length !== 0 ||
      rightHolder.required_positions.length !== 0 ||
      rightHolder.required_tokens.length !== 0;

    if (!isSetRightHolder) {
      // return false if right holder is not set
      return false;
    }

    // check user account satisfy require accounts,
    if (rightHolder.accounts.length !== 0 && !rightHolder.accounts.includes(account)) {
      return false;
    }

    // check user badge satisfy require badges
    if (rightHolder.required_badges.length) {
      // get all user badges
      const userBadgeTable = await this.query('cbadges', {
        scope: account,
        code: this.config.cryptoBadgeContractAccount,
        limit: 500,
      });

      const userBadges = userBadgeTable.rows;

      const userBadgeIds = userBadges.map(badge => badge.badgeid);

      // check that user have all required badges
      for (const id of rightHolder.required_badges) {
        if (!userBadgeIds.includes(id)) {
          return false;
        }
      }
    }

    // check user position statify require positions
    if (rightHolder.required_positions.length) {
      // get all positions of community that relative to required_positions
      const positionTable = await this.query(TableNameEnum.POSITIONS, {
        upper_bound: Math.max(...rightHolder.required_positions),
        lower_bound: Math.min(...rightHolder.required_positions),
      });

      const positions = positionTable.rows;

      for (const pos of positions) {
        if (rightHolder.required_positions.includes(pos.pos_id)) {
          // check that user have require position
          if (!pos.holders.includes(account)) {
            return false;
          }
        }
      }
    }

    return true;
  }

  /**
   * Create a new community
   * @param input
   * @param initialCAT example '10.0000 CAT'
   */
  createCommunity(input: Create, initialCAT: Asset) {
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

  async createConfigCodeActionInput(
    communityAccount: EosName,
    codeId: number,
    input: RightHolderType,
    isAmendmentCode: boolean,
  ): Promise<ExecutionCodeData[]> {
    const codeActions: ExecutionCodeData[] = [];

    if (
      (input.sole_right_accounts && input.sole_right_accounts.length) ||
      (input.sole_right_pos_ids && input.sole_right_pos_ids.length)
    ) {
      const setSoleExecInput: Setsoleexec = {
        community_account: communityAccount,
        code_id: codeId,
        right_accounts: input.sole_right_accounts || [],
        right_pos_ids: input.sole_right_pos_ids || [],
        is_amend_code: isAmendmentCode,
      };
      const packedParams = await serializeActionData(this.config, ActionNameEnum.SETSOLEEXEC, setSoleExecInput);
      codeActions.push({
        code_action: ActionNameEnum.SETSOLEEXEC,
        packed_params: packedParams,
      });
    }

    if (input.approval_type) {
      const setApprovalTypeInput: Setapprotype = {
        community_account: communityAccount,
        code_id: codeId,
        approval_type: input.approval_type,
        is_amend_code: isAmendmentCode,
      };
      const packedParams = await serializeActionData(this.config, ActionNameEnum.SETAPPROTYPE, setApprovalTypeInput);
      codeActions.push({
        code_action: ActionNameEnum.SETAPPROTYPE,
        packed_params: packedParams,
      });
    }

    if (
      (input.proposer_right_accounts && input.proposer_right_accounts.length) ||
      (input.proposer_right_pos_ids && input.proposer_right_pos_ids.length)
    ) {
      const setProposerInput: Setproposer = {
        community_account: communityAccount,
        code_id: codeId,
        right_accounts: input.proposer_right_accounts || [],
        right_pos_ids: input.proposer_right_pos_ids || [],
        is_amend_code: isAmendmentCode,
      };
      const packedParams = await serializeActionData(this.config, ActionNameEnum.SETPROPOSER, setProposerInput);
      codeActions.push({
        code_action: ActionNameEnum.SETPROPOSER,
        packed_params: packedParams,
      });
    }

    if (
      (input.approver_right_accounts && input.approver_right_accounts.length) ||
      (input.approver_right_pos_ids && input.approver_right_pos_ids.length)
    ) {
      const setApproverInput: Setapprover = {
        community_account: communityAccount,
        code_id: codeId,
        right_accounts: input.approver_right_accounts || [],
        right_pos_ids: input.approver_right_pos_ids || [],
        is_amend_code: isAmendmentCode,
      };
      const packedParams = await serializeActionData(this.config, ActionNameEnum.SETAPPROVER, setApproverInput);
      codeActions.push({
        code_action: ActionNameEnum.SETAPPROVER,
        packed_params: packedParams,
      });
    }

    if (
      (input.voter_right_accounts && input.voter_right_accounts.length) ||
      (input.voter_right_pos_ids && input.voter_right_pos_ids.length)
    ) {
      const setVoterInput: Setvoter = {
        community_account: communityAccount,
        code_id: codeId,
        right_accounts: input.voter_right_accounts || [],
        right_pos_ids: input.voter_right_pos_ids || [],
        is_amend_code: isAmendmentCode,
      };
      const packedParams = await serializeActionData(this.config, ActionNameEnum.SETVOTER, setVoterInput);
      codeActions.push({
        code_action: ActionNameEnum.SETVOTER,
        packed_params: packedParams,
      });
    }

    if (input.vote_duration && input.pass_rule) {
      const setVoteRuleInput: Setvoterule = {
        community_account: communityAccount,
        code_id: codeId,
        pass_rule: input.pass_rule,
        vote_duration: input.vote_duration,
        is_amend_code: isAmendmentCode,
      };
      const packedParams = await serializeActionData(this.config, ActionNameEnum.SETVOTERULE, setVoteRuleInput);
      codeActions.push({
        code_action: ActionNameEnum.SETVOTERULE,
        packed_params: packedParams,
      });
    }

    if (typeof input.exec_type === 'number') {
      const setExecTypeInput: Setexectype = {
        community_account: communityAccount,
        code_id: codeId,
        exec_type: input.exec_type,
        is_amend_code: isAmendmentCode,
      };
      const packedParams = await serializeActionData(this.config, ActionNameEnum.SETEXECTYPE, setExecTypeInput);
      codeActions.push({
        code_action: ActionNameEnum.SETEXECTYPE,
        packed_params: packedParams,
      });
    }

    return codeActions;
  }

  async createCode(input: Createcode, execCodeInput?: ExecCodeInput): Promise<any> {
    const packedParams = await serializeActionData(this.config, ActionNameEnum.CREATECODE, input);

    const codeActions: ExecutionCodeData[] = [
      {
        code_action: ActionNameEnum.CREATECODE,
        packed_params: packedParams,
      },
    ];

    return this.execCode(CODE_IDS.CREATE_CODE, codeActions, CodeTypeEnum.NORMAL, execCodeInput);
  }

  async configCode(input: ConfigCodeInput, execCodeInput?: ExecCodeInput): Promise<any> {
    let codeRightHolderSettingActions: ExecutionCodeData[] = [];
    let amendmentRightHolderSettingActions: ExecutionCodeData[] = [];

    if (input.code_right_holder) {
      codeRightHolderSettingActions = await this.createConfigCodeActionInput(
        input.community_account,
        input.code_id,
        input.code_right_holder,
        false,
      );
    }

    if (input.amendment_right_holder) {
      amendmentRightHolderSettingActions = await this.createConfigCodeActionInput(
        input.community_account,
        input.code_id,
        input.amendment_right_holder,
        true,
      );
    }

    const codeActions: ExecutionCodeData[] = codeRightHolderSettingActions.concat(amendmentRightHolderSettingActions);

    return this.execCode(CODE_IDS.SET_RIGHT_HOLDER_FOR_CODE, codeActions, CodeTypeEnum.AMENDMENT, execCodeInput);
  }

  async createPosition(input: Createpos, execCodeInput?: ExecCodeInput): Promise<any> {
    if (input.filled_through === FillingType.APPOINTMENT) {
      input = {
        ...input,
        term: 0,
        next_term_start_at: 0,
        voting_period: 0,
        pass_rule: 0,
        pos_candidate_accounts: [],
        pos_voter_accounts: [],
        pos_candidate_positions: [],
        pos_voter_positions: [],
      };
    } else {
      input = {
        ...input,
        pos_candidate_accounts: input.pos_candidate_accounts || [],
        pos_voter_accounts: input.pos_voter_accounts || [],
        pos_candidate_positions: input.pos_candidate_positions || [],
        pos_voter_positions: input.pos_voter_positions || [],
      };
    }
    const packedParams = await serializeActionData(this.config, ActionNameEnum.CREATEPOS, input);

    const codeActions: ExecutionCodeData[] = [
      {
        code_action: ActionNameEnum.CREATEPOS,
        packed_params: packedParams,
      },
    ];

    return this.execCode(CODE_IDS.CREATE_POSITION, codeActions, CodeTypeEnum.NORMAL, execCodeInput);
  }

  async configurePosition(input: Configpos, execCodeInput?: ExecCodeInput): Promise<any> {
    if (input.filled_through === FillingType.APPOINTMENT) {
      input = {
        ...input,
        term: 0,
        next_term_start_at: 0,
        voting_period: 0,
        pass_rule: 0,
        pos_candidate_accounts: [],
        pos_voter_accounts: [],
        pos_candidate_positions: [],
        pos_voter_positions: [],
      };
    } else {
      input = {
        ...input,
        pos_candidate_accounts: input.pos_candidate_accounts || [],
        pos_voter_accounts: input.pos_voter_accounts || [],
        pos_candidate_positions: input.pos_candidate_positions || [],
        pos_voter_positions: input.pos_voter_positions || [],
      };
    }
    const packedParams = await serializeActionData(this.config, ActionNameEnum.CONFIGPOS, input);

    const codeActions: ExecutionCodeData[] = [
      {
        code_action: ActionNameEnum.CONFIGPOS,
        packed_params: packedParams,
      },
    ];

    return this.execCode(CODE_IDS.CONFIGURE_POSITION, codeActions, CodeTypeEnum.POSITION, execCodeInput, input.pos_id);
  }

  async dismissPosition(input: Dismisspos, execCodeInput?: ExecCodeInput): Promise<any> {
    const packedParams = await serializeActionData(this.config, ActionNameEnum.DISMISSPOS, input);

    const codeActions: ExecutionCodeData[] = [
      {
        code_action: ActionNameEnum.DISMISSPOS,
        packed_params: packedParams,
      },
    ];

    return this.execCode(CODE_IDS.DISMISS_POSITION, codeActions, CodeTypeEnum.POSITION, execCodeInput, input.pos_id);
  }

  async approvePosition(input: Approvepos, execCodeInput?: ExecCodeInput): Promise<any> {
    const packedParams = await serializeActionData(this.config, ActionNameEnum.APPROVEPOS, input);

    const codeActions: ExecutionCodeData[] = [
      {
        code_action: ActionNameEnum.APPROVEPOS,
        packed_params: packedParams,
      },
    ];

    return this.execCode(CODE_IDS.APPROVE_POSITION, codeActions, CodeTypeEnum.POSITION, execCodeInput, input.pos_id);
  }

  async appointPosition(input: Appointpos, execCodeInput?: ExecCodeInput): Promise<any> {
    const packedParams = await serializeActionData(this.config, ActionNameEnum.APPOINTPOS, input);

    const codeActions: ExecutionCodeData[] = [
      {
        code_action: ActionNameEnum.APPOINTPOS,
        packed_params: packedParams,
      },
    ];

    return this.execCode(CODE_IDS.APPOINT_POSITION, codeActions, CodeTypeEnum.POSITION, execCodeInput, input.pos_id);
  }

  voteForCode(input: Voteforcode) {
    return this.signTrx({
      actions: [this.makeAction(ActionNameEnum.VOTEFORCODE, this.config.signOption.canAccount, input)],
    });
  }

  voteForPosition(input: VoteForPositionInput) {
    return this.signTrx({
      actions: input.candidates.map(candidate =>
        this.makeAction(ActionNameEnum.VOTEFORPOS, this.config.signOption.canAccount, {
          community_account: input.community_account,
          pos_id: input.pos_id,
          voter: input.voter,
          candidate,
          vote_status: input.vote_status,
        }),
      ),
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

  async query(table: string, queryOptions?: QueryOptions) {
    const queryInput: QueryOptions = {
      code: this.config.code,
      table,
      scope: this.config.signOption.communityCanAccount,
      ...queryOptions,
    };

    return this.rpc.get_table_rows(queryInput);
  }
}
