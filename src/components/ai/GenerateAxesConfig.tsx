import React from 'react';
import { Settings } from 'lucide-react';

export interface GenerateAxesConfig {
  context: string;
  count: number;
  language: string;
  list_hide: string[];
  text: string;
}

interface GenerateAxesConfigProps {
  config: GenerateAxesConfig;
  onChange: (config: GenerateAxesConfig) => void;
  onGenerate: () => void;
  isLoading: boolean;
  disabled: boolean;
}

export const GenerateAxesConfig: React.FC<GenerateAxesConfigProps> = ({
  config,
  onChange,
  onGenerate,
  isLoading,
  disabled,
}) => {
  const handleConfigChange = (key: keyof GenerateAxesConfig, value: any) => {
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
          <h4 className="font-medium">Generate Axes Configuration</h4>
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
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Context
          </label>
          <textarea
            value={config.context}
            onChange={(e) => handleConfigChange('context', e.target.value)}
            className="w-full p-2 border rounded-md h-24 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Axes
          </label>
          <input
            type="number"
            value={config.count}
            onChange={(e) => handleConfigChange('count', parseInt(e.target.value))}
            min={1}
            max={10}
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

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hide List (comma-separated)
          </label>
          <input
            type="text"
            value={config.list_hide.join(', ')}
            onChange={(e) => handleConfigChange('list_hide', e.target.value.split(',').map(w => w.trim()))}
            className="w-full p-2 border rounded-md"
            placeholder="SERALN, ESALNRA, ..."
          />
        </div>
      </div>
    </div>
  );
};