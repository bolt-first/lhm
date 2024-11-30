import React, { useMemo, useState } from 'react';
import { CheckCircle, Circle, Lock } from 'lucide-react';
import { DimensionModal } from './DimensionModal';
import type { TeamCriteriaSubmission, Team, Dimension } from '../types';
import type { Jeu } from '../api/jeux';

interface SubmissionProgressProps {
  submissions: TeamCriteriaSubmission[];
  teams: Team[];
  dimensions: Dimension[];
  getJeuByDimensionId: (dimensionId: number) => Jeu | undefined;
}

export const SubmissionProgress: React.FC<SubmissionProgressProps> = ({
  submissions,
  teams,
  dimensions,
  getJeuByDimensionId,
}) => {
  const [selectedDimension, setSelectedDimension] = useState<Dimension | null>(null);

  const submissionMap = useMemo(() => {
    return dimensions.reduce<Record<number, TeamCriteriaSubmission | null>>((acc, dimension) => {
      acc[dimension.dimension_id] = submissions.find(s => s.dimension_id === dimension.dimension_id) || null;
      return acc;
    }, {});
  }, [dimensions, submissions]);

  const totalDimensions = dimensions.length;
  const submittedDimensions = Object.values(submissionMap).filter(Boolean).length;
  const progressPercentage = (submittedDimensions / totalDimensions) * 100;

  const getTeamName = (teamId: number) => {
    const team = teams.find(t => t.team_id === teamId);
    return team ? team.team_name : 'Unknown Team';
  };

  const sortedDimensions = [...dimensions].sort((a, b) => a.dimension_id - b.dimension_id);

  const handleDimensionClick = (dimension: Dimension) => {
    const jeu = getJeuByDimensionId(dimension.dimension_id);
    if (!jeu) {
      setSelectedDimension(dimension);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Submission Progress</h2>
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-blue-600">
              {submittedDimensions}/{totalDimensions}
            </div>
            <div className="text-sm text-gray-500">dimensions completed</div>
          </div>
        </div>

        <div className="mb-6">
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedDimensions.map(dimension => {
            const submission = submissionMap[dimension.dimension_id];
            const jeu = getJeuByDimensionId(dimension.dimension_id);
            const hasJeu = !!jeu;
            const isVerified = hasJeu;
            
            return (
              <button
                key={dimension.dimension_id}
                onClick={() => handleDimensionClick(dimension)}
                disabled={hasJeu}
                className={`
                  flex items-center space-x-3 p-3 rounded-lg border text-left
                  ${hasJeu 
                    ? 'border-gray-100 bg-gray-50 cursor-not-allowed' 
                    : submission
                    ? 'border-green-100 hover:bg-green-50 transition-colors cursor-pointer'
                    : 'border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer'
                  }
                `}
              >
                {isVerified ? (
                  <Lock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                ) : submission ? (
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                )}
                <div>
                  <div className="font-medium text-gray-900">{dimension.dimension_name}</div>
                  <div className="text-sm text-gray-500">
                    {isVerified ? (
                      <span className="text-gray-500">
                        Verified
                        {jeu?.created_at && (
                          <>
                            <br />
                            <span className="text-gray-400 text-xs">
                              {new Date(jeu.created_at).toLocaleDateString()}
                            </span>
                          </>
                        )}
                      </span>
                    ) : submission ? (
                      <span className="text-green-600">
                        Submitted by {getTeamName(submission.team_id)}
                        <br />
                        <span className="text-gray-400 text-xs">
                          Click to verify
                        </span>
                      </span>
                    ) : (
                      <span className="text-gray-400">Not submitted</span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedDimension && (
        <DimensionModal
          dimensionId={selectedDimension.dimension_id}
          dimensionName={selectedDimension.dimension_name}
          submission={submissionMap[selectedDimension.dimension_id]}
          onClose={() => setSelectedDimension(null)}
          onSubmit={() => {
            setSelectedDimension(null);
          }}
          isSubmitted={!!getJeuByDimensionId(selectedDimension.dimension_id)}
        />
      )}
    </>
  );
};