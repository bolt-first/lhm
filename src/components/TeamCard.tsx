import React from 'react';
import type { Team, GameResult } from '../types';

interface TeamCardProps {
  team: Team;
  rank: number;
  results: GameResult[];
}

export const TeamCard = ({ team, rank, results }: TeamCardProps) => {
  const totalScore = results.reduce((sum, result) => sum + result.score, 0);
  
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <span className={`text-2xl font-bold ${rank <= 3 ? 'text-yellow-500' : 'text-gray-400'}`}>
            #{rank}
          </span>
          <div>
            <h3 className="font-semibold text-lg">{team.team_name}</h3>
            <p className="text-sm text-gray-500">Joined {new Date(team.created_at).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-blue-600">{totalScore}</p>
          <p className="text-sm text-gray-500">Total Score</p>
        </div>
      </div>
      <div className="space-y-2">
        {results.map((result) => (
          <div key={result.result_id} className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Dimension {result.dimension_id}</span>
            <span className="font-medium">{result.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
};