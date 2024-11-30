import { useMemo } from 'react';
import type { Team, GameResult } from '../types';
import type { Filters } from '../types/filters';

const isWithinTimePeriod = (date: string, timePeriod: Filters['timePeriod']) => {
  const resultDate = new Date(date);
  const now = new Date();
  
  switch (timePeriod) {
    case 'week':
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return resultDate >= weekAgo;
    case 'month':
      const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      return resultDate >= monthAgo;
    case 'year':
      const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      return resultDate >= yearAgo;
    default:
      return true;
  }
};

export const useFilteredData = (
  teams: Team[],
  results: Record<number, GameResult[]>,
  filters: Filters
) => {
  return useMemo(() => {
    const filteredResults = Object.entries(results).reduce<Record<number, GameResult[]>>(
      (acc, [teamId, teamResults]) => {
        acc[Number(teamId)] = teamResults.filter(result => {
          const matchesDimension = filters.dimensionId === 'all' || result.dimension_id === filters.dimensionId;
          const matchesTime = isWithinTimePeriod(result.created_at, filters.timePeriod);
          return matchesDimension && matchesTime;
        });
        return acc;
      },
      {}
    );

    const sortedTeams = [...teams].sort((a, b) => {
      const scoreA = filteredResults[a.team_id]?.reduce((sum, r) => sum + r.score, 0) || 0;
      const scoreB = filteredResults[b.team_id]?.reduce((sum, r) => sum + r.score, 0) || 0;
      return scoreB - scoreA;
    });

    return {
      sortedTeams,
      filteredResults,
    };
  }, [teams, results, filters]);
};