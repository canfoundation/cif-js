import { Api, JsonRpc } from 'eosjs/dist';

import app from './app';
import { ActionNameEnum } from './smart-contract-types/ActionNameEnum';
import { Appointpos } from './smart-contract-types/Appointpos';
import { Approvepos } from './smart-contract-types/Approvepos';
import { Asset, EosName } from './smart-contract-types/base-types';
import { Configbadge } from './smart-contract-types/Configbadge';
import { Configpos } from './smart-contract-types/Configpos';
import { Create } from './smart-contract-types/Create';
import { Createbadge } from './smart-contract-types/Createbadge';
import { Createcode } from './smart-contract-types/Createcode';
import { Createpos } from './smart-contract-types/Createpos';
import { Dismisspos } from './smart-contract-types/Dismisspos';
import { Execcode } from './smart-contract-types/Execcode';
import { Execproposal } from './smart-contract-types/Execproposal';
import { ExecutionCodeData } from './smart-contract-types/ExecutionCodeData';
import { Inputmembers } from './smart-contract-types/Inputmembers';
import { Issuebadge } from './smart-contract-types/Issuebadge';
import { Nominatepos } from './smart-contract-types/Nominatepos';
import { Proposecode } from './smart-contract-types/Proposecode';
import { RightHolder } from './smart-contract-types/RightHolder';
import { Setaccess } from './smart-contract-types/Setaccess';
import { Setapprotype } from './smart-contract-types/Setapprotype';
import { Setapprover } from './smart-contract-types/Setapprover';
import { Setexectype } from './smart-contract-types/Setexectype';
import { Setproposer } from './smart-contract-types/Setproposer';
import { Setsoleexec } from './smart-contract-types/Setsoleexec';
import { Setvoter } from './smart-contract-types/Setvoter';
import { Setvoterule } from './smart-contract-types/Setvoterule';
import { TableNameEnum } from './smart-contract-types/TableNameEnum';
import { Voteforcode } from './smart-contract-types/Voteforcode';
import {
  CanCommunityOptions,
  ExecCodeInput,
  QueryOptions,
  SignTrxOption,
  VoteForPositionInput,
} from './types/can-community-types';
import { CodeSetting, ConfigCodeInput } from './types/right-holder-type';
import { CodeTypeEnum } from './types/smart-contract-enum';
import { serializeActionData } from './utils/actions';
import { CODE_IDS, EXECUTION_TYPE, MSIG_ACCOUNT, SIGN_TRX_METHOD } from './utils/constant';
import { buildConfigPositionInput, buildCreateBadgeInput, buildCreatePositionInput } from './utils/inputBuilder';
import { logger } from './utils/logger';
import utils from './utils/utils';

export class CanCommunity {
  public config: CanCommunityOptions;
  public rpc: JsonRpc;
  public api: Api;

