export enum SIGN_TRX_METHOD {
  CAN_PASS = 'CAN_PASS',
  MANUAL = 'MANUAL',
}

export enum EXECUTION_TYPE {
  SOLE_DECISION = 0,
  COLLECTIVE_DECISION,
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

/**
 * @deprecated will be remove on version > 0.9.10
 */
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
