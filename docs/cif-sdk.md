<a name="common"></a>

## Required

```js
const fetch = require('node-fetch'); // node only
const { TextDecoder, TextEncoder } = require('util'); // node only
const config = {
  canUrl: 'http://18.182.95.163:8888',
  textEncoder: new TextEncoder(),
  textDecoder: new TextEncoder(),
  governanceAccount: 'governance22',
  fetch,
};
```

| Field **(config)**         | Description                 |
| -------------------------- | --------------------------- |
| canUrl (string)            |                             |
| textEncoder                | new TextEncoder() from util |
| textDecoder                | new TextEncoder() from util |
| governanceAccount (string) |                             |
| fetch                      | from 'node-fetch';          |

## Objects

<dl>
<dt><a href="#canCommunity">canCommunity</a> : <code>object</code></dt>
<dd></dd>
</dl>

- **Create `canCommunity`**

| Field **(input)** | Description                           |
| ----------------- | ------------------------------------- |
| clientId (string) |                                       |
| version (string)  | v1.0                                  |
| config            |                                       |
| store             | memory/localStore (default: 'memory') |

**Example**

```js
const { CanCommunity } = require('cif-js');
const canCommunity = new CanCommunity(clientId, version, config, store?);
```

#### Below is a list of supported actions:

- [canCommunity](#canCommunity) : <code>object</code>
  - [.createLoginButton()](#canCommunity.initLoginButton)
  - [.setCredentials(input: object)](#canCommunity.setCredentials)
  - [.createCommunity(input: object)](#canCommunity.createCommunity)
  - [.createCode(input: object)](#canCommunity.execCode)
  - [.setRightHolderForCode(input: object)](#canCommunity.setRightHolderForCode)
  - [.setCollectionRuleForCode(input: object)](#canCommunity.setCollectionRuleForCode)
  - [.execCode(input: object)](#canCommunity.execCode)
  - [.voteForCode(input: object)](#canCommunity.voteForCode)
  - [.createPosition(input: object)](#canCommunity.createPosition)
  - [.setFillingRuleForPosition(input: object)](#canCommunity.setFillingRuleForPosition)
  - [.setRightHolderForPosition(input: object)](#canCommunity.setRightHolderForPosition)
  - [.nominatePosition(input: object)](#canCommunity.nominatePosition)
  - [.approvePosition(input: object)](#canCommunity.approvePosition)
  - [.voteForPosition(input: object)](#canCommunity.voteForPosition)
  - [.appointPosition(input: object)](#canCommunity.appointPosition)
  - [.dissmissPosition(input: object)](#canCommunity.dissmissPosition)

---

<a name="canCommunity.initLoginButton"></a>

#### Create Login Button

**Example**

```js
canCommunity.initLoginButton();
<button
  className="can-pass-login-button"
  data-redirect-uri="http://localhost:3000/auth/cif/callback"
  data-state="hello"
></button>;
```

---

<a name="canCommunity.setCredentials"></a>

#### Set Credentials

| Field **(input)**           | Description |
| --------------------------- | ----------- |
| accessToken (string)        |             |
| idToken (string) (optional) |             |

**Example**

```js
const input = {
  accessToken: accessToken,
  idToken: idToken,
};
const result = canCommunity.setCredentials(input);
```

---

<a name="canCommunity.createCommunity"></a>

#### Create a Community

| Field **(input)**                  | Description                                                                          |
| ---------------------------------- | ------------------------------------------------------------------------------------ |
| creator (string)                   | Account registering to be a community creator who has permission to create community |
| community_account (string)         | CAN Account of Community on CAN chain (must follow this naming conventions)          |
| community_name (string)            | Community Name                                                                       |
| member_badge (optional) (number[]) | Declare a Badge to identify Members of Community                                     |
| community_url (string)             | URL Address of Community                                                             |
| description (string)               | Some description for the Community                                                   |
| create_default_code (boolean)      | To setup default codes to be used for the Community                                  |

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
const result = canCommunity.createCommunity(input);
```

---

<a name="canCommunity.createCode"></a>

#### Create a code

| Field **(input)**          | Description                                        |
| -------------------------- | -------------------------------------------------- |
| exec_account (string)      |                                                    |
| community_account (string) | CAN Account of the Community                       |
| code_id (string)           | Id of the Code to be configured                    |
| contract_name (string)     | The smart contract which run the code              |
| code_actions (string[])    | The code's action                                  |
| exec_type (number)         | 0: SOLE_DECISION, 1: COLLECTIVE_DECISION, 2 : BOTH |

**Example**

```js
const input = {
  exec_account: 'creator.can',
  community_account: 'community413',
  code_id: 'test.collect',
  contract_name: 'governance22',
  code_actions: ['createCodeUser1', 'createCodeUser2'],
  exec_type: 1,
};
const result = canCommunity.createCode(input);
```

---

<a name="canCommunity.setRightHolderForCode"></a>

#### Set Right Holders for a Code

| Field **(input)**          | Description                             |
| -------------------------- | --------------------------------------- |
| exec_account (string)      | CAN Account of user executing this code |
| community_account (string) | CAN Account of the Community            |
| code_id (string)           | Id of the Code to be configured         |
| right_accounts (string[])  | CAN Accounts of eligible Right Holders  |
| pos_ids (number[])         | List positions can run code             |

**Example**

```js
const input = {
  exec_account: 'quocleplayer',
  community_account: 'community413',
  code_id: 'test.graphql',
  right_accounts: ['creator.can'],
  pos_ids: [],
};
const result = canCommunity.setRightHolderForCode(input);
```

---

<a name="canCommunity.setCollectionRuleForCode"></a>

#### Set Collective Rules for a Code

| Field **(input)**           | Description                                  |
| --------------------------- | -------------------------------------------- |
| exec_account (string)       | CAN Account of user executing this code      |
| community_account (string)  | CAN Account of the Community                 |
| code_id (string)            | Id of the Code to be configured              |
| vote_duration (number)      | The duration for voting                      |
| execution_duration (number) | The duration for execution                   |
| pass_rule (number)          | Minimum % votes to pass the election         |
| right_accounts (string[])   | The voter accounts who can cote for the code |

**Example**

```js
const input = {
  exec_account: 'creator.can',
  community_account: 'community413',
  code_id: 'test.collect',
  right_accounts: ['creator.can'],
  pass_rule: 55,
  execution_duration: 600,
  vote_duration: 1200,
};
const result = canCommunity.setCollectionRuleForCode(input);
```

---

<a name="canCommunity.execCode"></a>

#### Execute a Code

| Field **(input)**          | Description                                    |
| -------------------------- | ---------------------------------------------- |
| community_account (string) | CAN Account of Community on CAN chain          |
| exec_account (string)      | Right holder account                           |
| code_id (string)           | Id of the Code to be configured                |
| code_action (string)       | The code's action                              |
| packed_params (string)     | The code's action which was convered to binary |

**Example**

```js
const input = {
  community_account: 'community413',
  exec_account: 'quocleplayer',
  code_id: 'co.amend',
  code_action: 'createcode',
  packed_params: '3048f0d94d2d25450000c8586590b1ca208242d3ccab3665020000c858e5608c310040c62a0b71ce3900',
};
const result = canCommunity.execCode(input);
```

---

<a name="canCommunity.voteForCode"></a>

#### Vote for a Code

| Field **(input)**          | Description                             |
| -------------------------- | --------------------------------------- |
| exec_account (string)      | CAN Account of user executing this code |
| community_account (string) | CAN Account of the Community            |
| proposal_id (string)       | The code's id                           |
| vote_status (boolean)      | 0: UNVOTE, 1: VOTE                      |

**Example**

```js
const input = {
  exec_account: 'creator.can',
  community_account: 'community413',
  proposal_id: '1',
  vote_status: true,
};
const result = canCommunity.voteForCode(input);
```

---

<a name="canCommunity.createPosition"></a>

#### Create a Position

| Field **(input)**          | Description                             |
| -------------------------- | --------------------------------------- |
| exec_account (string)      | CAN Account of user executing this code |
| community_account (string) | CAN Account of the Community            |
| pos_name (string)          | Name of the Position to be created      |
| max_holder (number)        | Maximum number of Position Holders      |

**Example**

```js
const input = {
  exec_account: 'creator.can',
  community_account: 'community413',
  pos_name: 'Lecle leader',
  max_holder: 100,
};
const result = canCommunity.createPosition(input);
```

---

<a name="canCommunity.setFillingRuleForPosition"></a>

#### Set Filling Rule for a Position

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
const result = canCommunity.setFillingRuleForPosition(input);
```

---

<a name="canCommunity.setRightHolderForPosition"></a>

#### Set Candidate Rights for a Position

| Field **(input)**          | Description                             |
| -------------------------- | --------------------------------------- |
| exec_account (string)      | CAN Account of user executing this code |
| community_account (string) | CAN Account of the Community            |
| pos_id (string)            | ID of the Position                      |
| right_accounts (string[])  | CAN Accounts of eligible Candidates     |

**Example**

```js
const input = {
  exec_account: 'creator.can',
  community_account: 'community413',
  pos_id: '1',
  right_accounts: ['creator.can'],
};
const result = canCommunity.setRightHolderForPosition(input);
```

---

<a name="canCommunity.nominatePosition"></a>

#### Nominate for a Position

| Field **(input)**          | Description                             |
| -------------------------- | --------------------------------------- |
| exec_account (string)      | CAN Account of user executing this code |
| community_account (string) | CAN Account of the Community            |
| pos_id (string)            | ID of the Position                      |

**Example**

```js
const input = {
  exec_account: 'creator.can',
  community_account: 'community413',
  pos_id: '1',
};
const result = canCommunity.nominatePosition(input);
```

---

<a name="canCommunity.approvePosition"></a>

#### Approve a Position

| Field **(input)**          | Description                             |
| -------------------------- | --------------------------------------- |
| exec_account (string)      | CAN Account of user executing this code |
| community_account (string) | CAN Account of the Community            |
| pos_id (string)            | ID of the Position                      |

**Example**

```js
const input = {
  exec_account: 'creator.can',
  community_account: 'community413',
  pos_id: '1',
};
const result = canCommunity.approvePosition(input);
```

---

<a name="canCommunity.voteForPosition"></a>

#### Vote for a Position

| Field **(input)**          | Description                               |
| -------------------------- | ----------------------------------------- |
| exec_account (string)      | CAN Account of user executing this code   |
| community_account (string) | CAN Account of the Community              |
| pos_id (string)            | ID of the Position                        |
| candidate (string)         | CAN Account of the Candidate              |
| vote_status (boolean)      | `true` for agree and `false` for disagree |

**Example**

```js
const input = {
  exec_account: 'creator.can',
  community_account: 'community413',
  pos_id: '1',
  candidate: 'daniel111112',
  vote_status: true,
};
const result = canCommunity.voteForPosition(input);
```

---

<a name="canCommunity.appointPosition"></a>

#### Appoint Someone to a Position

| Field **(input)**          | Description                                            |
| -------------------------- | ------------------------------------------------------ |
| exec_account (string)      | CAN Account of user executing this code                |
| community_account (string) | CAN Account of the Community                           |
| pos_id (string)            | ID of the Position                                     |
| holder_accounts (string[]) | CAN Account of users to be appointed for this Position |

**Example**

```js
const input = {
  exec_account: 'creator.can',
  community_account: 'community143',
  pos_id: '1',
  holder_accounts: ['creator.can'],
};
const result = canCommunity.appointPosition(input);
```

---

<a name="canCommunity.dissmissPosition"></a>

#### Dismiss Someone from a Position

| Field **(input)**          | Description                                  |
| -------------------------- | -------------------------------------------- |
| exec_account (string)      | CAN Account of user executing this code      |
| community_account (string) | CAN Account of the Community                 |
| pos_id (string)            | ID of the Position                           |
| holder (string)            | CAN Account of the user holding the Position |

**Example**

```js
const input = {
  exec_account: 'creator.can',
  community_account: 'community413',
  pos_id: '1',
  holder: 'creator.can',
};
const result = canCommunity.dissmissPosition(input);
```
