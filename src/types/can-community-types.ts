import { EosName } from '../smart-contract-types/base-types';
import { EXECUTION_TYPE, SIGN_TRX_METHOD } from '../utils/constant';
import { SignTrxPayload } from './SignTrxPayLoad';

export interface CanCommunityOptions {
  canUrl: string;
  signOption: SignTrxOption;
  textEncoder?: TextEncoder;
  textDecoder?: TextDecoder;
  /**
   * this is governance smart contract CAN account
   */
  code: EosName;
  userName: string;
  fetch?: (input?: string | Request, init?: RequestInit) => Promise<Response>;
  /**
   * this is crypto badge contract CAN account
   */
  cryptoBadgeContractAccount: EosName;
  payRam?: (signTrxPayload: SignTrxPayload) => Promise<SignTrxPayload>;
}

export interface SignTrxOption {
  /**
   * This param is required if the signing transaction method is Can-Pass
   */
  userId?: string;

  /**
   * Default is SIGN_TRX_METHOD.CAN_PASS
   */
  signTrxMethod?: SIGN_TRX_METHOD;

  canAccount: EosName;

  communityCanAccount: EosName;
}

export interface ExecCodeInput {
  /**
   * This param is required if the code is COLLECTIVE_DECISION execution type
   */
  proposal_name?: EosName;

  user_exec_type: EXECUTION_TYPE;
}

export interface VoteForPositionInput {
  community_account: EosName;
  pos_id: number;
  voter: EosName;
  candidates: EosName[];
  vote_status: boolean;
}

export interface QueryOptions {
  json?: boolean;
  code?: EosName;
  scope?: EosName;
  table?: string;
  table_key?: string;
  lower_bound?: number | string;
  upper_bound?: number | string;
  index_position?: number;
  key_type?: string;
  limit?: number;
  reverse?: boolean;
  show_payer?: boolean;
}
