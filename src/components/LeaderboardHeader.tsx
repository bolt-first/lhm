import React from 'react';
import { Trophy } from 'lucide-react';
import { useFilters } from '../context/FilterContext';
import { useDimensions } from '../hooks/useDimensions';
import type { TimePeriod } from '../types/filters';

export const LeaderboardHeader = () => {
  const { filters, setFilters } = useFilters();
  const { dimensions } = useDimensions();

  const handleDimensionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilters({
      ...filters,
      dimensionId: value === 'all' ? 'all' : Number(value),
    });
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({
      ...filters,
      timePeriod: e.target.value as TimePeriod,
    });
  };

  return (
    <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Trophy className="w-8 h-8 text-yellow-500" />
          <h1 className="text-2xl font-bold text-gray-900">LHM Leaderboard</h1>
        </div>
        <div className="flex items-center space-x-4">
          <select
            className="px-4 py-2 border rounded-lg bg-gray-50"
            value={filters.dimensionId.toString()}
            onChange={handleDimensionChange}
          >
            <option value="all">All Dimensions</option>
            {dimensions.map((dimension) => (
              <option key={dimension.dimension_id} value={dimension.dimension_id}>
                {dimension.dimension_name}
              </option>
            ))}
          </select>
          <select
            className="px-4 py-2 border rounded-lg bg-gray-50"
            value={filters.timePeriod}
            onChange={handleTimeChange}
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>
    </div>
  );
};