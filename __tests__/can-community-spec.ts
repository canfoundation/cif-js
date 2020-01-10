// tslint:disable-next-line:no-implicit-dependencies
import * as fetch from 'node-fetch';
// tslint:disable-next-line:no-implicit-dependencies
import { TextDecoder, TextEncoder } from 'util';
import { CanCommunity } from '../src/CanCommunity';
import { CODE_IDS, ACTIONS_NAME } from '../src/utils/constant';
import {
  SetCredentialsInput,
  CreateCommunityInput,
  ExecCodeInput,
  CreateCodeInput,
  SetRightHolderForCodeInput,
  SetCollectionRuleForCodeInput,
  VoteForCodeInput,
  SetRightHolderForPositionInput,
  VoteForPositionInput,
  SetFillingRuleForPositionInput,
  NominatePositionInput,
  CreatePositionInput,
  DismissPositionInput,
  ApprovePositionInput,
  AppointPositionInput,
} from '../src/types/canCommunity';

describe('test governance design api', () => {
  const canAccountCreator = 'creator.can';
  const canPassApi = new CanCommunity('leonardo', '1.0', {
    // @ts-ignore
    fetch,
    canUrl: process.env.app__can_main_net_url,
    // @ts-ignore
    textEncoder: new TextEncoder(),
    textDecoder: new TextDecoder(),
    governanceAccount: process.env.app__can_governance_account,
  });

  it('should set Credentials Input', async () => {
    const input: SetCredentialsInput = {
      accessToken: 'eyJraWQiOiJcL3hrV2hiQzhrbTlteTk2K2tDWXhWZnpXbkkwc1hsSFhiS2J1aXJ4SVRkaz0iLCJhbGciOiJSUzI1NiJ9',
      idToken: 'eyJraWQiOiJGOVh4aXJiSkF5Wms4a1EzUmpITzNhWkptSVJWUnd1Q1wvVEF0dk5Rallibz0iLCJhbGciOiJSUzI1NiJ9',
    };
    const res = canPassApi.setCredentials(input);
    expect(res).toBeTruthy();
  }, 10000);

  it('should create community - apply can-pass-api', async () => {
    const spyOnTransact = jest.spyOn(canPassApi, 'createCommunity');
    spyOnTransact.mockResolvedValue('createCommunityRes');

    const input: CreateCommunityInput = {
      creator: canAccountCreator,
      community_account: 'community413',
      community_name: 'my community account',
      member_badge: [],
      community_url: 'mycommunity.url',
      description: 'this is my community for test',
      create_default_code: true,
    };

    const createCommunityRes = await canPassApi.createCommunity(input);
    expect(createCommunityRes).toBeTruthy();
  }, 10000);

  it('should run a code', async () => {
    const spyOnTransact = jest.spyOn(canPassApi, 'execCode');
    spyOnTransact.mockResolvedValue('execCodeRes');

    const input: ExecCodeInput = {
      community_account: 'community413',
      exec_account: canAccountCreator,
      code_id: 'co.amend',
      code_action: 'createcode',
      packed_params: '3048f0d94d2d25430000c8586590b1ca208242d3ccab3665020000c858e5608c310040c62a0b71ce3900',
    };

    const execCodeRes = await canPassApi.execCode(input);
    expect(execCodeRes).toBeTruthy();
  });

  it('should create code', async () => {
    const spyOnExecCode = jest.spyOn(canPassApi, 'execCode');
    spyOnExecCode.mockResolvedValue('execCodeRes');

    const createCodeInput: CreateCodeInput = {
      exec_account: canAccountCreator,
      community_account: 'community413',
      code_id: 'test.collect',
      contract_name: process.env.app__can_governance_account,
      code_actions: ['createCodeUser1', 'createCodeUser2'],
      exec_type: 1,
    };

    const execCodeRes = await canPassApi.createCode(createCodeInput);
    expect(execCodeRes).toBeTruthy();
    expect(spyOnExecCode).toBeCalledWith({
      community_account: createCodeInput.community_account,
      exec_account: createCodeInput.exec_account,
      code_id: CODE_IDS.CREATE_CODE,
      code_action: ACTIONS_NAME.CREATE_CODE,
      packed_params: expect.any(String),
    });
  });

  it('should set right holder for code', async () => {
    const spyOnExecCode = jest.spyOn(canPassApi, 'execCode');
    spyOnExecCode.mockResolvedValue('execCodeRes');

    const input: SetRightHolderForCodeInput = {
      exec_account: canAccountCreator,
      community_account: 'community413',
      code_id: 'po.create',
      right_accounts: ['creator.can'],
      pos_ids: [],
    };

    const execCodeRes = await canPassApi.setRightHolderForCode(input);
    expect(execCodeRes).toBeTruthy();
    expect(spyOnExecCode).toBeCalledWith({
      community_account: input.community_account,
      exec_account: input.exec_account,
      code_id: CODE_IDS.SET_RIGHT_HOLDER_FOR_CODE,
      code_action: ACTIONS_NAME.SET_RIGHT_HOLDER_FOR_CODE,
      packed_params: expect.any(String),
    });
  });

  it('should set collection rule for code', async () => {
    const spyOnExecCode = jest.spyOn(canPassApi, 'execCode');
    spyOnExecCode.mockResolvedValue('execCodeRes');

    const input: SetCollectionRuleForCodeInput = {
      exec_account: canAccountCreator,
      community_account: 'community413',
      code_id: 'test.collect',
      right_accounts: [canAccountCreator],
      pass_rule: 55,
      execution_duration: 600,
      vote_duration: 1200,
    };

    const execCodeRes = await canPassApi.setCollectionRuleForCode(input);
    expect(execCodeRes).toBeTruthy();
    expect(spyOnExecCode).toBeCalledWith({
      community_account: input.community_account,
      exec_account: input.exec_account,
      code_id: CODE_IDS.SET_COLLECTION_RULE_FOR_CODE,
      code_action: ACTIONS_NAME.SET_COLLECTION_RULE_FOR_CODE,
      packed_params: expect.any(String),
    });
  });

  it('should vote for code', async () => {
    const spyOnTransact = jest.spyOn(canPassApi, 'voteForCode');
    spyOnTransact.mockResolvedValue('voteForCodeRes');

    const input: VoteForCodeInput = {
      exec_account: canAccountCreator,
      community_account: 'community413',
      proposal_id: '1',
      vote_status: true,
    };

    const voteForCodeRes = await canPassApi.voteForCode(input);
    expect(voteForCodeRes).toBeTruthy();
  }, 10000);

  it('should set right holder for position', async () => {
    const spyOnExecCode = jest.spyOn(canPassApi, 'execCode');
    spyOnExecCode.mockResolvedValue('execCodeRes');

    const input: SetRightHolderForPositionInput = {
      exec_account: canAccountCreator,
      community_account: 'community413',
      pos_id: '1',
      right_accounts: ['creator.can'],
    };

    const execCodeRes = await canPassApi.setRightHolderForPosition(input);
    expect(execCodeRes).toBeTruthy();
    expect(spyOnExecCode).toBeCalledWith({
      community_account: input.community_account,
      exec_account: input.exec_account,
      code_id: CODE_IDS.SET_RIGHT_HOLDER_FOR_POSITION,
      code_action: ACTIONS_NAME.SET_RIGHT_HOLDER_FOR_POSITION,
      packed_params: expect.any(String),
    });
  });

  it('should vote for position', async () => {
    const spyOnTransact = jest.spyOn(canPassApi, 'voteForPosition');
    spyOnTransact.mockResolvedValue('voteForPositionRes');

    const input: VoteForPositionInput = {
      exec_account: canAccountCreator,
      community_account: 'community413',
      pos_id: '1',
      candidate: 'daniel111112',
      vote_status: true,
    };

    const voteForPositionRes = await canPassApi.voteForPosition(input);
    expect(voteForPositionRes).toBeTruthy();
  }, 10000);

  it('should set filling rule for position', async () => {
    const spyOnExecCode = jest.spyOn(canPassApi, 'execCode');
    spyOnExecCode.mockResolvedValue('execCodeRes');

    const input: SetFillingRuleForPositionInput = {
      exec_account: canAccountCreator,
      community_account: 'community413',
      pos_id: '1',
      filling_type: 1,
      start_at: '2019-11-28T03:06:38Z',
      end_at: '2019-11-30T02:06:38Z',
      pass_rule: 76,
      right_accounts: ['creator.can'],
    };

    const execCodeRes = await canPassApi.setFillingRuleForPosition(input);
    expect(execCodeRes).toBeTruthy();
    expect(spyOnExecCode).toBeCalledWith({
      community_account: input.community_account,
      exec_account: input.exec_account,
      code_id: CODE_IDS.SET_FILLING_RULE_FOR_POSITION,
      code_action: ACTIONS_NAME.SET_FILLING_RULE_FOR_POSITION,
      packed_params: expect.any(String),
    });
  });

  it('should nominate position', async () => {
    const spyOnTransact = jest.spyOn(canPassApi, 'nominatePosition');
    spyOnTransact.mockResolvedValue('nominatePositionRes');

    const input: NominatePositionInput = {
      exec_account: canAccountCreator,
      community_account: 'community413',
      pos_id: '1',
    };

    const nominatePositionRes = await canPassApi.nominatePosition(input);
    expect(nominatePositionRes).toBeTruthy();
  }, 10000);

  it('should create position', async () => {
    const spyOnExecCode = jest.spyOn(canPassApi, 'execCode');
    spyOnExecCode.mockResolvedValue('execCodeRes');

    const input: CreatePositionInput = {
      exec_account: canAccountCreator,
      community_account: 'community413',
      pos_name: 'Lecle leader',
      max_holder: 100,
    };

    const execCodeRes = await canPassApi.createPosition(input);
    expect(execCodeRes).toBeTruthy();
    expect(spyOnExecCode).toBeCalledWith({
      community_account: input.community_account,
      exec_account: input.exec_account,
      code_id: CODE_IDS.CREATE_POSITION,
      code_action: ACTIONS_NAME.CREATE_POSITION,
      packed_params: expect.any(String),
    });
  });

  it('should approve position', async () => {
    const spyOnExecCode = jest.spyOn(canPassApi, 'execCode');
    spyOnExecCode.mockResolvedValue('execCodeRes');

    const input: ApprovePositionInput = {
      exec_account: canAccountCreator,
      community_account: 'community413',
      pos_id: '1',
    };

    const execCodeRes = await canPassApi.approvePosition(input);
    expect(execCodeRes).toBeTruthy();
    expect(spyOnExecCode).toBeCalledWith({
      community_account: input.community_account,
      exec_account: input.exec_account,
      code_id: CODE_IDS.APPROVE_POSITION,
      code_action: ACTIONS_NAME.APPROVE_POSITION,
      packed_params: expect.any(String),
    });
  });

  it('should dismiss position', async () => {
    const spyOnExecCode = jest.spyOn(canPassApi, 'execCode');
    spyOnExecCode.mockResolvedValue('execCodeRes');

    const input: DismissPositionInput = {
      exec_account: canAccountCreator,
      community_account: 'community413',
      pos_id: '1',
      holder: 'creator.can',
    };

    const execCodeRes = await canPassApi.dismissPosition(input);
    expect(execCodeRes).toBeTruthy();
    expect(spyOnExecCode).toBeCalledWith({
      community_account: input.community_account,
      exec_account: input.exec_account,
      code_id: CODE_IDS.DISMISS_POSITION,
      code_action: ACTIONS_NAME.DISMISS_POSITION,
      packed_params: expect.any(String),
    });
  });

  it('should appoint position', async () => {
    const spyOnExecCode = jest.spyOn(canPassApi, 'execCode');
    spyOnExecCode.mockResolvedValue('execCodeRes');

    const input: AppointPositionInput = {
      exec_account: canAccountCreator,
      community_account: 'community143',
      pos_id: '1',
      holder_accounts: ['creator.can'],
    };

    const execCodeRes = await canPassApi.appointPosition(input);
    expect(execCodeRes).toBeTruthy();
    expect(spyOnExecCode).toBeCalledWith({
      community_account: input.community_account,
      exec_account: input.exec_account,
      code_id: CODE_IDS.APPOINT_POSITION,
      code_action: ACTIONS_NAME.APPOINT_POSITION,
      packed_params: expect.any(String),
    });
  });

  it('should get Table Rows', async () => {
    const communityList = await canPassApi.getTableRows(
      process.env.app__can_governance_account,
      process.env.app__can_governance_account,
      'community',
    );
    expect(communityList).toBeTruthy();
  });

  it('should get list all of the community', async () => {
    const spyOnGetAllCommunities = jest.spyOn(canPassApi, 'getAllCommunities');
    spyOnGetAllCommunities.mockResolvedValue('AllCommunitiesRes');
    const AllCommunitiesRes = await canPassApi.getAllCommunities(10);
    expect(AllCommunitiesRes).toBeTruthy();
    expect(spyOnGetAllCommunities).toBeCalledWith(10);
  });

  it('should get list codes of the community', async () => {
    const spyOnGetAllCodeOfCommunity = jest.spyOn(canPassApi, 'getAllCodeOfCommunity');
    spyOnGetAllCodeOfCommunity.mockResolvedValue('allCodeOfCommunityRes');
    const allCodeOfCommunityRes = await canPassApi.getAllCodeOfCommunity('communiti111', 10);
    expect(allCodeOfCommunityRes).toBeTruthy();
    expect(spyOnGetAllCodeOfCommunity).toBeCalledWith('communiti111', 10);
  });

  it('should get collective rule of code', async () => {
    const spyOnCollectiveRuleOfCode = jest.spyOn(canPassApi, 'getCollectiveRuleOfCode');
    spyOnCollectiveRuleOfCode.mockResolvedValue('collectiveRuleOfCodeRes');
    const collectiveRuleOfCodeRes = await canPassApi.getCollectiveRuleOfCode('community111', 'po.create');
    expect(collectiveRuleOfCodeRes).toBeTruthy();
    expect(spyOnCollectiveRuleOfCode).toBeCalledWith('community111', 'po.create');
  });

  it('should get all code proposals of community', async () => {
    const spyOnGetAllCodeProposalOfCommunity = jest.spyOn(canPassApi, 'getAllCodeProposalOfCommunity');
    spyOnGetAllCodeProposalOfCommunity.mockResolvedValue('allCodeProposalOfCommunityRes');
    const allCodeProposalOfCommunityRes = await canPassApi.getAllCodeProposalOfCommunity('community451', 10);
    expect(allCodeProposalOfCommunityRes).toBeTruthy();
    expect(spyOnGetAllCodeProposalOfCommunity).toBeCalledWith('community451', 10);
  });

  it('should get all position of community', async () => {
    const spyOnGetAllPositionOfCommunity = jest.spyOn(canPassApi, 'getAllPositionOfCommunity');
    spyOnGetAllPositionOfCommunity.mockResolvedValue('allPositionOfCommunityListRes');
    const allPositionOfCommunityListRes = await canPassApi.getAllPositionOfCommunity('community451', 10);
    expect(allPositionOfCommunityListRes).toBeTruthy();
    expect(spyOnGetAllPositionOfCommunity).toBeCalledWith('community451', 10);
  });

  it('should get filling rule of position', async () => {
    const spyOnGetFillingRuleOfPosition = jest.spyOn(canPassApi, 'getFillingRuleOfPosition');
    spyOnGetFillingRuleOfPosition.mockResolvedValue('fillingRuleOfPositionRes');
    const fillingRuleOfPositionRes = await canPassApi.getFillingRuleOfPosition('community143', '1');
    expect(fillingRuleOfPositionRes).toBeTruthy();
    expect(spyOnGetFillingRuleOfPosition).toBeCalledWith('community143', '1');
  });

  it('should get all position proposal of community', async () => {
    const spyOnGetAllPositionProposalOfCommunity = jest.spyOn(canPassApi, 'getAllPositionProposalOfCommunity');
    spyOnGetAllPositionProposalOfCommunity.mockResolvedValue('allPositionProposalOfCommunityRes');
    const allPositionProposalOfCommunityRes = await canPassApi.getAllPositionProposalOfCommunity('community143', '1');
    expect(allPositionProposalOfCommunityRes).toBeTruthy();
    expect(spyOnGetAllPositionProposalOfCommunity).toBeCalledWith('community143', '1');
  });

  it('should get a position of a community', async () => {
    const spyOnGetPosition = jest.spyOn(canPassApi, 'getPosition');
    spyOnGetPosition.mockResolvedValue('getPositionRes');
    const getPositionRes = await canPassApi.getPosition('community143', '1');
    expect(getPositionRes).toBeTruthy();
    expect(spyOnGetPosition).toBeCalledWith('community143', '1');
  });

  it('should get proposal of position', async () => {
    const spyOnGetProposalOfPosition = jest.spyOn(canPassApi, 'getProposalOfPosition');
    spyOnGetProposalOfPosition.mockResolvedValue('proposalOfPositionRes');
    const proposalOfPositionRes = await canPassApi.getProposalOfPosition('community143', '1');
    expect(proposalOfPositionRes).toBeTruthy();
    expect(spyOnGetProposalOfPosition).toBeCalledWith('community143', '1');
  });

  it('should get all candidate of position', async () => {
    const spyOnGetAllCandidateOfPosition = jest.spyOn(canPassApi, 'getAllCandidateOfPosition');
    spyOnGetAllCandidateOfPosition.mockResolvedValue('allCandidateOfPositionRes');
    const allCandidateOfPositionRes = await canPassApi.getAllCandidateOfPosition('community143', '1', 10);
    expect(allCandidateOfPositionRes).toBeTruthy();
    expect(spyOnGetAllCandidateOfPosition).toBeCalledWith('community143', '1', 10);
  });
});
