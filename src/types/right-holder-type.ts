import { EosName } from '../smart-contract-types/base-types';
import { ExecutionType, ApprovalType } from './smart-contract-enum';

export interface RightHolderType {
  /**
   * This param is required if the code is COLLECTIVE_DECISION execution type
   */
  exec_type?: ExecutionType;
  approval_type?: ApprovalType;
  sole_right_accounts?: EosName[];
  sole_right_pos_ids?: number[];
  proposer_right_accounts?: EosName[];
  proposer_right_pos_ids?: number[];
  approver_right_accounts?: EosName[];
  approver_right_pos_ids?: number[];
  voter_right_accounts?: EosName[];
  voter_right_pos_ids?: number[];
  pass_rule?: number;
  vote_duration?: number;
}

export interface ConfigCodeInput {
  community_account: EosName;
  code_id: number;
  code_right_holder?: RightHolderType;
  amendment_right_holder?: RightHolderType;
}
