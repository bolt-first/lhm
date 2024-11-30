import React from 'react';
import { Settings } from 'lucide-react';

export interface GenerateDescriptionsConfig {
  language: string;
  tokens: number;
  words: string[];
}

interface GenerateDescriptionsConfigProps {
  config: GenerateDescriptionsConfig;
  onChange: (config: GenerateDescriptionsConfig) => void;
  onGenerate: () => void;
  isLoading: boolean;
  disabled: boolean;
}

export const GenerateDescriptionsConfig: React.FC<GenerateDescriptionsConfigProps> = ({
  config,
  onChange,
  onGenerate,
  isLoading,
  disabled,
}) => {
  const handleConfigChange = (key: keyof GenerateDescriptionsConfig, value: any) => {
    onChange({
      ...config,
      [key]: value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Settings className="w-4 h-4 text-gray-500" />
          <h4 className="font-medium">Generate Descriptions Configuration</h4>
        </div>
        <button
          onClick={onGenerate}
          disabled={isLoading || disabled}
          className={`px-4 py-2 rounded-lg text-white ${
            isLoading || disabled
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Generating...' : 'Generate'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tokens
          </label>
          <input
            type="number"
            value={config.tokens}
            onChange={(e) => handleConfigChange('tokens', parseInt(e.target.value))}
            min={1}
            max={1000}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Language
          </label>
          <select
            value={config.language}
            onChange={(e) => handleConfigChange('language', e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="french">French</option>
            <option value="english">English</option>
          </select>
        </div>
      </div>
    </div>
  );
};