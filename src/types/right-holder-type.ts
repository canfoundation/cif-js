import { EosName } from '../smart-contract-types/base-types';
import { ExecutionType, ApprovalType } from './smart-contract-enum';
import { RightHolder } from '../smart-contract-types/RightHolder';

export interface CodeSetting {
  /**
   * This param is required if the code is COLLECTIVE_DECISION execution type
   */
  exec_type?: ExecutionType;
  approval_type?: ApprovalType;
  right_sole_executor?: RightHolder;
  right_proposer?: RightHolder;
  right_approver?: RightHolder;
  right_voter?: RightHolder;
  pass_rule?: number;
  vote_duration?: number;
}

export interface ConfigCodeInput {
  community_account: EosName;
  code_id: number;
  code_right_holder?: CodeSetting;
  amendment_right_holder?: CodeSetting;
}
