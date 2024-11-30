import { API_CONFIG } from './config';

export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export const fetchWithErrorHandling = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...API_CONFIG.DEFAULT_HEADERS,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new APIError(
        `API request failed with status ${response.status}`,
        response.status,
        await response.json().catch(() => null)
      );
    }

    const data = await response.json();
    if (!data) {
      throw new APIError('Invalid response data');
    }

    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(
      error instanceof Error ? error.message : 'An unknown error occurred'
    );
  }
};