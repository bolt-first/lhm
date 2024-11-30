import { useState, useEffect, useCallback } from 'react';
import { getJeuStatus } from '../api/jeux';
import { useInterval } from './useInterval';
import type { Dimension } from '../types';
import type { JeuStatus } from '../api/jeux';

const REFRESH_INTERVAL = 3000;

export const useJeuxStatus = (dimensions: Dimension[]) => {
  const [jeuxStatus, setJeuxStatus] = useState<Record<number, JeuStatus>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadJeuxStatus = useCallback(async () => {
    if (!dimensions.length) return;

    try {
      const statusPromises = dimensions.map(async dimension => {
        const status = await getJeuStatus(dimension.dimension_id);
        return [dimension.dimension_id, status] as const;
      });

      const results = await Promise.all(statusPromises);
      const newStatus = Object.fromEntries(results);
      setJeuxStatus(newStatus);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Failed to load jeux status'));
    } finally {
      setLoading(false);
    }
  }, [dimensions]);

  useEffect(() => {
    loadJeuxStatus();
  }, [loadJeuxStatus]);

  useInterval(loadJeuxStatus, dimensions.length ? REFRESH_INTERVAL : null);

  return { jeuxStatus, loading, error };
};