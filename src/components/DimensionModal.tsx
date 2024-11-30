import React, { useState } from 'react';
import { X, CheckCircle, Edit2, Plus, Trash2 } from 'lucide-react';
import { submitJeux } from '../api/jeux';
import { GenerateTextConfig, type GenerateTextConfig as TextConfig } from './ai/GenerateTextConfig';
import { GenerateDescriptionsConfig, type GenerateDescriptionsConfig as DescConfig } from './ai/GenerateDescriptionsConfig';
import { GenerateAxesConfig, type GenerateAxesConfig as AxesConfig } from './ai/GenerateAxesConfig';
import { SumLettersConfig, type SumLettersConfig as SumConfig } from './ai/SumLettersConfig';
import { TransformDictConfig } from './ai/TransformDictConfig';
import { SumLettersResult } from './ai/SumLettersResult';
import { prepareTransformDictInput, formatTransformDictResponse } from '../utils/transformDict';
import type { TeamCriteriaSubmission } from '../types';
import type { TransformDictResponse } from '../types/transform';

interface DimensionModalProps {
  dimensionId: number;
  dimensionName: string;
  submission: TeamCriteriaSubmission | null;
  onClose: () => void;
  onSubmit: () => void;
  isSubmitted: boolean;
}

type AIFunction = 'generate-text' | 'generate-descriptions' | 'generate-axes' | 'sum-letters' | 'transform-dict';

