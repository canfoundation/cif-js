import { EosName } from '../smart-contract-types/base-types';
import { SIGN_TRX_METHOD } from '../utils/constant';

export interface CanCommunityOptions {
  canUrl: string;
  signOption: SignTrxOption;
  textEncoder?: TextEncoder;
  textDecoder?: TextDecoder;
  /**
   * this is governance smart contract CAN account
   */
  code: EosName;
  fetch?: (input?: string | Request, init?: RequestInit) => Promise<Response>;
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

  canAccount: EosName;

  communityCanAccount: EosName;
}

export interface ExecCodeInput {
  /**
   * This param is required if the code is COLLECTIVE_DECISION execution type
   */
  proposal_name?: EosName;
}
