import React from 'react';
import { Calculator } from 'lucide-react';

export interface SumLettersConfig {
  positions: [number, number][];
}

interface SumLettersConfigProps {
  config: SumLettersConfig;
  onChange: (config: SumLettersConfig) => void;
  onGenerate: () => void;
  isLoading: boolean;
  disabled: boolean;
}

export const SumLettersConfig: React.FC<SumLettersConfigProps> = ({
  config,
  onChange,
  onGenerate,
  isLoading,
  disabled,
}) => {
  const handleAddPosition = () => {
    onChange({
      positions: [...config.positions, [1, 2]],
    });
  };

  const handleRemovePosition = (index: number) => {
    const newPositions = config.positions.filter((_, i) => i !== index);
    onChange({
      positions: newPositions,
    });
  };

  const handlePositionChange = (index: number, posIndex: 0 | 1, value: number) => {
    const newPositions = [...config.positions];
    newPositions[index] = [...newPositions[index]];
    newPositions[index][posIndex] = value;
    onChange({
      positions: newPositions,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calculator className="w-4 h-4 text-gray-500" />
          <h4 className="font-medium">Sum Letters Configuration</h4>
        </div>
        <button
          onClick={onGenerate}
          disabled={isLoading || disabled}
          className={`
            px-4 py-2 rounded-lg text-white
            ${isLoading || disabled
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 transition-colors'
            }
          `}
        >
          {isLoading ? 'Calculating...' : 'Calculate'}
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h5 className="text-sm font-medium text-gray-700">Letter Positions</h5>
          <button
            onClick={handleAddPosition}
            className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            + Add Position
          </button>
        </div>
        
        {config.positions.map((position, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Position
                </label>
                <input
                  type="number"
                  min={1}
                  value={position[0]}
                  onChange={(e) => handlePositionChange(index, 0, parseInt(e.target.value))}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Position
                </label>
                <input
                  type="number"
                  min={1}
                  value={position[1]}
                  onChange={(e) => handlePositionChange(index, 1, parseInt(e.target.value))}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <button
              onClick={() => handleRemovePosition(index)}
              className="text-red-500 hover:text-red-600 transition-colors mt-6"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};