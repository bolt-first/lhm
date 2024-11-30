import { fetchWithErrorHandling } from './utils';
import type { GameResult } from '../types';

export const fetchTeamResults = async (teamId: number): Promise<GameResult[]> => {
  return fetchWithErrorHandling(`/results/team/${teamId}`);
};

export const fetchDimensionResults = async (dimensionId: number): Promise<GameResult[]> => {
  return fetchWithErrorHandling(`/results/dimension/${dimensionId}`);
};