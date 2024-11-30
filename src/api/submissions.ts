import { fetchWithErrorHandling } from './utils';
import type { TeamCriteriaSubmission } from '../types';

export const fetchTeamSubmissions = async (teamId: number): Promise<TeamCriteriaSubmission[]> => {
  return fetchWithErrorHandling(`/submissions/team/${teamId}`);
};

export const fetchDimensionSubmissions = async (dimensionId: number): Promise<TeamCriteriaSubmission[]> => {
  return fetchWithErrorHandling(`/submissions/dimension/${dimensionId}`);
};