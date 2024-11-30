export const formatSumLettersResponse = (sums: number[]): string[] => {
  // Filter out any NaN values and join the numbers
  const validSums = sums.filter(num => !isNaN(num));
  const concatenatedSum = validSums.join('');
  return [concatenatedSum];
};

export const parseSumLettersResponse = (response: string): string => {
  // Clean the response string by removing any non-digit characters
  return response.replace(/\D/g, '');
};