import React from 'react';

interface TransformDictResultProps {
  result: string;
}

export const TransformDictResult: React.FC<TransformDictResultProps> = ({ result }) => {
  return (
    <div className="space-y-2">
      <h4 className="font-medium text-gray-700">Result:</h4>
      <div className="bg-gray-50 p-3 rounded-md font-mono text-center text-lg">
        {result}
      </div>
    </div>
  );
};