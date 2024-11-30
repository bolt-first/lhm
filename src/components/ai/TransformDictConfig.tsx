import React from 'react';
import { Calculator } from 'lucide-react';
import type { TransformDictConfig as Config } from '../../types/transform';

interface TransformDictConfigProps {
  config: Config;
  onChange: (config: Config) => void;
  onGenerate: () => void;
  isLoading: boolean;
  disabled: boolean;
}

export const TransformDictConfig: React.FC<TransformDictConfigProps> = ({
  onGenerate,
  isLoading,
  disabled,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calculator className="w-4 h-4 text-gray-500" />
          <h4 className="font-medium">Transform Dictionary</h4>
        </div>
        <button
          onClick={onGenerate}
          disabled={isLoading || disabled}
          className={`
            px-4 py-2 rounded-lg text-white transition-colors
            ${isLoading || disabled
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
            }
          `}
        >
          {isLoading ? 'Transforming...' : 'Transform'}
        </button>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg space-y-2">
        <p className="text-sm text-gray-600">
          This will transform your criteria values into a new dictionary and concatenate the results in a specific order:
        </p>
        <ul className="text-sm text-gray-500 list-disc list-inside">
          <li>First: value for key "57"</li>
          <li>Second: value for key "573"</li>
          <li>Third: value for key "7"</li>
          <li>Fourth: value for key "27"</li>
        </ul>
      </div>
    </div>
  );
};