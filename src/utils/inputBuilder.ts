import { Createbadge } from '../smart-contract-types/Createbadge';
import { EXECUTION_TYPE } from './constant';
import { ApprovalType, FillingType } from '../types/smart-contract-enum';
import { Configbadge } from '../smart-contract-types/Configbadge';
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
      pos_candidate_accounts: [],
      pos_voter_accounts: [],
      pos_candidate_positions: [],
      pos_voter_positions: [],
    };
  } else {
    buildingInput = {
      ...rawInput,
      pos_candidate_accounts: rawInput.pos_candidate_accounts || [],
      pos_voter_accounts: rawInput.pos_voter_accounts || [],
      pos_candidate_positions: rawInput.pos_candidate_positions || [],
      pos_voter_positions: rawInput.pos_voter_positions || [],
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
      pos_candidate_accounts: [],
      pos_voter_accounts: [],
      pos_candidate_positions: [],
      pos_voter_positions: [],
    };
  } else {
    buildingInput = {
      ...rawInput,
      pos_candidate_accounts: rawInput.pos_candidate_accounts || [],
      pos_voter_accounts: rawInput.pos_voter_accounts || [],
      pos_candidate_positions: rawInput.pos_candidate_positions || [],
      pos_voter_positions: rawInput.pos_voter_positions || [],
    };
  }

  return buildingInput;
}

function buildCreateBadgeInput(rawInput: Createbadge) {
  let buildingInput = { ...rawInput };
  if (rawInput.issue_exec_type !== EXECUTION_TYPE.COLLECTIVE_DECISION) {
    buildingInput = {
      ...rawInput,
      issue_sole_right_accounts: rawInput.issue_sole_right_accounts || [],
      issue_sole_right_pos_ids: rawInput.issue_sole_right_pos_ids || [],
      issue_proposer_right_accounts: [],
      issue_proposer_right_pos_ids: [],
      issue_approver_right_accounts: [],
      issue_approver_right_pos_ids: [],
      issue_approval_type: ApprovalType.SOLE_APPROVAL,
      issue_voter_right_accounts: [],
      issue_voter_right_pos_ids: [],
      issue_vote_duration: 0,
      issue_pass_rule: 0,
    };
  }

  if (rawInput.issue_exec_type !== EXECUTION_TYPE.SOLE_DECISION) {
    buildingInput = {
      ...buildingInput,
      issue_proposer_right_accounts: rawInput.issue_proposer_right_accounts || [],
      issue_proposer_right_pos_ids: rawInput.issue_proposer_right_pos_ids || [],
      issue_approver_right_accounts: rawInput.issue_approver_right_accounts || [],
      issue_approver_right_pos_ids: rawInput.issue_approver_right_pos_ids || [],
      issue_approval_type: rawInput.issue_approval_type,
      issue_voter_right_accounts: rawInput.issue_voter_right_accounts || [],
      issue_voter_right_pos_ids: rawInput.issue_approver_right_pos_ids || [],
    };
  }

  return buildingInput;
}

function buildConfigBadgeInput(rawInput: Configbadge) {
  let buildingInput = { ...rawInput };
  if (rawInput.issue_exec_type !== EXECUTION_TYPE.COLLECTIVE_DECISION) {
    buildingInput = {
      ...rawInput,
      issue_sole_right_accounts: rawInput.issue_sole_right_accounts || [],
      issue_sole_right_pos_ids: rawInput.issue_sole_right_pos_ids || [],
      issue_proposer_right_accounts: [],
      issue_proposer_right_pos_ids: [],
      issue_approver_right_accounts: [],
      issue_approver_right_pos_ids: [],
      issue_approval_type: ApprovalType.SOLE_APPROVAL,
      issue_voter_right_accounts: [],
      issue_voter_right_pos_ids: [],
      issue_vote_duration: 0,
      issue_pass_rule: 0,
    };
  }

  if (rawInput.issue_exec_type !== EXECUTION_TYPE.SOLE_DECISION) {
    buildingInput = {
      ...buildingInput,
      issue_proposer_right_accounts: rawInput.issue_proposer_right_accounts || [],
      issue_proposer_right_pos_ids: rawInput.issue_proposer_right_pos_ids || [],
      issue_approver_right_accounts: rawInput.issue_approver_right_accounts || [],
      issue_approver_right_pos_ids: rawInput.issue_approver_right_pos_ids || [],
      issue_approval_type: rawInput.issue_approval_type,
      issue_voter_right_accounts: rawInput.issue_voter_right_accounts || [],
      issue_voter_right_pos_ids: rawInput.issue_approver_right_pos_ids || [],
    };
  }

  return buildingInput;
}

export { buildCreateBadgeInput, buildConfigBadgeInput, buildCreatePositionInput, buildConfigPositionInput };
