import { Createbadge } from '../smart-contract-types/Createbadge';
import { EXECUTION_TYPE } from './constant';
import { ApprovalType, FillingType } from '../types/smart-contract-enum';
import { Createpos } from '../smart-contract-types/Createpos';
import { Configpos } from '../smart-contract-types/Configpos';

function buildCreatePositionInput(rawInput: Createpos) {
  let buildingInput = { ...rawInput };
  if (rawInput.filled_through === FillingType.APPOINTMENT) {
    buildingInput = {
      ...rawInput,
      term: 0,
      next_term_start_at: 0,
      voting_period: 0,
      right_candidate: {
        is_anyone: false,
        is_any_community_member: false,
        required_badges: [],
        required_positions: [],
        required_tokens: [],
        required_exp: 0,
        accounts: [],
      },
      right_voter: {
        is_anyone: false,
        is_any_community_member: false,
        required_badges: [],
        required_positions: [],
        required_tokens: [],
        required_exp: 0,
        accounts: [],
      },
    };
  } else {
    buildingInput = {
      ...rawInput,
      right_candidate: {
        is_anyone: rawInput.right_candidate.is_anyone || false,
        is_any_community_member: rawInput.right_candidate.is_any_community_member || false,
        required_badges: rawInput.right_candidate.required_badges || [],
        required_positions: rawInput.right_candidate.required_positions || [],
        required_tokens: rawInput.right_candidate.required_tokens || [],
        required_exp: rawInput.right_candidate.required_exp || 0,
        accounts: rawInput.right_candidate.accounts || [],
      },
      right_voter: {
        is_anyone: rawInput.right_candidate.is_anyone || false,
        is_any_community_member: rawInput.right_candidate.is_any_community_member || false,
        required_badges: rawInput.right_candidate.required_badges || [],
        required_positions: rawInput.right_candidate.required_positions || [],
        required_tokens: rawInput.right_candidate.required_tokens || [],
        required_exp: rawInput.right_candidate.required_exp || 0,
        accounts: rawInput.right_candidate.accounts || [],
      },
    };
  }

  return buildingInput;
}

function buildConfigPositionInput(rawInput: Configpos) {
  let buildingInput = { ...rawInput };
  if (rawInput.filled_through === FillingType.APPOINTMENT) {
    buildingInput = {
      ...rawInput,
      term: 0,
      next_term_start_at: 0,
      voting_period: 0,
      right_candidate: {
        is_anyone: false,
        is_any_community_member: false,
        required_badges: [],
        required_positions: [],
        required_tokens: [],
        required_exp: 0,
        accounts: [],
      },
      right_voter: {
        is_anyone: false,
        is_any_community_member: false,
        required_badges: [],
        required_positions: [],
        required_tokens: [],
        required_exp: 0,
        accounts: [],
      },
    };
  } else {
    buildingInput = {
      ...rawInput,
      right_candidate: {
        is_anyone: rawInput.right_candidate.is_anyone || false,
        is_any_community_member: rawInput.right_candidate.is_any_community_member || false,
        required_badges: rawInput.right_candidate.required_badges || [],
        required_positions: rawInput.right_candidate.required_positions || [],
        required_tokens: rawInput.right_candidate.required_tokens || [],
        required_exp: rawInput.right_candidate.required_exp || 0,
        accounts: rawInput.right_candidate.accounts || [],
      },
      right_voter: {
        is_anyone: rawInput.right_candidate.is_anyone || false,
        is_any_community_member: rawInput.right_candidate.is_any_community_member || false,
        required_badges: rawInput.right_candidate.required_badges || [],
        required_positions: rawInput.right_candidate.required_positions || [],
        required_tokens: rawInput.right_candidate.required_tokens || [],
        required_exp: rawInput.right_candidate.required_exp || 0,
        accounts: rawInput.right_candidate.accounts || [],
      },
    };
  }

  return buildingInput;
}

