export enum DEFAULT_NUMBER {
  CAT = '10.0000 CAT',
}
export enum EOS_ACCOUNT {
  NAME = 'eosio.token',
}

export enum SIGN_TRX_METHOD {
  CAN_PASS = 'CAN_PASS',
  MANUAL = 'MANUAL',
}

export enum EXECUTION_TYPE {
  SOLE_DECISION = 0,
  COLLECTIVE_DECISION,
}

export enum ACTIONS_NAME {
  CREATE_COMMUNITY_ACCOUNT = 'transfer',
  CREATE_COMMUNITY = 'create',
  CREATE_CODE = 'createcode',
  EXECUTE_CODE = 'execcode',
  PROPOSE_CODE = 'proposecode',
  SET_RIGHT_HOLDER_FOR_CODE = 'setrightcode',
  SET_COLLECTION_RULE_FOR_CODE = 'setcollectrl',
  VOTE_FOR_CODE = 'voteforcode',
  SET_RIGHT_HOLDER_FOR_POSITION = 'setrightpos',
  VOTE_FOR_POSITION = 'voteforpos',
  SET_FILLING_RULE_FOR_POSITION = 'setfillrule',
  NOMINATE_POSITION = 'nominatepos',
  CREATE_POSITION = 'createpos',
  DISMISS_POSITION = 'dissmisspos',
  APPROVE_POSITION = 'approvepos',
  APPOINT_POSITION = 'appointpos',
  EXEC_PROPOSAL = 'execproposal',
}

export enum CODE_IDS {
  CREATE_CODE = 'co.amend',
  SET_RIGHT_HOLDER_FOR_CODE = 'co.amend',
  SET_COLLECTION_RULE_FOR_CODE = 'co.amend',
  CREATE_POSITION = 'po.create',
  DISMISS_POSITION = 'po.config',
  APPROVE_POSITION = 'po.config',
  APPOINT_POSITION = 'po.appoint',
  SET_RIGHT_HOLDER_FOR_POSITION = 'po.config',
  SET_FILLING_RULE_FOR_POSITION = 'po.config',
}

export enum TABLE {
  COMMUNITY = 'community',
  CODES = 'codes',
  COLLEC_RULES = 'collecrules',
  CO_PROPOSALS = 'coproposals',
  POSITIONS = 'positions',
  FILLING_RULE = 'fillingrule',
  POS_PROPOSAL = 'posproposal',
  POS_CANDIDATE = 'poscandidate',
}
