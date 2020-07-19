<a name="common"></a>

## Below is a list of supported actions:

- [init can community](#canCommunity.init)
- [canCommunity](#canCommunity.createCanCommunity)

  - [common input type](#commonInputType)
  - [.createCommunity(input: object)](#canCommunity.createCommunity)
  - [.setAccess(input: object)](#canCommunity.setAccess)
  - [.isAccessHolder(communityAccount: EosName, account: EosName)](#canCommunity.isAccessHolder)
  - [.createCode(input: object)](#canCommunity.createCode)
  - [.configCode(input: object)](#canCommunity.configCode)
  - [.isRightHolderOfCode(codeId: number, account: EosName, execType: EXECUTION_TYPE, action: string)](#canCommunity.isRightHolderOfCode)
  - [.checkRightHolder(rightHolder: RightHolder, account: EosName)](#canCommunity.checkRightHolder)
  - [.execCode(...input)](#canCommunity.execCode)
  - [.voteForCode(input: object)](#canCommunity.voteForCode)
  - [.createPosition(input: object)](#canCommunity.createPosition)
  - [.configurePosition(input: object)](#canCommunity.configurePosition)
  - [.nominatePosition(input: object)](#canCommunity.nominatePosition)
  - [.approvePosition(input: object)](#canCommunity.approvePosition)
  - [.voteForPosition(input: object)](#canCommunity.voteForPosition)
  - [.appointPosition(input: object)](#canCommunity.appointPosition)
  - [.dismissPosition(input: object)](#canCommunity.dismissPosition)
  - [.inputCommunityMember(input: object)](#canCommunity.inputCommunityMember)
  - [.createBadge(input: object)](#canCommunity.createBadge)
  - [.configBadge(input: object)](#canCommunity.configBadge)
  - [.issueBadge(input: object)](#canCommunity.issueBadge)
  - [.execProposal(input: object)](#canCommunity.execProposal)

## Table diagram and list of supported query:

- [table diagram and description](#canCommunity.tableDiagram)
- [community](#canCommunity.listCommunities)
  - [get list of all community information](#canCommunity.listCommunity)
  - [get community information by community account](#canCommunity.getCommunityByCommunityAccount)
  - [get community information by creator](#canCommunity.getCommunityByCreator)
  - [get access to code in force table](#canCommunity.getAccessTable)
  - [get members of community](#canCommunity.getCommunityMember)
- [code](#canCommunity.listCodes)
  - [get list of code of community](#canCommunity.listCodes)
  - [get code by code id](#canCommunity.getCodebyId)
  - [get code by code name](#canCommunity.getCodeByCodeName)
  - [get list of code by reference id](#canCommunity.getCodeByReferenceId)
  - [get sole decision of code](#canCommunity.getSoleDecisionOfCode)
  - [get collective decision of code](#canCommunity.getCollectiveDecisionOfCode)
  - [get sole decision of amendment code](#canCommunity.getSoleDecisionOfAmendCode)
  - [get collective decision of amendment code](#canCommunity.getCollectiveDecisionOfAmendCode)
  - [get list of code proposal by code id](#canCommunity.getCodeProposalByCodeId)
  - [get list of code proposal by proposer](#canCommunity.getCodeProposalByProposer)
  - [get code proposal by proposal name](#canCommunity.getCodeProposalByProposalName)
- [position](#canCommunity.listPosition)

  - [get list of positions of community](#canCommunity.listPosition)
  - [get position by position id](#canCommunity.getPositionByPositionId)
  - [get list of codes of position by position id](#canCommunity.getPositionCodeByPositionId)
  - [get filling rule of position](#canCommunity.getFillingRuleOfPosition)
  - [get proposal of position](#canCommunity.getProposalOfPosition)
  - [get list candidates of position](#canCommunity.getCandidatesOfPosition)

- [utils](#canCommunity.listUtil)
  - [check user is right holder of code](#canCommunity.checkRightHolder)

---

## List of supported actions:

<a name="canCommunity.int"></a>

### Initial `canCommunity` (Required)

**CanCommunityOptions**

| Field **(input)**         | Description                           |
| ------------------------- | ------------------------------------- |
| canUrl (string)           |                                       |
| userName (string)         |                                       |
| signOption(SignTrxOption) |                                       |
| textEncoder               | new TextEncoder() from `util`         |
| textDecoder               | new TextEncoder() from `util`         |
| code (string)             | governance smart contract CAN account |
| fetch                     | from 'node-fetch';                    |

**SignTrxOption**

| Field **(input)**            | Description                   |
| ---------------------------- | ----------------------------- |
| userId (string)              |                               |
| signTrxMethod                | `CAN_PASS` or `MANUAL`        |
| canAccount (string)          |                               |
| communityCanAccount (string) | new TextEncoder() from `util` |

**CanCommunity**

| Field **(input)**            | Description                                                               |
| ---------------------------- | ------------------------------------------------------------------------- |
| config (CanCommunityOptions) |                                                                           |
| canPass                      | new CanPass() from `can-pass-js` npm package (this field is not required) |

**Example**

```js
const fetch = require('node-fetch');
const { CanCommunity } = require('cif-js');
const { TextEncoder, TextDecoder } = require('util');
const config = {
  canUrl: 'http://18.182.95.163:8888',
  signOption: {
    userId: '1',
    signTrxMethod: 'CAN_PASS',
    canAccount: 'leonardo',
    communityCanAccount: 'Coin',
  },
  textEncoder: new TextEncoder(),
  textDecoder: new TextDecoder(),
  code: 'governance23',
  fetch,
};

const canPass = new CanPass();

const canCommunity = new CanCommunity(config, canPass);
```

### Common input type:

<a name="commonInputType"></a>

**RightHolder**

| Field **(RightHolder)**           | Description                                                                                        |
| --------------------------------- | -------------------------------------------------------------------------------------------------- |
| is_anyone (boolean)               | code execution type, 0 SOLE_DECISION, 1 COLLECTIVE_DECISION, 2 BOTH                                |
| is_any_community_member (boolean) | approval type in case of COLLECTIVE_DECISION, 0 SOLE_APPROVAL, 1 APPROVAL_CONSENSUS, 2 BOTH        |
| required_badges (number[])        | right holder who can execute code in case of SOLE_DECISION                                         |
| required_positions (number[])     | right holder who can create proposal in case of COLLECTIVE_DECISION                                |
| required_tokens (Asset[])         | right holder who can approve code in case of COLLECTIVE_DECISION and SOLE_APPROVAL                 |
| right_voter (RightHolder)         | right holder who can vote for code proposals in case of COLLECTIVE_DECISION and APPROVAL_CONSENSUS |
| required_exp (number)             | percentage of pass rule of proposal                                                                |
| accounts (EosName[])              | duration for voting for proposal                                                                   |

---

<a name="canCommunity.createCommunity"></a>

### Create a Community **[API doc](http://git.baikal.io/can/governance-designer#create-a-community)**

**input**

| Field **(input)**             | Description                                                                 |
| ----------------------------- | --------------------------------------------------------------------------- |
| creator (string)              | Account registering to be a community creator who has is community admin    |
| community_account (string)    | CAN Account of Community on CAN chain (must follow this naming conventions) |
| community_name (string)       | Community Name                                                              |
| member_badge (number[])       | Declare a Badge to identify Members of Community                            |
| community_url (string)        | URL Address of Community                                                    |
| description (string)          | Some description for the Community                                          |
| create_default_code (boolean) | To setup default codes to be used for the Community                         |

**initialCAT**

| Field **(input)**   | Description                                                               |
| ------------------- | ------------------------------------------------------------------------- |
| initialCAT (string) | Amount of cat transfer to governance contract to create community account |

**payer**

| Field **(input)** | Description                                                                          |
| ----------------- | ------------------------------------------------------------------------------------ |
| payer (string)    | The one who transfer token to create community account, default is community creator |

**Community account rule**

- length greater than 6 and less than 13 characters
- has suffix `.c`
- consisting only of lowercase letters a through z, and numbers 1 through 5

**Example**

```js
const input = {
  creator: 'quocleplayer',
  community_account: 'community413',
  community_name: 'community_name',
  member_badge: [],
  community_url: 'htpp://google.com',
  description: 'description',
  create_default_code: true,
};
const initialCAT = '10.0000 CAT';
const payer = 'comcreator';
const result = canCommunity.createCommunity(input, initialCAT, payer);
```

---

<a name="canCommunity.execCode"></a>

### execCodeInput (option)

| Field **(input)**                | Description                                                                                                                                   |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| code_id (number)                 | name of code want to execute                                                                                                                  |
| code_actions (ExecutionCodeData) | list of actions and packed parameters to execute                                                                                              |
| code_type                        | type of executing code, NORMAL = 0, POSITION_CONFIG = 1, POSITION_APPOINT=2, POSITION_DISMISS=3, BADGE_CONFIG=4, BADGE_ISSUE=5, AMENDMENT = 6 |
| execCodeInput                    | configuration to execute code                                                                                                                 |
| referenceId (number)             | reference id relative to code such as position id or badge id                                                                                 |

| Field **(execCodeInput)** | Description                                                                     |
| ------------------------- | ------------------------------------------------------------------------------- |
| proposal_name             | (Optional) Proposal name if propose code, if not specify, sdk will generate one |
| user_exec_type            | (Optional) Execution type user want to execute                                  |

| Type **(ExecutionCodeData)** | Description                     |
| ---------------------------- | ------------------------------- |
| code_action                  | contract action want to execute |
| packed_params                | packed parameters of action     |

**Example**

```js
const input = {
  community_account: 'community251';
  code_name: 'test-code';
  contract_name: 'governance';
  code_actions: ['testaction1', 'testaction2'];
}

const packedParams = await serializeActionData(config, ActionNameEnum.CREATECODE, input);

const codeActions = [
  {
    code_action: ActionNameEnum.CREATECODE,
    packed_params: packedParams,
  },
];

const result = await canCommunity.execCode(CODE_IDS.CREATE_CODE, codeActions, CodeTypeEnum.NORMAL, { proposal_name: "newcode12345", user_exec_type: EXECUTION_TYPE.COLLECTIVE_DECISION });
```

---

<a name="canCommunity.setAccess"></a>

- [.setAccess(input: object)](#canCommunity.setAccess)

### Set who can access code in force

**input**

| Field **(input)**          | Description                                                                            |
| -------------------------- | -------------------------------------------------------------------------------------- |
| community_account (string) | CAN Account of the Community                                                           |
| right_access (RightHolder) | condition for who can access code in force, refer to common input type for more detail |

| Field **(execCodeInput)** | Description                                                                           |
| ------------------------- | ------------------------------------------------------------------------------------- |
| proposal_name             | (Optional) Proposal name if propose code, if not specify, sdk will generate one       |
| user_exec_type            | (Optional) Execution type user want to execute (SOLE_DECISION or COLLECTIVE_DECISION) |

```js
const input = {
  community_account: 'community413',
  right_access: {
    is_anyone: false,
    is_any_community_member: false,
    required_badges: [],
    required_positions: [],
    required_tokens: [],
    required_exp: [],
    accounts: ['daniel111111'],
  },
};

const result = canCommunity.setAccess(input);
```

---

<a name="canCommunity.isAccessHolder"></a>

- [.isAccessHolder(communityAccount: EosName, account: EosName)](#canCommunity.isAccessHolder)

### Check account has permission to access code in force

**input**

| Field **(input)**          | Description                             |
| -------------------------- | --------------------------------------- |
| communityAccount (EosName) | CAN Account of the Community            |
| account (EosName)          | account want to check access permission |

**output**

| Output **(output)** | Description                                         |
| ------------------- | --------------------------------------------------- |
| boolean             | true if account can access CIF and false if can not |

```js
const result = canCommunity.isAccessHolder('community1.c', 'daniel111111');
```

---

<a name="canCommunity.createCode"></a>

### Create a code **[API doc](http://git.baikal.io/can/governance-designer#create-a-code)**

**input**

| Field **(input)**          | Description                           |
| -------------------------- | ------------------------------------- |
| community_account (string) | CAN Account of the Community          |
| code_name (string)         | Name of the Code to be configured     |
| contract_name (string)     | The smart contract which run the code |
| code_actions (string[])    | The code's action                     |

| Field **(execCodeInput)** | Description                                                                     |
| ------------------------- | ------------------------------------------------------------------------------- |
| proposal_name             | (Optional) Proposal name if propose code, if not specify, sdk will generate one |
| user_exec_type            | (Optional) Execution type user want to execute                                  |

```js
const input = {
  community_account: 'community413',
  code_name: 'test.collect',
  contract_name: 'governance23',
  code_actions: ['createCodeUser1', 'createCodeUser2'],
};

const result = canCommunity.createCode(input, execCodeInput);
```

---

<a name="canCommunity.configCode"></a>

### Set Configuration for a Code **[API doc](http://git.baikal.io/can/governance-designer#set-right-holders-for-a-code)**

| Field **(input)**                    | Description                                                         |
| ------------------------------------ | ------------------------------------------------------------------- |
| community_account (string)           | CAN Account of the Community                                        |
| code_id (string)                     | Id of the Code to be configured                                     |
| code_right_holder (CodeSetting)      | right holder condition who can for execute of code                  |
| amendment_right_holder (CodeSetting) | right holder condition who can rule for change right holder of code |

| Field **(execCodeInput)** | Description                                                                     |
| ------------------------- | ------------------------------------------------------------------------------- |
| proposal_name             | (Optional) Proposal name if propose code, if not specify, sdk will generate one |
| user_exec_type            | (Optional) Execution type user want to execute, default is SOLE_DECISION        |

**CodeSetting**

| Type **(CodeSetting)**            | Description                                                                                        |
| --------------------------------- | -------------------------------------------------------------------------------------------------- |
| exec_type (number)                | code execution type, 0 SOLE_DECISION, 1 COLLECTIVE_DECISION, 2 BOTH                                |
| approval_type (number)            | approval type in case of COLLECTIVE_DECISION, 0 SOLE_APPROVAL, 1 APPROVAL_CONSENSUS, 2 BOTH        |
| right_sole_executor (RightHolder) | right holder who can execute code in case of SOLE_DECISION                                         |
| right_proposer (RightHolder)      | right holder who can create proposal in case of COLLECTIVE_DECISION                                |
| right_approver (RightHolder)      | right holder who can approve code in case of COLLECTIVE_DECISION and SOLE_APPROVAL                 |
| right_voter (RightHolder)         | right holder who can vote for code proposals in case of COLLECTIVE_DECISION and APPROVAL_CONSENSUS |
| pass_rule (number)                | percentage of pass rule of proposal                                                                |
| vote_duration (number)            | duration for voting for proposal                                                                   |

**Example**

```js
const input = {
  community_account: 'test-community',
  code_id: 99,
  code_right_holder: {
    exec_type: 1,
    right_sole_executor: {
      is_anyone: false,
      is_any_community_member: false,
      required_badges: [],
      required_positions: [],
      required_tokens: [],
      required_exp: [],
      accounts: ['daniel111111'],
    },
  },
};
const result = canCommunity.configCode(input);
```

---

<a name="canCommunity.isRightHolderOfCode"></a>

[.isRightHolderOfCode(codeId: number, account: EosName, execType: EXECUTION_TYPE, action: string)](#canCommunity.isRightHolderOfCode)

### Check if account has permission to execute code with execType

| Field **(input)**         | Description                            |
| ------------------------- | -------------------------------------- |
| codeId (number)           | Id of the Code                         |
| account (EosName)         | account to check right holder          |
| execType (EXECUTION_TYPE) | execution type account want to execute |
| action (string)           | action of code want to execute         |

**Example**

```js
const result = canCommunity.isRightHolderOfCode(1, 'daniel111111', EXECUTION_TYPE.COLLECTIVE_DECISION, 'createcode');
```

---

<a name="canCommunity.checkRightHolder"></a>

- [.checkRightHolder(rightHolder: RightHolder, account: EosName)](#canCommunity.checkRightHolder)

### Check that account has right in that Right Holder

| Field **(input)**         | Description                   |
| ------------------------- | ----------------------------- |
| rightHolder (RightHolder) | Right Holder object           |
| account (EosName)         | account to check right holder |

**Example**

```javascript
// expected to be true
const result = canCommunity.checkRightHolder(
  {
    is_anyone: false,
    is_any_community_member: false,
    required_badges: [],
    required_positions: [],
    required_tokens: [],
    required_exp: [],
    accounts: ['daniel111111'],
  },
  'daniel111111',
);
```

---

<a name="canCommunity.voteForCode"></a>

### Vote for a Code **[API doc](http://git.baikal.io/can/governance-designer#vote-for-a-code)**

| Field **(input)**           | Description                  |
| --------------------------- | ---------------------------- |
| community_account (EosName) | CAN Account of the Community |
| proposal_name (EosName)     | The code's name              |
| approver (EosName)          | The voter's name             |
| vote_status (boolean)       | 0: UNVOTE, 1: VOTE           |

**Example**

```js
const input = {
  community_account: 'community413',
  proposal_name: 'proposal',
  voter: 'voter',
  vote_status: true,
};
const result = canCommunity.voteForCode(input);
```

---

<a name="canCommunity.createPosition"></a>

### Create a Position **[API doc](http://git.baikal.io/can/governance-designer#create-a-position)**

| Field **(input)**                            | Description                                                     |
| -------------------------------------------- | --------------------------------------------------------------- |
| community_account (string)                   | CAN Account of the Community                                    |
| creator (string)                             | Name of the creator                                             |
| pos_name (string)                            | Name of the Position to be created                              |
| max_holder (number)                          | Maximum number of Position Holders                              |
| filled_through (number)                      | How to fill holder for this position, 0 APPOINTMENT, 1 ELECTION |
| term (string) (for Election)                 | Term of position                                                |
| next_term_start_at (number) (for Election)   | Epoch number of time in second next term start                  |
| voting_period (number) (for Election)        | duration for voting, in second                                  |
| right_candidate (RightHolder) (for Election) | condition to be eligible Candidates                             |
| right_voter (RightHolder) (for Election)     | condition to be eligible Voter                                  |

| Field **(execCodeInput)** | Description                                                                     |
| ------------------------- | ------------------------------------------------------------------------------- |
| proposal_name             | (Optional) Proposal name if propose code, if not specify, sdk will generate one |
| user_exec_type            | (Optional) Execution type user want to execute, default is SOLE_DECISION        |

**Example**

```js
const input = {
  community_account: 'community413',
  creator: 'creator1',
  pos_name: 'Lecle leader',
  max_holder: 100,
  filled_through: 1,
  term: 1,
  next_term_start_at: 1593595380,
  voting_period: 60 * 60 * 24, // 1 day
  right_candidate: {
    is_anyone: false,
    is_any_community_member: false,
    required_badges: [],
    required_positions: [],
    required_tokens: [],
    required_exp: [],
    accounts: ['candidate111', 'candidate222'],
  },
  right_candidate: {
    is_anyone: false,
    is_any_community_member: false,
    required_badges: [],
    required_positions: [],
    required_tokens: [],
    required_exp: [],
    accounts: ['voter1111111', 'voter1111111'],
  },
};
const result = canCommunity.createPosition(input);
```

---

<a name="canCommunity.configurePosition"></a>

### Set Filling Rule for a Position **[API doc](http://git.baikal.io/can/governance-designer#set-filling-rule-for-a-position)**

| Field **(input)**                            | Description                          |
| -------------------------------------------- | ------------------------------------ |
| community_account (string)                   | CAN Account of the Community         |
| pos_id (number)                              | ID of the Position                   |
| pos_name (string)                            | ID of the Position                   |
| max_holder (number)                          | Max holder of position               |
| filled_through                               | 0 for Appointment and 1 for Election |
| term (string) (for Election)                 | Term of position                     |
| next_term_start_at (string) (for Election)   |                                      |
| voting_period (number) (for Election)        | duration for voting                  |
| right_candidate (RightHolder) (for Election) | condition to be eligible Candidates  |
| right_voter (RightHolder) (for Election)     | condition to be eligible Voter       |

| Field **(execCodeInput)** | Description                                                                     |
| ------------------------- | ------------------------------------------------------------------------------- |
| proposal_name             | (Optional) Proposal name if propose code, if not specify, sdk will generate one |
| user_exec_type            | (Optional) Execution type user want to execute, default is SOLE_DECISION        |

**Example**

```javascript
const input = {
  community_account: 'community413',
  pos_id: '1',
  pos_name: 'leader',
  max_holder: 10,
  filled_through: 1,
  term: 11,
  next_term_start_at: '2019-12-28T03:06:38Z',
  voting_period: '2019-11-30T02:06:38Z',
  right_candidate: {
    is_anyone: false,
    is_any_community_member: false,
    required_badges: [],
    required_positions: [],
    required_tokens: [],
    required_exp: [],
    accounts: ['candidate111', 'candidate222'],
  },
  right_candidate: {
    is_anyone: false,
    is_any_community_member: false,
    required_badges: [],
    required_positions: [],
    required_tokens: [],
    required_exp: [],
    accounts: ['voter1111111', 'voter1111111'],
  },
};
const result = canCommunity.configurePosition(input);
```

---

<a name="canCommunity.dismissPosition"></a>

### Dismiss a Position **[API doc](http://git.baikal.io/can/governance-designer#dismiss-someone-from-a-position)**

| Field **(input)**           | Description                  |
| --------------------------- | ---------------------------- |
| community_account (EosName) | CAN Account of the Community |
| pos_id (number)             | Id of the position           |
| holder (EosName)            | Name of the Holder           |
| dismissal_reason (string)   | Reason of dismissal          |

| Field **(execCodeInput)** | Description                                                                     |
| ------------------------- | ------------------------------------------------------------------------------- |
| proposal_name             | (Optional) Proposal name if propose code, if not specify, sdk will generate one |
| user_exec_type            | (Optional) Execution type user want to execute                                  |

**Example**

```javascript
const input = {
  community_account: 'community413',
  pos_id: 1,
  holder: 'lecleleader1',
  dismissal_reason: 'test',
};
const result = canCommunity.dismissPosition(input);
```

---

<a name="canCommunity.nominatePosition"></a>

### Nominate for a Position **[API doc](http://git.baikal.io/can/governance-designer#nominate-for-a-position)**

| Field **(input)**          | Description                  |
| -------------------------- | ---------------------------- |
| community_account (string) | CAN Account of the Community |
| pos_id (number)            | ID of the Position           |
| owner (string)             | Owner of the Position        |

**Example**

```js
const input = {
  community_account: 'community413',
  pos_id: 1,
  owner: 'owner',
};
const result = canCommunity.nominatePosition(input);
```

---

<a name="canCommunity.approvePosition"></a>

### Approve a Position

| Field **(input)**          | Description                  |
| -------------------------- | ---------------------------- |
| community_account (string) | CAN Account of the Community |
| pos_id (number)            | ID of the Position           |

**Example**

```javascript
const input = {
  community_account: 'community413',
  pos_id: 1,
};
const result = canCommunity.approvePosition(input, execCodeInput);
```

---

<a name="canCommunity.voteForPosition"></a>

### Vote for a Position **[API doc](http://git.baikal.io/can/governance-designer#vote-for-a-position)**

| Field **(input)**          | Description                                   |
| -------------------------- | --------------------------------------------- |
| community_account (string) | CAN Account of the Community                  |
| pos_id (string)            | ID of the Position                            |
| voter (string)             | The voter's name                              |
| candidates (EosName)       | CAN Account of the Candidate want to vote for |
| vote_status (boolean)      | `true` for agree and `false` for disagree     |

**Example**

```javascript
const input = {
  community_account: 'community413',
  pos_id: '1',
  voter: 'voter',
  candidate: 'daniel111112',
  vote_status: true,
};
const result = canCommunity.voteForPosition(input);
```

---

<a name="canCommunity.appointPosition"></a>

### Appoint Someone to a Position **[API doc](http://git.baikal.io/can/governance-designer#appoint-someone-to-a-position)**

| Field **(input)**           | Description                                            |
| --------------------------- | ------------------------------------------------------ |
| community_account (EosName) | CAN Account of the Community                           |
| pos_id (string)             | ID of the Position                                     |
| holder_accounts (EosName[]) | CAN Account of users to be appointed for this Position |
| appoint_reason (string)     | The reason why user appoint holder to this position    |

| Field **(execCodeInput)** | Description                                                                     |
| ------------------------- | ------------------------------------------------------------------------------- |
| proposal_name             | (Optional) Proposal name if propose code, if not specify, sdk will generate one |
| user_exec_type            | (Optional) Execution type user want to execute, default is SOLE_DECISION        |

**Example**

```javascript
const input = {
  community_account: 'community143',
  pos_id: '1',
  holder_accounts: ['creator.can'],
  appoint_reason: '',
};
const result = canCommunity.appointPosition(input);
```

---

<a name="canCommunity.inputCommunityMember"></a>

### Add/Remove member of community:

| Field **(input)**          | Description                                             |
| -------------------------- | ------------------------------------------------------- |
| community_account (string) | CAN Account of the Community                            |
| added_members (string[])   | CAN Account of users to be added into the community     |
| removed_members (string[]) | CAN Account of users to be removed out of the community |

**Example**

```javascript
const input = {
  community_account: 'community143',
  added_members: ['cifdemoweb1', 'cifdemoweb2'],
  removed_members: ['cifdemoweb', 'cifdemoweb3'],
};
const result = canCommunity.inputCommunityMember(input);
```

---

<a name="canCommunity.createBadge"></a>

- [.createBadge(input: object)](#canCommunity.createBadge)

### Create new badge

| Field **(input)**                       | Description                                                            |
| --------------------------------------- | ---------------------------------------------------------------------- |
| community_account (EosName)             | CAN Account of the Community                                           |
| issue_type (number)                     | 0 if issue WITHOUT_CLAIM or 1 if CLAIM_APPROVE_BY_ISSUER               |
| badge_propose_name (string[])           | multiple signature proposal name to create badge                       |
| issue_exec_type (number)                | execution type of issue badge code                                     |
| right_issue_sole_executor (RightHolder) | right holder who can execute issue badge code in case of sole decision |
| right_issue_proposer (RightHolder)      | right holder who can create issue badge proposal                       |
| issue_approval_type (number)            | approval type of issue badge code                                      |
| right_issue_approver (RightHolder)      | right holder who can approve issue badge proposal                      |
| right_issue_voter (RightHolder)         | right holder who can vote for proposal                                 |
| issue_pass_rule (number)                | percent of proposal pass rule                                          |
| issue_vote_duration (number)            | duration to vote for issue badge code proposal                         |

| Field **(execCodeInput)** | Description                                                                     |
| ------------------------- | ------------------------------------------------------------------------------- |
| proposal_name             | (Optional) Proposal name if propose code, if not specify, sdk will generate one |
| user_exec_type            | (Optional) Execution type user want to execute, default is SOLE_DECISION        |

**Example**

```javascript
const createBadgeInput = {
  community_account: 'community143',
  issue_type: 0,
  badge_propose_name: 'newbadge1234',
  issue_exec_type: ExecutionType.BOTH,
  right_issue_sole_executor: {
    is_anyone: false,
    is_any_community_member: false,
    required_badges: [],
    required_positions: [],
    required_tokens: [],
    required_exp: [],
    accounts: ['executor1234'],
  },
  right_issue_proposer: {
    is_anyone: false,
    is_any_community_member: false,
    required_badges: [],
    required_positions: [],
    required_tokens: [],
    required_exp: [],
    accounts: ['proposer1234'],
  },
  right_issue_voter: {
    is_anyone: false,
    is_any_community_member: false,
    required_badges: [],
    required_positions: [],
    required_tokens: [],
    required_exp: [],
    accounts: ['voter1111111'],
  },
  issue_approval_type: ApprovalType.BOTH_TYPE,
  issue_pass_rule: 80,
  issue_vote_duration: 24 * 60 * 60, // one day in second
};
const result = await canCommunity.createBadge(createBadgeInput);
```

---

<a name="canCommunity.configBadge"></a>

- [.configBadge(input: object)](#canCommunity.configBadge)

### Configuration of badge

| Field **(input)**                   | Description                                              |
| ----------------------------------- | -------------------------------------------------------- |
| community_account (EosName)         | CAN Account of the Community                             |
| badge_id (number)                   | id of badge want to update                               |
| update_badge_proposal_name (string) | multiple signature proposal name of update badge action  |
| issue_type (string)                 | 0 if issue WITHOUT_CLAIM or 1 if CLAIM_APPROVE_BY_ISSUER |

| Field **(execCodeInput)** | Description                                                                     |
| ------------------------- | ------------------------------------------------------------------------------- |
| proposal_name             | (Optional) Proposal name if propose code, if not specify, sdk will generate one |
| user_exec_type            | (Optional) Execution type user want to execute, default is SOLE_DECISION        |

**Example**

```javascript
const createBadgeInput = {
  community_account: 'community143',
  issue_type: 0,
  update_badge_proposal_name: 'newbadge1234',
  issue_exec_type: ExecutionType.BOTH,
  badge_id: 10,
};
const result = await canCommunity.configBadge(createBadgeInput);
```

---

<a name="canCommunity.issueBadge"></a>

- [.issueBadge(input: object)](#canCommunity.issueBadge)

### issue badge

| Field **(input)**           | Description                                            |
| --------------------------- | ------------------------------------------------------ |
| community_account (EosName) | CAN Account of the Community                           |
| badge_propose_name (string) | multiple signature proposal name of issue badge action |

| Field **(execCodeInput)** | Description                                                                     |
| ------------------------- | ------------------------------------------------------------------------------- |
| proposal_name             | (Optional) Proposal name if propose code, if not specify, sdk will generate one |
| user_exec_type            | (Optional) Execution type user want to execute, default is SOLE_DECISION        |

**Example**

```javascript
const issueBadge = {
  community_account: 'community143',
  badge_propose_name: 'newcert12345',
};
const result = await canCommunity.issueBadge(issueBadge);
```

---

<a name="canCommunity.execProposal"></a>

- [.execProposal(input: object)](#canCommunity.execProposal)

### execute code proposal

| Field **(input)**           | Description                  |
| --------------------------- | ---------------------------- |
| community_account (EosName) | CAN Account of the Community |
| proposal_name (string)      | code proposal to execute     |

**Example**

```javascript
const issueBadge = {
  community_account: 'community143',
  proposal_name: 'newcode12345',
};
const result = await canCommunity.issueBadge(issueBadge);
```

## List of supported query:

<a name="canCommunity.tableDiagram"></a>

### Table diagram of Code in Force smart contract present at **[Link](http://git.baikal.io/can/governance-designer/wikis/%5BDatabase-diagram%5D-Code-in-Force-database-diagram)**

| Table        | Description                                                                                                 | Scope                                       |
| ------------ | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| community    | community information                                                                                       | governance contract                         |
| codes        | code of the community, each community have many code                                                        | community account                           |
| coproposals  | proposal of code, each code can have many proposal                                                          | community account                           |
| codeexecrule | sole decision rule of code in case that code execution type is sole decision                                | community account                           |
| codevoterule | collective decision rule of code in case that code execution type is collective decision                    | community account                           |
| amenexecrule | sole decision rule of amendment code                                                                        | community account                           |
| amenvoterule | collective decision rule of amendment code                                                                  | community account                           |
| position     | positions of community                                                                                      | community account                           |
| fillingrule  | filling rule of position                                                                                    | community account                           |
| posproposal  | position proposal, save proposal status, apporove time and pos_proposal_id use for scope of candidate table | community account                           |
| poscandidate | candidates of position                                                                                      | pos_proposal_id define in posproposal table |

---

<a name="canCommunity.listCommunities"></a>

### get list of all community information

| Table        | Scope                    | Index   |
| ------------ | ------------------------ | ------- |
| v1.community | Governance contract name | primary |

```javascript
const table = 'v1.community';
const queryOption = {
  scope: 'governance24',
};
const result = await canCommunity.query(table, queryOption);
```

---

<a name="canCommunity.getCommunityByCommunityAccount"></a>

### get community information by community account

| Table        | Scope                    | Index   |
| ------------ | ------------------------ | ------- |
| v1.community | Governance contract name | primary |

```javascript
const table = 'v1.community';
const queryOption = {
  scope: 'governance2',
  lower_bound: 'community251',
  upper_bound: 'community251',
};
const result = await canCommunity.query(table, queryOption);
```

---

<a name="canCommunity.getCommunityByCreator"></a>

### get community information by creator

| Table        | Scope                    | Index                        |
| ------------ | ------------------------ | ---------------------------- |
| v1.community | Governance contract name | secondary index (by.creator) |

```javascript
const table = 'v1.community';
const queryOption = {
  scope: 'governance24',
  lower_bound: 'creator.can',
  upper_bound: 'creator.can',
  index_position: 2,
  key_type: 'i64',
};

const result = await canCommunity.query(table, queryOption);
```

---

<a name="canCommunity.getCommunityMember"></a>

### get members of community table

| Table     | Scope                  |
| --------- | ---------------------- |
| v1.member | community account name |

```javascript
const table = 'v1.member';
const queryOption = {
  scope: community_account,
  code: 'governance2', // governance2 is version of Governance Designer has v1.member table
};

const result = await canCommunity.query(table, queryOption);
```

---

<a name="canCommunity.listCodes"></a>

### get list of code of community

| Table   | Scope             | Index   |
| ------- | ----------------- | ------- |
| v1.code | community account | primary |

```javascript
const table = 'v1.code';
const queryOption = {
  scope: 'community234',
};

const result = await canCommunity.query(table, queryOption);
```

---

<a name="canCommunity.getCodebyId"></a>

### get code by code id

| Table   | Scope             | Index   |
| ------- | ----------------- | ------- |
| v1.code | community account | primary |

```js
const table = 'v1.code';
const queryOption = {
  scope: 'community234',
  lower_bound: 1,
  upper_bound: 1,
};

const result = await canCommunity.query(table, queryOption);
```

---

<a name="canCommunity.getCodeByCodeName"></a>

### get code by code name

| Table   | Scope             | Index                                      |
| ------- | ----------------- | ------------------------------------------ |
| v1.code | community account | secondary (by.code.name), index position 2 |

```js
const table = 'v1.code';
const queryOption = {
  scope: 'community234',
  lower_bound: 'po.create',
  upper_bound: 'po.create',
  index_position: 2,
  key_type: 'i64',
};

const result = await canCommunity.query(table, queryOption);
```

---

<a name="canCommunity.getCodeByReferenceId"></a>

### get list of code by reference id

| Table   | Scope             | Index                                     |
| ------- | ----------------- | ----------------------------------------- |
| v1.code | community account | secondary (by.refer.id), index position 3 |

```js
const table = 'v1.code';
const queryOption = {
  scope: 'community234',
  lower_bound: 11, // reference id
  upper_bound: 11, // reference id
  index_position: 3,
};

const result = await canCommunity.query(table, queryOption);
```

---

<a name="canCommunity.getSoleDecisionOfCode"></a>

### get sole decision of code

| Table       | Scope             | Index   |
| ----------- | ----------------- | ------- |
| v1.codeexec | community account | primary |

```js
const table = 'v1.codeexec';
const queryOption = {
  scope: 'community234',
  lower_bound: 11, // code id
  upper_bound: 11, // code id
};

const result = await canCommunity.query(table, queryOption);
```

---

<a name="canCommunity.getCollectiveDecisionOfCode"></a>

### get collective decision of code

| Table       | Scope             | Index   |
| ----------- | ----------------- | ------- |
| v1.codevote | community account | primary |

```js
const table = 'v1.codevote';
const queryOption = {
  scope: 'community234',
  lower_bound: 11, // code id
  upper_bound: 11, // code id
};

const result = await canCommunity.query(table, queryOption);
```

---

<a name="canCommunity.getSoleDecisionOfAmendCode"></a>

### get sole decision of amendment code

| Table       | Scope             | Index   |
| ----------- | ----------------- | ------- |
| v1.amenexec | community account | primary |

```js
const table = 'v1.amenexec';
const queryOption = {
  scope: 'community234',
  lower_bound: 11, // code id
  upper_bound: 11, // code id
};

const result = await canCommunity.query(table, queryOption);
```

---

<a name="canCommunity.getCollectiveDecisionOfAmendCode"></a>

### get collective decision of amendment code

| Table       | Scope             | Index   |
| ----------- | ----------------- | ------- |
| v1.amenvote | community account | primary |

```js
const table = 'v1.amenvote';
const queryOption = {
  scope: 'community234',
  lower_bound: 11, // code id
  upper_bound: 11, // code id
};

const result = await canCommunity.query(table, queryOption);
```

---

<a name="canCommunity.getCodeProposalByCodeId"></a>

### get list of code proposal by code id

| Table        | Scope             | Index                                    |
| ------------ | ----------------- | ---------------------------------------- |
| v1.cproposal | community account | secondary (by.code.id), index position 3 |

```js
const table = 'v1.cproposal';
const queryOption = {
  scope: 'community234',
  lower_bound: 11, // code id
  upper_bound: 11, // code id
  index_position: 3,
  key_type: 'i64',
};

const result = await canCommunity.query(table, queryOption);
```

---

<a name="canCommunity.getCodeProposalByProposer"></a>

### get list of code proposal by proposer

| Table        | Scope             | Index                                     |
| ------------ | ----------------- | ----------------------------------------- |
| v1.cproposal | community account | secondary (by.proposer), index position 2 |

```js
const table = 'v1.cproposal';
const queryOption = {
  scope: 'community234',
  lower_bound: 'daniel111111', // proposer name
  upper_bound: 'daniel111111', // proposer name
  index_position: 2,
  key_type: 'i64',
};

const result = await canCommunity.query(table, queryOption);
```

---

<a name="canCommunity.getCodeProposalByProposalName"></a>

### get code proposal by proposal name

| Table        | Scope             | Index   |
| ------------ | ----------------- | ------- |
| v1.cproposal | community account | primary |

```js
const table = 'v1.cproposal';
const queryOption = {
  scope: 'community234',
  lower_bound: 'proposal1', // proposal name
  upper_bound: 'proposal1', // proposal name
};

const result = await canCommunity.query(table, queryOption);
```

---

<a name="canCommunity.listPosition"></a>

### get list of positions of community

| Table       | Scope             | Index   |
| ----------- | ----------------- | ------- |
| v1.position | community account | primary |

```js
const table = 'v1.position';
const queryOption = {
  scope: 'community234',
};

const result = await canCommunity.query(table, queryOption);
```

---

<a name="canCommunity.getPositionByPositionId"></a>

### get position by position id

| Table       | Scope             | Index   |
| ----------- | ----------------- | ------- |
| v1.position | community account | primary |

```js
const table = 'v1.position';
const queryOption = {
  scope: 'community234',
  lower_bound: 1, // position id
  upper_bound: 1, // position id
};

const result = await canCommunity.query(table, queryOption);
```

---

<a name="canCommunity.getPositionCodeByPositionId"></a>

### get list of codes of position by position id

| Table   | Scope             | Index                                     |
| ------- | ----------------- | ----------------------------------------- |
| v1.code | community account | secondary (by.refer.id), index position 3 |

```js
const table = 'v1.code';
const queryOption = {
  scope: 'community234',
  lower_bound: 1, // position id
  upper_bound: 1, // position id
  index_position: 3,
  key_type: 'i64',
};

const result = await canCommunity.query(table, queryOption);
```

---

<a name="canCommunity.getFillingRuleOfPosition"></a>

### get filling rule of position

| Table      | Scope             | Index   |
| ---------- | ----------------- | ------- |
| v1.filling | community account | primary |

```js
const table = 'v1.filling';
const queryOption = {
  scope: 'community234',
  lower_bound: 1, // position id
  upper_bound: 1, // position id
};

const result = await canCommunity.query(table, queryOption);
```

---

<a name="canCommunity.getProposalOfPosition"></a>

### get proposal of position

| Table        | Scope             | Index   |
| ------------ | ----------------- | ------- |
| v1.pproposal | community account | primary |

```js
const table = 'v1.pproposal';
const queryOption = {
  scope: 'community234',
  lower_bound: 1, // position id
  upper_bound: 1, // position id
};

const result = await canCommunity.query(table, queryOption);
```

---

<a name="canCommunity.getCandidatesOfPosition"></a>

### get list candidates of position

| Table        | Scope                                       | Index   |
| ------------ | ------------------------------------------- | ------- |
| v1.candidate | pos_proposal_id define in posproposal table | primary |

```js
const table = 'v1.candidate';
const queryOption = {
  scope: 1, // pos_proposal_id
};

const result = await canCommunity.query(table, queryOption);
```

---

<a name="canCommunity.getAccessTable"></a>

- [get access to code in force table](#canCommunity.getAccessTable)

### get access to code in force table

| Table     | Scope                  | Index           |
| --------- | ---------------------- | --------------- |
| v1.access | community account name | singleton table |

```js
const table = 'v1.access';
const queryOption = {
  scope: 'community234', // pos_proposal_id
};

const result = await canCommunity.query(table, queryOption);
```

---

<a name="canCommunity.checkRightHolder"></a>

### check user is right holder of code

| Field (input) | Description                                                    |
| ------------- | -------------------------------------------------------------- |
| codeId        | Id of the Code to be checked                                   |
| account       | community account to be checked                                |
| execType      | execution type, 0 SOLE_DECISION, 1 COLLECTIVE_DECISION, 2 BOTH |
| action        | The code's action                                              |

```js
const account = 'daniel111111';
const codeId = 1;

const result = await cif.isRightHolderOfCode(codeId, account, 0, 'createcode'); // return a boolean
```
