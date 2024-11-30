import React from 'react';

interface SumLettersResultProps {
  result: string;
}

export const SumLettersResult: React.FC<SumLettersResultProps> = ({ result }) => {
  // Remove any spaces and commas from the result
  const cleanResult = result.replace(/[\s,]/g, '');

  return (
    <div className="space-y-2">
      <h4 className="font-medium text-gray-700">Result:</h4>
      <div className="bg-gray-50 p-3 rounded-md font-mono text-center text-lg">
        {cleanResult}
      </div>
    </div>
  );
};