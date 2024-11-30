import React from 'react';
import { LeaderboardHeader } from './components/LeaderboardHeader';
import { LeaderboardGrid } from './components/LeaderboardGrid';
import { SubmissionProgress } from './components/SubmissionProgress';
import { ErrorMessage } from './components/ErrorMessage';
import { FilterProvider } from './context/FilterContext';
import { useTeamsData } from './hooks/useTeamsData';
import { useDimensions } from './hooks/useDimensions';
import { useSubmissionStatus } from './hooks/useSubmissionStatus';
import { useJeux } from './hooks/useJeux';

const App: React.FC = () => {
  const { teams, results, loading: teamsLoading, error: teamsError } = useTeamsData();
  const { dimensions, loading: dimensionsLoading, error: dimensionsError } = useDimensions();
  const { submissions, loading: submissionsLoading, error: submissionsError } = useSubmissionStatus(dimensions);
  const { jeux, getJeuByDimensionId, loading: jeuxLoading, error: jeuxError } = useJeux();

  const loading = teamsLoading || dimensionsLoading || submissionsLoading || jeuxLoading;
  const error = teamsError || dimensionsError || submissionsError || jeuxError;

  return (
    <FilterProvider>
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <LeaderboardHeader />
          
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <ErrorMessage 
              message={error.message} 
              onRetry={() => window.location.reload()}
            />
          ) : (
            <>
              <SubmissionProgress 
                submissions={submissions}
                teams={teams}
                dimensions={dimensions}
                getJeuByDimensionId={getJeuByDimensionId}
              />
              <LeaderboardGrid teams={teams} results={results} />
            </>
          )}
        </div>
      </div>
    </FilterProvider>
  );
};

export default App;