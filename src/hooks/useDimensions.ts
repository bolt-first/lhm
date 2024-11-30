import { useState, useEffect, useCallback } from 'react';
import { fetchDimensions } from '../api';
import { useInterval } from './useInterval';
import type { Dimension } from '../types';

const REFRESH_INTERVAL = 3000; // 30 seconds

export const useDimensions = () => {
  const [dimensions, setDimensions] = useState<Dimension[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadDimensions = useCallback(async () => {
    try {
      const data = await fetchDimensions();
      const sortedDimensions = [...data].sort((a, b) => a.dimension_id - b.dimension_id);
      setDimensions(sortedDimensions);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Failed to load dimensions'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDimensions();
  }, [loadDimensions]);

  useInterval(loadDimensions, REFRESH_INTERVAL);

  return { dimensions, loading, error };
};