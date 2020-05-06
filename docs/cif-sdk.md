<a name="common"></a>

## Below is a list of supported actions:

- [canCommunity](#canCommunity.createCanCommunity)

  - [.createCommunity(input: object)](#canCommunity.createCommunity)
  - [.setAccess(input: object)](#canCommunity.setAccess)
  - [.createCode(input: object)](#canCommunity.execCode)
  - [.configCode(input: object)](#canCommunity.configCode)
  - [.execCode(...input)](#canCommunity.execCode)
  - [.voteForCode(input: object)](#canCommunity.voteForCode)
  - [.createPosition(input: object)](#canCommunity.createPosition)
  - [.configurePosition(input: object)](#canCommunity.configurePosition)
  - [.setRightHolderForPosition(input: object)](#canCommunity.setRightHolderForPosition)
  - [.nominatePosition(input: object)](#canCommunity.nominatePosition)
  - [.approvePosition(input: object)](#canCommunity.approvePosition)
  - [.voteForPosition(input: object)](#canCommunity.voteForPosition)
  - [.appointPosition(input: object)](#canCommunity.appointPosition)
  - [.dismissPosition(input: object)](#canCommunity.dismissPosition)
  - [.inputCommunityMember(input: object)](#canCommunity.inputCommunityMember)

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

<a name="canCommunity.createCanCommunity"></a>

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

---

<a name="canCommunity.createCommunity"></a>

### Create a Community **[API doc](http://git.baikal.io/can/governance-designer#create-a-community)**

**input**

| Field **(input)**             | Description                                                                          |
| ----------------------------- | ------------------------------------------------------------------------------------ |
| creator (string)              | Account registering to be a community creator who has permission to create community |
| community_account (string)    | CAN Account of Community on CAN chain (must follow this naming conventions)          |
| community_name (string)       | Community Name                                                                       |
| member_badge (number[])       | Declare a Badge to identify Members of Community                                     |
| community_url (string)        | URL Address of Community                                                             |
| description (string)          | Some description for the Community                                                   |
| create_default_code (boolean) | To setup default codes to be used for the Community                                  |

**initialCAT**

| Field **(input)**   | Description |
| ------------------- | ----------- |
| initialCAT (string) | CAT token   |

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
const result = canCommunity.createCommunity(input, initialCAT);
```

---

<a name="canCommunity.execCodeInput"></a>

### execCodeInput (option)

| Field **(input)**                | Description                                                                |
| -------------------------------- | -------------------------------------------------------------------------- |
| code_id (number)                 | name of code want to execute                                               |
| code_actions (ExecutionCodeData) | list of actions and packed parameters to execute                           |
| code_type                        | type of executing code, NORMAL = 0, AMENDMENT = 1, POSITION = 2, BADGE = 3 |
| referenceId (number)             | reference id relative to code such as position id or badge id              |

| Field **(execCodeInput)** | Description                                                                     |
| ------------------------- | ------------------------------------------------------------------------------- |
| proposal_name             | (Optional) Proposal name if propose code, if not specify, sdk will generate one |
| user_exec_type            | Execution type user want to execute                                             |

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

const result = await canCommunity.execCode(CODE_IDS.CREATE_CODE, codeActions, CodeTypeEnum.NORMAL, execCodeInput);
```

---

<a name="canCommunity.execCode"></a>

### Execute a Code

| Field **(input)**      | Description                                    |
| ---------------------- | ---------------------------------------------- |
| code_id (string)       | Id of the Code to be configured                |
| code_action (string)   | The code's action                              |
| packed_params (string) | The code's action which was convered to binary |

| Field **(execCodeInput)** | Description                                                                     |
| ------------------------- | ------------------------------------------------------------------------------- |
| proposal_name             | (Optional) Proposal name if propose code, if not specify, sdk will generate one |
| user_exec_type            | Execution type user want to execute                                             |

**Example**

```js
const code_id = 'co.amend';
const code_action = 'createcode';
const packed_params = '3048f0d94d2d25450000c8586590b1ca208242d3ccab3665020000c858e5608c310040c62a0b71ce3900';
const result = canCommunity.execCode(code_id, code_action, packed_params, execCodeInput);
```

---

<a name="canCommunity.setAccess"></a>

- [.setAccess(input: object)](#canCommunity.setAccess)

### Set who can access code in force

community_account: EosName;
is_anyone: boolean;
is_any_community_member: boolean;
right_accounts: EosName[];
right_badge_ids: number[];
right_pos_ids: number[];

**input**

| Field **(input)**                 | Description                            |
| --------------------------------- | -------------------------------------- |
| community_account (string)        | CAN Account of the Community           |
| is_anyone (boolean)               | is anyone can access CiF               |
| is_any_community_member (boolean) | is any community member can access CiF |
| right_accounts (string[])         | list of account can access CiF         |
| right_badge_ids (string[])        | list of badge ids can access CiF       |
| right_pos_ids (string[])          | list of position ids can access CiF    |

| Field **(execCodeInput)** | Description                                                                     |
| ------------------------- | ------------------------------------------------------------------------------- |
| proposal_name             | (Optional) Proposal name if propose code, if not specify, sdk will generate one |
| user_exec_type            | Execution type user want to execute                                             |

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
| user_exec_type            | Execution type user want to execute                                             |

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

| Field **(input)**                        | Description                          |
| ---------------------------------------- | ------------------------------------ |
| community_account (string)               | CAN Account of the Community         |
| code_id (string)                         | Id of the Code to be configured      |
| code_right_holder (RightHolderType)      | rule for execute of code             |
| amendment_right_holder (RightHolderType) | rule for change right holder of code |

| Field **(execCodeInput)** | Description                                                                     |
| ------------------------- | ------------------------------------------------------------------------------- |
| proposal_name             | (Optional) Proposal name if propose code, if not specify, sdk will generate one |
| user_exec_type            | Execution type user want to execute                                             |

**RightHolderType**

| Field **(input)**                   | Description                                                                                                     |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| exec_type (number)                  | code execution type, 0 SOLE_DECISION, 1 COLLECTIVE_DECISION, 2 BOTH                                             |
| approval_type (number)              | approval type in case of COLLECTIVE_DECISION, 0 SOLE_APPROVAL, 1 APPROVAL_CONSENSUS, 2 BOTH                     |
| sole_right_accounts (EosName[])     | right holder accounts who can execute code in case of SOLE_DECISION                                             |
| sole_right_pos_ids (number[])       | right holder position ids who can execute code in case of SOLE_DECISION                                         |
| proposer_right_accounts (EosName[]) | right holder accounts who can create proposal in case of COLLECTIVE_DECISION                                    |
| proposer_right_pos_ids (number[])   | right holder position ids who can create proposal in case of COLLECTIVE_DECISION                                |
| approver_right_accounts (EosName[]) | right holder accounts who can approve code in case of COLLECTIVE_DECISION and SOLE_APPROVAL                     |
| approver_right_pos_ids (number[])   | right holder position ids who can approve code in case of COLLECTIVE_DECISION and SOLE_APPROVAL                 |
| voter_right_accounts (EosName[])    | right holder account who can vote for code proposals in case of COLLECTIVE_DECISION and APPROVAL_CONSENSUS      |
| voter_right_pos_ids (number[])      | right holder position ids who can vote for code proposals in case of COLLECTIVE_DECISION and APPROVAL_CONSENSUS |
| pass_rule (number)                  | percentage of pass rule of proposal                                                                             |
| vote_duration (number)              | duration for voting for proposal                                                                                |

**Example**

```js
const input = {
  community_account: 'test-community',
  code_id: 99,
  code_right_holder: {
    exec_type: 1,
    sole_right_accounts: ['daniel111111'],
  },
};
const result = canCommunity.configCode(input, execCodeInput);
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

| Field **(input)**                                 | Description                                                     |
| ------------------------------------------------- | --------------------------------------------------------------- |
| community_account (string)                        | CAN Account of the Community                                    |
| creator (string)                                  | Name of the creator                                             |
| pos_name (string)                                 | Name of the Position to be created                              |
| max_holder (number)                               | Maximum number of Position Holders                              |
| filled_through (number)                           | How to fill holder for this position, 0 APPOINTMENT, 1 ELECTION |
| term (string) (for Election)                      | Term of position                                                |
| next_term_start_at (string) (for Election)        |                                                                 |
| voting_period (number) (for Election)             | duration for voting                                             |
| pos_candidate_accounts (string[]) (for Election)  | CAN Accounts of eligible Candidates                             |
| pos_candidate_positions (string[]) (for Election) | position ids of eligible Candidates                             |
| pos_voter_accounts (string[]) (for Election)      | CAN Accounts of eligible vote for candidates                    |
| pos_voter_positions (string[]) (for Election)     | position ids of eligible Candidates                             |

| Field **(execCodeInput)** | Description                                                                     |
| ------------------------- | ------------------------------------------------------------------------------- |
| proposal_name             | (Optional) Proposal name if propose code, if not specify, sdk will generate one |
| user_exec_type            | Execution type user want to execute                                             |

**Example**

```js
const input = {
  community_account: 'community413',
  creator: 'creator1',
  pos_name: 'Lecle leader',
  max_holder: 100,
  filled_through: 1,
};
const result = canCommunity.createPosition(input, execCodeInput);
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
| user_exec_type            | Execution type user want to execute                                             |

**Example**

```js
const input = {
  community_account: 'community413',
  pos_id: 1,
  holder: 'Lecle leader',
  dismissal_reason: 'test',
};
const result = canCommunity.dismissPosition(input, execCodeInput);
```

---

<a name="canCommunity.configurePosition"></a>

### Set Filling Rule for a Position **[API doc](http://git.baikal.io/can/governance-designer#set-filling-rule-for-a-position)**

| Field **(input)**                                 | Description                                  |
| ------------------------------------------------- | -------------------------------------------- |
| community_account (string)                        | CAN Account of the Community                 |
| pos_id (number)                                   | ID of the Position                           |
| pos_name (string)                                 | ID of the Position                           |
| max_holder (number)                               | Max holder of position                       |
| filled_through                                    | 0 for Appointment and 1 for Election         |
| term (string) (for Election)                      | Term of position                             |
| next_term_start_at (string) (for Election)        |                                              |
| voting_period (number) (for Election)             | duration for voting                          |
| pos_candidate_accounts (string[]) (for Election)  | CAN Accounts of eligible Candidates          |
| pos_candidate_positions (string[]) (for Election) | position ids of eligible Candidates          |
| pos_voter_accounts (string[]) (for Election)      | CAN Accounts of eligible vote for candidates |
| pos_voter_positions (string[]) (for Election)     | position ids of eligible Candidates          |

| Field **(execCodeInput)** | Description                                                                     |
| ------------------------- | ------------------------------------------------------------------------------- |
| proposal_name             | (Optional) Proposal name if propose code, if not specify, sdk will generate one |
| user_exec_type            | Execution type user want to execute                                             |

**Example**

```js
const input = {
  community_account: 'community413',
  pos_id: '1',
  pos_name: 'leader',
  max_holder: 10,
  filled_through: 1,
  term: 11,
  next_term_start_at: '2019-12-28T03:06:38Z',
  voting_period: '2019-11-30T02:06:38Z',
  pos_candidate_accounts: ['creator.can'],
  pos_candidate_positions: [10, 11],
  pos_voter_accounts: ['creator.can'],
  pos_voter_positions: [10, 11],
};
const result = canCommunity.configurePosition(input, execCodeInput);
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

```js
const input = {
  community_account: 'community413',
  pos_id: 1,
};
const result = canCommunity.approvePosition(input, execCodeInput);
```

---

<a name="canCommunity.voteForPosition"></a>

### Vote for a Position **[API doc](http://git.baikal.io/can/governance-designer#vote-for-a-position)**

| Field **(input)**          | Description                               |
| -------------------------- | ----------------------------------------- |
| community_account (string) | CAN Account of the Community              |
| pos_id (string)            | ID of the Position                        |
| voter (string)             | The voter's name                          |
| candidates (EosName[])     | List of CAN Account of the Candidate      |
| vote_status (boolean)      | `true` for agree and `false` for disagree |

**Example**

```js
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

| Field **(input)**             | Description                                                                 |
| ----------------------------- | --------------------------------------------------------------------------- |
| community_account (string)    | CAN Account of the Community                                                |
| pos_id (string)               | ID of the Position                                                          |
| holder_accounts (string[])    | CAN Account of users to be appointed for this Position                      |
| appoint_reason (string)       |                                                                             |
| execCodeInput (ExecCodeInput) | Additional parameters to execute code like proposal_name and user_exec_type |

| Field **(execCodeInput)** | Description                                                                     |
| ------------------------- | ------------------------------------------------------------------------------- |
| proposal_name             | (Optional) Proposal name if propose code, if not specify, sdk will generate one |
| user_exec_type            | Execution type user want to execute                                             |

**Example**

```js
const input = {
  community_account: 'community143',
  pos_id: '1',
  holder_accounts: ['creator.can'],
  appoint_reason: '',
};
const result = canCommunity.appointPosition(input, execCodeInput);
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

```js
const input = {
  community_account: 'community143',
  added_members: ['cifdemoweb1', 'cifdemoweb2'],
  removed_members: ['cifdemoweb', 'cifdemoweb3'],
};
const result = canCommunity.inputCommunityMember(input);
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

| Table     | Scope                    | Index   |
| --------- | ------------------------ | ------- |
| community | Governance contract name | primary |

```js
const table = 'community';
const queryOption = {
  scope: 'governance24',
};
const result = await canCommunity.query(table, queryOption);
```

---

<a name="canCommunity.getCommunityByCommunityAccount"></a>

### get community information by community account

| Table     | Scope                    | Index   |
| --------- | ------------------------ | ------- |
| community | Governance contract name | primary |

```js
const table = 'community';
const queryOption = {
  scope: 'governance24',
  lower_bound: 'community251',
  upper_bound: 'community251',
};
const result = await canCommunity.query(table, queryOption);
```

---

<a name="canCommunity.getCommunityByCreator"></a>

### get community information by creator

| Table     | Scope                    | Index                        |
| --------- | ------------------------ | ---------------------------- |
| community | Governance contract name | secondary index (by.creator) |

```js
const table = 'community';
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

- [get members of community table](#canCommunity.getCommunityMember)

### get access to code in force table

| Table     | Scope                  | Index           |
| --------- | ---------------------- | --------------- |
| v1.member | community account name | singleton table |

```js
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

| Table | Scope             | Index   |
| ----- | ----------------- | ------- |
| codes | community account | primary |

```js
const table = 'codes';
const queryOption = {
  scope: 'community234',
};

const result = await canCommunity.query(table, queryOption);
```

---

<a name="canCommunity.getCodebyId"></a>

### get code by code id

| Table | Scope             | Index   |
| ----- | ----------------- | ------- |
| codes | community account | primary |

```js
const table = 'codes';
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

| Table | Scope             | Index                                      |
| ----- | ----------------- | ------------------------------------------ |
| codes | community account | secondary (by.code.name), index position 2 |

```js
const table = 'codes';
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

| Table | Scope             | Index                                     |
| ----- | ----------------- | ----------------------------------------- |
| codes | community account | secondary (by.refer.id), index position 3 |

```js
const table = 'codes';
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

| Table        | Scope             | Index   |
| ------------ | ----------------- | ------- |
| codeexecrule | community account | primary |

```js
const table = 'codeexecrule';
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

| Table        | Scope             | Index   |
| ------------ | ----------------- | ------- |
| codevoterule | community account | primary |

```js
const table = 'codevoterule';
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

| Table        | Scope             | Index   |
| ------------ | ----------------- | ------- |
| amenexecrule | community account | primary |

```js
const table = 'amenexecrule';
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

| Table        | Scope             | Index   |
| ------------ | ----------------- | ------- |
| amenvoterule | community account | primary |

```js
const table = 'amenvoterule';
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

| Table       | Scope             | Index                                    |
| ----------- | ----------------- | ---------------------------------------- |
| coproposals | community account | secondary (by.code.id), index position 3 |

```js
const table = 'coproposals';
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

| Table       | Scope             | Index                                     |
| ----------- | ----------------- | ----------------------------------------- |
| coproposals | community account | secondary (by.proposer), index position 2 |

```js
const table = 'coproposals';
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

| Table       | Scope             | Index   |
| ----------- | ----------------- | ------- |
| coproposals | community account | primary |

```js
const table = 'coproposals';
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

| Table     | Scope             | Index   |
| --------- | ----------------- | ------- |
| positions | community account | primary |

```js
const table = 'positions';
const queryOption = {
  scope: 'community234',
};

const result = await canCommunity.query(table, queryOption);
```

---

<a name="canCommunity.getPositionByPositionId"></a>

### get position by position id

| Table     | Scope             | Index   |
| --------- | ----------------- | ------- |
| positions | community account | primary |

```js
const table = 'positions';
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

| Table | Scope             | Index                                     |
| ----- | ----------------- | ----------------------------------------- |
| codes | community account | secondary (by.refer.id), index position 3 |

```js
const table = 'codes';
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

| Table       | Scope             | Index   |
| ----------- | ----------------- | ------- |
| fillingrule | community account | primary |

```js
const table = 'fillingrule';
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

| Table       | Scope             | Index   |
| ----------- | ----------------- | ------- |
| posproposal | community account | primary |

```js
const table = 'posproposal';
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
| poscandidate | pos_proposal_id define in posproposal table | primary |

```js
const table = 'poscandidate';
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
| accession | community account name | singleton table |

```js
const table = 'accession';
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
