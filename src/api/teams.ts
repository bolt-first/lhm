import { fetchWithErrorHandling } from './utils';
import type { Team } from '../types';

export const fetchTeams = async (skip = 0, limit = 10): Promise<Team[]> => {
  return fetchWithErrorHandling(`/teams/?skip=${skip}&limit=${limit}`);
};