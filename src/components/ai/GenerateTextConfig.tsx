import React from 'react';
import { Settings } from 'lucide-react';

export interface GenerateTextConfig {
  company_context: string;
  target_words: string[];
  tokens: number;
  language: string;
  is_order: boolean;
}

interface GenerateTextConfigProps {
  config: GenerateTextConfig;
  onChange: (config: GenerateTextConfig) => void;
  onGenerate: () => void;
  isLoading: boolean;
  disabled: boolean;
}

export const GenerateTextConfig: React.FC<GenerateTextConfigProps> = ({
  config,
  onChange,
  onGenerate,
  isLoading,
  disabled,
}) => {
  const handleConfigChange = (key: keyof GenerateTextConfig, value: any) => {
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
          <h4 className="font-medium">Generate Text Configuration</h4>
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
            Company Context
          </label>
          <textarea
            value={config.company_context}
            onChange={(e) => handleConfigChange('company_context', e.target.value)}
            className="w-full p-2 border rounded-md h-24 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Target Words (comma-separated)
          </label>
          <input
            type="text"
            value={config.target_words.join(', ')}
            onChange={(e) => handleConfigChange('target_words', e.target.value.split(',').map(w => w.trim()))}
            className="w-full p-2 border rounded-md"
          />
        </div>

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

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="is_order"
            checked={config.is_order}
            onChange={(e) => handleConfigChange('is_order', e.target.checked)}
            className="rounded border-gray-300"
          />
          <label htmlFor="is_order" className="text-sm font-medium text-gray-700">
            Maintain Order
          </label>
        </div>
      </div>
    </div>
  );
};