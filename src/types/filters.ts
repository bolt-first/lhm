export type TimePeriod = 'week' | 'month' | 'year' | 'all';

export interface Filters {
  dimensionId: number | 'all';
  timePeriod: TimePeriod;
}

export interface FilterContextType {
  filters: Filters;
  setFilters: (filters: Filters) => void;
}

export const defaultFilters: Filters = {
  dimensionId: 'all',
  timePeriod: 'week',
};