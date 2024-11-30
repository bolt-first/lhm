import { fetchWithErrorHandling } from './utils';
import type { Dimension } from '../types';

export const fetchDimensions = async (skip = 0, limit = 10): Promise<Dimension[]> => {
  return fetchWithErrorHandling(`/dimensions/?skip=${skip}&limit=${limit}`);
};