export const DimensionModal: React.FC<DimensionModalProps> = ({
  dimensionId,
  dimensionName,
  submission,
  onClose,
  onSubmit,
  isSubmitted,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [criteriaData, setCriteriaData] = useState(submission?.criteria_data || {});
  const [newCriteriaKey, setNewCriteriaKey] = useState('');
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFunction, setSelectedFunction] = useState<AIFunction>('generate-text');
  
  const [textConfig, setTextConfig] = useState<TextConfig>({
    company_context: "LafargeHolcim Maroc, un leader dans le secteur des matériaux de construction au Maroc, est une filiale du groupe international Holcim. L'entreprise se distingue par son engagement envers le développement durable et l'innovation dans ses produits et services.",
    target_words: ["DES", "AU", "C'EST", "CAS"],
    tokens: 100,
    language: "french",
    is_order: true,
  });

  const [descConfig, setDescConfig] = useState<DescConfig>({
    language: "french",
    tokens: 3,
    words: [],
  });

  const [axesConfig, setAxesConfig] = useState<AxesConfig>({
    context: "LafargeHolcim Maroc, un leader dans le secteur des matériaux de construction au Maroc, est une filiale du groupe international Holcim. L'entreprise se distingue par son engagement envers le développement durable et l'innovation dans ses produits et services.",
    count: 4,
    language: "french",
    list_hide: ["SERALN", "ESALNRA", "NRESALN", "ESARNL"],
    text: Object.values(criteriaData)[0] || "",
  });

  const [sumConfig, setSumConfig] = useState<SumConfig>({
    positions: [[1, 3], [3, 4], [1, 2]],
  });

  const handleFunctionChange = (newFunction: AIFunction) => {
    setSelectedFunction(newFunction);
    setGeneratedContent('');
    if (newFunction === 'generate-descriptions') {
      setDescConfig(prev => ({
        ...prev,
        words: Object.values(criteriaData),
      }));
    } else if (newFunction === 'generate-axes') {
      setAxesConfig(prev => ({
        ...prev,
        text: Object.values(criteriaData)[0] || "",
      }));
    }
  };

  const generateContent = async () => {
    setIsLoading(true);
    try {
      const criteriaValues = Object.values(criteriaData);
      let endpoint = '';
      let requestBody = {};

      switch (selectedFunction) {
        case 'generate-text':
          endpoint = '/generate-text';
          requestBody = {
            ...textConfig,
            criteria: criteriaValues,
          };
          break;
        case 'generate-descriptions':
          endpoint = '/generate-descriptions';
          requestBody = {
            ...descConfig,
            words: criteriaValues,
          };
          break;
        case 'generate-axes':
          endpoint = '/generate-axes';
          requestBody = {
            ...axesConfig,
            text: criteriaValues[0] || "",
          };
          break;
        case 'sum-letters':
          endpoint = '/sum-letters';
          requestBody = {
            positions: sumConfig.positions,
            words: criteriaValues,
          };
          break;
        case 'transform-dict':
          endpoint = '/transform-dict';
          requestBody = {
            input_dict: prepareTransformDictInput(criteriaData)
          };
          break;
      }

      const response = await fetch(`http://98.71.171.3:8002${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      if (selectedFunction === 'generate-text') {
        setGeneratedContent(data.text || '');
      } else if (selectedFunction === 'generate-descriptions') {
        const descriptions = Object.entries(data)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n\n');
        setGeneratedContent(descriptions);
      } else if (selectedFunction === 'generate-axes' && data.axes) {
        const axesContent = data.axes.map(axis => {
          return `${axis.title}\n${axis.phrases.map((phrase, i) => `${i + 1}. ${phrase}`).join('\n')}`;
        }).join('\n\n');
        setGeneratedContent(axesContent);
      } else if (selectedFunction === 'sum-letters' && data.sums) {
        setGeneratedContent(data.sums.filter(num => !isNaN(num)).join(''));
      } else if (selectedFunction === 'transform-dict') {
        setGeneratedContent(formatTransformDictResponse(data as TransformDictResponse));
      }
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (isSubmitted) return;
    
    try {
      const bbox = [generatedContent];
      await submitJeux({
        dimension_id: dimensionId,
        atelier: Object.values(criteriaData),
        bbox,
      });
      onSubmit();
    } catch (error) {
      console.error('Error submitting verification:', error);
      alert('Failed to verify submission. Please try again.');
    }
  };

  const handleEdit = (key: string, value: string) => {
    setCriteriaData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleAddCriteria = () => {
    if (!newCriteriaKey.trim()) return;
    setCriteriaData(prev => ({
      ...prev,
      [newCriteriaKey]: '',
    }));
    setNewCriteriaKey('');
  };

  const handleDeleteCriteria = (keyToDelete: string) => {
    setCriteriaData(prev => {
      const newData = { ...prev };
      delete newData[keyToDelete];
      return newData;
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">{dimensionName}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Atelier</h3>
              <div className="flex items-center space-x-2">
                {!isSubmitted && isEditing && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newCriteriaKey}
                      onChange={(e) => setNewCriteriaKey(e.target.value)}
                      placeholder="New criteria name"
                      className="px-3 py-1 border rounded-md text-sm"
                    />
                    <button
                      onClick={handleAddCriteria}
                      className="text-green-600 hover:text-green-700 p-1 rounded-md hover:bg-green-50"
                      title="Add new criteria"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                )}
                {!isSubmitted && (
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>{isEditing ? 'Done' : 'Edit'}</span>
                  </button>
                )}
              </div>
            </div>
            
            {Object.entries(criteriaData).map(([key, value], index) => (
              <div key={index} className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    {key}
                  </label>
                  {isEditing && !isSubmitted && (
                    <button
                      onClick={() => handleDeleteCriteria(key)}
                      className="text-red-500 hover:text-red-600 p-1 rounded-md hover:bg-red-50"
                      title="Delete criteria"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {isEditing && !isSubmitted ? (
                  <input
                    type="text"
                    value={value as string}
                    onChange={(e) => handleEdit(key, e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    {value as string}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Black Box</h3>
            <div className="space-y-4">
              <select
                value={selectedFunction}
                onChange={(e) => handleFunctionChange(e.target.value as AIFunction)}
                className="px-4 py-2 border rounded-lg bg-white"
              >
                <option value="generate-text">Generate Text</option>
                <option value="generate-descriptions">Generate Descriptions</option>
                <option value="generate-axes">Generate Axes</option>
                <option value="sum-letters">Sum Letters</option>
                <option value="transform-dict">Transform Dictionary</option>
              </select>

              {selectedFunction === 'generate-text' && (
                <GenerateTextConfig
                  config={textConfig}
                  onChange={setTextConfig}
                  onGenerate={generateContent}
                  isLoading={isLoading}
                  disabled={Object.values(criteriaData).length === 0}
                />
              )}
              
              {selectedFunction === 'generate-descriptions' && (
                <GenerateDescriptionsConfig
                  config={descConfig}
                  onChange={setDescConfig}
                  onGenerate={generateContent}
                  isLoading={isLoading}
                  disabled={Object.values(criteriaData).length === 0}
                />
              )}
              
              {selectedFunction === 'generate-axes' && (
                <GenerateAxesConfig
                  config={axesConfig}
                  onChange={setAxesConfig}
                  onGenerate={generateContent}
                  isLoading={isLoading}
                  disabled={Object.values(criteriaData).length === 0}
                />
              )}
              
              {selectedFunction === 'sum-letters' && (
                <SumLettersConfig
                  config={sumConfig}
                  onChange={setSumConfig}
                  onGenerate={generateContent}
                  isLoading={isLoading}
                  disabled={Object.values(criteriaData).length === 0}
                />
              )}

              {selectedFunction === 'transform-dict' && (
                <TransformDictConfig
                  config={{ input_dict: prepareTransformDictInput(criteriaData) }}
                  onChange={() => {}} // No configuration needed
                  onGenerate={generateContent}
                  isLoading={isLoading}
                  disabled={Object.values(criteriaData).length === 0}
                />
              )}

              <div className="border rounded-lg p-4 min-h-[200px] bg-gray-50">
                {generatedContent ? (
                  selectedFunction === 'sum-letters' ? (
                    <SumLettersResult result={generatedContent} />
                  ) : (
                    <p className="whitespace-pre-wrap">{generatedContent}</p>
                  )
                ) : (
                  <p className="text-gray-500 italic">
                    Generated content will appear here...
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50 flex justify-end">
          <button
            onClick={handleVerify}
            disabled={isSubmitted || !generatedContent}
            className={`
              px-4 py-2 rounded-lg flex items-center space-x-2
              ${isSubmitted 
                ? 'bg-green-100 text-green-700 cursor-not-allowed'
                : !generatedContent
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
              }
            `}
          >
            {isSubmitted ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Verified</span>
              </>
            ) : (
              <span>Verify</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};