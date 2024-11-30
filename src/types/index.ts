export interface Team {
  team_id: number;
  team_name: string;
  created_at: string;
}

export interface Dimension {
  dimension_id: number;
  dimension_name: string;
}

export interface TeamCriteriaSubmission {
  submission_id: number;
  team_id: number;
  dimension_id: number;
  criteria_data: Record<string, any>;
  submitted_at: string;
}

export interface GameResult {
  result_id: number;
  team_id: number;
  dimension_id: number;
  score: number;
  created_at: string;
}

export interface SubmissionStatus {
  dimension_id: number;
  team_id: number | null;
  submitted: boolean;
  submitted_at: string | null;
}