<a name="common"></a>

## Below is a list of supported actions:

- [canCommunity](#canCommunity.createCanCommunity)
  - [.createCommunity(input: object)](#canCommunity.createCommunity)
  - [.createCode(input: object)](#canCommunity.execCode)
  - [.setRightHolderForCode(input: object)](#canCommunity.setRightHolderForCode)
  - [.setCollectionRuleForCode(input: object)](#canCommunity.setCollectionRuleForCode)
  - [.execCode(...input)](#canCommunity.execCode)
  - [.voteForCode(input: object)](#canCommunity.voteForCode)
  - [.createPosition(input: object)](#canCommunity.createPosition)
  - [.setFillingRuleForPosition(input: object)](#canCommunity.setFillingRuleForPosition)
  - [.setRightHolderForPosition(input: object)](#canCommunity.setRightHolderForPosition)
  - [.nominatePosition(input: object)](#canCommunity.nominatePosition)
  - [.approvePosition(input: object)](#canCommunity.approvePosition)
  - [.voteForPosition(input: object)](#canCommunity.voteForPosition)
  - [.appointPosition(input: object)](#canCommunity.appointPosition)
  - [.dismissPosition(input: object)](#canCommunity.dismissPosition)

---

<a name="canCommunity.createCanCommunity"></a>

### Initial `canCommunity` (Required)

**CanCommunityOptions**

| Field **(input)**         | Description                           |
| ------------------------- | ------------------------------------- |
| canUrl (string)           |                                       |
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

#### execCodeInput (option)

| Field **(input)**      | Description   |
| ---------------------- | ------------- |
| proposal_name (string) | Proposal name |

**Example**

```js
const execCodeInput = {
  proposal_name: 'proposalName';
};
```

---

<a name="canCommunity.execCode"></a>

#### Execute a Code

| Field **(input)**             | Description                                    |
| ----------------------------- | ---------------------------------------------- |
| code_id (string)              | Id of the Code to be configured                |
| code_action (string)          | The code's action                              |
| packed_params (string)        | The code's action which was convered to binary |
| execCodeInput (ExecCodeInput) |                                                |

**Example**

```js
const code_id = 'co.amend';
const code_action = 'createcode';
const packed_params = '3048f0d94d2d25450000c8586590b1ca208242d3ccab3665020000c858e5608c310040c62a0b71ce3900';
const result = canCommunity.execCode(code_id, code_action, packed_params, execCodeInput);
```

---

<a name="canCommunity.createCode"></a>

#### Create a code **[API doc](http://git.baikal.io/can/governance-designer#create-a-code)**

**input**

| Field **(input)**                       | Description                                        |
| --------------------------------------- | -------------------------------------------------- |
| community_account (string)              | CAN Account of the Community                       |
| code_name (string)                      | Name of the Code to be configured                  |
| contract_name (string)                  | The smart contract which run the code              |
| code_actions (string[])                 | The code's action                                  |
| code_exec_type (number)                 | 0: SOLE_DECISION, 1: COLLECTIVE_DECISION, 2 : BOTH |
| amendment_exec_type (number)            |                                                    |
| amendment_right_accounts (number)       |                                                    |
| amendment_pos_ids_right_holder (number) |                                                    |
| amendment_vote_duration (number)        |                                                    |
| amendment_execution_duration (number)   |                                                    |
| amendment_pass_rule (number)            |                                                    |
| amendment_vote_right_accounts (number)  |                                                    |
| amendment_vote_pos_ids (number)         |                                                    |

```js
const input = {
  community_account: 'community413',
  code_name: 'test.collect',
  contract_name: 'governance23',
  code_actions: ['createCodeUser1', 'createCodeUser2'],
  code_exec_type: 1,
};

const result = canCommunity.createCode(input, execCodeInput);
```

---

<a name="canCommunity.setRightHolderForCode"></a>

#### Set Right Holders for a Code **[API doc](http://git.baikal.io/can/governance-designer#set-right-holders-for-a-code)**

| Field **(input)**          | Description                            |
| -------------------------- | -------------------------------------- |
| community_account (string) | CAN Account of the Community           |
| code_id (string)           | Id of the Code to be configured        |
| right_accounts (string[])  | CAN Accounts of eligible Right Holders |
| pos_ids (number[])         | List positions can run code            |

**Example**

```js
const input = {
  community_account: 'community413',
  code_id: 'test.graphql',
  right_accounts: ['creator.can'],
  pos_ids: [],
};
const result = canCommunity.setRightHolderForCode(input, execCodeInput);
```

---

<a name="canCommunity.setCollectionRuleForCode"></a>

#### Set Collective Rules for a Code **[API doc](http://git.baikal.io/can/governance-designer#set-collective-rules-for-a-code)**

| Field **(input)**           | Description                                  |
| --------------------------- | -------------------------------------------- |
| community_account (string)  | CAN Account of the Community                 |
| code_id (string)            | Id of the Code to be configured              |
| vote_duration (number)      | The duration for voting                      |
| execution_duration (number) | The duration for execution                   |
| pass_rule (number)          | Minimum % votes to pass the election         |
| right_accounts (string[])   | The voter accounts who can cote for the code |
| pos_ids (number[])          | List positions can run code                  |

**Example**

```js
const input = {
  community_account: 'community413',
  code_id: 'test.collect',
  right_accounts: ['creator.can'],
  pass_rule: 55,
  execution_duration: 600,
  vote_duration: 1200,
  pos_ids: [],
};
const result = canCommunity.setCollectionRuleForCode(input, execCodeInput);
```

---

<a name="canCommunity.voteForCode"></a>

#### Vote for a Code **[API doc](http://git.baikal.io/can/governance-designer#vote-for-a-code)**

| Field **(input)**          | Description                  |
| -------------------------- | ---------------------------- |
| community_account (string) | CAN Account of the Community |
| proposal_name (string)     | The code's name              |
| voter (string)             | The voter's name             |
| vote_status (boolean)      | 0: UNVOTE, 1: VOTE           |

**Example**

```js
const input = {
  community_account: 'community413',
  proposal_name: 'proposal',
  voter: 'voter',
  vote_status: true,
};
const result = canCommunity.voteForCode(input, execCodeInput);
```

---

<a name="canCommunity.createPosition"></a>

#### Create a Position **[API doc](http://git.baikal.io/can/governance-designer#create-a-position)**

| Field **(input)**          | Description                        |
| -------------------------- | ---------------------------------- |
| community_account (string) | CAN Account of the Community       |
| creator (string)           | Name of the creator                |
| pos_name (string)          | Name of the Position to be created |
| max_holder (number)        | Maximum number of Position Holders |
| filled_through (number)    |                                    |

**Example**

```js
const input = {
  community_account: 'community413',
  creator: 'creator1',
  pos_name: 'Lecle leader',
  max_holder: 100,
  filled_through: 4,
};
const result = canCommunity.createPosition(input, execCodeInput);
```

---

<a name="canCommunity.dismissPosition"></a>

#### Dismiss a Position **[API doc](http://git.baikal.io/can/governance-designer#dismiss-someone-from-a-position)**

| Field **(input)**          | Description                  |
| -------------------------- | ---------------------------- |
| community_account (string) | CAN Account of the Community |
| pos_id (number)            | Id of the position           |
| holder (string)            | Name of the Holder           |
| dismissal_reason (string)  |                              |

**Example**

```js
const input = {
  community_account: 'community413',
  pos_id: 1,
  holder: 'Lecle leader',
  dismissal_reason: '',
};
const result = canCommunity.dismissPosition(input, execCodeInput);
```

---

<a name="canCommunity.setFillingRuleForPosition"></a>

#### Set Filling Rule for a Position **[API doc](http://git.baikal.io/can/governance-designer#set-filling-rule-for-a-position)**

| Field **(input)**                        | Description                             |
| ---------------------------------------- | --------------------------------------- |
| exec_account (string)                    | CAN Account of user executing this code |
| community_account (string)               | CAN Account of the Community            |
| pos_id (string)                          | ID of the Position                      |
| filling_type                             | 0 for Appointment and 1 for Election    |
| start_at (string) (for Election)         | Starting time for Election term         |
| end_at (string) (for Election)           | Ending time for Election term           |
| pass_rule (number) (for Election)        | % of Total Votes to be passed           |
| right_accounts (string[]) (for Election) | CAN Accounts of eligible Candidates     |

**Example**

```js
const input = {
  exec_account: 'creator.can',
  community_account: 'community413',
  pos_id: '1',
  filling_type: 1,
  start_at: '2019-11-28T03:06:38Z',
  end_at: '2019-11-30T02:06:38Z',
  pass_rule: 76,
  right_accounts: ['creator.can'],
};
const result = canCommunity.setFillingRuleForPosition(input, execCodeInput);
```

---

<a name="canCommunity.setRightHolderForPosition"></a>

#### Set Candidate Rights for a Position

| Field **(input)**          | Description                         |
| -------------------------- | ----------------------------------- |
| community_account (string) | CAN Account of the Community        |
| pos_id (string)            | ID of the Position                  |
| right_accounts (string[])  | CAN Accounts of eligible Candidates |
| pos_ids (number[])         | List positions can run code         |

**Example**

```js
const input = {
  community_account: 'community413',
  pos_id: '1',
  right_accounts: ['creator.can'],
  pos_ids: [];
};
const result = canCommunity.setRightHolderForPosition(input, execCodeInput);
```

---

<a name="canCommunity.nominatePosition"></a>

#### Nominate for a Position **[API doc](http://git.baikal.io/can/governance-designer#nominate-for-a-position)**

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
const result = canCommunity.nominatePosition(input, execCodeInput);
```

---

<a name="canCommunity.approvePosition"></a>

#### Approve a Position

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

#### Vote for a Position **[API doc](http://git.baikal.io/can/governance-designer#vote-for-a-position)**

| Field **(input)**          | Description                               |
| -------------------------- | ----------------------------------------- |
| community_account (string) | CAN Account of the Community              |
| pos_id (string)            | ID of the Position                        |
| voter (string)             | The voter's name                          |
| candidate (string)         | CAN Account of the Candidate              |
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
const result = canCommunity.voteForPosition(input, execCodeInput);
```

---

<a name="canCommunity.appointPosition"></a>

#### Appoint Someone to a Position **[API doc](http://git.baikal.io/can/governance-designer#appoint-someone-to-a-position)**

| Field **(input)**          | Description                                            |
| -------------------------- | ------------------------------------------------------ |
| community_account (string) | CAN Account of the Community                           |
| pos_id (string)            | ID of the Position                                     |
| holder_accounts (string[]) | CAN Account of users to be appointed for this Position |
| appoint_reason (string)    |                                                        |

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
