export interface CanCommunityOptions {
  canUrl: string;
  textEncoder?: TextEncoder;
  textDecoder?: TextDecoder;
  governanceAccount: string;
  fetch?: (input?: string | Request, init?: RequestInit) => Promise<Response>;
}
export interface CreateCommunityInput {
  creator: string;
  community_account: string;
  community_name: string;
  member_badge: number[];
  community_url: string;
  description: string;
  create_default_code: boolean;
}
export interface CreateCodeInput {
  exec_account: string;
  community_account: string;
  code_id: string;
  contract_name: string;
  code_actions: string[];
  exec_type: number;
}

export interface ExecCodeInput {
  community_account: string;
  exec_account: string;
  code_id: string;
  code_action: string;
  packed_params: string;
}

export interface SetRightHolderForCodeInput {
  exec_account: string;
  community_account: string;
  code_id: string;
  right_accounts: string[];
  pos_ids: number[];
}

export interface SetCollectionRuleForCodeInput {
  exec_account: string;
  community_account: string;
  code_id: string;
  vote_duration: number;
  execution_duration: number;
  pass_rule: number;
  right_accounts: string[];
}

export interface VoteForCodeInput {
  exec_account: string;
  community_account: string;
  proposal_id: string;
  vote_status: boolean;
}

export interface SetRightHolderForPositionInput {
  exec_account: string;
  community_account: string;
  pos_id: string;
  right_accounts: string[];
}

export interface VoteForPositionInput {
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
export interface SetFillingRuleForPositionInput {
  exec_account: string;
  community_account: string;
  pos_id: string;
  filling_type: PositionFillingType;
  start_at: string;
  end_at: string;
  pass_rule: number;
  right_accounts: string[];
}

export interface NominatePositionInput {
  exec_account: string;
  community_account: string;
  pos_id: string;
}

export interface CreatePositionInput {
  exec_account: string;
  community_account: string;
  pos_name: string;
  max_holder: number;
}
export interface DismissPositionInput {
  exec_account: string;
  community_account: string;
  pos_id: string;
  holder: string;
}
export interface ApprovePositionInput {
  exec_account: string;
  community_account: string;
  pos_id: string;
}

export interface AppointPositionInput {
  exec_account: string;
  community_account: string;
  pos_id: string;
  holder_accounts: string[];
}

export interface SetCredentialsInput {
  accessToken: string;
  idToken?: string;
}

export interface ExecProposalInput {
  exec_account: string;
  community_account: string;
  proposal_id: number;
}
