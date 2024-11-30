import { useState, useEffect, useCallback } from 'react';
import { fetchDimensionSubmissions } from '../api/submissions';
import { useInterval } from './useInterval';
import type { TeamCriteriaSubmission, Dimension } from '../types';

const REFRESH_INTERVAL = 3000; // 30 seconds

export const useSubmissionStatus = (dimensions: Dimension[]) => {
  const [submissions, setSubmissions] = useState<TeamCriteriaSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadSubmissions = useCallback(async () => {
    if (!dimensions.length) return;

    try {
      const submissionPromises = dimensions.map(dimension => 
        fetchDimensionSubmissions(dimension.dimension_id)
      );
      
      const results = await Promise.all(submissionPromises);
      const allSubmissions = results.flat();
      setSubmissions(allSubmissions);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Failed to load submission status'));
    } finally {
      setLoading(false);
    }
  }, [dimensions]);

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  useInterval(loadSubmissions, dimensions.length ? REFRESH_INTERVAL : null);

  return { submissions, loading, error };
};