function buildCreateBadgeInput(rawInput: Createbadge) {
  let buildingInput = { ...rawInput };
  if (rawInput.issue_exec_type !== EXECUTION_TYPE.COLLECTIVE_DECISION) {
    buildingInput = {
      ...rawInput,
      right_issue_sole_executor: {
        is_anyone: rawInput.right_issue_sole_executor.is_anyone || false,
        is_any_community_member: rawInput.right_issue_sole_executor.is_any_community_member || false,
        required_badges: rawInput.right_issue_sole_executor.required_badges || [],
        required_positions: rawInput.right_issue_sole_executor.required_positions || [],
        required_tokens: rawInput.right_issue_sole_executor.required_tokens || [],
        required_exp: rawInput.right_issue_sole_executor.required_exp || 0,
        accounts: rawInput.right_issue_sole_executor.accounts || [],
      },
      right_issue_proposer: {
        is_anyone: false,
        is_any_community_member: false,
        required_badges: [],
        required_positions: [],
        required_tokens: [],
        required_exp: 0,
        accounts: [],
      },
      right_issue_approver: {
        is_anyone: false,
        is_any_community_member: false,
        required_badges: [],
        required_positions: [],
        required_tokens: [],
        required_exp: 0,
        accounts: [],
      },
      issue_approval_type: ApprovalType.SOLE_APPROVAL,
      right_issue_voter: {
        is_anyone: false,
        is_any_community_member: false,
        required_badges: [],
        required_positions: [],
        required_tokens: [],
        required_exp: 0,
        accounts: [],
      },
      issue_vote_duration: 0,
      issue_pass_rule: 0,
    };
  }

  if (rawInput.issue_exec_type !== EXECUTION_TYPE.SOLE_DECISION) {
    buildingInput = {
      ...buildingInput,
      right_issue_sole_executor: {
        is_anyone: rawInput.right_issue_sole_executor.is_anyone || false,
        is_any_community_member: rawInput.right_issue_sole_executor.is_any_community_member || false,
        required_badges: rawInput.right_issue_sole_executor.required_badges || [],
        required_positions: rawInput.right_issue_sole_executor.required_positions || [],
        required_tokens: rawInput.right_issue_sole_executor.required_tokens || [],
        required_exp: rawInput.right_issue_sole_executor.required_exp || 0,
        accounts: rawInput.right_issue_sole_executor.accounts || [],
      },
      right_issue_proposer: {
        is_anyone: rawInput.right_issue_proposer.is_anyone || false,
        is_any_community_member: rawInput.right_issue_proposer.is_any_community_member || false,
        required_badges: rawInput.right_issue_proposer.required_badges || [],
        required_positions: rawInput.right_issue_proposer.required_positions || [],
        required_tokens: rawInput.right_issue_proposer.required_tokens || [],
        required_exp: rawInput.right_issue_proposer.required_exp || 0,
        accounts: rawInput.right_issue_proposer.accounts || [],
      },
      right_issue_approver: {
        is_anyone: rawInput.right_issue_approver.is_anyone || false,
        is_any_community_member: rawInput.right_issue_approver.is_any_community_member || false,
        required_badges: rawInput.right_issue_approver.required_badges || [],
        required_positions: rawInput.right_issue_approver.required_positions || [],
        required_tokens: rawInput.right_issue_approver.required_tokens || [],
        required_exp: rawInput.right_issue_approver.required_exp || 0,
        accounts: rawInput.right_issue_approver.accounts || [],
      },
      issue_approval_type: rawInput.issue_approval_type || ApprovalType.SOLE_APPROVAL,
      right_issue_voter: {
        is_anyone: rawInput.right_issue_voter.is_anyone || false,
        is_any_community_member: rawInput.right_issue_voter.is_any_community_member || false,
        required_badges: rawInput.right_issue_voter.required_badges || [],
        required_positions: rawInput.right_issue_voter.required_positions || [],
        required_tokens: rawInput.right_issue_voter.required_tokens || [],
        required_exp: rawInput.right_issue_voter.required_exp || 0,
        accounts: rawInput.right_issue_voter.accounts || [],
      },
      issue_vote_duration: rawInput.issue_vote_duration || 0,
      issue_pass_rule: rawInput.issue_pass_rule || 0,
    };
  }

  return buildingInput;
}

export { buildCreateBadgeInput, buildCreatePositionInput, buildConfigPositionInput };
