import { useState, useEffect, useCallback } from 'react';
import { fetchJeux } from '../api/jeux';
import { useInterval } from './useInterval';
import type { Jeu } from '../api/jeux';

const REFRESH_INTERVAL = 3000; // 3 seconds

export const useJeux = () => {
  const [jeux, setJeux] = useState<Jeu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadJeux = useCallback(async () => {
    try {
      const data = await fetchJeux();
      setJeux(data);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Failed to load jeux'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJeux();
  }, [loadJeux]);

  useInterval(loadJeux, REFRESH_INTERVAL);

  const getJeuByDimensionId = useCallback((dimensionId: number) => {
    return jeux.find(jeu => jeu.dimension_id === dimensionId);
  }, [jeux]);

  const isJeuCreated = useCallback((dimensionId: number) => {
    return jeux.some(jeu => jeu.dimension_id === dimensionId);
  }, [jeux]);

  return { 
    jeux, 
    getJeuByDimensionId, 
    isJeuCreated,
    loading, 
    error 
  };
};