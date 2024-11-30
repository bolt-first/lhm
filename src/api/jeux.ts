import { fetchWithErrorHandling } from './utils';

export interface Jeu {
  dimension_id: number;
  atelier: string[];
  bbox: string[];
  jeu_id: number;
  created_at: string;
}

export interface JeuxSubmission {
  dimension_id: number;
  atelier: string[];
  bbox: string[];
}

export const fetchJeux = async (): Promise<Jeu[]> => {
  return fetchWithErrorHandling('/jeux/');
};

export const submitJeux = async (data: JeuxSubmission): Promise<void> => {
  return fetchWithErrorHandling('/jeux/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};