import React from 'react';
import { TeamCard } from './TeamCard';
import { useFilters } from '../context/FilterContext';
import { useFilteredData } from '../hooks/useFilteredData';
import type { Team, GameResult } from '../types';

interface LeaderboardGridProps {
  teams: Team[];
  results: Record<number, GameResult[]>;
}

export const LeaderboardGrid = ({ teams, results }: LeaderboardGridProps) => {
  const { filters } = useFilters();
  const { sortedTeams, filteredResults } = useFilteredData(teams, results, filters);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedTeams.map((team, index) => (
        <TeamCard
          key={team.team_id}
          team={team}
          rank={index + 1}
          results={filteredResults[team.team_id] || []}
        />
      ))}
    </div>
  );
};