  constructor(config: CanCommunityOptions, public canPass?: any) {
    app.init(config.canUrl, config.fetch, config.textEncoder, config.textDecoder);
    this.config = config;
    this.rpc = app.rpc;
    this.api = app.api;
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
      default:
        // set default value of the the broadcast to false so that
        // we can add more signatures to the transaction before broadcasting it
        const broadcast = !this.config.payRam;
        return this.canPass.signTx(trx, { broadcast });
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
    execCodeInput: ExecCodeInput = { user_exec_type: EXECUTION_TYPE.SOLE_DECISION },
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
    const codeExecType = codeType === CodeTypeEnum.AMENDMENT ? code.amendment_exec_type : code.code_exec_type;

    if (execCodeInput.user_exec_type === EXECUTION_TYPE.COLLECTIVE_DECISION) {
      if (codeExecType === EXECUTION_TYPE.SOLE_DECISION) {
        throw new Error('Can not create proposal for sole decision code');
      }

      let { proposal_name } = execCodeInput;
      if (!proposal_name) {
        proposal_name = utils.randomEosName(null, '12345abcdefghijklmnopqrstuvwxyz');
        logger.debug('---- missing param proposal_name, auto generate one:', proposal_name);
      }

      const proposeCode: Proposecode = {
        community_account,
        proposer: canAccount,
        code_id: code.code_id,
        code_actions,
        proposal_name,
      };

      trx = {
        actions: [this.makeAction(ActionNameEnum.PROPOSECODE, canAccount, proposeCode)],
      };
    } else {
      if (codeExecType === EXECUTION_TYPE.COLLECTIVE_DECISION) {
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

    return this.signTrx(trx).then(res => {
      if (this.config.payRam) {
        return this.config.payRam(res).then(() => res);
      }
      return res;
    });
  }

  async isAccessHolder(communityAccount: EosName, account: EosName) {
    const accessionTable = await this.query(TableNameEnum.V1_ACCESS, {
      scope: communityAccount,
    });

    if (!accessionTable || !accessionTable.rows || !accessionTable.rows.length) {
      throw Error('Accession table is not exist');
    }

    const rightHolder = accessionTable?.rows[0].right_access;

    return this.checkRightHolder(rightHolder, account);
  }

  async isRightHolderOfCode(codeId: number, account: EosName, execType: EXECUTION_TYPE, action: string) {
    const isAmendCode = action === 'configCode';
    let rightHolder;
    if (execType === EXECUTION_TYPE.SOLE_DECISION) {
      let codeExecRule;
      if (isAmendCode) {
        // if it is amendment action, get right holder from amenexecrule table
        const amendExecRuleTable = await this.query(TableNameEnum.V1_AMENEXEC, {
          lower_bound: codeId,
          upper_bound: codeId,
        });
        if (amendExecRuleTable.rows.length === 0) {
          return false;
        }
        codeExecRule = amendExecRuleTable.rows[0];
      } else {
        // if it is normal action, get right holder from codeexecrule table
        const codeExecRuleTable = await this.query(TableNameEnum.V1_CODEEXEC, {
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
        const amendVoteRuleTable = await this.query(TableNameEnum.V1_AMENVOTE, {
          lower_bound: 1,
          upper_bound: 1,
        });
        if (amendVoteRuleTable.rows.length === 0) {
          return false;
        }
        codeVoteRule = amendVoteRuleTable.rows[0];
      } else {
        // if it is amendment code, get right holder from codevoterule table
        const codeVoteRuleTable = await this.query(TableNameEnum.V1_CODEVOTE, {
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

    return this.checkRightHolder(rightHolder, account);
  }

  async checkRightHolder(rightHolder: RightHolder, account: EosName) {
    // if anyone can exec the code, return true
    if (rightHolder.is_anyone) {
      return true;
    }

    // TODO check the case that is_any_community_member
    if (rightHolder.is_any_community_member || rightHolder.is_anyone) {
      return true;
    }

    // check right holder is set or not
    const isSetRightHolder =
      rightHolder.accounts.length > 0 ||
      rightHolder.required_badges.length > 0 ||
      rightHolder.required_positions.length > 0 ||
      rightHolder.required_tokens.length > 0;

    if (!isSetRightHolder) {
      // return false if right holder is not set
      return false;
    }

    // check user account satisfy require accounts,
    if (rightHolder.accounts.length > 0 && rightHolder.accounts.includes(account)) {
      return true;
    }

    // check user badge satisfy require badges
    if (rightHolder.required_badges.length > 0) {
      // get all user badges
      const userBadgeTable = await this.query(TableNameEnum.V1_CERT, {
        scope: account,
        code: this.config.cryptoBadgeContractAccount,
        index_position: 2,
        key_type: 'i64',
        upper_bound: Math.max(...rightHolder.required_badges),
        lower_bound: Math.min(...rightHolder.required_badges),
      });

      const userBadges = userBadgeTable.rows;

      const userBadgeIds = userBadges.map(badge => badge.badge_id);

      // check that user have one of required badges
      for (const id of rightHolder.required_badges) {
        if (userBadgeIds.includes(id)) {
          return true;
        }
      }
    }

    // check user position statify require positions
    if (rightHolder.required_positions.length > 0) {
      // get all positions of community that relative to required_positions
      const positionTable = await this.query(TableNameEnum.V1_POSITION, {
        upper_bound: Math.max(...rightHolder.required_positions),
        lower_bound: Math.min(...rightHolder.required_positions),
      });

      const positions = positionTable.rows;

      for (const pos of positions) {
        if (rightHolder.required_positions.includes(pos.pos_id)) {
          // check that user have require position
          if (pos.holders.includes(account)) {
            return true;
          }
        }
      }
    }

    return false;
  }

  /**
   * Create a new community
   * @param input: create community input
   * @param initialCAT: init token transfer to governance to create community account, example '10.0000 CAT'
   * @param payer: payer for creating community
   */
  createCommunity(input: Create, initialCAT: Asset, payer?: EosName) {
    const trx = {
      actions: [
        {
          account: 'eosio.token',
          authorization: [{ actor: input.creator, permission: 'active' }],
          data: {
            from: payer ? payer : input.creator,
            memo: payer ? `${input.community_account}-${input.creator}` : input.community_account,
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

  async setAccess(input: Setaccess, execCodeInput?: ExecCodeInput): Promise<any> {
    const packedParams = await serializeActionData(this.config, ActionNameEnum.SETACCESS, input);

    const codeActions: ExecutionCodeData[] = [
      {
        code_action: ActionNameEnum.SETACCESS,
        packed_params: packedParams,
      },
    ];

    return this.execCode(CODE_IDS.ACCESS_CODE, codeActions, CodeTypeEnum.NORMAL, execCodeInput);
  }

  async inputCommunityMember(input: Inputmembers, execCodeInput?: ExecCodeInput): Promise<any> {
    const packedParams = await serializeActionData(this.config, ActionNameEnum.INPUTMEMBERS, input);

    const codeActions: ExecutionCodeData[] = [
      {
        code_action: ActionNameEnum.INPUTMEMBERS,
        packed_params: packedParams,
      },
    ];

    return this.execCode(CODE_IDS.MEMBER_CODE, codeActions, CodeTypeEnum.NORMAL, execCodeInput);
  }

  async createConfigCodeActionInput(
    communityAccount: EosName,
    codeId: number,
    input: CodeSetting,
    isAmendmentCode: boolean,
  ): Promise<ExecutionCodeData[]> {
    const codeActions: ExecutionCodeData[] = [];

    if (input.right_sole_executor) {
      const setSoleExecInput: Setsoleexec = {
        community_account: communityAccount,
        code_id: codeId,
        right_sole_executor: input.right_sole_executor,
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

    if (input.right_proposer) {
      const setProposerInput: Setproposer = {
        community_account: communityAccount,
        code_id: codeId,
        right_proposer: input.right_proposer,
        is_amend_code: isAmendmentCode,
      };
      const packedParams = await serializeActionData(this.config, ActionNameEnum.SETPROPOSER, setProposerInput);
      codeActions.push({
        code_action: ActionNameEnum.SETPROPOSER,
        packed_params: packedParams,
      });
    }

    if (input.right_approver) {
      const setApproverInput: Setapprover = {
        community_account: communityAccount,
        code_id: codeId,
        right_approver: input.right_approver,
        is_amend_code: isAmendmentCode,
      };
      const packedParams = await serializeActionData(this.config, ActionNameEnum.SETAPPROVER, setApproverInput);
      codeActions.push({
        code_action: ActionNameEnum.SETAPPROVER,
        packed_params: packedParams,
      });
    }

    if (input.right_voter) {
      const setVoterInput: Setvoter = {
        community_account: communityAccount,
        code_id: codeId,
        right_voter: input.right_voter,
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

    return this.execCode(CODE_IDS.SET_RIGHT_HOLDER_FOR_CODE, codeActions, CodeTypeEnum.AMENDMENT, execCodeInput, input.code_id);
  }

  async createPosition(input: Createpos, execCodeInput?: ExecCodeInput): Promise<any> {
    const serializeInput = buildCreatePositionInput(input);
    const packedParams = await serializeActionData(this.config, ActionNameEnum.CREATEPOS, serializeInput);

    const codeActions: ExecutionCodeData[] = [
      {
        code_action: ActionNameEnum.CREATEPOS,
        packed_params: packedParams,
      },
    ];

    return this.execCode(CODE_IDS.CREATE_POSITION, codeActions, CodeTypeEnum.NORMAL, execCodeInput);
  }

  async configurePosition(input: Configpos, execCodeInput?: ExecCodeInput): Promise<any> {
    const serializeInput = buildConfigPositionInput(input);
    const packedParams = await serializeActionData(this.config, ActionNameEnum.CONFIGPOS, serializeInput);

    const codeActions: ExecutionCodeData[] = [
      {
        code_action: ActionNameEnum.CONFIGPOS,
        packed_params: packedParams,
      },
    ];

    return this.execCode(CODE_IDS.CONFIGURE_POSITION, codeActions, CodeTypeEnum.POSITION_CONFIG, execCodeInput, input.pos_id);
  }

  async dismissPosition(input: Dismisspos, execCodeInput?: ExecCodeInput): Promise<any> {
    const packedParams = await serializeActionData(this.config, ActionNameEnum.DISMISSPOS, input);

    const codeActions: ExecutionCodeData[] = [
      {
        code_action: ActionNameEnum.DISMISSPOS,
        packed_params: packedParams,
      },
    ];

    return this.execCode(CODE_IDS.DISMISS_POSITION, codeActions, CodeTypeEnum.POSITION_DISMISS, execCodeInput, input.pos_id);
  }

  async approvePosition(input: Approvepos, execCodeInput?: ExecCodeInput): Promise<any> {
    const packedParams = await serializeActionData(this.config, ActionNameEnum.APPROVEPOS, input);

    const codeActions: ExecutionCodeData[] = [
      {
        code_action: ActionNameEnum.APPROVEPOS,
        packed_params: packedParams,
      },
    ];

    return this.execCode(CODE_IDS.APPROVE_POSITION, codeActions, CodeTypeEnum.NORMAL, execCodeInput, input.pos_id);
  }

  async appointPosition(input: Appointpos, execCodeInput?: ExecCodeInput): Promise<any> {
    const packedParams = await serializeActionData(this.config, ActionNameEnum.APPOINTPOS, input);

    const codeActions: ExecutionCodeData[] = [
      {
        code_action: ActionNameEnum.APPOINTPOS,
        packed_params: packedParams,
      },
    ];

    return this.execCode(CODE_IDS.APPOINT_POSITION, codeActions, CodeTypeEnum.POSITION_APPOINT, execCodeInput, input.pos_id);
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

  async createBadge(input: Createbadge, execCodeInput?: ExecCodeInput): Promise<any> {
    const serializeInput = buildCreateBadgeInput(input);
    const packedParams = await serializeActionData(this.config, ActionNameEnum.CREATEBADGE, serializeInput);

    const codeActions: ExecutionCodeData[] = [
      {
        code_action: ActionNameEnum.CREATEBADGE,
        packed_params: packedParams,
      },
    ];

    return this.execCode(CODE_IDS.CREATE_BADGE, codeActions, CodeTypeEnum.NORMAL, execCodeInput);
  }

  async configBadge(input: Configbadge, execCodeInput?: ExecCodeInput): Promise<any> {
    const packedParams = await serializeActionData(this.config, ActionNameEnum.CONFIGBADGE, input);

    const codeActions: ExecutionCodeData[] = [
      {
        code_action: ActionNameEnum.CONFIGBADGE,
        packed_params: packedParams,
      },
    ];

    return this.execCode(CODE_IDS.CONFIG_BADGE, codeActions, CodeTypeEnum.BADGE_CONFIG, execCodeInput, input.badge_id);
  }

  async issueBadge(input: Issuebadge, execCodeInput?: ExecCodeInput): Promise<any> {
    const packedParams = await serializeActionData(this.config, ActionNameEnum.ISSUEBADGE, input);

    const codeActions: ExecutionCodeData[] = [
      {
        code_action: ActionNameEnum.ISSUEBADGE,
        packed_params: packedParams,
      },
    ];

    const proposalQueryOption: QueryOptions = {
      code: MSIG_ACCOUNT,
      scope: this.config.cryptoBadgeContractAccount,
      lower_bound: input.badge_propose_name,
      upper_bound: input.badge_propose_name,
    };

    const proposalItems = await this.query(TableNameEnum.PROPOSAL, proposalQueryOption);

    const packedTransaction = proposalItems?.rows[0].packed_transaction;

    const unpackTransaction = await this.api.deserializeTransaction(Buffer.from(packedTransaction, 'hex'));

    if (unpackTransaction.actions.length !== 1) {
      throw new Error('Issue badge proposal is invalid');
    }

    if (
      unpackTransaction.actions[0].account !== this.config.cryptoBadgeContractAccount ||
      unpackTransaction.actions[0].name !== 'issuebadge'
    ) {
      throw new Error('Proposal is not issue badge transaction');
    }

    const unpackIssueBadgeAction = await this.api.deserializeActions(unpackTransaction.actions);
    const issuingBadgeId = unpackIssueBadgeAction[0].data.badge_id;

    return this.execCode(CODE_IDS.ISSUE_BADGE, codeActions, CodeTypeEnum.BADGE_ISSUE, execCodeInput, Number(issuingBadgeId));
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
