import { TransformDictResponse } from '../types/transform';

export const formatTransformDictResponse = (response: TransformDictResponse): string => {
  const order = ["57", "573", "7", "27"];
  return order.map(key => response[key]?.toString() || "").join("");
};

export const prepareTransformDictInput = (criteriaData: Record<string, any>): Record<string, number> => {
  const inputDict: Record<string, number> = {};
  Object.entries(criteriaData).forEach(([key, value]) => {
    const numValue = parseInt(value as string);
    if (!isNaN(numValue)) {
      inputDict[key] = numValue;
    }
  });
  return inputDict;
};