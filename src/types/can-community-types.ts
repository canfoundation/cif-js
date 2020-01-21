import { CODE_IDS, EXECUTION_TYPE, SIGN_TRX_METHOD } from '../utils/constant';

/**
 * Eos name format https://eosio.github.io/eosio.cdt/latest/structeosio_1_1name/#struct-eosioname
 * [1-5a-z.]
 */
export type EosName = string;
export type CAT_Token = string;

export interface BaseInput {
  exec_account: string;
  community_account: string;
}

export interface CanCommunityOptions {
  canUrl: string;
  textEncoder?: TextEncoder;
  textDecoder?: TextDecoder;
  governanceAccount: string;
  fetch?: (input?: string | Request, init?: RequestInit) => Promise<Response>;
}

export interface CreateCommunityInput {
  creator: EosName;
  community_account: EosName;
  initialCAT: CAT_Token;
  community_name: string;
  member_badge: number[];
  community_url: string;
  description: string;
  create_default_code: boolean;
  signOption: SignTrxOption;
}

export interface CreateCodeInput extends ExecCodeBaseInput {
  contract_name: EosName;
  code_actions: string[];
  exec_type: EXECUTION_TYPE;
}

export interface SignTrxOption {
  /**
   * This param is required if the signing transaction method is Can-Pass
   */
  userId?: string;
  /**
   * Default is SIGN_TRX_METHOD.CAN_PASS
   */
  signTrxMethod: SIGN_TRX_METHOD;
}

export interface ExecCodeBaseInput extends BaseInput {
  signOption: SignTrxOption;
  /**
   * This param is required if the code is COLLECTIVE_DECISION execution type
   */
  proposal_name?: EosName;
}

export interface ExecCodeInput extends ExecCodeBaseInput {
  code_action: string;
  packed_params: string;
  code_id: CODE_IDS;
}

export interface SetRightHolderForCodeInput extends ExecCodeBaseInput {
  right_accounts: string[];
  pos_ids: number[];
}

export interface SetCollectionRuleForCodeInput extends ExecCodeBaseInput {
  vote_duration: number;
  execution_duration: number;
  pass_rule: number;
  right_accounts: string[];
}

export interface VoteForCodeInput {
  signOption: SignTrxOption;
  exec_account: string;
  community_account: string;
  proposal_id: string;
  vote_status: boolean;
}

export interface SetRightHolderForPositionInput extends ExecCodeBaseInput {
  pos_id: string;
  right_accounts: string[];
}

export interface VoteForPositionInput {
  signOption: SignTrxOption;
  exec_account: string;
  community_account: string;
  pos_id: string;
  candidate: string;
  vote_status: boolean;
}

export enum PositionFillingType {
  APPOINTMENT = 0,
  ELECTION,
}

export interface SetFillingRuleForPositionInput extends ExecCodeBaseInput {
  pos_id: string;
  filling_type: PositionFillingType;
  start_at: string;
  end_at: string;
  pass_rule: number;
  right_accounts: string[];
}

export interface NominatePositionInput {
  signOption: SignTrxOption;
  exec_account: string;
  community_account: string;
  pos_id: string;
}

export interface CreatePositionInput extends ExecCodeBaseInput {
  pos_name: string;
  max_holder: number;
  filling_through: PositionFillingType;
}

export interface DismissPositionInput extends ExecCodeBaseInput {
  pos_id: string;
  holder: string;
}

export interface ApprovePositionInput extends ExecCodeBaseInput {
  pos_id: string;
}

export interface AppointPositionInput extends ExecCodeBaseInput {
  pos_id: string;
  holder_accounts: string[];
}

export interface SetCredentialsInput {
  accessToken: string;
  idToken?: string;
}

export interface ExecProposalInput {
  signOption: SignTrxOption;
  exec_account: string;
  community_account: string;
  proposal_id: number;
}
