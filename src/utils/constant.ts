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
  DISMISS_POSITION = 'po.dismisspos',
  APPROVE_POSITION = 'po.config',
  APPOINT_POSITION = 'po.appoint',
  SET_RIGHT_HOLDER_FOR_POSITION = 'po.config',
  CONFIGURE_POSITION = 'po.config',
}
