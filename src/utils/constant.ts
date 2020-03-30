export enum SIGN_TRX_METHOD {
  CAN_PASS = 'CAN_PASS',
  MANUAL = 'MANUAL',
}

export enum EXECUTION_TYPE {
  SOLE_DECISION = 0,
  COLLECTIVE_DECISION,
  BOTH,
}

export enum CODE_IDS {
  CREATE_CODE = 'co.amend',
  ACCESS_CODE = 'co.access',
  SET_RIGHT_HOLDER_FOR_CODE = 'co.amend',
  SET_COLLECTION_RULE_FOR_CODE = 'co.amend',
  CREATE_POSITION = 'po.create',
  DISMISS_POSITION = 'po.dismiss',
  APPROVE_POSITION = 'po.config',
  APPOINT_POSITION = 'po.appoint',
  SET_RIGHT_HOLDER_FOR_POSITION = 'po.config',
  CONFIGURE_POSITION = 'po.config',
  CREATE_BADGE = 'ba.create',
  ISSUE_BADGE = 'ba.issue',
  CONFIG_BADGE = 'ba.config',
}
